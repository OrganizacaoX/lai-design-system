# Typography

Componentes semânticos inspirados no conjunto clássico de Typography do shadcn,
com as fontes e cores do tema LAI. Disponíveis no pacote e em `@lai/typography`.
O link original do shadcn hoje redireciona para Typeset; esta API oferece os
componentes React individuais, sem aplicar estilos globais ao conteúdo HTML.

```tsx
import {
  Title, SubTitle, Text, Lead,
  InlineCode, BulletList, TextLink,
} from "@organizacaox/lai-design-system";

<Title>Documentação</Title>
<Lead>Uma introdução à sua aplicação.</Lead>
<SubTitle className="mt-8">Primeiros passos</SubTitle>
<Text>
  Use <InlineCode>className</InlineCode> para ajustar o visual.
  Consulte os <TextLink href="/fundamentos">fundamentos</TextLink>.
</Text>
<BulletList><li>Configure o projeto.</li><li>Crie sua primeira tela.</li></BulletList>
```

| Componente | Elemento | Uso |
| --- | --- | --- |
| Title | h1 | Título principal |
| SubTitle | h2 | Título de seção |
| SectionTitle | h3 | Título de subseção |
| SectionSubTitle | h4 | Título de nível quatro |
| Text | p | Texto principal |
| Quote | blockquote | Citação; aceita cite nativo |
| BulletList | ul | Lista com marcadores e filhos li |
| NumberedList | ol | Lista numerada; aceita start/reversed/type |
| InlineCode | code | Código curto dentro do texto |
| Lead | p | Introdução em destaque |
| Highlight | div | Destaque sem criar um título semântico |
| Caption | small | Observação breve |
| Description | p | Texto de apoio |
| TextLink | a | Link com sublinhado e foco visível |

Todos aceitam as propriedades nativas do elemento, incluindo `ref`, `id`,
`aria-*`, `style`, eventos e `className`. A aplicação decide o espaçamento entre
seções. Text adiciona margem superior quando não é o primeiro filho; citação e
listas têm margem vertical. Substitua esses valores com classes como `mt-0`.
SubTitle tem borda inferior; use `border-0 pb-0` quando não couber ao contexto.

A escala editorial é maior que a de controles compactos: H1 36px/48px em telas
grandes, H2 30px, H3 24px, H4 20px, corpo 16px. Cores e fontes são herdadas do
tema, incluindo modo escuro e fonte mono para código. Os tamanhos usam rem.
O componente PageHeader continua oferecendo o título compacto de páginas de app.

Escolha o nível do heading pela estrutura, sem pular níveis apenas para obter
um tamanho menor. Use um H1 para o título principal. Não coloque blocos dentro
de Text ou Caption. Texto essencial deve continuar legível, mesmo quando secundário.
Para tabelas, use Table, TableHeader, TableBody, TableHead, TableCell e demais
componentes existentes; o exemplo do catálogo mostra essa composição.

Referência: https://v3.shadcn.com/docs/components/typography
Catálogo: `/componentes/typography`.

## Nomes públicos

Os nomes antigos com prefixo Typography foram substituídos pelos nomes acima,
sem mudança de classes, elementos HTML ou propriedades. Atualize os imports e JSX.
O item de registry continua `@lai/typography` e o arquivo continua `typography.tsx`.

`Label` já é exportado pelo pacote para rótulos de campos (elemento label, com
`htmlFor`). Consuma-o de `@lai/label` pelo registry. Para observações pequenas,
use Caption; para texto secundário, Description.
