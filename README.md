# FLAME BURGER — reconstrução local / KS Agency

Frontend reconstruído do zero diretamente no repositório. HTML semântico, módulos JavaScript, CSS Grid/Flexbox, fontes Sora/Manrope e uma animação GSAP com nove ingredientes independentes. Sem framework de componentes, template ou gerador de layouts. Esta versão não foi publicada pelo Sites.

## Abrir o projeto

Na raiz do repositório:

```sh
python3 -m http.server 5173
```

Abra http://localhost:5173. O site não exige Node.js para funcionar. Não abra `index.html` via `file://`: módulos e carregamento do manifest exigem um servidor HTTP.

## Build

```sh
python3 scripts/build.py
```

O resultado fica em `dist/`. O build contém apenas os arquivos utilizados pelo novo site; não inclui backup, referência completa, vídeo com marca-d'água, testes ou assets antigos não utilizados. Todos os originais continuam preservados na raiz e em `public/images`.

## Estrutura nova

- `index.html`: estrutura semântica, hero, faixa editorial, experiência, cardápio, essência, preparo, encerramento e diálogos.
- `src/site.css`: estilos integralmente novos, com layouts específicos para desktop, tablet e mobile.
- `src/main.js`: inicialização e ciclo de vida.
- `src/ingredients.js`: dados dos nove ingredientes e composição das fotografias.
- `src/experience.js`: timeline GSAP/ScrollTrigger, pin, geometria de abertura e reduced motion.
- `src/menu.js`: produtos, filtros, galeria horizontal e composição visual.
- `src/smooth-scroll.js`: Lenis condicional no desktop, sincronização com GSAP e controle de diálogos.
- `src/interactions.js`: navegação, diálogos, pedidos e metadata condicionada à URL confirmada.
- `config.js`: configurações comerciais preexistentes preservadas, sem expor credenciais.
- `public/images/v3/hero.webp`: hero isolado. `public/images/v4/`: nove camadas HD de 1254 px, versões responsivas de 640 px e manifest com dimensões.
- `tests/browser.cjs`: testes reais em Chrome/Playwright, com servidor temporário próprio.
- `docs/AUDIT.md`: auditoria das ferramentas e da reconstrução.
- `docs/ASSETS.md`: inventário, estratégia e prompts dos novos assets.

Os arquivos antigos `app.js`, `style.css` e o teste visual antigo não integram mais o projeto. Nenhum componente ou stylesheet anterior é importado.

## Configuração

Produtos, descrições, WhatsApp, Instagram e a URL canônica estão em `config.js`. O número do WhatsApp permanece vazio: todos os CTAs mostram uma demonstração explícita, sem envio ou cobrança. Quando houver número confirmado, informe DDI + DDD + número, somente dígitos. Instagram só aparece quando configurado.

A configuração de hospedagem anterior foi preservada em `.openai/hosting.json`, sem uso nesta reconstrução local. A metadata canônica e a imagem Open Graph só são adicionadas quando a origem atual corresponde à URL confirmada em `config.js`; assim a prévia local não aponta para assets de uma publicação antiga.

## Animação

Nove arquivos WebP com alpha: pão superior, alface, bacon, cebola, tomate, queijo, carne, molho e pão inferior. O hero usa uma fotografia isolada; a sequência de scroll usa os nove arquivos separados. Não é uma fotografia única simulando desmontagem.

No computador, uma única timeline com `pin`, `scrub: 0.65` no desktop e duração de três alturas de viewport. A abertura progride até 75%; de 75 a 100% a composição permanece aberta. A rolagem reversa refaz a montagem. Posições, escala e rotações de até 12° são calculadas por ingrediente. A abertura compacta usa sobreposição parcial intencional para manter as camadas maiores; deslocamentos laterais individuais tornam a composição assimétrica. Seis pequenos respingos de cheddar acompanham a abertura e a reversão. A geometria considera os limites rotacionados para evitar recorte vertical.

No celular e tablet (até 900 px), ou em dispositivos touch sem hover, o hambúrguer fica montado e estático, com seção compacta, rolagem nativa e sem pin. A troca de breakpoint remove ou restaura a timeline automaticamente.

Inicialização após decode dos assets e carregamento das fontes. Resize atualiza a mesma timeline por refresh; não recria pins em andamento. `gsap.context()` controla teardown. Reduced motion mostra a composição aberta, sem pin ou transição. Touch mantém cursor normal; mouse preciso oculta o cursor somente na superfície não interativa ativa, com restauração ao sair. Links e foco permanecem funcionais.

Não há Three.js: a composição utiliza imagens independentes. Lenis 1.3.27 é carregado apenas no desktop com mouse preciso, compartilhando o ticker do GSAP. Lerp 0.085 suaviza a roda do mouse; âncoras usam duração de 1.1s e easing próprio. O controlador para em diálogos e é removido em touch/reduced motion. Integração baseada na [documentação oficial do Lenis](https://github.com/darkroomengineering/lenis#gsap-scrolltrigger). A biblioteca e sua licença MIT ficam em `vendor/`.

## Verificação

Requer Node.js 22+ e Google Chrome. Instale as dependências de desenvolvimento:

```sh
npm ci
npm run check
npm run test:visual
```

A suíte abre seu próprio servidor temporário e o encerra ao terminar. Para testar o build:

```sh
TEST_DIST=1 npm run test:visual
```

`CHROME_PATH` permite indicar outro executável do Chrome. `TEST_URL` permite testar uma URL de prévia existente. Não há linter ou TypeScript configurados; `check` verifica a sintaxe dos sete módulos/scripts.

A suíte captura 375, 390, 430, 768, 1024, 1280 e 1440 px. Verifica composição estática e ausência de pin no mobile, 15 estados de scroll para frente, 12 estados reversos no desktop, pin, camadas independentes, escala mínima, assimetria e limites verticais na abertura, overflow, cursor, touch, navegação por teclado, filtros, galeria, pedidos demonstrativos, resize, reload e reduced motion. Também compara os hashes dos quinze materiais originais.

Screenshots e relatório são gravados em `qa-v3/`. São testes em Chrome headless com emulação mobile; não constituem testes em aparelhos físicos nem uma pontuação Lighthouse.

## Backup recuperável

Estado anterior completo, com assets e configuração:

`checkpoints/flame-before-clean-rebuild.tar.gz`

Hashes dos originais:

`checkpoints/original-assets-sha256.json`

O backup foi verificado antes da limpeza. Para recuperar, extraia o arquivo em uma pasta vazia; `.git` e diretórios protegidos não foram modificados. Não há credenciais temporárias de publicação gravadas nos arquivos.

## Refinamento de qualidade e controles

As camadas HD em `public/images/v4/` foram geradas individualmente pela ferramenta integrada image_gen, com largura de 1254 px (3× a largura anterior de 418 px), preservando transparência. O navegador seleciona versões de 640 ou 1254 px conforme resolução/densidade. Os arquivos anteriores permanecem preservados.

Botões principais têm 58px de altura no desktop e 52px no mobile, tipografia maior, brilho de passagem, elevação, seta animada e resposta ao clique. Os efeitos respeitam reduced motion.

A suíte também mede interpolação com eventos reais de roda do mouse, chegada das âncoras (respeitando scroll-padding) e altura dos CTAs.

## Editorial de preparo

Nossa essência usa grill-hq.webp (1536 × 1024), com variante responsiva. A seção ritual substitui os blocos antigos de cheddar e pão por composição assimétrica, foto melt-hq.webp, título em três linhas e etapas numeradas do preparo. Ambas as fotografias foram refinadas com image_gen; os originais permanecem preservados.
