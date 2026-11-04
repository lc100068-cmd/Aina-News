import sys, json
from scipy import ndimage as nd
from PIL import Image
import numpy as np
src = sys.argv[1]
W, H = 1920, 1080
im = np.array(Image.open(src).convert('RGB')).astype(float)
h0, w0 = im.shape[:2]
bg = np.array([23, 77, 55], float)
d = np.abs(im - bg).max(2)
alpha = np.clip((d - 8) / 120, 0, 1)
fg = bg + (im - bg) / np.maximum(alpha, 1e-3)[..., None]
fg = np.clip(fg, 0, 255)
mask = d > 18
for (x0, y0, x1, y1) in [(55,40,250,90),(95,255,745,545),(95,560,1035,620),(55,860,220,900),(1585,860,1630,900)]:
    alpha[y0:y1, x0:x1] = 0; mask[y0:y1, x0:x1] = False
lab, n = nd.label(nd.binary_dilation(mask, iterations=3))
objs = nd.find_objects(lab)
moon_id = rice_ids = None
moon = []; rice = []
for i, s in enumerate(objs):
    c = (lab[s] == i + 1).sum()
    if c < 3000: continue
    x0, x1, y0, y1 = s[1].start, s[1].stop, s[0].start, s[0].stop
    if y0 == 0 and x0 > 1300: moon.append(i + 1)
    elif y0 >= 730 and x1 < 1150: rice.append((x0, i + 1))
rice.sort()
sx, sy = W / w0, H / h0
def save(sel, name):
    a = np.where(sel, alpha, 0)
    rgba = np.dstack([fg, a * 255]).astype(np.uint8)
    Image.fromarray(rgba, 'RGBA').resize((W, H), Image.LANCZOS).save(name)
moon_sel = np.isin(lab, moon)
rice_sel = [lab == r for _, r in rice]
save(moon_sel, 'moon.png')
any_rice = np.zeros_like(mask)
meta = {'rice': []}
for k, sel in enumerate(rice_sel):
    save(sel, f'rice{k+1}.png'); any_rice |= sel
    ys, xs = np.where(sel)
    meta['rice'].append({'px': float(np.median(xs[ys > ys.max() - 6]) * sx), 'py': float(ys.max() * sy)})
save(~moon_sel & ~any_rice, 'tower.png')
ys, xs = np.where(moon_sel & (alpha > .5))
meta['moon'] = {'x': float(xs.mean() * sx), 'y': float(ys.mean() * sy)}
json.dump(meta, open('meta.json', 'w'), indent=1)
print(meta)
