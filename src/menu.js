import {RECIPES,createLayers,layoutAssembled} from './ingredients.js';
export function mountMenu(root, products, manifest){
  const gallery=root.querySelector('.burger-gallery');const stacks=[];const cards=[];
  products.forEach((product,index)=>{
    const card=document.createElement('article');card.className='menu-entry';card.dataset.category=product.category;card.dataset.product=product.id;
    const photo=document.createElement('div');photo.className='menu-product-photo';
    const number=document.createElement('span');number.className='menu-product-number';number.textContent=String(index+1).padStart(2,'0');photo.append(number);
    if(product.id==='chicken'){
      const image=new Image(800,800);image.src=product.image||'public/images/chicken.webp';image.alt='Chicken Crunch com frango crocante, alface, queijo e molho';image.loading='lazy';image.decoding='async';photo.append(image);
    }else{
      const stack=document.createElement('div');stack.className='menu-product-stack';stack.setAttribute('role','img');stack.setAttribute('aria-label',product.name+', composição ilustrativa');createLayers(stack,RECIPES[product.id]||RECIPES.classic,manifest);photo.append(stack);stacks.push(stack);
    }
    const tag=document.createElement('p');tag.className='menu-product-tag';tag.textContent=product.tag;
    const name=document.createElement('h3');name.textContent=product.name;
    const description=document.createElement('p');description.className='menu-product-description';description.textContent=product.description;
    const action=document.createElement('div');action.className='menu-product-action';
    const value=document.createElement('span');value.textContent='Consultar valor';
    const order=document.createElement('button');order.className='circle-arrow';order.dataset.order=product.id;order.setAttribute('aria-label','Pedir '+product.name);order.innerHTML='<svg aria-hidden="true"><use href="#arrow"/></svg>';
    action.append(value,order);card.append(photo,tag,name,description,action);gallery.append(card);cards.push(card);
  });
  const controls=[...root.querySelectorAll('[data-gallery-direction]')];
  function layout(){stacks.forEach(layoutAssembled);updateControls();}
  function updateControls(){controls.forEach(button=>button.disabled=button.dataset.galleryDirection==='previous'?gallery.scrollLeft<=1:gallery.scrollLeft>=gallery.scrollWidth-gallery.clientWidth-2);}
  const observer=new ResizeObserver(layout);observer.observe(gallery);
  gallery.addEventListener('scroll',updateControls,{passive:true});
  controls.forEach(button=>button.addEventListener('click',()=>{
    const first=cards.find(card=>!card.hidden);if(!first)return;
    const step=first.getBoundingClientRect().width+parseFloat(getComputedStyle(gallery).columnGap);
    gallery.scrollBy({left:button.dataset.galleryDirection==='previous'?-step:step,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  }));
  root.querySelectorAll('[data-menu-filter]').forEach(button=>button.addEventListener('click',()=>{
    root.querySelectorAll('[data-menu-filter]').forEach(filter=>filter.setAttribute('aria-pressed',String(filter===button)));
    cards.forEach(card=>card.hidden=button.dataset.menuFilter!=='all'&&card.dataset.category!==button.dataset.menuFilter);
    gallery.scrollLeft=0;layout();root.querySelector('.menu-live-status').textContent=`${cards.filter(card=>!card.hidden).length} opções no cardápio.`;
  }));
  layout();return ()=>observer.disconnect();
}
