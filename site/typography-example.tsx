import {
  Title, SubTitle, SectionTitle, SectionSubTitle, Text,
  Quote, BulletList, NumberedList, InlineCode,
  Lead, Highlight, Caption, Description, TextLink,
} from "@/components/ui/typography";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function TypographyExample() {
  return <article className="w-full min-w-0 max-w-3xl text-foreground">
    <Title>Uma linguagem compartilhada</Title>
    <Lead className="mt-4">Tipografia para orientar, explicar e tornar cada interação mais clara.</Lead>
    <Text>Uma interface começa pelas palavras. Títulos organizam a leitura e parágrafos dão contexto para que as pessoas saibam o que fazer.</Text>
    <SubTitle className="mt-10" id="hierarquia">Hierarquia que orienta</SubTitle>
    <Text>Escolha o nível do título pela estrutura do documento. Consulte os <TextLink href="/fundamentos">fundamentos do LAI</TextLink> para combinar cores, espaçamento e conteúdo.</Text>
    <Quote cite="/fundamentos">Uma boa interface responde primeiro ao que a pessoa precisa entender.</Quote>
    <SectionTitle>Princípios de escrita</SectionTitle>
    <BulletList>
      <li>Comece pela informação mais relevante.</li>
      <li>Use palavras familiares e frases diretas.</li>
      <li>Mantenha os nomes das ações consistentes.</li>
    </BulletList>
    <SectionSubTitle>Antes de publicar</SectionSubTitle>
    <NumberedList>
      <li>Revise os títulos e a sequência da leitura.</li>
      <li>Confira a experiência em uma tela pequena.</li>
    </NumberedList>
    <Text>Use <InlineCode>InlineCode</InlineCode> para nomes de propriedades, comandos curtos e valores técnicos.</Text>
    <SubTitle className="mt-10">Informação fácil de comparar</SubTitle>
    <div className="my-6">
      <Table>
        <TableCaption>Exemplos de aplicação da hierarquia tipográfica.</TableCaption>
        <TableHeader><TableRow><TableHead scope="col">Elemento</TableHead><TableHead scope="col">Uso</TableHead></TableRow></TableHeader>
        <TableBody>
          <TableRow><TableCell>Título</TableCell><TableCell>Identificar a seção</TableCell></TableRow>
          <TableRow><TableCell>Parágrafo</TableCell><TableCell>Explicar o contexto</TableCell></TableRow>
        </TableBody>
      </Table>
    </div>
    <div className="space-y-3 rounded-xl border p-5">
      <Highlight>Pronto para começar</Highlight>
      <Caption>Alterações salvas automaticamente.</Caption>
      <Description>Os textos de apoio complementam a informação principal.</Description>
    </div>
  </article>;
}
