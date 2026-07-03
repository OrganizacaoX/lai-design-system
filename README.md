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
    "@lai": "https://ui.lai.ia.br/r/{name}.json"
  }
}
```

> Preview de todos os componentes e docs: **https://ui.lai.ia.br**

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

## Hospedagem (Railway + Cloudflare)

O registry é servido por um servidor estático mínimo (`server.mjs`, zero
dependências) que expõe a pasta `public/`. O `Dockerfile` builda o registry no
deploy e sobe o servidor. O Railway **re-deploya a cada push na `main`**.

### Deploy no Railway (uma vez)

1. Em [railway.com](https://railway.com) → **New Project → Deploy from GitHub
   repo** → selecione `OrganizacaoX/lai-design-system`.
2. O Railway detecta o `Dockerfile` (config em `railway.json`) e faz o build.
   Não precisa setar `PORT` — o servidor usa `process.env.PORT` automaticamente.
3. Ao terminar, **Settings → Networking → Generate Domain** para testar na URL
   `*.up.railway.app` (ou pule direto pro domínio custom abaixo).

Teste: `https://<seu-app>.up.railway.app/r/theme.json` deve retornar JSON.

### Domínio custom via Cloudflare

1. No Railway: **Settings → Networking → Custom Domain** → informe o subdomínio
   (ex.: `ui.seu-dominio.com`). O Railway mostra um alvo **CNAME**
   (algo como `xxxx.up.railway.app`).
2. Na Cloudflare (DNS do `seu-dominio.com`): **DNS → Add record**
   - Type: `CNAME`
   - Name: `ui`
   - Target: o valor CNAME que o Railway deu
   - Proxy status: **DNS only** (nuvem cinza) — o Railway já emite o certificado
     TLS. (Se preferir usar o proxy laranja da Cloudflare, deixe o SSL/TLS em
     "Full (strict)".)
3. Aguarde o Railway validar o domínio (fica "Active"). Pronto:
   `https://ui.seu-dominio.com/r/{name}.json`.

## Desenvolvimento / manutenção

Os componentes-fonte ficam em `src/`. O `registry.json` é **gerado** a partir
deles (escaneando os imports para deduzir dependências npm e dependências entre
componentes).

```bash
npm install
npm run build     # gera registry.json + public/r/*.json
npm start         # sobe o servidor local em http://localhost:8080
```

### Adicionar um componente novo

1. Crie o `.tsx` em `src/components/ui/` (ou `src/components/`, `src/hooks/`).
2. `npm run build`.
3. Commit + push na `main`. O Railway rebuilda e publica sozinho.
