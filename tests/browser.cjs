const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'qa-v3');
let URL = process.env.TEST_URL;
let server;
const http=require('node:http');
const {URL:ParsedURL}=require('node:url');
const SERVE_ROOT=process.env.TEST_DIST==='1'?path.join(ROOT,'dist'):ROOT;
fs.mkdirSync(OUT, { recursive: true });
const widths = process.env.TEST_WIDTHS?process.env.TEST_WIDTHS.split(',').map(Number):[375,390,430,768,1024,1280,1440];
async function settle(page) { await page.waitForTimeout(850); }
async function sceneState(page) {
  return page.evaluate(() => {
    const trigger = ScrollTrigger.getById('flame-explosion');
    const stage = document.querySelector('.layer-stage');
    return {
      progress: trigger?.progress || 0,
      stage: stage.getBoundingClientRect().toJSON(),
      cursor: getComputedStyle(document.querySelector('.layer-scene')).cursor,
      interactiveCursor: getComputedStyle(stage.querySelector('a')).cursor,
      layers: [...document.querySelectorAll('.layer-scene img')].map(image => ({
        id: image.dataset.ingredient,
        x: Number(gsap.getProperty(image, 'x')),
        y: Number(gsap.getProperty(image, 'y')),
        scale: Number(gsap.getProperty(image, 'scale')),
        rotation: Number(gsap.getProperty(image, 'rotation')),
        rect: image.getBoundingClientRect().toJSON()
      }))
    };
  });
}
(async () => {
  if(!URL){
    const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.ttf':'font/ttf'};
    server=http.createServer((request,response)=>{
      const pathname=decodeURIComponent(new ParsedURL(request.url,'http://localhost').pathname);
      const file=path.resolve(SERVE_ROOT,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname));
      if(!file.startsWith(SERVE_ROOT+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){response.writeHead(404);response.end();return;}
      response.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(response);
    });
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));URL=`http://127.0.0.1:${server.address().port}/`;
  }
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
  const report = { date: '2026-10-15', url: URL, environment: 'Chrome headless', build: process.env.TEST_DIST==='1'?'dist':'source', viewports: [], checks: {} };
  for (const width of widths) {
    const height = width <= 430 ? 844 : 960;
    const page = await browser.newPage({ viewport: { width, height }, hasTouch: width <= 430, isMobile: width <= 430 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(URL);
    await page.waitForFunction(() => document.documentElement.dataset.ready === 'complete');
    await page.waitForFunction(()=>innerWidth<=900?document.documentElement.dataset.smoothScroll==='native':document.documentElement.dataset.smoothScroll==='lenis');
    await page.evaluate(() => Promise.all([...document.images].map(image => { image.loading = 'eager'; return image.decode(); })));
    const overview = await page.evaluate(() => ({ viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth, triggers: ScrollTrigger.getAll().length, h1: document.querySelectorAll('h1').length, products: document.querySelectorAll('.menu-entry').length, images: [...document.images].every(image => image.complete && image.naturalWidth > 0) }));
    assert(overview.scrollWidth <= width, `Overflow at ${width}: ${overview.scrollWidth}`);
    assert.equal(overview.triggers, width<=900?0:1); assert.equal(overview.h1, 1); assert.equal(overview.products, 4); assert(overview.images);
    await page.screenshot({ path: path.join(OUT, `hero-${width}.png`) });
    const range = await page.evaluate(() => { const t = ScrollTrigger.getById('flame-explosion'); return t?{ start: t.start, end: t.end, pin: !!t.pin, scrub: t.vars.scrub }:null; });
    if(range)assert(range.pin && range.scrub > 0);
    if(width===1440){
      await page.mouse.move(800,400);await page.mouse.wheel(0,640);await page.waitForTimeout(110);
      const middle=await page.evaluate(()=>scrollY);await page.waitForTimeout(1100);const end=await page.evaluate(()=>scrollY);
      assert(middle>0&&middle<end-5,`Wheel must interpolate: ${middle} -> ${end}`);
      await page.mouse.wheel(0,-320);await page.waitForTimeout(1200);const reverse=await page.evaluate(()=>scrollY);assert(reverse<end-50);
      report.checks.smoothDesktopWheel={middle,end,reverse};
      await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(150);
      await page.locator('.opening-links .layer-link').click();await page.waitForTimeout(1500);
      const padding=await page.evaluate(()=>parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0);
      assert(Math.abs(await page.evaluate(()=>scrollY)-(range.start-padding))<3,`Smooth anchor: actual ${await page.evaluate(()=>scrollY)}, expected ${range.start-padding}`);
      report.checks.smoothAnchor=true;
      const dimensions=await page.locator('.opening-links .pill').boundingBox();assert(dimensions.height>=56);report.checks.largerDesktopButtonHeight=dimensions.height;
    }
    const states = [];
    if(range){
    for (const progress of [0, .25, .5, .75, 1]) {
      await page.evaluate(y => { document.documentElement.style.scrollBehavior = 'auto'; scrollTo(0, y); }, range.start + (range.end - range.start) * progress);
      await settle(page);
      const state = await sceneState(page); states.push(state);
      assert(Math.abs(state.progress - progress) < .002, `Progress ${width} ${progress}`);
      assert(Math.abs(state.stage.top) < 2, `Pin ${width} ${progress}: ${state.stage.top}`);
      assert.equal(state.layers.length, 9); assert.equal(new Set(state.layers.map(layer => layer.id)).size, 9);
      if (progress > 0 && progress < 1) {
        assert.equal(state.cursor, width <= 430 ? 'auto' : 'none');
        if (width > 600) assert.equal(state.interactiveCursor, 'pointer');
      }
      await page.screenshot({ path: path.join(OUT, `scroll-${width}-${progress * 100}.png`) });
    }
    states[0].layers.forEach((initial, i) => assert(Math.abs(initial.y - states[3].layers[i].y) > 1 || Math.abs(initial.scale - states[3].layers[i].scale) > .01, `Layer did not move: ${width} ${initial.id}`));
    assert(states[3].layers[0].scale>=states[0].layers[0].scale*.68,`Open burger too small at ${width}`);
    assert(states[3].layers.some(l=>Math.abs(l.rotation)>=10),'Expressive tilt missing');
    assert(states[3].layers.some(l=>Math.abs(l.x)>10),'Asymmetric offsets missing');
    const scene=await page.locator('.layer-scene').boundingBox();
    states[3].layers.forEach(l=>assert(l.rect.top>=scene.y-2&&l.rect.bottom<=scene.y+scene.height+2,`Layer clipped: ${width} ${l.id}`));
    assert.equal(await page.locator('.cheddar-splash:visible').count(),6);
    for (let i = 3; i >= 0; i--) {
      const progress = i / 4;
      await page.evaluate(y => scrollTo(0, y), range.start + (range.end - range.start) * progress);
      await settle(page);
      const reverse = await sceneState(page);
      reverse.layers.forEach((layer, j) => {assert(Math.abs(layer.y - states[i].layers[j].y) < 1.5, `Reverse motion ${width} ${i} ${j}`);assert(Math.abs(layer.x-states[i].layers[j].x)<1.5,`Reverse lateral motion ${width} ${i} ${j}`);});
    }
    await page.evaluate(y => scrollTo(0, y), range.end + 30); await settle(page);
    assert.equal(await page.locator('.layer-stage').evaluate(stage => stage.classList.contains('cinema-on')), false);
    assert.notEqual(await page.locator('.layer-scene').evaluate(scene => getComputedStyle(scene).cursor), 'none');
    }else{
      assert.equal(await page.locator('.pin-spacer').count(),0);
      await page.locator('.layer-chapter').scrollIntoViewIfNeeded();await settle(page);
      const before=await sceneState(page);assert.equal(before.layers.length,9);
      assert(before.stage.height<800);
      await page.screenshot({path:path.join(OUT,`static-mobile-${width}.png`)});
      await page.evaluate(()=>scrollBy(0,180));await settle(page);
      const after=await sceneState(page);
      assert.deepEqual(after.layers.map(l=>[l.y,l.scale,l.rotation]),before.layers.map(l=>[l.y,l.scale,l.rotation]));
      assert.equal(await page.locator('.layer-chapter').getAttribute('data-motion'),'static');
      assert((await page.locator('.opening-links .pill').first().boundingBox()).height>=52);
    }
    for (const id of ['cardapio', 'essencia', 'ritual', 'contato']) {
      await page.locator(`#${id}`).evaluate(el => scrollTo(0, scrollY + el.getBoundingClientRect().top)); await page.waitForTimeout(120);
      await page.screenshot({ path: path.join(OUT, `${id}-${width}.png`) });
    }
    await page.locator('[data-menu-filter="chicken"]').click(); assert.equal(await page.locator('.menu-entry:visible').count(), 1);
    await page.locator('[data-order="chicken"]').click(); assert(await page.locator('#order-dialog').isVisible());
    assert.match(await page.locator('[data-order-selection]').innerText(), /CHICKEN CRUNCH/);
    await page.keyboard.press('Escape'); assert(!(await page.locator('#order-dialog').isVisible()));
    await page.locator('[data-menu-filter="beef"]').click(); assert.equal(await page.locator('.menu-entry:visible').count(), 3);
    await page.locator('[data-menu-filter="all"]').click(); assert.equal(await page.locator('.menu-entry:visible').count(), 4);
    assert.equal(await page.evaluate(() => ScrollTrigger.getAll().length), width<=900?0:1);
    assert(await page.locator('[data-gallery-direction="previous"]').isDisabled());
    await page.locator('[data-gallery-direction="next"]').click(); await page.waitForTimeout(500);
    assert(await page.locator('.burger-gallery').evaluate(el => el.scrollLeft > 0));
    if (width <= 900) {
      await page.evaluate(() => scrollTo(0, 0)); await page.locator('.menu-switch').click();
      assert(await page.locator('#navigation-dialog').isVisible());
      await page.screenshot({ path: path.join(OUT, `navigation-${width}.png`) });
      await page.keyboard.press('Tab'); assert(await page.evaluate(() => document.querySelector('#navigation-dialog').contains(document.activeElement)));
      await page.keyboard.press('Escape'); await page.waitForFunction(()=>document.querySelector('.menu-switch').getAttribute('aria-expanded')==='false'); assert(!(await page.locator('#navigation-dialog').isVisible()));
    }
    assert.equal(errors.length, 0, errors.join('\n'));
    report.viewports.push({ width, height, overview, range, states, errors });
    console.log(`PASS ${width}px: ${range?'desktop animation':'static mobile'}, responsive layout, menu, gallery and orders.`);
    await page.close();
  }
  const resize = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  await resize.goto(URL); await resize.waitForFunction(() => document.documentElement.dataset.ready === 'complete');
  for (const width of [390, 768, 1024, 1440]) {
    await resize.setViewportSize({ width, height: 960 }); await resize.waitForTimeout(650);
    const t = await resize.evaluate(() => { const t = ScrollTrigger.getById('flame-explosion'); return { start: t?.start, end: t?.end, count: ScrollTrigger.getAll().length }; });
    assert.equal(t.count, width<=900?0:1);
    if(width<=900){assert.equal(await resize.locator('.pin-spacer').count(),0);continue;}
    assert(t.start > 0);
    await resize.evaluate(y => { document.documentElement.style.scrollBehavior = 'auto'; scrollTo(0, y); }, t.start + (t.end - t.start) * .5); await settle(resize);
    assert(Math.abs((await sceneState(resize)).progress - .5) < .002, `Resize ${width}`);
    assert(await resize.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  }
  await resize.reload(); await resize.waitForFunction(() => document.documentElement.dataset.ready === 'complete');
  assert.equal(await resize.evaluate(() => ScrollTrigger.getAll().length), 1); await resize.close();
  report.checks.resizeAndReload = true;
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 960 }, reducedMotion: 'reduce', hasTouch: width === 390 });
    await page.goto(URL); await page.waitForFunction(() => document.documentElement.dataset.ready === 'complete');
    assert.equal(await page.evaluate(() => ScrollTrigger.getAll().length), 0); assert.equal(await page.locator('.layer-chapter').getAttribute('data-motion'), 'static');
    await page.locator('.layer-chapter').evaluate(el => scrollTo(0, scrollY + el.getBoundingClientRect().top));
    await page.screenshot({ path: path.join(OUT, `reduced-motion-${width}.png`) });
    assert.notEqual(await page.locator('.layer-scene').evaluate(el => getComputedStyle(el).cursor), 'none'); await page.close();
  }
  report.checks.reducedMotion = true;
  const hash = require('node:crypto');
  const originals = JSON.parse(fs.readFileSync(path.join(ROOT, 'checkpoints/original-assets-sha256.json'), 'utf8'));
  for (const [file, expected] of Object.entries(originals)) assert.equal(hash.createHash('sha256').update(fs.readFileSync(path.join(ROOT, file))).digest('hex'), expected, `Original modified: ${file}`);
  report.checks.originalAssetsPreserved = Object.keys(originals).length;
  fs.writeFileSync(path.join(OUT, 'browser-report.json'), JSON.stringify(report, null, 2));
  await browser.close();
  if(server)await new Promise(resolve=>server.close(resolve));
  console.log(`PASS: ${widths.length} viewports, ${widths.filter(w=>w>900).length*5} forward states, ${widths.filter(w=>w>900).length*4} reverse states, responsive resize/reload, reduced motion and preserved originals.`);
})().catch(error => { console.error(error); process.exit(1); });
