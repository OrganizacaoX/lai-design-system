# Page Header

`PageHeader` é o cabeçalho padrão de uma tela de aplicação. Existe para que
título, descrição e ações fiquem no mesmo tamanho e no mesmo alinhamento em
todas as telas, em vez de cada uma montar o seu à mão.

```tsx
import { PageHeader } from "@organizacaox/lai-design-system";

<PageHeader
  title="Contatos"
  description="Gerencie as pessoas da sua organização."
  actions={<Button>Novo contato</Button>}
/>;
```

## Propriedades

| Propriedade   | Tipo                        | Papel                                                        |
| ------------- | --------------------------- | ------------------------------------------------------------ |
| `title`       | `string`                    | Único `<h1>` da tela.                                        |
| `description` | `string`                    | Frase de apoio, abaixo do título.                            |
| `actions`     | `ReactNode`                 | Botões da tela, alinhados à direita.                         |
| `breadcrumbs` | `ReactNode`                 | Trilha acima do título (só na variante `page`).               |
| `badges`      | `ReactNode`                 | Estado ao lado do título: versão, rascunho, status.          |
| `meta`        | `ReactNode`                 | Linha discreta abaixo do título: data, identificador, origem. |
| `back`        | `PageHeaderBack`            | Botão voltar, à esquerda do título.                          |
| `variant`     | `"page"` \| `"bar"`         | Layout. Padrão `page`.                                        |
| `className`   | `string`                    | Classes adicionais no `<header>`.                            |

O `<h1>` usa `--text-page-title` nas duas variantes. Ajustar esse token no tema
muda o título de todas as telas de uma vez; não sobrescreva o tamanho por tela.

## Título, badges e meta

`badges` fica fora do `<h1>`, de propósito: o leitor de tela anuncia só o título
da página, e o estado é lido em seguida como conteúdo comum. Use `meta` para o
dado de contexto que hoje costuma virar um `<p>` solto abaixo do título.

```tsx
<PageHeader
  title="Auditoria"
  badges={<Badge variant="outline">Versão 2 de 5</Badge>}
  meta={formatDateTime(audit.createdAt)}
  actions={<Button size="sm">Reprocessar</Button>}
/>
```

## Voltar

`back` não depende de roteador. Sem `render` o componente cai num `<a href>`;
com `render`, recebe o `Link` do roteador do consumidor.

```tsx
<PageHeader title="Vendedor" back={{ href: "/dashboard", render: <Link to="/dashboard" /> }} />
```

`label` sobrescreve o rótulo acessível, que por padrão vem do dicionário
(`pageHeader.back`) no idioma ativo.

## Variante `bar`

`variant="bar"` é a versão compacta, com borda inferior e sem `space-y`, para
telas de altura fixa — canvas e editores, onde o cabeçalho divide a viewport com
o conteúdo e não pode consumir a altura de um header de página.

```tsx
<main className="flex h-svh flex-col overflow-hidden">
  <PageHeader
    variant="bar"
    title="Fluxo de análise"
    back={{ href: "/fluxos", render: <Link to="/fluxos" /> }}
    badges={<Badge variant="secondary">Rascunho v3</Badge>}
    actions={<Button size="sm">Publicar</Button>}
  />
  <div className="min-h-0 flex-1 overflow-auto">{children}</div>
</main>
```

Na variante `bar` o título mantém o mesmo tamanho da variante `page`; o que muda
é o espaçamento. `breadcrumbs` é ignorado, e `description` e `meta` aparecem
inline, à direita do título.

Catálogo: `/componentes/page-header`.
