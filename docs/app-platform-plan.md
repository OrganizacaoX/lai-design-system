# Plano de expansão da base LAI

Escopo aprovado: centralizar dependências e integrações de frontend em subpaths do pacote LAI, preservando as APIs nativas e instâncias configuráveis por aplicação.

- [x] Formulários: TanStack Form, Zod, campos LAI e erros de API.
- [x] Ordenação: DnD Kit, handles, teclado e toque.
- [x] Virtualização: TanStack Virtual e lista reutilizável.
- [x] Autenticação: Better Auth e limpeza de estado em transições de sessão/organização.
- [x] Utilitários: Motion, date-fns, locales e Lucide.
- [x] Analytics: PostHog com inicialização explícita.
- [x] Tours: Driver.js com textos localizados e CSS publicado.
- [x] IA: TanStack AI React/client e helper shadcn para streaming local.
- [x] Testes de consumidores: renderWithLai, instâncias isoladas e cleanup.
- [x] Validação: tipos, build, pacote instalado isoladamente, integrações no navegador e regressões.

Critérios: nenhum frontend precisa instalar essas dependências diretamente; cada módulo tem import próprio; nenhuma credencial ou endpoint de produto é fixado na biblioteca. Testes locais não comprovam integrações com serviços de produção.

Implementação documentada em [app-platform.md](app-platform.md). Validação concluída em 2026-09-05: os testes de consumidores exercitaram os novos módulos pelo tarball empacotado localmente.

## Evidências finais

- `bun run check` e build da biblioteca aprovados.
- `bun run test:app`: instalação sem hoisting com LAI + React + ferramentas, tipos estritos incluindo ferramentas de IA, 14 testes de runtime e fluxos Chromium desktop/mobile aprovados. O kit Testing Library foi validado com React em desenvolvimento.
- `bun run test:consumers`: pacote React 19 e 33 itens transitivos do registry com tema em React 18 aprovados.
- `bun run test:reliability-unit`: 7 testes aprovados.
- `bun run test:reliability`: 144 testes de navegador e 34 de composição aprovados; relatório de 76 componentes com fingerprint atual e sem mudança de fontes durante a execução.
- Manifesto e npm lock sincronizados; 28 exports apontam para arquivos existentes; `git diff --check` aprovado.

A validação de autenticação e analytics usa endpoints/fixtures locais. O helper de IA foi validado sem acesso a modelos ou rede. Configurar os serviços reais continua sendo responsabilidade de cada aplicação.
