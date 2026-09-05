import { useState } from "react";
import type { Demo } from "./demos";
import {
  Attachment,
  AttachmentContent,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import {
  Message,
  MessageHeader,
  MessageContent,
} from "@/components/ui/message";
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
} from "@/components/ui/message-scroller";
import { Marker } from "@/components/ui/marker";
import { DirectionProvider } from "@/components/ui/direction";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/sonner";
import { useTheme } from "@/components/theme-provider";
import {
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireTitle,
  QuestionnaireChoices,
  QuestionnaireChoice,
  QuestionnaireActions,
  QuestionnaireSubmit,
} from "@/components/ui/questionnaire";
function QuestionnaireExample() {
  const [done, setDone] = useState(false);
  return (
    <div className="w-full">
      <Questionnaire
        onSubmit={(event) => {
          event.preventDefault();
          setDone(true);
        }}
      >
        <QuestionnaireItem name="channel" required>
          <QuestionnaireTitle>
            Como prefere receber atualizações?
          </QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="email">E-mail</QuestionnaireChoice>
            <QuestionnaireChoice value="app">No aplicativo</QuestionnaireChoice>
          </QuestionnaireChoices>
        </QuestionnaireItem>
        <QuestionnaireActions>
          <QuestionnaireSubmit>Salvar preferência</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>
      {done && <p role="status">Preferência salva.</p>}
    </div>
  );
}
function ToastExample() {
  const { toast } = useToast();
  return (
    <Button onClick={() => toast.success("Alterações salvas.")}>
      Mostrar notificação
    </Button>
  );
}
function ThemeExample() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <Button
      variant="outline"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      Alternar tema do site
    </Button>
  );
}
export const messagingDemos: Demo[] = [
  {
    id: "attachment",
    title: "Attachment",
    description: "Arquivo anexado e estados de processamento.",
    node: (
      <div className="flex flex-wrap gap-3">
        {(["done", "uploading", "error"] as const).map((state) => (
          <Attachment key={state} state={state}>
            <AttachmentContent>
              <AttachmentTitle>
                relatorio.pdf —{" "}
                {state === "done"
                  ? "Concluído"
                  : state === "uploading"
                    ? "Enviando"
                    : "Falha no envio"}
              </AttachmentTitle>
            </AttachmentContent>
          </Attachment>
        ))}
      </div>
    ),
    code: '<Attachment state="done"><AttachmentContent><AttachmentTitle>relatorio.pdf</AttachmentTitle></AttachmentContent></Attachment>',
  },
  {
    id: "bubble",
    title: "Bubble",
    description: "Conteúdo de conversa com alinhamento e variantes.",
    node: (
      <div className="flex w-full flex-col gap-3">
        <Bubble variant="secondary">
          <BubbleContent>Como posso ajudar?</BubbleContent>
        </Bubble>
        <Bubble align="end">
          <BubbleContent>Quero consultar meu relatório.</BubbleContent>
        </Bubble>
      </div>
    ),
    code: '<Bubble variant="secondary"><BubbleContent>Como posso ajudar?</BubbleContent></Bubble>',
  },
  {
    id: "message",
    title: "Message",
    description: "Mensagem com identificação do autor e conteúdo.",
    node: (
      <Message>
        <MessageContent>
          <MessageHeader>Ana</MessageHeader>
          <Bubble variant="secondary">
            <BubbleContent>O relatório está disponível.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    ),
    code: "<Message><MessageContent><MessageHeader>Ana</MessageHeader><Bubble><BubbleContent>Relatório disponível.</BubbleContent></Bubble></MessageContent></Message>",
  },
  {
    id: "message-scroller",
    title: "Message Scroller",
    description: "Área de conversa com rolagem gerenciada.",
    node: (
      <div className="h-48 w-full">
        <MessageScrollerProvider>
          <MessageScroller>
            <MessageScrollerViewport
              tabIndex={0}
              aria-label="Histórico de mensagens"
            >
              <MessageScrollerContent>
                {Array.from({ length: 8 }, (_, i) => (
                  <p key={i}>Mensagem {i + 1}: atualização do relatório.</p>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
          </MessageScroller>
        </MessageScrollerProvider>
      </div>
    ),
    code: '<MessageScrollerProvider><MessageScroller><MessageScrollerViewport tabIndex={0} aria-label="Histórico"><MessageScrollerContent>{messages}</MessageScrollerContent></MessageScrollerViewport></MessageScroller></MessageScrollerProvider>',
  },
  {
    id: "marker",
    title: "Marker",
    description: "Marcador de data ou mudança de contexto em uma conversa.",
    node: <Marker variant="separator">Hoje</Marker>,
    code: '<Marker variant="separator">Hoje</Marker>',
  },
  {
    id: "direction",
    title: "Direction",
    description: "Direção de leitura para componentes e layouts.",
    node: (
      <DirectionProvider direction="rtl">
        <div dir="rtl" className="w-full rounded-lg border p-4">
          <span lang="ar">مرحبا</span>
          <p className="mt-2 text-sm">
            Exemplo de direção da direita para a esquerda.
          </p>
        </div>
      </DirectionProvider>
    ),
    code: '<DirectionProvider direction="rtl"><div dir="rtl">{children}</div></DirectionProvider>',
  },
  {
    id: "label",
    title: "Label",
    description: "Rótulo associado a um controle de formulário.",
    node: (
      <div className="grid gap-2">
        <Label htmlFor="label-example">Nome</Label>
        <Input id="label-example" />
      </div>
    ),
    code: '<Label htmlFor="name">Nome</Label>\n<Input id="name" />',
  },
  {
    id: "sonner",
    title: "Sonner",
    description: "Notificações temporárias com Toaster e useToast.",
    node: <ToastExample />,
    code: 'const { toast } = useToast();\n<Button onClick={() => toast.success("Alterações salvas.")}>Notificar</Button>\n// Monte <Toaster /> uma vez na raiz.',
  },
  {
    id: "theme-provider",
    title: "Theme Provider",
    description: "Tema do sistema e preferência persistida do usuário.",
    node: <ThemeExample />,
    code: "<ThemeProvider><App /><Toaster /></ThemeProvider>\n// const { resolvedTheme, setTheme } = useTheme();",
  },
  {
    id: "questionnaire",
    title: "Questionnaire",
    description: "Perguntas sequenciais com escolhas e ações traduzíveis.",
    node: <QuestionnaireExample />,
    code: '<Questionnaire onSubmit={handleSubmit}><QuestionnaireItem name="channel" required><QuestionnaireTitle>Canal de contato</QuestionnaireTitle><QuestionnaireChoices><QuestionnaireChoice value="email">E-mail</QuestionnaireChoice></QuestionnaireChoices></QuestionnaireItem><QuestionnaireActions><QuestionnaireSubmit>Salvar preferência</QuestionnaireSubmit></QuestionnaireActions></Questionnaire>',
  },
];
