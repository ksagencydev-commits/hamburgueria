// Desktop-only smoothing. Lenis shares GSAP's ticker; touch stays native.
export function mountSmoothScroll(){
  const desktop=matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine)');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let controller,tick,observer,generation=0,disposed=false;
  function destroy(){
    if(tick)window.gsap.ticker.remove(tick);
    observer?.disconnect();controller?.destroy();controller=undefined;tick=undefined;observer=undefined;
    document.documentElement.dataset.smoothScroll='native';
  }
  async function sync(){
    const current=++generation;destroy();
    if(disposed||!desktop.matches||reduced.matches)return;
    const {default:Lenis}=await import('../vendor/lenis.mjs');
    if(disposed||current!==generation||!desktop.matches||reduced.matches)return;
    controller=new Lenis({autoRaf:false,lerp:.085,smoothWheel:true,wheelMultiplier:.9,syncTouch:false,anchors:{duration:1.1,easing:t=>1-Math.pow(1-t,4)},prevent:node=>Boolean(node.closest('dialog'))});
    controller.on('scroll',window.ScrollTrigger.update);
    tick=time=>controller?.raf(time*1000);
    window.gsap.ticker.lagSmoothing(0);window.gsap.ticker.add(tick);
    observer=new MutationObserver(()=>{if(document.querySelector('dialog[open]'))controller?.stop();else controller?.start();});
    observer.observe(document.body,{attributes:true,attributeFilter:['class']});
    document.documentElement.dataset.smoothScroll='lenis';
  }
  desktop.addEventListener('change',sync);reduced.addEventListener('change',sync);sync();
  return ()=>{disposed=true;++generation;desktop.removeEventListener('change',sync);reduced.removeEventListener('change',sync);destroy();};
}
