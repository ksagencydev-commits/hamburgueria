# Assets e direção de arte

## Materiais preservados

`public/images/referencia-flame-burger.png` é a referência aprovada e permanece idêntica ao original `imagens/Burger em Outro Nível.png` (1536 × 1024). A referência não é usada como background integral, nem como uma captura substituindo HTML. Sua composição orienta o grid, a navegação vertical, a tipografia, os CTAs, as anotações, a escala do produto e a faixa diagonal editorial.

Todos os treze arquivos preexistentes de `public/images` e os dois arquivos de `imagens` foram preservados com SHA-256. As fotografias editoriais já disponíveis são usadas como imagens individuais; o vídeo original de oito segundos tem marca-d'água e foi preservado fora do build. Não havia modelo GLB/GLTF.

## Novos arquivos finais

Todos em `public/images/v3/`:

- `hero.webp`: produto fotográfico isolado preparado a partir da referência, com alpha, otimizado em WebP. É um asset de hero, não a implementação da animação.
- `top-bun.webp`, `lettuce.webp`, `bacon.webp`, `onion.webp`, `tomato.webp`, `cheddar.webp`, `patty.webp`, `sauce.webp`, `bottom-bun.webp`: nove fotografias individuais com alpha, em câmera frontal baixa e iluminação âmbar consistente. Cebola e tomate, molho e pão são arquivos distintos.
- `manifest.json`: dimensões originais dos nove recortes, usadas para calcular a geometria.

Os arquivos foram preparados com a ferramenta integrada `image_gen`, sem CLI/API externa e sem geração de interface. Os atlas foram separados em arquivos individuais, mantendo proporções e transparência. A versão final utiliza a câmera frontal baixa; o primeiro atlas, com câmera muito alta, foi descartado.

A foto do hero e as fotografias dos ingredientes são materiais ilustrativos preparados a partir da direção fornecida; não são alegadas como recortes pixel a pixel de uma única sessão original. Para correspondência fotográfica absoluta entre produto completo e todas as camadas, os recortes originais da sessão aprovada seriam o material ideal. A animação atual tem nove camadas reais e foi testada no navegador.

Fontes locais: Sora variável e Manrope variável, com licenças SIL Open Font License em `public/fonts/`. GSAP e ScrollTrigger locais foram preservados em `vendor/`, com licença indicada nos próprios arquivos.

## Prompt final do hero

Ferramenta integrada image_gen, edição com a referência fornecida e `transparent_background: true`:

> EDIT THE SUPPLIED REFERENCE. Extract ONLY the large floating exploded hamburger in the center-right, as a standalone transparent-background product photography cutout. Preserve the actual burger's photographic appearance, proportions, warm dramatic amber highlights, dark charred meat, melted cheddar drips, brioche sesame buns, ruffled lettuce, purple onion rings, tomato and bacon, close 3/4 perspective and vertical exploded arrangement. Remove ALL text, ALL UI, ALL logos, annotations, buttons, restaurant background and the bottom ingredient photo strip. Do not recreate any website layout. This output is a single full-height premium burger cutout for a website hero, not a mockup. Keep the burger centered with all buns completely inside the canvas, no crop of the product. Genuine alpha transparency. A few tiny food crumbs and sauce drops directly around the burger may remain. No lettering, no watermark, no plate. Portrait canvas, burger taking most of it.

## Prompt final das camadas

Ferramenta integrada image_gen, geração de atlas, `transparent_background: true`:

> A square 1536x1536 true transparent-background asset sheet, precise equal 3x3 grid, ONE PHOTOREAL burger ingredient in each cell. CRITICAL CAMERA: very LOW FRONT CAMERA almost at burger level, NOT top down, NOT an overhead still life. All nine food layers are HORIZONTAL FLAT SIDE-VIEW elliptical layers, about 400px wide but only 60-130px tall each, giving a very wide thin silhouette and same camera viewpoint to stack into a burger. There must be LARGE clear transparent areas above and below every object within its cell. Every object's width is 80% of its cell, its height no more than 30% of its cell. TOP ROW left-to-right: (1) golden sesame brioche TOP BUN DOME, low wide dome viewed straight from front, height/width 0.3; (2) flat horizontal layer of curly GREEN LETTUCE, side-view, height/width .15; (3) TWO RED TOMATO SLICES lying horizontal seen at low angle, height/width .12. MIDDLE ROW: (4) purple ONION RINGS LYING FLAT HORIZONTALLY, nearly edge-on, height/width .12, not upright diagonal hoops; (5) 3 flat wavy CRISPY BACON strips horizontally, height/width .15; (6) thin flat MELTED CHEDDAR slice with 2 short drips, height/width .17, no meat. BOTTOM ROW: (7) GRILLED BEEF PATTY with char marks low side-view, height/width .22; (8) THIN creamy beige SAUCE elliptical spread with 1 short drip, height/width .12, not a mound; (9) golden brioche BOTTOM BUN alone side-view height/width .18, not showing large top surface. Warm amber cinematic rim lighting from top-right, detailed food advertising photography, moist organic irregular textures. Matching scales and dark shadows. No text, no plates, no extra objects, no grid lines, no labels, no background, no assembled burgers. Genuine alpha. Never tilt these layers upright. Do not place ingredients at a top-down camera angle.


## Camadas HD — atualização v4

Arquivos finais em `public/images/v4/{top-bun,lettuce,tomato,onion,bacon,cheddar,patty,sauce,bottom-bun}.webp`, cada um com 1254 px de largura, e variantes `*-640.webp`. O primeiro pedido de upscale do atlas não aumentou a resolução e foi descartado. A solução final gerou nove fotografias individuais, com microtexturas próprias e transparência, usando image_gen integrado. O recorte remove apenas margens transparentes e mantém a proporção; a variante menor é uma otimização proporcional do mesmo arquivo.

Prompt compartilhado final: “The input atlas is ONLY a supporting reference for lighting and ingredient identity. Generate ONE standalone high-resolution food photograph, not an atlas, not a grid. Subject: [ingrediente]. Square 1536x1536 canvas with true alpha transparent background. The SINGLE ingredient is centered, fills 85 percent of canvas WIDTH, with generous empty transparent space above and below. Very LOW FRONT camera almost level with the tabletop, NOT overhead; maintain a naturally flat wide horizontal layer so it can stack into a burger. Match the supplied reference's premium warm amber rim lighting from top-right and dark food advertising shadows. Exceptional lifelike macro detail, photographic microtexture, sharp clean transparent edges, no plastic look. Do not include any other ingredients. No text, labels, plate, utensil, background, grid or assembled burger. Only one isolated ingredient layer. The large single ingredient must occupy nearly the full image width for retina-quality display.”

Os nove sujeitos foram: pão superior de gergelim (proporção 3:1), alface frisada (5:1), duas fatias de tomate horizontais (6:1), anéis de cebola roxa deitados (7:1), três tiras de bacon crocante (5:1), cheddar com dois pingos curtos (5:1), carne bovina grelhada (4:1), molho raso com um pingo curto (7:1), pão inferior tostado sem molho (5:1). Os tamanhos efetivos dos recortes estão em `manifest.json`; o pedido de canvas não é apresentado como resolução final atingida.

## Carne refinada — atualização HQ

Edição integrada image_gen da camada patty.webp, preservando ângulo frontal, iluminação quente, silhueta e transparência. Pedido: textura natural de carne moída, crosta irregular grelhada, detalhes nítidos e reflexos contidos, sem outros ingredientes. Resultado real: 2172 × 724 px, WebP qualidade 96, variantes 1280/640 px qualidade 94. Arquivos patty-hq*.webp; manifest atualizado. A versão anterior permanece preservada.

## Fotografias do preparo — HQ

Grill HQ: 1536 × 1024 px. Cheddar HQ: 1536 × 1024 px. Edições image_gen das fotografias originais para restaurar detalhe natural da crosta, grelha, fumaça e queijo; preservados câmera baixa, iluminação âmbar, tema e composição. Sem textos ou elementos extras. WebP qualidade 95 e versões 768 px qualidade 90, com srcset. Originais preservados. A nova seção ritual substitui os blocos de cheddar e pão por uma composição editorial com fotografia, título e três etapas numeradas.

## Recorte do cheddar

image_gen background-extraction da foto melt-hq.webp: removidos grelha, fumaça e fundo; preservados carne, cheddar, textura e iluminação. Fundo alpha real, arquivo melt-cutout.webp 1536 × 1024, variante 768 px. CSS usa contain e não aplica moldura ou sobreposição retangular.
