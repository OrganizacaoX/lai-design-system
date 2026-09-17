export type AccessibilityGuidance = {
  semantics: string;
  keyboard: string;
  usage: string;
};

// Orientações de composição e verificação, não uma certificação de conformidade.
const entries = {
  accordion: [
    "Use títulos descritivos nos gatilhos e preserve a associação entre cada gatilho e seu painel.",
    "Verifique Tab e Shift+Tab entre gatilhos e Enter ou Espaço para expandir e recolher.",
    "Mantenha a hierarquia de títulos e revele painéis que contenham erros antes de direcionar o foco.",
  ],
  alert: [
    "Escreva o problema e a próxima ação em texto; o ícone e a cor são complementares.",
    "O aviso não precisa receber foco. Ações incluídas devem ser alcançáveis por Tab.",
    "Evite anúncios urgentes repetidos; reserve interrupções para informações que exigem atenção imediata.",
  ],
  "alert-dialog": [
    "Inclua AlertDialogTitle e AlertDialogDescription com a consequência da decisão.",
    "Confira o foco inicial, a contenção do foco e o retorno ao gatilho. Ofereça uma ação de cancelamento acessível.",
    "Use nomes concretos como Excluir arquivo. Em ações irreversíveis, prefira foco inicial na opção menos destrutiva.",
  ],
  "app-shell": [
    "Nomeie as regiões de navegação e indique o destino atual. Mantenha um título de página na área principal.",
    "Confira o acesso ao conteúdo, o botão de recolher e o menu mobile por teclado, incluindo o retorno do foco ao fechar.",
    "Verifique os nomes dos itens com a sidebar recolhida e se a navegação fixa não cobre o elemento focado.",
  ],
  "app-update-card": [
    "Explique a atualização, o progresso e as falhas em texto, com rótulos claros para atualizar e tentar novamente.",
    "Acione a atualização por teclado e verifique o destino do foco quando o card der lugar à tela de progresso.",
    "Anuncie mudanças de etapa sem repetir continuamente o progresso e preserve uma saída acessível em caso de falha.",
  ],
  "aspect-ratio": [
    "O contêiner define proporção visual. Forneça alt nas imagens e legendas ou alternativas para vídeos.",
    "Não adicione foco ao contêiner; preserve o acesso por teclado aos controles da mídia.",
    "Confira se a proporção não recorta legendas, textos ou controles ao ampliar a página.",
  ],
  attachment: [
    "Nomeie AttachmentTrigger e cada ação com a operação e o arquivo, como Remover contrato.pdf.",
    "Verifique Tab entre abrir, baixar e remover, com foco visível mesmo no gatilho sobreposto.",
    "Descreva upload, processamento e falhas em texto; data-state sozinho não anuncia mudanças.",
  ],
  avatar: [
    "Use alt com o nome quando a imagem identifica alguém; use alt vazio se o mesmo nome já estiver ao lado.",
    "O avatar estático não recebe foco. Se abrir um perfil ou menu, use um link ou botão nomeado.",
    "Confira o nome acessível tanto com a imagem carregada quanto com o fallback.",
  ],
  badge: [
    "Expresse o status em texto, sem depender exclusivamente da cor.",
    "Badges informativos não precisam de Tab. Use um controle semântico para ações.",
    "Para mudanças relevantes de status, componha um anúncio discreto; a variante visual não cria uma região viva.",
  ],
  "bottom-sheet": [
    "Forneça um título que identifique o painel e uma ação de fechamento com nome acessível.",
    "Confira abertura, Escape, contenção do foco e retorno ao elemento que abriu o painel.",
    "Não dependa do gesto de arrastar para fechar ou alcançar conteúdo; teste todos os tamanhos do painel com zoom.",
  ],
  breadcrumb: [
    "Nomeie a navegação e identifique a página atual. Separadores visuais não devem repetir conteúdo na leitura.",
    "Use links reais nos ancestrais; a página atual sem ação não precisa entrar na ordem de Tab.",
    "Se abreviar caminhos, mantenha os destinos ocultos disponíveis por um controle acessível.",
  ],
  bubble: [
    "Inclua autor e estado da mensagem em texto quando necessários; alinhamento e cor não identificam o remetente sozinhos.",
    "A bolha de texto não precisa receber foco; links e ações internas precisam funcionar por teclado.",
    "Preserve a ordem de leitura da conversa e evite anúncios duplicados ao compor com Message.",
  ],
  button: [
    "Use texto que descreva a ação. Botões apenas com ícone precisam de aria-label ou texto visualmente oculto.",
    "Confira Tab, Shift+Tab, Enter e Espaço, mantendo o indicador de foco visível.",
    "No carregamento, mantenha um nome compreensível e anuncie o estado. Use link para navegação e botão para ações.",
  ],
  "button-group": [
    "Dê um nome ao grupo quando necessário e mantenha um nome acessível em cada botão.",
    "Confira Tab entre ações e Enter ou Espaço para ativar cada botão; o agrupamento visual não cria atalhos.",
    "Use RadioGroup ou ToggleGroup quando os itens representarem seleção, em vez de comunicar seleção apenas pela aparência.",
  ],
  calendar: [
    "Configure idioma e rótulos de navegação para que datas e meses sejam compreensíveis na leitura assistiva.",
    "Confira setas entre dias, seleção por teclado e acesso aos controles de mês sem prender o foco.",
    "Verifique o anúncio de hoje, seleção e datas indisponíveis; explique restrições de período fora do calendário.",
  ],
  card: [
    "Use um título com nível coerente com a página; o estilo de CardTitle não substitui a hierarquia semântica.",
    "Somente links e botões internos entram na ordem de Tab; evite tornar todo o card um controle com ações aninhadas.",
    "Mantenha a ordem de leitura entre título, descrição e ações, inclusive quando o layout mudar no mobile.",
  ],
  carousel: [
    "Identifique o carrossel e nomeie os controles anterior e próximo no idioma do produto.",
    "Confira os controles e a navegação por teclado; elementos de slides ocultos não devem desviar o foco.",
    "Se adicionar reprodução automática, ofereça pausa e respeite a preferência por movimento reduzido.",
  ],
  chart: [
    "Forneça um resumo textual e uma tabela ou alternativa equivalente com os dados relevantes.",
    "Confira o acesso por teclado às informações interativas; valores não podem depender somente de hover.",
    "Diferencie séries também por rótulos ou padrões e confira a leitura com o tema claro e escuro.",
  ],
  checkbox: [
    "Associe um rótulo ao controle e use legenda para conjuntos de opções relacionadas.",
    "Confira Tab para alcançar o controle e Espaço para alternar a seleção.",
    "Verifique a leitura dos estados marcado, desmarcado e misto; explique erros e obrigatoriedade em texto.",
  ],
  collapsible: [
    "Dê um nome descritivo ao gatilho e preserve sua relação com o conteúdo e o estado expandido.",
    "Confira Enter e Espaço no gatilho e Tab até os controles revelados.",
    "Ao recolher programaticamente, não deixe o foco em conteúdo oculto; retorne ao gatilho quando necessário.",
  ],
  combobox: [
    "Nomeie o campo de busca e apresente opções com texto acessível, mesmo quando incluem imagens.",
    "Confira digitação, setas para percorrer opções, Enter para selecionar e Escape para fechar.",
    "Diferencie carregamento, ausência de resultados e erro; preserve o valor selecionado durante a busca.",
  ],
  command: [
    "Nomeie a busca de comandos e, na versão em diálogo, inclua título e descrição adequados.",
    "Confira setas para percorrer resultados, Enter para executar e Escape para fechar e devolver o foco.",
    "Mostre uma mensagem para buscas vazias e disponibilize as ações também fora de atalhos globais.",
  ],
  "context-menu": [
    "Use nomes claros para as ações e disponibilize uma alternativa visível ao menu contextual.",
    "Confira a abertura por teclado, setas entre itens, Enter para executar e Escape para fechar.",
    "Garanta acesso às mesmas ações por toque; não dependa exclusivamente do clique direito.",
  ],
  "data-list": [
    "Estruture os registros como lista quando apropriado e dê nomes específicos às ações de cada registro.",
    "Confira Tab entre ações e preserve o foco ao carregar, remover ou reordenar registros.",
    "Comunique carregamento, lista vazia e falhas; não use apenas um espaço em branco para representar esses estados.",
  ],
  "data-pagination": [
    "Nomeie os controles de página e tamanho de página no idioma do produto e informe a página atual.",
    "Confira Tab e ativação dos botões, incluindo os limites de primeira e última página.",
    "Anuncie a atualização dos resultados sem mover o foco inesperadamente e mantenha os totais coerentes.",
  ],
  "data-table": [
    "Forneça cabeçalhos compreensíveis e rótulos de seleção e ações que identifiquem cada registro.",
    "Confira ordenação, seleção e paginação por teclado, preservando o foco após atualizar dados.",
    "Verifique o anúncio da ordenação e da seleção parcial. Disponibilize contexto e estados de carregamento ou erro em texto.",
  ],
  "date-range-picker": [
    "Configure ariaLabel, locale e os rótulos dos atalhos para identificar o campo e o intervalo selecionado.",
    "Confira abertura pelo gatilho, seleção das duas datas por teclado, Escape e retorno do foco.",
    "Explique limites de datas e confira se o intervalo selecionado é compreensível sem depender do destaque visual.",
  ],
  dialog: [
    "Inclua DialogTitle e associe uma descrição quando ela ajudar a compreender a tarefa.",
    "Confira foco inicial, Tab e Shift+Tab dentro do modal, Escape e retorno ao gatilho.",
    "Nomeie o botão de fechar e mantenha as ações visíveis com zoom e conteúdo longo.",
  ],
  direction: [
    "Configure a direção de leitura correta e defina também o idioma do documento; direção não traduz o conteúdo.",
    "Confira a ordem de foco e as setas nos componentes direcionais ao alternar entre LTR e RTL.",
    "Teste conteúdo misto, como números e nomes em outro idioma, sem inverter manualmente a ordem do DOM.",
  ],
  drawer: [
    "Inclua título, descrição útil e um controle de fechamento nomeado.",
    "Confira foco inicial, navegação dentro do painel e retorno ao gatilho ao fechar.",
    "Ofereça uma alternativa ao gesto de arrastar e mantenha campos e ações acessíveis com teclado virtual aberto.",
  ],
  "dropdown-menu": [
    "Nomeie o gatilho e cada ação; preserve a semântica dos itens de seleção quando usados.",
    "Confira abertura por teclado, setas entre itens e submenus, Enter e Escape com retorno ao gatilho.",
    "Use Select para valores de formulário. Não inclua campos ou controles arbitrários dentro de itens de menu.",
  ],
  empty: [
    "Explique a ausência de conteúdo com título e descrição, sem depender apenas da ilustração.",
    "O estado vazio não precisa receber foco; a ação sugerida deve ser acessível por Tab.",
    "Diferencie busca sem resultados de primeira utilização e anuncie a mudança se ela resultar de uma ação assíncrona.",
  ],
  field: [
    "Associe FieldLabel ao controle por htmlFor/id e ajuda e erro por aria-describedby; use FieldSet e FieldLegend para grupos.",
    "Confira se clicar no rótulo alcança o controle e se a ordem de Tab acompanha a ordem visual.",
    "Marque o controle inválido com aria-invalid e descreva a correção necessária. O estilo do grupo não cria as associações sozinho.",
  ],
  "filter-bar": [
    "Configure ariaLabel para a região, label para a busca e resetLabel para limpar os filtros.",
    "Confira Tab entre busca, filtros adicionais e limpar; mantenha o foco durante a atualização dos resultados.",
    "Nomeie também os filtros fornecidos como children e anuncie a quantidade de resultados sem interromper cada caractere digitado.",
  ],
  "hover-card": [
    "Mantenha a informação essencial no conteúdo principal ou em um destino acessível pelo link.",
    "Confira o que está disponível ao focar o gatilho; não coloque uma ação obrigatória acessível apenas por hover.",
    "Para conteúdo interativo que precise ser aberto explicitamente, prefira Popover ou Dialog.",
  ],
  input: [
    "Associe Label por htmlFor/id. Placeholder não substitui rótulo; conecte ajuda e erro com aria-describedby.",
    "Confira Tab, edição, seleção e colagem sem interceptar atalhos nativos de texto.",
    "Use type e autoComplete adequados, indique obrigatoriedade e marque erros com aria-invalid.",
  ],
  "input-group": [
    "Associe um rótulo ao campo e nomeie botões de sufixo ou prefixo; o ícone decorativo não é um rótulo.",
    "Confira Tab entre o campo e suas ações, preservando os atalhos nativos de edição.",
    "Associe unidades e instruções relevantes à descrição do campo e evite anúncios duplicados de elementos decorativos.",
  ],
  "input-otp": [
    "Nomeie o campo de código e informe comprimento, formato e instruções de recuperação.",
    "Confira digitação, exclusão e colagem do código completo, sem exigir foco manual em cada posição visual.",
    "Associe a mensagem de código inválido ou expirado e ofereça reenvio com uma ação nomeada.",
  ],
  item: [
    "Use link para navegação e botão para ação; mantenha título e descrição com uma ordem de leitura compreensível.",
    "Confira foco visível nas ações e evite botões ou links aninhados dentro de outro controle.",
    "Quando houver ações repetidas, inclua o nome do item no rótulo, como Remover Maria.",
  ],
  kbd: [
    "Apresente a combinação de teclas como texto compreensível; símbolos isolados podem precisar de explicação.",
    "Kbd apenas exibe o atalho. Implemente e confira a combinação, mantendo uma ação equivalente na interface.",
    "Evite conflitos com atalhos do navegador e tecnologias assistivas; adapte as instruções ao sistema usado.",
  ],
  label: [
    "Use htmlFor com o id único do controle e um texto que descreva o dado solicitado.",
    "Confira se a ativação do rótulo foca ou alterna o controle associado; o rótulo não precisa de tabIndex.",
    "Mantenha o texto visível e use uma legenda para grupos de opções, em vez de um rótulo solto.",
  ],
  marker: [
    "Descreva a separação ou evento em texto, como a data ou Novas mensagens; linhas e ícones são complementares.",
    "O marcador estático não recebe foco; links incluídos precisam ser acessíveis por Tab.",
    "Preserve a posição do marcador na ordem de leitura da conversa e não dependa só da aparência de separador.",
  ],
  menubar: [
    "Dê nomes aos menus e comandos e preserve estados acessíveis dos itens de seleção.",
    "Confira setas entre menus e itens, abertura por teclado e Escape para sair de submenus.",
    "Use esse padrão para comandos de aplicação e mantenha destinos comuns em uma navegação por links.",
  ],
  message: [
    "Identifique autor, conteúdo, horário e estado de envio em texto quando relevantes.",
    "Confira o acesso às ações de copiar, responder e tentar novamente, sem tornar cada mensagem estática uma parada de Tab.",
    "Ao anunciar novas mensagens, evite reler todo o histórico e não interrompa a leitura com atualizações de cada token.",
  ],
  "message-scroller": [
    "Nomeie a região de conversa e o controle que leva às mensagens recentes.",
    "Confira rolagem por teclado e acesso ao botão de voltar ao final, sem retirar o foco da mensagem em leitura.",
    "Respeite quem está lendo o histórico: novas mensagens não devem impor rolagem nem anúncios repetidos de todo o conteúdo.",
  ],
  "native-select": [
    "Associe Label ao select e forneça opções com nomes claros; conecte ajuda e erro quando presentes.",
    "Preserve a navegação nativa do navegador e do sistema, verificando Tab, setas e seleção por teclado.",
    "Indique seleção obrigatória e estado inválido; não trate uma opção de instrução como escolha válida.",
  ],
  "navigation-menu": [
    "Nomeie a navegação, use links reais e indique a página atual com aria-current quando apropriado.",
    "Confira Tab entre destinos, abertura dos painéis por teclado e fechamento com Escape.",
    "Garanta que destinos em painéis estejam disponíveis sem hover e mantenha nomes distintos para várias navegações.",
  ],
  "page-header": [
    "Use um título de página coerente com a hierarquia do documento e nomes descritivos nas ações.",
    "Confira o acesso aos breadcrumbs e ações por Tab; o título estático não precisa entrar na ordem de foco.",
    "Evite títulos principais duplicados na composição e confira texto longo e ações com zoom.",
  ],
  pagination: [
    "Nomeie a navegação de páginas e identifique a página atual com aria-current.",
    "Confira Tab e Enter nos links; controles indisponíveis não devem continuar navegando.",
    "Dê nomes claros a anterior e próximo e preserve os filtros ao mudar de página.",
  ],
  popover: [
    "Nomeie o gatilho e identifique o conteúdo do painel com título ou rótulo apropriado.",
    "Confira abertura, acesso ao conteúdo por Tab, Escape e retorno do foco ao gatilho.",
    "Não dependa de hover para abrir um editor; use Dialog quando a tarefa exigir um fluxo modal mais extenso.",
  ],
  progress: [
    "Use ProgressLabel ou um nome acessível e informe um valor coerente com o intervalo de progresso.",
    "A barra não é um controle e não precisa de Tab; ações de cancelar devem ser botões separados.",
    "Não invente porcentagens para espera indeterminada. Anuncie conclusão e falha sem narrar cada atualização numérica.",
  ],
  questionnaire: [
    "Identifique cada pergunta e associe rótulos às opções, com instruções sobre seleção e obrigatoriedade.",
    "Confira seleção e avanço por teclado e o destino do foco ao trocar de pergunta ou mostrar erros.",
    "Expresse progresso, respostas inválidas e conclusão em texto, sem depender apenas de marcadores visuais.",
  ],
  "radio-group": [
    "Dê um nome ao grupo e associe um rótulo a cada alternativa.",
    "Confira Tab para entrar e sair do grupo e setas para percorrer e selecionar as opções.",
    "Indique obrigatoriedade e erro para o conjunto e evite alterar o contexto da página assim que uma opção é selecionada.",
  ],
  resizable: [
    "Identifique o separador redimensionável e forneça contexto sobre os painéis que ele ajusta.",
    "Confira foco no separador e redimensionamento por setas, respeitando orientação e limites.",
    "Não dependa exclusivamente de arrastar e garanta que o tamanho mínimo preserve o acesso ao conteúdo.",
  ],
  "scroll-area": [
    "Dê um nome à região rolável quando ela precisar ser identificada separadamente na página.",
    "Confira se o conteúdo pode ser rolado por teclado e se é possível sair da região com Tab.",
    "Evite rolagens aninhadas desnecessárias e verifique se conteúdo ampliado e foco não ficam cortados.",
  ],
  select: [
    "Forneça um rótulo acessível ao gatilho e texto compreensível para o valor selecionado e as opções.",
    "Confira abertura por teclado, setas entre opções, seleção e Escape para fechar.",
    "Associe ajuda e erro ao controle; placeholder não substitui rótulo. Use Combobox quando a seleção exigir busca.",
  ],
  separator: [
    "Use a semântica de separador apenas quando a divisão tiver significado; para decoração, mantenha decorative.",
    "Um separador estático não recebe foco nem responde a teclas; use Resizable para divisão ajustável.",
    "Confira a orientação e evite separadores anunciados em excesso entre itens de uma mesma lista.",
  ],
  sheet: [
    "Inclua SheetTitle, descrição útil e um botão de fechar com nome acessível.",
    "Confira foco inicial, contenção no modo modal, Escape e retorno ao gatilho.",
    "Mantenha o fechamento e as ações acessíveis com conteúdo longo, zoom e teclado virtual.",
  ],
  shimmer: [
    "Mantenha uma mensagem textual compreensível sem o efeito visual; Shimmer não substitui um anúncio de status.",
    "Texto em processamento não precisa de foco. Preserve o foco no controle que iniciou a ação.",
    "Confira a versão estática com movimento reduzido e, se usar role=status, evite duplicar anúncios em regiões ancestrais.",
  ],
  sidebar: [
    "Nomeie a navegação e os botões de expandir e recolher, mantendo nomes acessíveis para itens apenas com ícone.",
    "Confira Tab nos destinos e controles e abertura, fechamento e retorno do foco no painel mobile.",
    "Indique a página atual e confira que tooltips não sejam a única fonte do nome dos destinos recolhidos.",
  ],
  "sidebar-profile": [
    "Configure os rótulos de perfil, organização e saída no idioma do produto e identifique o usuário atual.",
    "Confira abertura do menu por teclado, navegação entre ações, Escape e retorno ao gatilho.",
    "Verifique os nomes com a sidebar recolhida e anuncie o estado de saída sem perder o contexto em caso de erro.",
  ],
  skeleton: [
    "Trate os blocos como decoração e forneça uma mensagem de carregamento para a região de conteúdo.",
    "Skeletons não devem ser focáveis nem conter controles ativos fictícios.",
    "Use aria-busy na região em atualização quando apropriado e confira a experiência com movimento reduzido.",
  ],
  slider: [
    "Forneça aria-label ou aria-labelledby; para intervalos, use thumbLabels para distinguir os limites.",
    "Confira Tab entre os controles deslizantes e setas para ajustar os valores, incluindo os limites mínimo e máximo.",
    "Expresse a unidade e ofereça entrada numérica quando a precisão for importante; não dependa somente de arrastar.",
  ],
  sonner: [
    "Escreva notificações compreensíveis e nomeie ações e fechamento no idioma do produto.",
    "Confira acesso por teclado às ações e fechamento sem roubar o foco da tarefa em andamento.",
    "Mantenha informações essenciais disponíveis fora da notificação temporária e evite duplicar o mesmo anúncio em outra região viva.",
  ],
  spinner: [
    "Associe a animação a uma mensagem como Carregando resultados; o ícone sozinho não explica a espera.",
    "O indicador não recebe foco. Preserve o contexto e disponibilize cancelamento quando a tarefa permitir.",
    "Evite anúncios duplicados quando estiver dentro de um botão em carregamento e confira movimento reduzido.",
  ],
  "status-panel": [
    "Forneça título, descrição e ações no idioma do produto, distinguindo erro, vazio, sucesso e indisponibilidade.",
    "Confira o acesso às ações de recuperação e preserve um destino de foco válido quando o painel mudar.",
    "Evite envolver o painel em outra região viva que duplique seus anúncios; cor e ícone apenas complementam a mensagem.",
  ],
  switch: [
    "Associe um rótulo estável que descreva a configuração; o estado ligado ou desligado deve ser comunicado pelo controle.",
    "Confira Tab para alcançar o switch e Espaço para alterná-lo, mantendo foco visível.",
    "Não troque o nome da configuração ao alternar. Explique dependências e indisponibilidade próximas ao controle.",
  ],
  table: [
    "Use TableCaption para contexto e cabeçalhos associados às colunas ou linhas, com scope quando necessário.",
    "A tabela estática é percorrida pela leitura assistiva; apenas ações internas precisam entrar na ordem de Tab.",
    "Não use tabelas para layout e preserve as relações entre cabeçalhos e células ao adaptar para telas pequenas.",
  ],
  tabs: [
    "Nomeie a lista de abas e preserve a associação entre cada aba e seu painel.",
    "Confira setas na orientação da lista, ativação conforme a configuração e Tab para chegar ao conteúdo do painel.",
    "Mantenha o estado selecionado perceptível além da cor e evite que controles de painéis ocultos recebam foco.",
  ],
  textarea: [
    "Associe Label por htmlFor/id e conecte instruções, limite de caracteres e erro com aria-describedby.",
    "Preserve Enter para nova linha, Tab para sair e atalhos nativos de seleção e colagem.",
    "Não substitua rótulo por placeholder; permita revisar textos longos e anuncie limites sem interromper a cada tecla.",
  ],
  "theme-provider": [
    "O provider configura o tema; o controle de escolha de tema precisa de rótulo e seleção acessíveis na interface.",
    "Confira a troca por teclado no controle consumidor e preserve o foco durante a mudança de tema.",
    "Verifique contraste, estados e foco em todos os temas, inclusive quando a preferência acompanhar o sistema.",
  ],
  toast: [
    "Forneça título e mensagem claros e nomeie ações e fechamento; use urgência compatível com a mensagem.",
    "Confira acesso por teclado às ações e fechamento, sem mover o foco automaticamente para cada notificação.",
    "Não deixe instruções essenciais apenas em avisos que expiram; evite anúncios repetidos e preserve uma forma de recuperação.",
  ],
  toggle: [
    "Use um nome estável para a ação alternável e preserve a semântica de estado pressionado.",
    "Confira Tab, Enter e Espaço, com indicação de foco distinta da seleção.",
    "Em botões apenas com ícone, forneça aria-label; a aparência selecionada não deve ser o único indicador de estado.",
  ],
  "toggle-group": [
    "Nomeie o conjunto e cada opção, preservando o estado pressionado de cada item.",
    "Confira a navegação por teclado na configuração usada e Enter ou Espaço para alternar itens.",
    "Explique se várias opções podem ser selecionadas e não comunique seleção apenas pela cor de fundo.",
  ],
  tooltip: [
    "Use o tooltip como descrição complementar; o gatilho precisa ter seu próprio nome acessível.",
    "Confira exibição ao focar o gatilho e fechamento com Escape, sem exigir movimento do ponteiro.",
    "Não coloque ações ou instruções essenciais no tooltip; para conteúdo interativo, use Popover.",
  ],
  typography: [
    "Escolha títulos pela hierarquia do documento e preserve listas e parágrafos semânticos, independentemente do tamanho visual.",
    "Texto estático não precisa de Tab. Links no conteúdo devem ter nomes que façam sentido no contexto.",
    "Confira zoom, espaçamento de texto e contraste; textos menores não devem ser a única forma de apresentar informação essencial.",
  ],
  "validated-form": [
    "Preencha label e description dos campos e forneça mensagens de validação que expliquem como corrigir o valor.",
    "Confira envio por teclado e foco no primeiro campo inválido, além da navegação durante e após o envio.",
    "Configure autoComplete e traduza mensagens de envio, sucesso e falha; preserve os valores quando ocorrer erro.",
  ],
} satisfies Record<string, [string, string, string]>;

export const accessibilityGuidance: Record<string, AccessibilityGuidance> =
  Object.fromEntries(
    Object.entries(entries).map(([id, [semantics, keyboard, usage]]) => [
      id,
      { semantics, keyboard, usage },
    ]),
  );
