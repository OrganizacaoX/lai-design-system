# LAI Design System (`@lai`)

Registry [shadcn](https://ui.shadcn.com/docs/registry) com os componentes de UI,
hooks e o tema de design do LAI. É a **fonte de verdade** dos componentes: em
qualquer projeto você roda `npx shadcn add @lai/<item>` e o código é copiado com
as dependências certas — igual ao registry oficial do shadcn.

## O que tem

- **`@lai/theme`** — todo o sistema de design (cores oklch light/dark,
  tipografia Google Sans, escala de raios).
- **60 componentes de UI** (`@lai/button`, `@lai/sidebar`, `@lai/dialog`, …).
- **Componentes compostos** (`@lai/date-range-picker`).
- **Hooks** (`@lai/use-mobile`).

As dependências entre itens se resolvem sozinhas (ex.: `@lai/sidebar` traz
`button`, `sheet`, `tooltip`, `use-mobile`…).

## Consumir em outro projeto

Requisito: o projeto de destino já ter o shadcn inicializado
(`npx shadcn@latest init` — cria `components.json` e o `lib/utils` com `cn`).

### 1. Registre o namespace `@lai` no `components.json` do destino

```jsonc
{
  // ...resto do components.json...
  "registries": {
    "@lai": "https://organizacaox.github.io/lai-design-system/r/{name}.json"
  }
}
```

### 2. Instale

```bash
# aplica todo o design (cores/tipografia/raios)
npx shadcn@latest add @lai/theme

# componentes (as dependências vêm junto)
npx shadcn@latest add @lai/button @lai/sidebar @lai/date-range-picker
```

Para **atualizar** um componente depois, rode o `add` de novo — o shadcn baixa a
versão mais recente e sobrescreve o arquivo. (Modelo copy-paste do shadcn: você é
dono do código; edições locais no projeto consumidor são sobrescritas ao
re-adicionar.)

## Desenvolvimento / manutenção

Os componentes-fonte ficam em `src/`. O `registry.json` é **gerado** a partir
deles (escaneando os imports para deduzir dependências npm e dependências entre
componentes).

```bash
npm install
npm run registry:build   # gera registry.json + public/r/*.json
```

Ao dar `push` na `main`, o workflow `.github/workflows/deploy-registry.yml`
rebuilda e publica `public/r` no GitHub Pages automaticamente.

### Adicionar um componente novo

1. Crie o `.tsx` em `src/components/ui/` (ou `src/components/`, `src/hooks/`).
2. `npm run registry:build`.
3. Commit + push. O Pages atualiza sozinho.

## Ativar o GitHub Pages (uma vez só)

Em **Settings → Pages → Build and deployment → Source**, selecione
**GitHub Actions**. Depois disso o workflow publica a cada push na `main`.
O registry precisa estar acessível publicamente para o shadcn CLI baixar sem
autenticação (repo público, ou Pages com token no header em projeto privado).
