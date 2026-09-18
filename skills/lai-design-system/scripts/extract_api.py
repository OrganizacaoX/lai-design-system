#!/usr/bin/env python3
"""Extrai a API real dos componentes do LAI Design System e gera references/components.md.

Roda sobre os fontes em src/, nao sobre docs escritas a mao, para que a referencia
consultada pelo agente nunca divirja do codigo. Rode depois de adicionar ou alterar
componentes:

    python3 skills/lai-design-system/scripts/extract_api.py

Opcoes:
    --src   raiz dos componentes (padrao: src/components/ui a partir da raiz do repo)
    --out   arquivo de saida (padrao: skills/lai-design-system/references/components.md)
    --check nao escreve; sai com status 1 se o arquivo gerado estaria desatualizado
            (use no CI para pegar componente novo sem documentacao)
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

# Props herdadas de primitivas ou do HTML: ruido, nao ajudam a escolher componente.
NOISE = {"className", "children", "ref", "key", "style", "id"}


def mask(source: str) -> str:
    """Substitui o conteudo das strings por 'x' preservando os indices.

    Precisamos disso porque as classes Tailwind contem ':', '{' e '}' que confundem
    qualquer varredura estrutural (`[&_svg:not([class*='size-'])]:size-4` casaria como
    se fosse uma chave de objeto). Chaves de objeto entre aspas ("icon-xs":) sao
    preservadas: elas sao nomes de variante reais e precisam sobreviver.
    """
    out = list(source)
    i, n = 0, len(source)
    while i < n:
        ch = source[i]
        if ch in "\"'`":
            quote = ch
            start = i
            i += 1
            while i < n and source[i] != quote:
                if source[i] == "\\":
                    i += 2
                    continue
                i += 1
            end = i
            i += 1
            k = i
            while k < n and source[k] in " \t\n":
                k += 1
            is_object_key = k < n and source[k] == ":"
            if not is_object_key:
                for j in range(start + 1, end):
                    out[j] = "x"
        else:
            i += 1
    return "".join(out)


def match_brace(source: str, i: int, open_ch: str = "{", close_ch: str = "}") -> int:
    depth = 0
    for j in range(i, len(source)):
        if source[j] == open_ch:
            depth += 1
        elif source[j] == close_ch:
            depth -= 1
            if depth == 0:
                return j
    return -1


def parse_variant_block(masked: str, raw: str) -> dict[str, list[str]]:
    found: dict[str, list[str]] = {}
    for key_match in re.finditer(r'(?:^|[{,\s])"?([A-Za-z0-9_\-]+)"?\s*:\s*\{', masked):
        before = masked[: key_match.start(1)]
        if before.count("{") - before.count("}") != 1:
            continue
        key = key_match.group(1)
        start = masked.index("{", key_match.end(1))
        end = match_brace(masked, start)
        sub = masked[start : end + 1]
        values: list[str] = []
        for val_match in re.finditer(r'(?:^|[{,\s])"?([A-Za-z0-9_\-]+)"?\s*:', sub):
            prefix = sub[: val_match.start(1)]
            if prefix.count("{") - prefix.count("}") == 1:
                value = val_match.group(1)
                if value not in values:
                    values.append(value)
        found[key] = values
    return found


def extract_cvas(raw: str, masked: str) -> dict[str, dict]:
    """Separa as variantes por const `cva` nomeada.

    Um arquivo costuma declarar varios cva (itemVariants e itemMediaVariants, por
    exemplo). Fundir todos atribuiria variantes ao componente errado, que e pior que
    nao documentar: o agente passaria uma prop que nao existe naquele componente.
    """
    cvas: dict[str, dict] = {}
    for match in re.finditer(r"const\s+([A-Za-z0-9_]+)\s*=\s*cva\(", masked):
        name = match.group(1)
        start = match.end() - 1
        depth = 0
        end = len(masked)
        for j in range(start, len(masked)):
            if masked[j] == "(":
                depth += 1
            elif masked[j] == ")":
                depth -= 1
                if depth == 0:
                    end = j
                    break
        seg_m, seg_r = masked[start:end], raw[start:end]
        v_match = re.search(r"\bvariants:\s*\{", seg_m)
        if not v_match:
            continue
        i = v_match.end() - 1
        j = match_brace(seg_m, i)
        variants = parse_variant_block(seg_m[i : j + 1], seg_r[i : j + 1])
        defaults: dict[str, str] = {}
        d_match = re.search(r"defaultVariants:\s*\{", seg_m)
        if d_match:
            di = d_match.end() - 1
            dj = match_brace(seg_m, di)
            for pair in re.finditer(r'([A-Za-z0-9_\-]+)\s*:\s*"([^"]*)"', seg_r[di : dj + 1]):
                defaults[pair.group(1)] = pair.group(2)
        if variants:
            cvas[name] = {"variants": variants, "defaults": defaults}
    return cvas


def extract_exports(raw: str) -> tuple[list[str], list[str]]:
    names: set[str] = set()
    for match in re.finditer(r"export\s*\{([^}]*)\}", raw):
        for part in match.group(1).split(","):
            name = part.strip().split(" as ")[-1].strip()
            if name and not name.startswith("type "):
                names.add(name)
    for match in re.finditer(r"export\s+(?:function|const)\s+([A-Za-z0-9_]+)", raw):
        names.add(match.group(1))
    types = sorted(set(re.findall(r"export\s+type\s+([A-Za-z0-9_]+)", raw)))
    components = sorted(n for n in names if n[:1].isupper())
    return components, types


def _looks_like_type(value: str) -> bool:
    """Descarta o que e claramente expressao de runtime, nao anotacao de tipo.

    Objetos literais dentro do corpo de um componente (`axis: orientation === "x" ...`)
    tem a mesma forma `nome: valor` de uma prop e passariam batido. Uma prop
    documentada que nao existe e pior que uma prop faltando: o agente confia e usa.
    """
    value = value.strip()
    if not value:
        return False
    return not re.search(r"===|!==|&&|\|\||\?\.|\)\s*\?", value)


def _end_of_type_alias(masked: str, start: int) -> int | None:
    """Fim de um `type X = ...`, com ou sem `;` final.

    Varios tipos no repo terminam so com `}` (`type CarouselProps = { ... }`). Procurar
    apenas por `;` faz o parser engolir o proximo tipo e o corpo da funcao seguinte,
    enchendo a referencia de coisas que nao sao props. Entao: fecha no `;` de nivel 0,
    ou no `}` que zera a profundidade, desde que nao venha `&`/`|` depois continuando
    a expressao de tipo.
    """
    # `<` e `>` ficam de fora da contagem de propos_ito: `=>` em `setApi?: (api) => void`
    # zeraria a profundidade no meio do tipo e truncaria a extracao. Genericos nao
    # precisam ser balanceados aqui porque nao contem `;` nem `}` soltos.
    depth = 0
    opened = False
    for j in range(start, len(masked)):
        ch = masked[j]
        if ch in "{(":
            depth += 1
            opened = True
        elif ch in "})":
            depth -= 1
            if opened and depth == 0:
                k = j + 1
                while k < len(masked) and masked[k] in " \t\n":
                    k += 1
                if k < len(masked) and masked[k] in "&|":
                    continue
                return j + 1
        elif ch == ";" and depth <= 0:
            return j
        elif ch == "\n" and depth <= 0 and opened:
            return j
    return None


def _props_from_object_literal(body_r: str, body_m: str) -> list[str]:
    own: list[str] = []
    for brace in re.finditer(r"\{", body_m):
        close = match_brace(body_m, brace.start())
        if close < 0 or "{" in body_m[brace.start() + 1 : close]:
            continue
        for line in re.split(r"[;\n]", body_r[brace.start() + 1 : close]):
            line = line.strip().rstrip(",")
            prop = re.match(r"^([A-Za-z0-9_]+)(\??):\s*(.+)$", line)
            if prop and prop.group(1) not in NOISE and _looks_like_type(prop.group(3)):
                own.append(f"{prop.group(1)}{prop.group(2)}: {prop.group(3).strip()}")
    return own


def extract_own_props(raw: str, masked: str) -> dict[str, list[str]]:
    """Props declaradas pelo proprio LAI, alem das herdadas da primitiva Base UI.

    Sao as que um agente treinado em shadcn/ui nunca adivinha (`loading` no Button,
    por exemplo), entao valem mais que a lista completa de props herdadas.

    Cobre as duas formas usadas no repo: `type XProps = Base & { ... }` e a anotacao
    inline `function X({ ... }: ComponentProps<"div"> & { ... })`. A segunda importa
    porque e onde vivem props como o `variant` do `Sidebar`, que colide em nome com o
    `variant` do `SidebarMenuButton` e tem valores completamente diferentes.
    """
    result: dict[str, list[str]] = {}

    for match in re.finditer(r"type\s+([A-Za-z0-9_]+Props)\s*=\s*", masked):
        name = match.group(1)
        # Tipos de contexto descrevem o valor do provider, nao props de componente.
        if name.endswith("ContextProps"):
            continue
        end = _end_of_type_alias(masked, match.end())
        if end is None:
            continue
        own = _props_from_object_literal(raw[match.end() : end], masked[match.end() : end])
        if own:
            result[name] = own

    for match in re.finditer(r"function\s+([A-Z][A-Za-z0-9_]*)\s*\(\s*\{", masked):
        params_start = masked.index("{", match.end() - 1)
        params_end = match_brace(masked, params_start)
        if params_end < 0 or params_end + 1 >= len(masked) or masked[params_end + 1] != ":":
            continue
        sig_close = match_brace(masked, match.end() - 1, "(", ")")
        if sig_close < 0:
            continue
        annot_r = raw[params_end + 1 : sig_close]
        annot_m = masked[params_end + 1 : sig_close]
        own = _props_from_object_literal(annot_r, annot_m)
        if own:
            result.setdefault(match.group(1), []).extend(own)

    return {k: v for k, v in result.items() if v}


def build_markdown(components: dict[str, dict]) -> str:
    total_symbols = sum(len(c["exports"]) for c in components.values())
    lines: list[str] = []
    lines.append("# Componentes do LAI Design System")
    lines.append("")
    lines.append(
        f"Gerado por `scripts/extract_api.py` a partir de `src/components/ui/`. "
        f"{len(components)} módulos, {total_symbols} componentes exportados. "
        "Não edite à mão: rode o script de novo."
    )
    lines.append("")
    lines.append(
        "Tudo aqui é importado da raiz de `@organizacaox/lai-design-system`, sem subpath. "
        "As variantes listadas são as únicas aceitas: qualquer outro valor cai no default "
        "silenciosamente, sem erro de tipo e sem aviso em runtime. Cada bloco de variantes "
        "está sob o nome do componente que realmente a recebe — `variant` costuma existir em "
        "mais de um componente do mesmo módulo com valores diferentes."
    )
    lines.append("")
    for name in sorted(components):
        data = components[name]
        lines.append(f"## {name}")
        lines.append("")
        lines.append(f"`{'`, `'.join(data['exports'])}`")
        lines.append("")
        if data["cvas"]:
            for cva_name, cva in sorted(data["cvas"].items()):
                owner = re.sub(r"Variants$", "", cva_name)
                owner = owner[:1].upper() + owner[1:]
                lines.append(f"Variantes de `{owner}`:")
                lines.append("")
                for key, values in cva["variants"].items():
                    default = cva["defaults"].get(key)
                    suffix = f" (padrão `{default}`)" if default else ""
                    lines.append(f"- `{key}`: `{'` | `'.join(values)}`{suffix}")
                lines.append("")
        if data["own_props"]:
            lines.append("Props próprias do LAI, que o shadcn/ui equivalente não tem:")
            lines.append("")
            for type_name, props in sorted(data["own_props"].items()):
                for prop in props:
                    lines.append(f"- `{prop}`  <!-- {type_name} -->")
            lines.append("")
        if data["types"]:
            lines.append(f"Tipos: `{'`, `'.join(data['types'])}`")
            lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def extract_composition_props(raw: str, masked: str) -> list[tuple[str, str]]:
    """Props da composição, preservando os comentários /** */ que documentam a intenção."""
    match = re.search(r"(?:export\s+)?(?:type|interface)\s+[A-Za-z0-9_]*Props", masked)
    if not match:
        return []
    # Pula o parâmetro genérico antes de procurar o corpo: em
    # `interface DataTableProps<T extends { id: string }>`, o primeiro `{` pertence à
    # restrição do genérico, e tomá-lo como corpo documenta `id` como se fosse a única
    # prop do componente.
    cursor = match.end()
    while cursor < len(masked) and masked[cursor] in " \t\n":
        cursor += 1
    if cursor < len(masked) and masked[cursor] == "<":
        depth = 0
        for j in range(cursor, len(masked)):
            if masked[j] == "<":
                depth += 1
            elif masked[j] == ">":
                depth -= 1
                if depth == 0:
                    cursor = j + 1
                    break
    if "{" not in masked[cursor:]:
        return []
    start = masked.index("{", cursor)
    end = match_brace(masked, start)
    if end < 0:
        return []
    body_r = raw[start + 1 : end]
    body_m = masked[start + 1 : end]
    props: list[tuple[str, str]] = []
    comment = ""
    depth = 0
    pending: list[str] = []
    for line_r, line_m in zip(body_r.split("\n"), body_m.split("\n")):
        stripped = line_r.strip()
        # Props com tipo objeto/união em várias linhas (`labels?: Partial<{ ... }>`)
        # seriam achatadas em props de nível superior que não existem. Acumula a
        # declaração inteira e colapsa numa linha só.
        if depth > 0:
            pending.append(stripped)
            depth += line_m.count("{") - line_m.count("}")
            if depth <= 0:
                joined = " ".join(pending)
                prop = re.match(r"^([A-Za-z0-9_]+\??):\s*(.+?),?$", joined)
                if prop:
                    props.append((f"{prop.group(1)}: {prop.group(2).rstrip(';,')}", comment))
                comment, pending, depth = "", [], 0
            continue
        doc = re.match(r"^/\*\*\s*(.*?)\s*\*/$", stripped)
        if doc:
            comment = doc.group(1)
            continue
        opened = line_m.count("{") - line_m.count("}")
        if opened > 0 and re.match(r"^[A-Za-z0-9_]+\??:", stripped):
            pending = [stripped]
            depth = opened
            continue
        prop = re.match(r"^([A-Za-z0-9_]+\??):\s*(.+?),?$", stripped)
        if prop and _looks_like_type(prop.group(2)):
            props.append((f"{prop.group(1)}: {prop.group(2).rstrip(';,')}", comment))
            comment = ""
    return props


def build_compositions_markdown(compositions: dict[str, list[tuple[str, str]]]) -> str:
    lines = ["# Composições de alto nível", ""]
    lines.append(
        "Gerado por `scripts/extract_api.py` a partir de `src/components/`. "
        "Não edite à mão: rode o script de novo."
    )
    lines.append("")
    lines.append(
        "Estes componentes montam telas inteiras e já carregam acessibilidade, i18n e os "
        "estados de carregamento, erro e vazio. Antes de compor uma tela a partir das "
        "primitivas, verifique se uma destas resolve: refazer à mão custa mais e perde "
        "comportamento que não é óbvio que existia."
    )
    lines.append("")
    for name in sorted(compositions):
        props = compositions[name]
        if not props:
            continue
        lines.append(f"## {name}")
        lines.append("")
        for signature, comment in props:
            suffix = f" — {comment}" if comment else ""
            lines.append(f"- `{signature}`{suffix}")
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def main() -> int:
    repo_root = Path(__file__).resolve().parents[3]
    parser = argparse.ArgumentParser(description=__doc__)
    refs = repo_root / "skills" / "lai-design-system" / "references"
    parser.add_argument("--src", type=Path, default=repo_root / "src" / "components" / "ui")
    parser.add_argument("--out", type=Path, default=refs / "components.md")
    parser.add_argument("--compositions-out", type=Path, default=refs / "compositions.md")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()

    if not args.src.is_dir():
        print(f"erro: {args.src} não existe", file=sys.stderr)
        return 2

    components: dict[str, dict] = {}
    for path in sorted(args.src.glob("*.tsx")):
        raw = path.read_text(encoding="utf-8")
        masked = mask(raw)
        exports, types = extract_exports(raw)
        if not exports:
            continue
        components[path.stem] = {
            "exports": exports,
            "types": types,
            "cvas": extract_cvas(raw, masked),
            "own_props": extract_own_props(raw, masked),
        }

    compositions: dict[str, list[tuple[str, str]]] = {}
    for path in sorted(args.src.parent.glob("*.tsx")):
        raw = path.read_text(encoding="utf-8")
        name_match = re.search(r"export\s+function\s+([A-Z][A-Za-z0-9_]*)", raw)
        if not name_match:
            continue
        props = extract_composition_props(raw, mask(raw))
        if props:
            compositions[name_match.group(1)] = props

    outputs = [
        (args.out, build_markdown(components)),
        (args.compositions_out, build_compositions_markdown(compositions)),
    ]

    if args.check:
        stale = [
            path
            for path, content in outputs
            if (path.read_text(encoding="utf-8") if path.exists() else "") != content
        ]
        if stale:
            for path in stale:
                print(f"{path} está desatualizado.", file=sys.stderr)
            print(
                "Rode: python3 skills/lai-design-system/scripts/extract_api.py",
                file=sys.stderr,
            )
            return 1
        print(f"Referências atualizadas ({len(components)} módulos, {len(compositions)} composições).")
        return 0

    for path, content in outputs:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
    total = sum(len(c["exports"]) for c in components.values())
    print(
        f"{args.out}: {len(components)} módulos, {total} símbolos.\n"
        f"{args.compositions_out}: {len(compositions)} composições."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
