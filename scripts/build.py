from pathlib import Path
import shutil
root = Path(__file__).resolve().parent.parent
dist = root / 'dist'
if dist.exists(): shutil.rmtree(dist)
dist.mkdir()
for name in ['index.html', 'src', 'config.js', 'vendor']:
    src = root / name
    if src.is_dir(): shutil.copytree(src, dist / name)
    else: shutil.copy2(src, dist / name)
public = dist / 'public'
public.mkdir()
shutil.copy2(root / 'public/favicon.svg', public / 'favicon.svg')
shutil.copytree(root / 'public/fonts', public / 'fonts')
images = public / 'images'
images.mkdir()
for name in ['grill.webp','grill-hq.webp','grill-hq-768.webp','melt.webp','melt-hq.webp','melt-hq-768.webp','melt-cutout.webp','melt-cutout-768.webp','garden.webp','sauce.webp','chicken.webp']:
    shutil.copy2(root / 'public/images' / name, images / name)
(images / 'v3').mkdir()
shutil.copy2(root / 'public/images/v3/hero.webp', images / 'v3/hero.webp')
shutil.copytree(root / 'public/images/v4', images / 'v4')
print('Build local concluído: dist/. Referência, backup e materiais não utilizados permanecem preservados fora do build.')
