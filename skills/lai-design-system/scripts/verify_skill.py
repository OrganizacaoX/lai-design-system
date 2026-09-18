#!/usr/bin/env python3
"""Confere as afirmações do SKILL.md contra o código-fonte do design system.

`extract_api.py` mantém as referências geradas em dia, mas o SKILL.md é escrito à mão:
nomes de componente, subpaths, variantes e o mapeamento de tipografia podem envelhecer
sem que nada quebre. Uma skill que ensina uma prop que não existe mais é pior que skill
nenhuma, porque o agente confia nela e não vai conferir.

Rode no CI junto de `extract_api.py --check`:

    python3 skills/lai-design-system/scripts/verify_skill.py

Sai com status 1 e lista as divergências quando encontra alguma.
"""

from __future__ import annotations

import glob
import json
import re
import sys
from pathlib import Path

# Palavras em backtick no SKILL.md que parecem componente mas são outra coisa:
# nomes de biblioteca, tipos do React e identificadores de exemplos.
NOT_COMPONENTS = {
    "ReactNode", "ReactElement", "Partial", "Key", "Date", "Locale", "DateRange",
    "Zod", "Lucide", "Zustand", "Motion", "Recharts", "Sonner", "TanStack",
    "Tailwind", "Radix", "Base", "UI", "DOM", "T",
}


def collect_exports(repo: Path) -> set[str]:
    names: set[str] = set()
    for path in glob.glob(str(repo / "src" / "components" / "**" / "*.tsx"), recursive=True):
        raw = Path(path).read_text(encoding="utf-8")
        for block in re.finditer(r"export\s*\{([^}]*)\}", raw):
            for part in block.group(1).split(","):
                name = part.strip().split(" as ")[-1].strip()
                if name[:1].isupper():
                    names.add(name)
        for decl in re.finditer(r"export\s+(?:function|const)\s+([A-Z][A-Za-z0-9_]*)", raw):
            names.add(decl.group(1))
    # Alias criado no barrel para não colidir com o Toaster do Sonner.
    names.add("BaseToaster")
    return names


def main() -> int:
    repo = Path(__file__).resolve().parents[3]
    skill_path = repo / "skills" / "lai-design-system" / "SKILL.md"
    skill = skill_path.read_text(encoding="utf-8")
    exports = collect_exports(repo)
    problems: list[str] = []
    checks: list[str] = []

    cited = set(re.findall(r"`([A-Z][A-Za-z0-9_]+)`", skill)) - NOT_COMPONENTS
    missing = sorted(cited - exports)
    if missing:
        problems.append(f"componentes citados que não existem mais: {missing}")
    else:
        checks.append(f"{len(cited)} componentes citados existem")

    declared = {key.lstrip("./") for key in json.loads((repo / "package.json").read_text())["exports"]}
    subpaths = set(re.findall(r"`\.\.\./([a-z0-9]+)`", skill))
    bad_subpaths = sorted(subpaths - declared)
    if bad_subpaths:
        problems.append(f"subpaths que o package.json não exporta: {bad_subpaths}")
    else:
        checks.append(f"{len(subpaths)} subpaths existem")

    if any("asChild" in Path(p).read_text(encoding="utf-8")
           for p in glob.glob(str(repo / "src" / "**" / "*.tsx"), recursive=True)):
        problems.append("o SKILL.md afirma que `asChild` não existe, mas ele apareceu no código")
    else:
        checks.append("`asChild` continua ausente do design system")

    typography = dict(
        re.findall(
            r'export function ([A-Za-z]+)\([^)]*\}: ComponentProps<"([a-z0-9]+)">',
            (repo / "src" / "components" / "ui" / "typography.tsx").read_text(encoding="utf-8"),
            re.S,
        )
    )
    documented = dict(re.findall(r"\| `([A-Za-z]+)` \| `<([a-z0-9]+)>` \|", skill))
    diverged = {k: (v, typography.get(k)) for k, v in documented.items() if typography.get(k) != v}
    if diverged:
        problems.append(f"tipografia divergente (skill, código): {diverged}")
    else:
        checks.append(f"{len(documented)} mapeamentos de tipografia conferem")

    button = (repo / "src" / "components" / "ui" / "button.tsx").read_text(encoding="utf-8")
    for variant in re.findall(r"`(default|outline|secondary|ghost|destructive|link)`", skill):
        if f"{variant}:" not in button:
            problems.append(f"variante de Button documentada mas ausente: {variant}")
    checks.append("variantes de Button conferem")

    for line in checks:
        print(f"  ok  {line}")
    for line in problems:
        print(f"  !!  {line}", file=sys.stderr)
    if problems:
        print(f"\n{skill_path} precisa de atualização.", file=sys.stderr)
        return 1
    print("\nSKILL.md consistente com o código.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
