# Manchete Viva
Portal SSR em React 19 e TanStack Start. Identidade baseada na imagem enviada pelo proprietário.

## Conteúdo
- Artigos em src/data/articles.json. Campos: slug, category, title, excerpt, sourceDate, sourceAuthor, sourceUrl, image, credit, caption, paragraphs.
- Resumos originais de reportagens reais com fontes identificadas. Não há publicação automática nem repórteres inventados.
- Publicação inicial em 16/11/2026. Revisar o estado de cada notícia antes de atualizá-la.
- Fotografias próprias da Agência Brasil com crédito. Imagens sem autorização verificada não devem ser adicionadas.

## Monetag
Editar src/config/advertising.ts com o script HTTPS, ID da zona e token de verificação emitidos para o domínio definitivo. enabled continua false até isso acontecer.
O script só carrega com consentimento. A origem HTTPS do script é incorporada ao CSP; confirmar os demais hosts de connect/frame exigidos pelo código oficial antes de ativar. Não liberar curingas.
O meta token é retornado no head quando configurado. Se a Monetag fornecer ads.txt, inserir apenas as linhas oficiais no campo adsTxtLines. Um ads.txt vazio não representa autorização de vendedor.
Não há popunder nem push de navegador configurados. In-Page Push preferido, condicionado à zona fornecida. Filtros de adulto/apostas dependem do painel Monetag e não foram aplicados pela aplicação.

## Privacidade
Consentimento em localStorage com expiração de180 dias. Rejeitar bloqueia código; revogar recarrega a página. Nenhum analytics ativado.
Consultar políticas antes de adicionar fornecedores ou mudar finalidade. A estrutura não garante aprovação em rede publicitária.

## Contato
POST /api/contato valida origem, tamanho, formato, honeypot, consentimento e limite de cinco mensagens por dia por identificador derivado de IP. D1 contact_messages armazena mensagens sem endpoint público de leitura. Limpeza de180 dias ocorre em envios seguintes. Não há entrega de e-mail nem notificação automática.
O proprietário consulta a tabela contact_messages pelas ferramentas administrativas autenticadas da hospedagem; não criar interface pública sem autenticação. Configure canal de notificação quando disponível para garantir acompanhamento regular.
Migração aditiva em migrations/0002_contact.sql, DB ativado em app.manifest.json.

## SEO
Metadados, canonical, NewsArticle e BreadcrumbList, sitemap.xml, robots.txt, rss.xml e favicon. Atualizar SITE em src/lib/content.ts e URLs de app-meta.json ao vincular domínio próprio.

## Desenvolvimento
Dependências e scripts preservados. Executar bun run typecheck se Bun e dependências estiverem presentes. A plataforma executa a compilação da versão publicada.
