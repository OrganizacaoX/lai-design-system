export const usageGuidance: Record<string, string> = {
  "status-panel": "Use para loading, error, empty, success e unavailable. Informe título e descrição no idioma do produto; ofereça ação de recuperação para erros e estados vazios. O painel anuncia alterações e não usa apenas cor para comunicar o estado.",
  "data-table":
    "Use para comparar registros por colunas e executar ações em lote. Forneça IDs estáveis, rótulos traduzidos e renderizadores de célula. A seleção acompanha os registros atuais e fica indisponível durante o carregamento.",
  "data-pagination":
    "Use com listagens paginadas. Os callbacks controlam página e limite; o consumidor decide quando recarregar dados e reiniciar a página. Traduza os rótulos e indique o total de páginas.",
  "bottom-sheet":
    "Use para detalhes e ações contextuais em um painel inferior. Controle isOpen/onClose, ofereça um título descritivo e configure snapPoints conforme a quantidade de conteúdo. Preserve fechamento por teclado e retorno de foco.",
  accordion:
    "Use para revelar respostas ou detalhes independentes. Mantenha os títulos informativos mesmo quando os painéis estiverem fechados; não esconda erros de formulário em painéis recolhidos.",
  alert:
    "Use para informação persistente que afeta uma seção. Inclua o que aconteceu e a próxima ação. Para feedback temporário de uma ação concluída, use Toast.",
  "alert-dialog":
    "Use quando uma ação destrutiva precisa de decisão explícita. Descreva a consequência e dê nomes concretos às ações, como Excluir contato e Cancelar.",
  "aspect-ratio":
    "Reserve a proporção de imagens e vídeos antes do carregamento. O contêiner não substitui o texto alternativo da imagem nem os controles acessíveis do vídeo.",
  avatar:
    "Identifique pessoas ou organizações. Ofereça iniciais como fallback e evite repetir o nome no texto alternativo quando ele já estiver ao lado.",
  badge:
    "Exiba status ou categorias curtas. Combine cor com texto; para executar uma ação, use Button em vez de transformar um status em controle implícito.",
  breadcrumb:
    "Mostre a hierarquia de páginas, com a página atual por último. Use links reais nos ancestrais e evite repetir toda a navegação principal.",
  "button-group":
    "Agrupe ações relacionadas e mantenha a mesma densidade. Se os itens representam uma escolha persistente, use Toggle Group ou Radio Group.",
  calendar:
    "Use para escolher datas com contexto de mês. Informe locale e limites de seleção; para filtros de intervalo com atalhos, prefira Date Range Picker.",
  card: "Agrupe um assunto com título, conteúdo e ações relacionadas. Evite cards dentro de cards e reserve elevação para uma hierarquia com significado.",
  carousel:
    "Use para conteúdo sequencial quando a navegação entre itens for importante. Dê nomes aos controles anterior/próximo e preserve a navegação por teclado.",
  chart:
    "Compare séries com os tokens chart-1 a chart-5, rótulos e formatos numéricos consistentes. Ofereça um resumo textual ou tabela com os dados; cor e tooltip não bastam para comunicar valores.",
  checkbox:
    "Use para escolhas independentes, consentimento ou seleção múltipla. Associe um rótulo clicável; para exatamente uma opção, use Radio Group.",
  collapsible:
    "Revele detalhes opcionais de uma única seção. O gatilho deve descrever o conteúdo e manter o estado expandido acessível; use Accordion para vários grupos.",
  combobox:
    "Use quando a lista exige busca ou contém muitas opções. Identifique o campo, diferencie ausência de resultados de carregamento e preserve a seleção durante filtragem.",
  command:
    "Ofereça busca de comandos e destinos. Use título e descrição no diálogo, atalhos documentados e uma mensagem explícita quando nenhum resultado corresponder à consulta.",
  "context-menu":
    "Ofereça ações contextuais como complemento. Garanta que as mesmas ações estejam disponíveis em um botão de menu para usuários de toque e teclado.",
  "data-list":
    "Use para registros que cabem em linhas compostas. Forneça chaves estáveis, renderItem e ações de recuperação. Para comparar várias colunas numéricas, prefira Table.",
  dialog:
    "Use para uma tarefa curta que exige atenção sem abandonar a página. Inclua título e descrição; mantenha o foco no diálogo e retorne-o ao gatilho ao fechar.",
  drawer:
    "Use um painel de borda para tarefas ou detalhes, especialmente em telas pequenas. Preserve uma forma visível de fechar e não dependa apenas de gestos.",
  "dropdown-menu":
    "Agrupe ações secundárias sob um gatilho nomeado. Use Select para escolher um valor de formulário e Navigation Menu para navegação principal.",
  empty:
    "Explique qual conteúdo aparecerá e ofereça a ação que resolve a ausência. Diferencie uma primeira utilização de uma busca sem resultados.",
  field:
    "Componha rótulo, ajuda, controle e erro em uma unidade. Use FieldSet e FieldLegend para grupos; associe o erro por aria-describedby.",
  "filter-bar":
    "Use busca controlada com filtros adicionais como children. Atualize os resultados no consumidor e forneça onReset para limpar todos os filtros de forma consistente.",
  "hover-card":
    "Mostre informação complementar sobre um link ou pessoa. Conteúdo essencial e ações obrigatórias devem estar disponíveis sem depender de hover.",
  "input-group":
    "Associe prefixos, sufixos e ações a um campo. Ícones decorativos não substituem o rótulo; botões internos precisam de nome acessível.",
  "input-otp":
    "Use para códigos de verificação curtos. Documente o comprimento, permita colar o código completo e forneça mensagem de erro e ação de reenvio.",
  item: "Componha uma linha com mídia, texto e ações. Escolha link quando a linha navega e botão quando executa uma ação; evite controles interativos aninhados.",
  kbd: "Exiba um atalho que realmente funciona. Mostre a combinação adequada ao sistema e mantenha a ação disponível também pela interface.",
  menubar:
    "Use para menus de comandos em ferramentas de trabalho. Preserve a navegação por setas e evite usá-lo como substituto de uma navegação comum por links.",
  "native-select":
    "Prefira o controle nativo para seleções simples que se beneficiam da interface do dispositivo. Associe Label e forneça opções com nomes claros.",
  "navigation-menu":
    "Organize destinos de navegação com links reais. Use rótulos claros e indique a página atual; ações de edição pertencem a Dropdown Menu.",
  "page-header":
    "Use uma vez no início da página. Forneça título, descrição opcional e ações; mantenha uma ação primária e use breadcrumbs quando houver hierarquia.",
  pagination:
    "Use para conjuntos divididos em páginas. Preserve os filtros ao navegar, indique a página atual e desabilite anterior/próximo nos limites.",
  popover:
    "Mostre um pequeno editor ou conteúdo contextual junto ao gatilho. Para tarefas extensas, prefira Dialog ou Sheet; verifique Escape e retorno do foco.",
  progress:
    "Use quando o avanço pode ser medido. Informe rótulo e valor acessíveis; para espera sem estimativa, prefira Spinner com descrição.",
  "radio-group":
    "Use para escolher exatamente uma opção entre alternativas visíveis. Agrupe com legenda e mantenha a navegação por setas.",
  resizable:
    "Permita ajustar painéis de trabalho. Defina limites úteis e identifique os separadores; o redimensionamento também precisa funcionar por teclado.",
  "scroll-area":
    "Use quando a área precisa de rolagem independente. Garanta acesso por teclado e evite múltiplas regiões aninhadas que dificultem o uso no mobile.",
  separator:
    "Separe grupos relacionados sem acrescentar ruído visual. Use a opção decorativa quando a divisão não precisar ser anunciada por tecnologia assistiva.",
  sheet:
    "Mostre detalhes ou edição de um registro ao lado do contexto principal. Inclua título, ação de fechamento e tratamento de conteúdo longo em telas pequenas.",
  sidebar:
    "Organize destinos frequentes, agrupados por tarefa. Mantenha o estado ativo claro e ofereça uma navegação equivalente no menu mobile.",
  skeleton:
    "Represente a forma do conteúdo durante a primeira carga. Anuncie o carregamento uma vez no contêiner e evite anunciar cada bloco decorativo.",
  slider:
    "Use para ajustar um valor em uma escala contínua. Informe unidade, limites e valor acessível; ofereça entrada numérica quando precisão for essencial.",
  spinner:
    "Indique uma espera de duração desconhecida junto à ação. Acrescente um rótulo de status e preserve o contexto que já está disponível.",
  switch:
    "Use para uma configuração binária aplicada imediatamente. Mantenha o rótulo estável; para uma escolha enviada junto com um formulário, considere Checkbox.",
  table:
    "Use para comparar dados por colunas. Inclua cabeçalhos semânticos, alinhe números e forneça estados vazio, carregamento e erro no contêiner da tabela.",
  tabs: "Alterne painéis relacionados dentro do mesmo contexto. Use links de navegação para páginas distintas e confira ativação e foco por teclado.",
  textarea:
    "Use para conteúdo de múltiplas linhas. Associe rótulo, ajuda e limite de caracteres quando houver; preserve a possibilidade de ler textos longos.",
  toast:
    "Use para confirmação breve e erros recuperáveis de ações. Erros de formulário também devem permanecer junto ao campo ou à seção afetada.",
  toggle:
    "Use para uma ação com estado pressionado, como formatação. O nome deve identificar a ação e o estado deve ser exposto ao leitor de tela.",
  "toggle-group":
    "Agrupe opções de apresentação ou ferramentas com estado. Defina se a seleção é única ou múltipla; para dados de formulário, considere Radio Group ou Checkbox.",
  tooltip:
    "Explique um controle de forma breve, ao receber hover ou foco. Não coloque ações ou instruções essenciais exclusivamente no tooltip.",
  "validated-form":
    "Use para formulários pequenos com validação explícita por campo. validate retorna a mensagem de erro; onSubmit recebe os valores e pode ser assíncrono. O componente foca o primeiro erro e impede envios duplicados.",
  attachment:
    "Mostre nome e estado do arquivo. Para erro ou processamento, forneça texto descritivo e ações de recuperação; não use apenas a borda colorida.",
  bubble:
    "Diferencie mensagens recebidas e enviadas pelo alinhamento e contexto. Preserve texto legível e combine com Message para identificar o autor.",
  message:
    "Componha autor, conteúdo e metadados de uma mensagem. Use identificação textual e mantenha a ordem de leitura coerente mesmo com alinhamento à direita.",
  "message-scroller":
    "Use em conversas com novas mensagens. Preserve a posição quando o usuário estiver lendo o histórico e identifique a região rolável para acesso por teclado.",
  marker:
    "Separe mudanças de data ou contexto em conversas. Use texto curto e não transforme um marcador informativo em título principal da página.",
  direction:
    "Configure a direção da primitiva com DirectionProvider e a direção do conteúdo com dir. Use propriedades lógicas de espaçamento e valide a ordem de leitura em RTL.",
  label:
    "Associe htmlFor ao id único do controle. Placeholder é uma dica de preenchimento e não substitui o rótulo persistente.",
  sonner:
    "Monte Toaster uma vez na raiz e use useToast para notificações. Mantenha erros importantes persistentes no conteúdo e evite várias mensagens para uma única ação.",
  "theme-provider":
    "Monte na raiz para aplicar a classe dark e persistir a preferência em lai-theme. O padrão acompanha o sistema; use setTheme para escolhas explícitas e resolvedTheme para o tema efetivo.",
  questionnaire:
    "Use para perguntas sequenciais com uma tarefa clara. Textos padrão estão em português; substitua children das ações para outro idioma ou um verbo específico. Informe nomes estáveis aos itens e rótulos às escolhas.",
};
