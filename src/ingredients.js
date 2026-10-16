export const INGREDIENTS = [
  {id:'top-bun',name:'PÃO ARTESANAL',detail:'Dourado por fora. Macio por dentro.',advance:.52,turn:-1.3},
  {id:'lettuce',name:'ALFACE FRESCA',detail:'Textura, leveza e frescor em equilíbrio.',advance:.50,turn:1.1},
  {id:'bacon',name:'BACON CROCANTE',detail:'A intensidade que você escuta na primeira mordida.',advance:.42,turn:-1.2},
  {id:'onion',name:'CEBOLA ROXA',detail:'Personalidade e uma dose de crocância.',advance:.45,turn:1.4},
  {id:'tomato',name:'TOMATE FRESCO',detail:'Suculência natural, sem atalhos.',advance:.50,turn:-1},
  {id:'cheddar',name:'QUEIJO CREMOSO',detail:'Uma camada feita para derreter.',advance:.35,turn:1.3},
  {id:'patty',name:'CARNE NA BRASA',detail:'O coração do burger. Fogo e sabor de verdade.',advance:.65,turn:-.9},
  {id:'sauce',name:'MOLHO DA CASA',detail:'O toque final que conecta cada ingrediente.',advance:.20,turn:1},
  {id:'bottom-bun',name:'A BASE PERFEITA',detail:'Toda essa experiência, em uma só mordida.',advance:1,turn:0}
];
export const RECIPES = {
  classic:['top-bun','lettuce','tomato','cheddar','patty','sauce','bottom-bun'],
  double:['top-bun','bacon','cheddar','patty','cheddar','patty','sauce','bottom-bun'],
  smoke:['top-bun','bacon','onion','patty','sauce','bottom-bun']
};
export function createLayers(container, ids, manifest, eager=false){
  const images=ids.map((id,index)=>{
    const info=manifest.find(asset=>asset.id===id);
    if(!info)throw new Error(`Asset de ingrediente ausente: ${id}`);
    const image=new Image(info.width,info.height);
    image.alt='';image.className='food-layer';
    image.dataset.ingredient=id;image.dataset.ratio=String(info.ratio);image.style.zIndex=String(ids.length-index);
    image.decoding='async';image.loading=eager?'eager':'lazy';
    if(info.srcset){image.sizes='(max-width: 600px) 90vw, 46vw';image.srcset=info.srcset;}
    image.src=info.src||`public/images/v3/${id}.webp`;container.append(image);return image;
  });
  return images;
}
export function assembledGeometry(images){
  let top=0;
  const positions=images.map(image=>{
    const y=top;const ingredient=INGREDIENTS.find(item=>item.id===image.dataset.ingredient);
    top+=Number(image.dataset.ratio)*(ingredient?.advance??.5);return y;
  });
  return {positions,height:positions.at(-1)+Number(images.at(-1).dataset.ratio)};
}
export function layoutAssembled(container){
  const images=[...container.querySelectorAll('.food-layer')];if(!images.length)return;
  const width=container.clientWidth,height=container.clientHeight;if(!width||!height)return;
  const geometry=assembledGeometry(images);const unit=Math.min(width*.95,height*.92/geometry.height);
  const start=(height-unit*geometry.height)/2;
  images.forEach((image,i)=>{image.style.width=`${unit}px`;image.style.left=`${(width-unit)/2}px`;image.style.top=`${start+geometry.positions[i]*unit}px`;});
}
