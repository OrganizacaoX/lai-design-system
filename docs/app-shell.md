# AppShell

Layout compartilhado para as áreas autenticadas. Disponível no pacote como
`AppShell` e no registry como `@lai/app-shell`. Exemplo interativo:
`/examples/app-shell`; documentação no catálogo: `/componentes/app-shell`.

```tsx
import { AppShell, PageHeader } from "@organizacaox/lai-design-system";
import "@organizacaox/lai-design-system/styles.css";

<AppShell
  brand={<strong>Meu produto</strong>}
  navigation={[{
    id: "principal",
    label: "Workspace",
    items: [
      { id: "home", label: "Início", href: "/", active: true, mobile: true },
      { id: "contacts", label: "Contatos", href: "/contacts", mobile: true },
    ],
  }]}
  footer={<UserMenu />}
  banner={<SubscriptionNotice />}
>
  <PageHeader title="Visão geral" />
  <Outlet />
</AppShell>
```

`UserMenu`, `SubscriptionNotice` e `Outlet` são componentes do produto.
`brandIcon` recebe a marca compacta. O rodapé recebe qualquer composição de
usuário/ações; use `useSidebar()` dentro dela para adaptar o conteúdo ao estado
recolhido (`state === "collapsed" && !isMobile`).

## Navegação e roteadores

`navigation` recebe grupos com IDs estáveis e itens com `id`, `label`, `href`,
`icon`, `badge`, `active` e `mobile`. Grupos vazios são omitidos. O produto filtra
itens por permissão e calcula a rota ativa antes de passar os dados ao shell.
Autenticação, autorização e seleção de organização continuam no produto.

Grupos aceitam `collapsible: true`, `icon` e `defaultOpen` para mostrar subitens
expansíveis. Informe `label` para nomear o botão do grupo. Ao selecionar uma rota
do grupo, ele se abre automaticamente; na sidebar recolhida, clicar no grupo
expande a navegação para revelar suas opções.

Com `accordion`, no máximo um grupo recolhível fica aberto: abrir um fecha o
que estava aberto, e a mudança de rota abre o grupo do item ativo e fecha os
outros — inclusive um grupo que a pessoa tinha aberto na mão. Sem rota ativa
em grupo, começa no primeiro com `defaultOpen`. Na sidebar recolhida, clicar
num grupo expande a navegação e abre só ele. Sem `accordion`, cada grupo segue
com o próprio estado, como antes.

```tsx
<AppShell accordion navigation={navigation} /* ... */ />
```

Abrir e fechar um grupo anima a altura do painel (a regra global de
`[data-slot="collapsible-content"]`) e os subitens descem um pouco na entrada,
com os mesmos tokens `--motion-normal` e `--motion-ease`.

Por padrão, os itens são âncoras HTML. Para navegação SPA:

```tsx
renderLink={item => <Link to={item.href} />}
```

O Link precisa encaminhar as propriedades DOM, eventos e ref para a âncora.
Atualize `active` ao mudar de rota; essa mudança também fecha o drawer mobile.
O shell mantém a semântica de links, inclusive abrir em nova aba, e sinaliza
`aria-current="page"`. O conteúdo tem um link de salto para acesso por teclado.

## Responsividade e estado

Desktop usa a sidebar recolhível em ícones. `open` e `onOpenChange` permitem
controle externo; `defaultOpen` define o estado inicial não controlado. O
produto pode, por exemplo, fechar a sidebar ao entrar numa chamada. Não é
necessário montar outro `SidebarProvider` ao redor do shell.

Mobile usa até três itens marcados com `mobile: true`, na ordem dos grupos,
e o botão Menu, em uma pílula flutuante com fundo translúcido e blur. A barra
respeita a área segura inferior e mantém espaço no conteúdo para não encobri-lo.
O painel completo inclui todos os itens e o rodapé, mesmo os
que não aparecem como atalhos. A área de conteúdo reserva espaço para a barra
inferior e a safe area do dispositivo. `mobileNavigation="drawer"` remove a
barra inferior e mantém um botão flutuante para abrir o menu. O botão de recolher/fechar fica
dentro da sidebar, junto à marca. O shell não insere cabeçalho na área de conteúdo.

`labels` permite traduzir `navigation`, `mobileNavigation`, `toggleNavigation`,
`menu` e `skipToContent`. Os padrões são em português. `className` personaliza
o wrapper; `contentClassName`, a área interna. Para páginas largas, mantenha o
scroll horizontal dentro da tabela/quadro, evitando overflow global.

## Migração de Disk e MeetCore

Substitua a composição externa SidebarProvider/Sidebar/SidebarInset pelo
AppShell e mantenha o Outlet em children. Passe os menus já filtrados em
navigation e os componentes de marca, usuário e alertas nos slots.
O shell suporta grupos simples; menus hierárquicos e animações específicas dos
produtos precisam ser adaptados antes de uma migração completa. Esta adição
não altera os repositórios consumidores.

## Perfil no rodapé

Use `footer={<SidebarProfile ... />}` para o menu pronto, sem criar outro
SidebarProvider. Veja [SidebarProfile](sidebar-profile.md) para as ações padrão,
preferências e integração com a sessão do produto.
