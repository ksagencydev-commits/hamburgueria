import {INGREDIENTS,createLayers,assembledGeometry} from './ingredients.js';
export async function mountExperience(root, manifest){
  const stage=root.querySelector('.layer-stage');const scene=root.querySelector('.layer-scene');
  const images=createLayers(scene,INGREDIENTS.map(item=>item.id),manifest,true);
  await Promise.all(images.map(image=>image.decode()));
  const turns=[-7,5,-9,8,-5,9,-12,6,3];
  const shifts=[-.035,.035,-.065,.06,-.04,.055,-.06,.025,.015];
  const splashes=Array.from({length:6},(_,i)=>{const drop=document.createElement('span');drop.className=`cheddar-splash cheddar-splash-${i}`;drop.setAttribute('aria-hidden','true');scene.append(drop);return drop;});
  const {gsap,ScrollTrigger}=window;
  if(!gsap||!ScrollTrigger)throw new Error('GSAP/ScrollTrigger não carregados.');
  gsap.registerPlugin(ScrollTrigger);
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const mobile=matchMedia('(max-width: 900px), (hover: none) and (pointer: coarse)');
  const story=stage.querySelector('.layer-story>p');const originalStory=story.innerHTML;
  function renderStatic(){
    images.forEach((image,i)=>gsap.set(image,{y:mobile.matches?metrics[i].closedY:metrics[i].openY,scale:mobile.matches?metrics[i].closedScale:metrics[i].openScale,x:mobile.matches?0:metrics[i].openX,rotation:mobile.matches?0:metrics[i].turn,transformOrigin:'50% 0%'}));
  }
  let metrics,context,timeline,resizeFrame,active=-1;
  const staticGeometry=assembledGeometry(images);
  const labels={number:stage.querySelector('[data-layer-number]'),name:stage.querySelector('[data-layer-name]'),detail:stage.querySelector('[data-layer-detail]'),bar:stage.querySelector('.layer-meter-fill')};
  function measure(){
    const width=scene.clientWidth,height=scene.clientHeight;
    let cursor=0;
    const positions=images.map((image,i)=>{const y=cursor;cursor+=Number(image.dataset.ratio)*.54+Math.abs(Math.sin(turns[i]*Math.PI/180))*.22;return y;});
    const tops=positions.map((y,i)=>y-Math.abs(Math.sin(turns[i]*Math.PI/180))*.5);
    const bottoms=positions.map((y,i)=>y+Number(images[i].dataset.ratio)*Math.cos(turns[i]*Math.PI/180)+Math.abs(Math.sin(turns[i]*Math.PI/180))*.5);
    const min=Math.min(...tops),max=Math.max(...bottoms),extent=max-min;
    const openWidth=Math.min(width*.84,(height-38)/extent);
    const openTop=(height-extent*openWidth)/2-min*openWidth;
    const closedWidth=Math.min(width*.97,(height-20)/staticGeometry.height);
    const closedTop=(height-staticGeometry.height*closedWidth)/2;
    metrics=images.map((image,i)=>({closedY:closedTop+staticGeometry.positions[i]*closedWidth,closedScale:closedWidth/width,
      openY:openTop+positions[i]*openWidth,openX:shifts[i]*width,openScale:openWidth/width,turn:turns[i]}));
  }
  function label(progress){
    root.dataset.progress=progress.toFixed(4);labels.bar.style.transform=`scaleX(${progress})`;
    const index=Math.min(8,Math.floor(progress*9));if(index===active)return;active=index;
    labels.number.textContent=String(index+1).padStart(2,'0');labels.name.textContent=INGREDIENTS[index].name;labels.detail.textContent=INGREDIENTS[index].detail;
  }
  function initialize(){
    context?.revert();timeline=null;active=-1;stage.classList.remove('cinema-on');
    root.dataset.layout=mobile.matches?'mobile':'desktop';
    story.innerHTML=mobile.matches?'Da brasa ao pão artesanal.<br>Nove ingredientes, um sabor extraordinário.':originalStory;
    measure();label(0);
    context=gsap.context(()=>{
      if(motion.matches||mobile.matches){
        gsap.set(splashes,{autoAlpha:0});renderStatic();
        root.dataset.motion='static';return;
      }
      ScrollTrigger.addEventListener('refreshInit',measure);
      timeline=gsap.timeline({scrollTrigger:{id:'flame-explosion',trigger:root,pin:stage,start:'top top',end:()=>`+=${Math.round(innerHeight*3)}`,scrub:matchMedia('(min-width: 901px) and (pointer: fine)').matches?.65:.35,anticipatePin:1,invalidateOnRefresh:true,onUpdate:()=>label(timeline?.progress()||0),onToggle:self=>stage.classList.toggle('cinema-on',self.isActive),onLeave:()=>stage.classList.remove('cinema-on'),onLeaveBack:()=>stage.classList.remove('cinema-on')}});
      images.forEach((image,i)=>{
        const offset=i*.006;
        timeline.fromTo(image,{x:0,y:()=>metrics[i].closedY,scale:()=>metrics[i].closedScale,rotation:0,transformOrigin:'50% 0%'},{x:()=>metrics[i].openX,y:()=>metrics[i].openY,scale:()=>metrics[i].openScale,rotation:()=>metrics[i].turn,duration:.75-offset,ease:'power1.inOut',immediateRender:true},offset);
      });
      splashes.forEach((drop,i)=>{
        const side=i%2?-1:1;
        timeline.fromTo(drop,{x:0,y:()=>metrics[5].closedY,scale:.2,rotation:0,autoAlpha:0},
          {x:()=>side*scene.clientWidth*metrics[5].openScale*(.55+(i%3)*.08),y:()=>metrics[5].openY+[-30,35,85,-75,120,50][i],scale:1,rotation:side*(25+i*13),autoAlpha:.95,duration:.48,ease:'power2.out'},.16+i*.025);
      });
      timeline.eventCallback('onUpdate',()=>label(timeline.progress()));
      timeline.to({}, {duration:.25}, .75);root.dataset.motion='scroll';
      return ()=>ScrollTrigger.removeEventListener('refreshInit',measure);
    },stage);
    ScrollTrigger.refresh();root.dataset.ready='true';
  }
  const refresh=()=>{clearTimeout(resizeFrame);resizeFrame=setTimeout(()=>{if(timeline){timeline.invalidate();ScrollTrigger.refresh();}else{measure();renderStatic();}},150);};
  motion.addEventListener('change',initialize);mobile.addEventListener('change',initialize);window.addEventListener('resize',refresh);
  initialize();
  return {dispose(){clearTimeout(resizeFrame);window.removeEventListener('resize',refresh);motion.removeEventListener('change',initialize);mobile.removeEventListener('change',initialize);context?.revert();splashes.forEach(drop=>drop.remove());stage.classList.remove('cinema-on');},restore:initialize};
}
