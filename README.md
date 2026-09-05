# LAI Design System

Biblioteca React e registry [shadcn](https://ui.shadcn.com/docs/registry) com os
componentes, hooks e o tema do LAI. Há dois modos de consumo:

- **GitHub Packages:** instala `@organizacaox/lai-design-system` como uma
  dependência e recebe atualizações ao mudar a versão do pacote.
- **Registry shadcn:** copia componentes individuais com
  `bunx shadcn add @lai/<item>` para permitir customização no projeto consumidor.

## O que tem

- **`@lai/theme`** — todo o sistema de design (cores oklch light/dark,
  tipografia Google Sans, escala de raios).
- **Componentes de UI** (`@lai/button`, `@lai/sidebar`, `@lai/dialog`, …).
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
bun add @organizacaox/lai-design-system
```

Importe os estilos uma vez, no entrypoint da aplicação, e use os componentes:

```tsx
import "@organizacaox/lai-design-system/styles.css";
import { Button, DateRangePicker } from "@organizacaox/lai-design-system";
```

O CSS já carrega a **Google Sans Flex** como fonte padrão e a **Google Sans Code**
para código, via Google Fonts (`display=swap`). Não é necessário adicionar links
de fontes no HTML. O tema do registry inclui o mesmo carregamento automático.

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

O pacote completo requer `react` e `react-dom` 19. Componentes independentes
copiados pelo registry podem funcionar em React 18, conforme suas dependências;
`questionnaire` e `message-scroller` usam `@shadcn/react` e exigem React 19.

## Consumir pelo registry shadcn

Requisito: o projeto de destino já ter o shadcn inicializado
(`bunx shadcn@latest init` — cria `components.json` e o `lib/utils` com `cn`).

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
bunx shadcn@latest add @lai/theme

# componentes (as dependências vêm junto)
bunx shadcn@latest add @lai/button @lai/sidebar @lai/date-range-picker
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
bun install
bun run build     # gera o site/registry e o pacote em lib/
bun run package:build # gera somente o pacote instalável
bun run start         # sobe o servidor local em http://localhost:8080
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
bun pm version patch
git push origin main --follow-tags
gh release create "v$(node -p "require('./package.json').version")" --generate-notes
```

Para publicar manualmente a partir de uma máquina autenticada, rode
`bun publish`. O script `prepublishOnly` valida os tipos e gera os artefatos
antes do upload.

### Adicionar um componente novo

1. Crie o `.tsx` em `src/components/ui/` (ou `src/components/`, `src/hooks/`).
2. `bun run build`.
3. Commit + push na `main`. O Railway rebuilda e publica sozinho.

## Fundamentos e padrões

O guia em `/fundamentos` usa `src/index.css` e os componentes React reais.
`/design-system/` continua disponível como redirecionamento. Cada componente tem
uma URL `/componentes/<nome>`, exemplo, instalação, API e orientações de uso.
`site/catalog.json` é gerado por `bun run docs:build`; edite os fontes e os arquivos
`site/demos*.tsx`, não o catálogo gerado. Regras editoriais ficam em
`site/usage-guidance.ts`.

Os controles usam densidade confortável (44px). Para ferramentas compactas:

```tsx
<div data-density="compact">
  <Input aria-label="Buscar" />
  <Button>Buscar</Button>
</div>
```

Os tokens `success`, `warning` e `info` têm pares `*-foreground` para texto sobre
as respectivas superfícies. Combine cor com texto. As composições `PageHeader`,
`FilterBar`, `DataList` e `ValidatedForm` são exportadas pelo pacote e pelo registry.
`ValidatedForm` destina-se a formulários pequenos: a validação é explícita por
campo e ocorre no submit; campos complexos podem ser compostos com `Field`.

## Validação de mudanças

```bash
bun install --frozen-lockfile
bun run check
bun run build
bunx playwright install chromium
bun run test:e2e
bun run test:consumers
```

Os testes de navegador rodam sobre o site **buildado** via Vite Preview.
Depois de editar o site, gere o build antes de testar. A suíte cobre catálogo,
teclado, foco, seleções, formulários, tema, densidade, acessibilidade automatizada
e snapshots de componentes em desktop/mobile e claro/escuro.
A auditoria automatizada não substitui avaliação manual com leitor de tela.

Para uma mudança visual intencional, rode `bun run test:e2e --update-snapshots`,
inspecione os PNGs em `tests/browser/visual.spec.ts-snapshots` e inclua os novos
baselines na revisão. Use a versão de Chromium fixada pelo lockfile. CI roda em
Linux; diferenças de sistema/fontes devem ser verificadas, não aprovadas às cegas.

`test:consumers` usa uma pasta temporária isolada, instala o tarball de `npm pack`,
materializa os arquivos e dependências transitivas do registry e valida tipos e
bundle de aplicações consumidoras: pacote completo em React 19 e componentes
independentes com o tema exportado pelo registry em React 18. Não publica pacotes nem altera projetos externos.

O workflow de PR verifica também que os arquivos gerados estão atualizados.
Mudanças de API ou tokens devem incluir orientação de migração em `CHANGELOG.md`.

## Tabelas, paginação e painéis compartilhados

`DataTable`, `DataPagination` e `BottomSheet` estão disponíveis no entrypoint do
pacote e nos itens `@lai/data-table`, `@lai/data-pagination` e `@lai/bottom-sheet`.
O `DateRangePicker` também oferece limpeza do período e fechamento após seleção.
Veja os [contratos e exemplos de migração](docs/meetcore-components.md).
Valide essas composições com `bun run test:compositions`.

## Estados, playground e personalização

`Button` oferece `loading` e `loadingLabel`: durante o envio, bloqueia a ação,
expõe `aria-busy` e mostra progresso. Use `disabled` para indisponibilidade.
`StatusPanel` compartilha os estados `loading`, `error`, `empty`, `success` e
`unavailable`; título, descrição e ação pertencem ao contexto do produto.

`DataTable` mantém o clique da linha e oferece um botão de ação por registro
quando `onRowClick` está definido. Links, botões e campos dentro da linha não
acionam o callback da linha. Personalize `labels.actions`, `labels.openRow`,
`labels.loading` e `labels.retry`; `error` e `onRetry` oferecem recuperação.
`FilterBar.ariaLabel` permite traduzir também o nome acessível da região.

Os playgrounds de Button, Input e Select sincronizam opções, prévia e código.
Em `/fundamentos`, o editor visual exporta um `lai-theme.css` para importar
depois dos estilos do pacote. A mesma página contém o fluxo completo de
contatos com código copiável: busca, paginação, detalhes, edição e exclusão
confirmada. Os dados do exemplo são locais e podem ser restaurados.

Movimento: `--motion-fast` para feedback, `--motion-normal` para contexto e
`--motion-ease` para a curva compartilhada. Preserve suporte a movimento reduzido.

`DialogContent` e `SheetContent` aceitam `closeLabel` (padrão: Fechar).
`ComboboxInput` aceita `triggerLabel` e `clearLabel`; `ComboboxChip` aceita
`removeLabel`. Em controles que expõem diretamente o elemento interativo, use
`aria-label` e os filhos para personalizar o nome e o texto.

Os testes de documentação usam a porta 4197 (`LAI_E2E_PORT` para sobrescrever),
com servidor próprio e porta estrita. Os testes de composições usam 4185 e
artefatos em outra pasta, permitindo execução simultânea sem compartilhar arquivos.

## Confiabilidade por componente

Cada página de componente mostra quantidade, resultado, data e cenários de testes
associados. Um cenário executado em desktop e mobile conta duas vezes; retries
não aumentam a quantidade. Falhas, instabilidade, testes ignorados e testes não
executados aparecem separadamente. Um teste de renderização não é apresentado
como cobertura de interação ou porcentagem de cobertura de código.

Para atualizar a evidência real, execute:

```bash
bun run test:reliability-unit
bun run test:reliability
```

O segundo comando constrói a documentação atual, executa integralmente as duas
suítes Playwright e gera `public/component-tests.json`, também copiado para `dist`.
Inclua esse arquivo ao entregar uma nova execução; execuções focadas de
`test:e2e` não alteram o painel. A CI preserva o relatório e os JSONs originais
como artefatos. Uma execução com falhas ainda gera resultados e termina com erro.

Associe cada cenário explicitamente com tags como `@component:button` e
`@kind:interaction`. Tipos disponíveis: `render`, `visual`, `interaction`,
`accessibility` e `integration`. Associe somente componentes cujo comportamento
é verificado pelas asserções do teste, evitando inflar os números.

Um hash de conteúdo inclui componentes, documentação, testes e configurações.
Ao reconstruir a documentação após uma mudança, evidências anteriores aparecem
como desatualizadas até executar novamente a validação completa. Sem relatório,
a tela informa ausência de execução; nunca presume que os testes passaram.

## App shell compartilhado

`AppShell` reúne sidebar recolhível, marca, usuário, alertas e
navegação mobile. Disponível no pacote e em `@lai/app-shell`, com exemplo em
`/examples/app-shell`. Consulte [a API e a integração com roteadores](docs/app-shell.md).

## Base de aplicação

O pacote também entrega Better Fetch, TanStack Query, TanStack Router e Zustand
como dependências diretas. O frontend instala o LAI e importa as APIs por
`/fetch`, `/query`, `/router` e `/store`; `/app` fornece configuração integrada,
providers e limpeza de estado. Para rotas por arquivo, use `laiRouter` de
`@organizacaox/lai-design-system/router/vite`.

Veja [a configuração, os contratos e o exemplo completo](docs/app-base.md).
Valide o pacote instalado com `bun run package:build && bun run test:app`.

## Tipografia e efeito de texto

`@lai/typography` oferece títulos H1–H4, parágrafos, citações, listas, links,
código inline e textos de apoio. Veja [Typography](docs/typography.md).
`@lai/shimmer` oferece o brilho de texto do shadcn com controle de duração,
ativação e movimento reduzido. Veja [Shimmer](docs/shimmer.md).
Ambos também são exportados pelo pacote React e têm exemplos no catálogo.

A base também inclui **i18next/react-i18next** em `/i18n` e **TanStack Table 9**
em `/table`. `createAppI18n` fornece instâncias isoladas com mensagens LAI em
português, inglês e espanhol; `AppProviders` recebe `i18n` para traduzir os
componentes automaticamente. Rótulos explícitos e o uso sem provider continuam
compatíveis. Veja os exemplos de idiomas, persistência e tabelas no guia acima.

A base também oferece formulários com Zod, ordenação, virtualização, Better Auth,
Motion, datas, ícones, PostHog, tours, TanStack AI e helpers de teste através de
subpaths do pacote. Consulte [Integrações de aplicação](docs/app-platform.md) e
[o plano de implementação](docs/app-platform-plan.md).
