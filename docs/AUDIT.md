# Auditoria do reinício

Raiz exclusiva: `/home/ketlynsouza/sites/hamburgueria`.

Backup recuperável: `checkpoints/flame-before-clean-rebuild.tar.gz`. Inventário SHA-256 dos quinze materiais originais: `checkpoints/original-assets-sha256.json`. Inclui os materiais fornecidos em `imagens` e todos os arquivos preexistentes de `public/images`.

O frontend anterior (`index.html`, `style.css`, `app.js` e teste visual correspondente) foi descartado após validar o backup. O novo frontend é escrito diretamente em `index.html` e `src/`, sem importar componentes, estilos ou animações anteriores. Configurações comerciais em `config.js`, `.openai/hosting.json`, `.git`, materiais fornecidos e bibliotecas GSAP locais foram preservados.

## Skills e integrações disponíveis

Sites, geração/edição de imagens, ferramentas de documentos, PDFs, apresentações, planilhas, visualizações, gerenciamento de plugins, skills e pets estão disponíveis. Neste trabalho usamos edição direta do repositório, preparação de imagens e Chrome/Playwright para testes. Não há biblioteca de componentes nem framework/template que determine a aparência.

A integração Sites foi utilizada anteriormente para sincronização e hospedagem de HTML/CSS/JS escritos diretamente. O código e o histórico de chamadas não mostram geração automática de layout, injeção de componentes, alteração de CSS ou conflito do Sites com GSAP. Os erros anteriores eram da implementação do frontend. Esta reconstrução é local e não utiliza as chamadas Sites nem altera conexões/contas ou a publicação anterior. A integração não foi desinstalada e não afirmamos tê-la desativado na conta.

Não são usados geradores automáticos de interfaces. A ferramenta de imagem prepara somente arquivos raster de produto; ela não decide a estrutura HTML, CSS ou animação.

## Materiais

Referência aprovada: `public/images/referencia-flame-burger.png` (cópia idêntica de `imagens/Burger em Outro Nível.png`). Fotografias editoriais existentes, vídeo original, sete camadas antigas e imagem Chicken Crunch foram inventariados e preservados. Não existe GLB/GLTF. As camadas antigas não separavam tomate/cebola e molho/base; o novo atlas deverá fornecer nove arquivos independentes. O vídeo original tem marca-d'água e não será usado como mídia final.
