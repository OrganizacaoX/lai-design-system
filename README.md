# LAI Design System

Biblioteca React e registry [shadcn](https://ui.shadcn.com/docs/registry) com os
componentes, hooks e o tema do LAI. Há dois modos de consumo:

- **GitHub Packages:** instala `@organizacaox/lai-design-system` como uma
  dependência e recebe atualizações ao mudar a versão do pacote.
- **Registry shadcn:** copia componentes individuais com
  `npx shadcn add @lai/<item>` para permitir customização no projeto consumidor.

## O que tem

- **`@lai/theme`** — todo o sistema de design (cores oklch light/dark,
  tipografia Google Sans, escala de raios).
- **60 componentes de UI** (`@lai/button`, `@lai/sidebar`, `@lai/dialog`, …).
- **Componentes compostos** (`@lai/date-range-picker`).
- **Hooks** (`@lai/use-mobile`).

As dependências entre itens se resolvem sozinhas (ex.: `@lai/sidebar` traz
`button`, `sheet`, `tooltip`, `use-mobile`…).

## Instalar como pacote

O GitHub Packages exige autenticação até para baixar pacotes públicos. Crie um
Personal Access Token (classic) com `read:packages` e configure o projeto
consumidor.

No `.npmrc` do projeto consumidor:

```ini
@organizacaox:registry=https://npm.pkg.github.com
```

No `~/.npmrc` da sua máquina (não faça commit do token):

```ini
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
```

Depois exporte o token e instale o pacote:

```bash
export GITHUB_PACKAGES_TOKEN="cole_o_token_aqui"
npm install @organizacaox/lai-design-system
```

Importe os estilos uma vez, no entrypoint da aplicação, e use os componentes:

```tsx
import "@organizacaox/lai-design-system/styles.css";
import { Button, DateRangePicker } from "@organizacaox/lai-design-system";
```

O Sonner já é uma dependência do design system. Para exibir notificações, não é
necessário instalá-lo nem importá-lo diretamente:

```tsx
import {
  Button,
  ThemeProvider,
  Toaster,
  useToast,
} from "@organizacaox/lai-design-system";

function SaveButton() {
  const { toast } = useToast();

  return <Button onClick={() => toast.success("Salvo!")}>Salvar</Button>;
}

function App() {
  return (
    <ThemeProvider>
      <SaveButton />
      <Toaster />
    </ThemeProvider>
  );
}
```

O provider usa a classe `.dark` e, na primeira visita, segue o tema da máquina
(com fallback claro). Depois, persiste a escolha do usuário em
`localStorage["lai-theme"]`. O hook `useTheme` também é exportado pelo pacote.

O projeto consumidor precisa ter `react` e `react-dom` 18 ou 19 instalados.

## Consumir pelo registry shadcn

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
>
> Guia visual interativo: **https://ui.lai.ia.br/design-system/**

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
npm run build     # gera o site/registry e o pacote em lib/
npm run package:build # gera somente o pacote instalável
npm start         # sobe o servidor local em http://localhost:8080
```

## Publicar uma versão

O workflow `.github/workflows/publish-package.yml` publica automaticamente no
GitHub Packages quando uma GitHub Release é publicada. A tag da release deve
ser exatamente `v` seguida pela versão do `package.json` (por exemplo,
`v0.1.0`). O workflow usa o `GITHUB_TOKEN` do próprio repositório; nenhum token
de publicação precisa ser criado.

Na primeira publicação, o GitHub cria o pacote como privado. Depois dela,
ajuste a visibilidade e os repositórios/equipes com acesso nas configurações do
pacote da organização, conforme a necessidade.

Fluxo sugerido:

```bash
npm version patch
git push origin main --follow-tags
gh release create "v$(node -p "require('./package.json').version")" --generate-notes
```

Para publicar manualmente a partir de uma máquina autenticada, rode
`npm publish`. O script `prepublishOnly` valida os tipos e gera os artefatos
antes do upload.

### Adicionar um componente novo

1. Crie o `.tsx` em `src/components/ui/` (ou `src/components/`, `src/hooks/`).
2. `npm run build`.
3. Commit + push na `main`. O Railway rebuilda e publica sozinho.
