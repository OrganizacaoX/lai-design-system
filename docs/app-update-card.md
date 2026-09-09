# App Update Card

`AppUpdateCard` e `AppUpdatingScreen` são a interface do fluxo de atualização de
um app: o aviso de que existe uma versão nova e a tela que assume o app enquanto
ela é aplicada. Os dois são apresentacionais — quem detecta a versão (service
worker, sondagem de build, erro de chunk após deploy) continua sendo o produto.

```tsx
import { AppUpdateCard, AppUpdatingScreen } from "@organizacaox/lai-design-system";

if (!ready) return null;
if (!updating) return <AppUpdateCard onUpdate={startUpdate} />;
return <AppUpdatingScreen variant={failed ? "failed" : "updating"} onRetry={retry} />;
```

## AppUpdateCard

Aviso persistente, mas não bloqueante: uma versão nova não interrompe o que a
pessoa está fazendo. O card flutua no topo da tela (`fixed`, centralizado,
`max-w-xl`), anuncia-se como `role="status"` com `aria-live="polite"` e some
quando o consumidor para de renderizá-lo.

| Propriedade   | Tipo         | Papel                                                             |
| ------------- | ------------ | ----------------------------------------------------------------- |
| `onUpdate`    | `() => void` | Ação do botão. É o único caminho para a atualização começar.       |
| `title`       | `string`     | Padrão: "Nova versão disponível".                                  |
| `description` | `ReactNode`  | Padrão: "Atualize quando for conveniente…".                        |
| `actionLabel` | `string`     | Padrão: "Atualizar agora".                                         |
| `icon`        | `ReactNode`  | Padrão: `RefreshCw` no círculo `bg-primary/10`.                    |
| `className`   | `string`     | Classes adicionais no card.                                        |

Use `description` quando atualizar naquele momento custar alguma coisa. É o que
o Disk faz nas rotas de ligação:

```tsx
<AppUpdateCard
  onUpdate={startUpdate}
  description={inCall ? t("appUpdater.duringCall") : undefined}
/>
```

## AppUpdatingScreen

Overlay de tela cheia para depois do clique. `updating` é o caminho feliz
(atualização em curso); `failed` é a saída quando o recarregamento não veio
dentro do tempo esperado — sem ela a pessoa fica presa num spinner.

| Propriedade    | Tipo                        | Papel                                                          |
| -------------- | --------------------------- | -------------------------------------------------------------- |
| `variant`      | `"updating"` \| `"failed"`  | Padrão `updating`.                                             |
| `onRetry`      | `() => void`                | Botão "Tentar novamente" da variante `failed`.                  |
| `onClearCache` | `() => void`                | Renderiza o botão secundário. Sem ele, o botão não existe.      |
| `icon`         | `ReactNode`                 | Padrão: `Spinner`. Passe a marca do produto no lugar.           |
| `className`    | `string`                    | Classes adicionais no overlay.                                  |

`onClearCache` é opcional de propósito: dois botões com rótulos diferentes para
a mesma ação só confundem. Informe-o apenas quando o app tiver um caminho a mais
que o retry — apagar o Cache Storage e desregistrar o service worker, por
exemplo, que é o único jeito de sair de uma aba ainda controlada pelo worker
antigo.

```tsx
<AppUpdatingScreen
  icon={<Logo className="size-20 animate-pulse motion-reduce:animate-none" />}
  variant="failed"
  onRetry={retry}
  onClearCache={() => void clearCacheAndRestart()}
/>
```

## Textos

Os rótulos vêm do namespace `lai` (`appUpdate.*`) em pt-BR, en e es. Com um
`LaiI18nProvider` no app, traduza sobrescrevendo essas chaves; sem provider, o
componente usa o português. As props de texto do card existem para o caso em que
o app já tem os próprios textos — como o Disk, que traduz por `appUpdater.*`.
