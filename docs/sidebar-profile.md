# SidebarProfile

Menu de conta compartilhado do Disk e MeetCore, disponível como export do pacote
`@organizacaox/lai-design-system` e item `@lai/sidebar-profile` do registry.
Use no `footer` do AppShell ou em SidebarFooter dentro de SidebarProvider.

```tsx
<SidebarProfile
  user={{ name: user.name, email: user.email, image: user.image }}
  profile={{ render: <Link to="/profile" /> }}
  organization={canSwitchOrganization ? { onSelect: openOrganizations } : undefined}
  install={isInstalled ? undefined : { onSelect: openInstall }}
  theme={{ value: theme, onChange: setTheme }}
  language={{ value: language, onChange: setLanguage, options: [
    { value: "pt-BR", label: "Português" },
    { value: "en", label: "English" },
  ] }}
  signOut={{ onSelect: handleSignOut, pending: signingOut }}
/>
```

O trigger mostra avatar, nome, e-mail e indicador de dropdown. Sem imagem, usa
iniciais do primeiro e último nome; `user.initials` permite substituir.
Na sidebar recolhida aparece apenas o avatar, mantendo o nome acessível.
No drawer mobile o nome e o e-mail voltam a aparecer.

As ações têm ordem e ícones padrão: Meu perfil, Trocar organização, Instalar
aplicativo, Tema, Idioma e Sair. Somente as ações fornecidas são mostradas.
Perfil, organização e instalação aceitam `onSelect`, `render` (âncora ou Link
que encaminhe props/eventos/ref) e `disabled`. Forneça um destino ou callback
para cada ação habilitada. `actions` recebe ações adicionais com `id`, `label`,
`icon` opcional e o mesmo contrato; elas aparecem antes de Sair.

Tema oferece Claro, Escuro e Sistema. Tema e idioma são controlados: o produto
persiste os valores e aplica as mudanças. Por exemplo, conecte `useTheme()` do
ThemeProvider ou a store de preferências existente. O componente não exige um
ThemeProvider para ser renderizado.

O produto também controla autenticação, permissões, disponibilidade da instalação,
tratamento de erros e logout. `signOut.pending` desabilita Sair e mostra Saindo…;
restaure o estado e informe o erro se a operação falhar. Não renderize o perfil
com uma sessão fictícia durante carregamento ou quando o usuário estiver deslogado.

Todos os textos padrão estão em português e podem ser substituídos por `labels`:
trigger, profile, organization, install, theme, light, dark, system, language,
signOut e signingOut. Traduza `trigger` incluindo o nome da pessoa. `className`
personaliza o wrapper do menu.

A demonstração em `/examples/app-shell` conecta o tema real do catálogo e exibe
um diálogo demonstrativo para ações que dependem de um produto. A seleção de
idioma ilustra o estado controlado; não traduz o site de documentação.
