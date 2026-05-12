import type { Metadata } from "next";
import "./cssGlobal.css";

export const metadata: Metadata = {
  title: "Template",
  description: "Template para criação de novas aplicações.",
};

/**
 * Layout raiz da aplicação.
 * Use para imports globais, metadados e estrutura comum compartilhada por todas as rotas.
 */
export default function LayoutRaiz({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" data-scroll-behavior="smooth">
      <body>
        <div className="flex">

          {/* Conteudo dinamico da rota atual. */}
          <main className="min-w-0 flex-1 p-0">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}
