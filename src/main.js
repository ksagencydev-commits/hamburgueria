import {mountSmoothScroll} from './smooth-scroll.js';
import {mountExperience} from './experience.js';
import {mountMenu} from './menu.js';
import {mountInteractions} from './interactions.js';
import {createLayers,layoutAssembled,RECIPES} from './ingredients.js';
const config=window.FLAME_CONFIG;
mountInteractions(config);
try{
  const response=await fetch('public/images/v4/manifest.json');if(!response.ok)throw new Error('Manifest de ingredientes não encontrado.');
  const manifest=await response.json();
  const menuCleanup=mountMenu(document.querySelector('.menu-chapter'),config.products,manifest);
  const closing=document.querySelector('.closing-product');createLayers(closing,RECIPES.classic,manifest);layoutAssembled(closing);
  const closingObserver=new ResizeObserver(()=>layoutAssembled(closing));closingObserver.observe(closing);
  await document.fonts.ready;
  const experience=await mountExperience(document.querySelector('.layer-chapter'),manifest);
  await document.querySelector('.opening-product img').decode();
  const smoothCleanup=mountSmoothScroll();
  window.addEventListener('pagehide',event=>{if(!event.persisted){smoothCleanup();experience.dispose();menuCleanup();closingObserver.disconnect();}});
  window.addEventListener('pageshow',event=>{if(event.persisted)window.ScrollTrigger.refresh()});
  document.documentElement.dataset.ready='complete';
}catch(error){
  document.documentElement.dataset.ready='error';console.error(error);
  const status=document.createElement('p');status.className='asset-error';status.setAttribute('role','status');status.textContent='Não foi possível carregar a experiência. Tente recarregar a página.';document.querySelector('.layer-stage').prepend(status);
}
