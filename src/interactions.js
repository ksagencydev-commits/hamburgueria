export function mountInteractions(config){
  const navigation=document.querySelector('#navigation-dialog');const order=document.querySelector('#order-dialog');
  const menuButton=document.querySelector('.menu-switch');
  const dialogs=[navigation,order];let lastOrder;
  function syncDialogs(){document.body.classList.toggle('dialog-open',dialogs.some(dialog=>dialog.open));menuButton.setAttribute('aria-expanded',String(navigation.open));}
  function open(dialog){dialog.showModal();syncDialogs();}
  function close(dialog){dialog.close();syncDialogs();}
  menuButton.addEventListener('click',()=>{menuButton.setAttribute('aria-expanded','true');open(navigation);});
  dialogs.forEach(dialog=>{
    dialog.querySelectorAll('[data-dismiss]').forEach(button=>button.addEventListener('click',()=>close(dialog)));
    dialog.addEventListener('cancel',event=>{event.preventDefault();close(dialog);});
    dialog.addEventListener('close',()=>{syncDialogs();if(dialog===navigation){menuButton.setAttribute('aria-expanded','false');menuButton.focus();}else lastOrder?.focus();});
    dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)close(dialog);});
  });
  navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>close(navigation)));
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-order]');if(!button)return;
    const product=config.products.find(item=>item.id===button.dataset.order);
    if(/^\d{10,15}$/.test(config.whatsapp)){
      const message=config.message+(product?` Tenho interesse no ${product.name}.`:'');
      window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer');return;
    }
    lastOrder=button;order.querySelector('[data-order-selection]').textContent=product?`Sua escolha: ${product.name}`:'Escolha sua próxima obsessão.';open(order);
  });
  if(/^https:\/\/(www\.)?instagram\.com\//.test(config.instagram)){
    const link=document.createElement('a');link.href=config.instagram;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Instagram ↗';document.querySelector('.footer-navigation').append(link);
  }
  if(/^https:\/\//.test(config.canonical)&&new URL(config.canonical).origin===location.origin){
    const canonical=document.createElement('link');canonical.rel='canonical';canonical.href=config.canonical;document.head.append(canonical);
    for(const [property,content] of [['og:url',config.canonical],['og:image',new URL('public/images/v3/hero.webp',config.canonical).href]]){const meta=document.createElement('meta');meta.setAttribute('property',property);meta.content=content;document.head.append(meta);}
  }
  let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(innerWidth>900&&navigation.open)close(navigation);},150);});
}
