import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "./code-block";

export function ComponentPreview({
  id,
  title,
  description,
  children,
  code,
}: {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
  code: string;
}) {
  return (
    <section id={id} className="min-w-0 scroll-mt-20">
      <div className="mb-3">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>

      <Tabs defaultValue="preview" className="w-full min-w-0">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Código</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <div className="flex min-h-40 flex-wrap items-center justify-center gap-4 overflow-x-auto rounded-lg border bg-background p-4 sm:p-8">
            {children}
          </div>
        </TabsContent>
        <TabsContent value="code">
          <CodeBlock code={code} />
        </TabsContent>
      </Tabs>
    </section>
  );
}
