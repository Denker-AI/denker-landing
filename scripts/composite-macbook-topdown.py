"""Rebuild public/images/hero/denker-macbook-topdown.png.

Warps a desktop screenshot (denker-desktop-screenshot.jpg) onto the lid of the
physical top-down MacBook photo (denker-macbook-physical-tight-opaque.png):
fits the screen trapezoid from pixel brightness, paints a bezel-black underlay
over the old baked screen, then perspective-warps the screenshot behind a
rounded-corner mask with baked-in vertical shading.

Run: python3 scripts/composite-macbook-topdown.py
"""
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

BASE = "public/images/hero/denker-macbook-physical-tight-opaque.png"
SHOT = "public/images/hero/denker-desktop-screenshot.jpg"
OUT = "public/images/hero/denker-macbook-topdown.png"

base = Image.open(BASE).convert("RGBA")
shot = Image.open(SHOT).convert("RGBA")
W, H = base.size
g = np.asarray(base.convert("L")).astype(int)
bright = g > 60

ys, ls, rs = [], [], []
for y in range(60, 740):
    xs = np.where(bright[y])[0]
    if len(xs) > W * 0.5:
        ys.append(y); ls.append(xs.min()); rs.append(xs.max())
ys, ls, rs = map(np.array, (ys, ls, rs))
lfit, rfit = np.polyfit(ys, ls, 1), np.polyfit(ys, rs, 1)
edge = lambda fit, y: fit[0] * y + fit[1]

yo_t, yo_b = 33, 799
outer = [(edge(lfit, yo_t) - 5, yo_t), (edge(rfit, yo_t) + 5, yo_t),
         (edge(rfit, yo_b) + 5, yo_b), (edge(lfit, yo_b) - 5, yo_b)]
y_top, y_bot, in_x, in_t, in_b = 38, 794, 8, 7, 6
quad = [(edge(lfit, y_top) + in_x, y_top + in_t), (edge(rfit, y_top) - in_x, y_top + in_t),
        (edge(rfit, y_bot) - in_x, y_bot - in_b), (edge(lfit, y_bot) + in_x, y_bot - in_b)]

def solve_h(dst, src):
    A, B = [], []
    for (x, y), (u, v) in zip(dst, src):
        A.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); B.append(u)
        A.append([0, 0, 0, x, y, 1, -v * x, -v * y]); B.append(v)
    return np.linalg.solve(np.array(A, float), np.array(B, float)).tolist()

sw, sh = shot.size
coeffs = solve_h(quad, [(0, 0), (sw, 0), (sw, sh), (0, sh)])

sarr = np.zeros((sh, sw), dtype=np.uint8)
for y in range(sh):
    sarr[y, :] = int(30 * (y / sh))
black = Image.new("RGBA", (sw, sh), (0, 0, 0, 255))
shot = Image.alpha_composite(shot, Image.merge("RGBA", (*black.split()[:3], Image.fromarray(sarr, "L"))))

warped = shot.transform((W, H), Image.PERSPECTIVE, coeffs, resample=Image.BICUBIC)
mask_src = Image.new("L", (sw, sh), 0)
ImageDraw.Draw(mask_src).rounded_rectangle([0, 0, sw - 1, sh - 1], radius=42, fill=255)
mask = mask_src.transform((W, H), Image.PERSPECTIVE, coeffs, resample=Image.BICUBIC)

out = base.copy()
under = Image.new("L", (W, H), 0)
ImageDraw.Draw(under).polygon(outer, fill=255)
out.paste(Image.new("RGBA", (W, H), (8, 8, 10, 255)), (0, 0), under.filter(ImageFilter.GaussianBlur(1.2)))
out.paste(warped, (0, 0), mask)
out.save(OUT)
print("saved", OUT)
