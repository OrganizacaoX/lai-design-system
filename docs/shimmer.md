# Shimmer

Brilho animado no texto usando a utility oficial do shadcn. Disponível no pacote
como `Shimmer` e no registry como `@lai/shimmer`.

```tsx
import { Shimmer } from "@organizacaox/lai-design-system";
import "@organizacaox/lai-design-system/styles.css";

<Shimmer role="status" active={loading}>
  {loading ? "Gerando resposta…" : "Resposta concluída"}
</Shimmer>
<Shimmer duration={3500} color="var(--primary)" spread="4ch" once>
  Analisando documentos…
</Shimmer>
```

O elemento raiz é span e aceita props nativas, ref, className e style.
`active` é true por padrão; false remove as classes de animação.
`duration` é o tempo de uma passagem em milissegundos (padrão 2000; números
inválidos ou não positivos usam o padrão). `once` limita a uma passagem;
`reverse` inverte a direção. Sem reverse, a direção acompanha RTL.
`color` aceita uma cor CSS e `spread` uma largura CSS. `style` permite
sobrescrever as variáveis `--shimmer-*` diretamente.

O CSS do pacote também permite uso direto de `className="shimmer"`, combinado
com `shimmer-once`, `shimmer-reverse` e `shimmer-none`. O item do registry injeta
as mesmas utilities básicas, propriedades CSS e keyframes do shadcn instalado,
incluindo a regra de movimento reduzido, sem exigir a CLI como dependência do app.
Ao consumir o pacote, importe styles.css uma vez. Ao copiar pelo registry,
use o tema LAI para compartilhar fontes e cores.

Use em textos curtos de processamento, não em parágrafos longos. A preferência
`prefers-reduced-motion: reduce` remove animação e gradiente e mantém o texto
legível. A animação é decorativa: informe o progresso em palavras. O componente
não cria uma região live automaticamente; adicione `role="status"` quando
necessário ou use a região de status existente ao redor dele.

Referência: https://ui.shadcn.com/docs/utils/shimmer
Catálogo: `/componentes/shimmer`.
