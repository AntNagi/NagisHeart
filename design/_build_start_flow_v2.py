from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

ROOT = Path(r"D:/Nagi's Heart/NagisHeart")
OUT = ROOT / "handoff/yiyi_start_flow_redesign_20260711_v5_dark_contrast"
BG = ROOT / "assets/bg"
W, H = 1080, 1920
SERIF = r"C:/Windows/Fonts/georgia.ttf"
SERIF_ITALIC = r"C:/Windows/Fonts/georgiai.ttf"
CN_SERIF = r"C:/Windows/Fonts/NotoSerifSC-VF.ttf"
CN_SANS = r"C:/Windows/Fonts/NotoSansSC-VF.ttf"

WHITE = (242, 246, 249)
SILVER = (202, 212, 224)
GOLD = (210, 184, 130)
GOLD_D = (150, 119, 78)
NAVY = (13, 22, 35)
INK = (20, 29, 42)


def f(path, size):
    return ImageFont.truetype(path, size)


def cover(path, size=(W, H), pos=(0.5, 0.5)):
    im = Image.open(path).convert("RGB")
    iw, ih = im.size
    scale = max(size[0] / iw, size[1] / ih)
    nw, nh = round(iw * scale), round(ih * scale)
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    x = round((nw - size[0]) * pos[0])
    y = round((nh - size[1]) * pos[1])
    return im.crop((x, y, x + size[0], y + size[1]))


def overlay(base, color, alpha):
    layer = Image.new("RGBA", base.size, (*color, alpha))
    return Image.alpha_composite(base.convert("RGBA"), layer)


def vertical_shade(base, top=55, mid=10, bottom=205):
    shade = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(shade)
    for y in range(H):
        t = y / (H - 1)
        if t < 0.42:
            a = int(top + (mid - top) * (t / 0.42))
        else:
            a = int(mid + (bottom - mid) * ((t - 0.42) / 0.58) ** 1.65)
        d.line((0, y, W, y), fill=(9, 17, 29, max(0, min(255, a))))
    return Image.alpha_composite(base.convert("RGBA"), shade)


def text_center(draw, xy, text, font, fill, anchor="mm", stroke=0, stroke_fill=(0, 0, 0, 0)):
    draw.text(xy, text, font=font, fill=fill, anchor=anchor, stroke_width=stroke, stroke_fill=stroke_fill)


def diamond(draw, x, y, r, fill):
    draw.polygon([(x, y-r), (x+r, y), (x, y+r), (x-r, y)], fill=fill)


def line_label(draw, y, text, width=420):
    x1, x2 = (W-width)//2, (W+width)//2
    draw.line((x1, y, W//2-84, y), fill=(*GOLD, 145), width=2)
    draw.line((W//2+84, y, x2, y), fill=(*GOLD, 145), width=2)
    diamond(draw, W//2, y, 6, (*GOLD, 210))
    text_center(draw, (W//2, y-2), text, f(CN_SANS, 26), (*SILVER, 220))


def title_art(draw, y=230):
    # Baked raster wordmark: separate hierarchy, ornamental rule and a small crown.
    text_center(draw, (W//2, y), "BLUE LOCK", f(SERIF, 28), (*SILVER, 220))
    draw.line((W//2-170, y+40, W//2-35, y+40), fill=(*GOLD, 170), width=2)
    draw.line((W//2+35, y+40, W//2+170, y+40), fill=(*GOLD, 170), width=2)
    diamond(draw, W//2, y+40, 7, (*GOLD, 220))
    text_center(draw, (W//2, y+154), "Nagi's", f(SERIF_ITALIC, 93), (*WHITE, 245), stroke=1, stroke_fill=(30, 38, 50, 170))
    text_center(draw, (W//2, y+282), "Heart", f(SERIF_ITALIC, 178), (*GOLD, 245), stroke=1, stroke_fill=(35, 28, 26, 180))
    # Heart monogram and sweep underline deliberately form part of the graphic.
    draw.arc((W//2-235, y+324, W//2+235, y+378), 198, 342, fill=(*GOLD, 210), width=3)
    diamond(draw, W//2+236, y+346, 8, (*GOLD, 225))
    text_center(draw, (W//2, y+384), "A BLUE LOCK STORY", f(CN_SANS, 19), (*SILVER, 205))


def action_text(draw, top, label="S  T  A  R  T", caption="Tap to start"):
    # This system uses typography as the control itself. No button container.
    font = f(CN_SERIF if any(ord(c) > 127 for c in label) else SERIF, 42 if any(ord(c) > 127 for c in label) else 48)
    text_center(draw, (W//2, top), label, font, (*WHITE, 252), stroke=1, stroke_fill=(24, 31, 44, 165))
    width = min(360, max(180, len(label) * 34))
    y = top + 48
    draw.line((W//2-width, y, W//2-28, y), fill=(*GOLD, 180), width=2)
    draw.line((W//2+28, y, W//2+width, y), fill=(*GOLD, 180), width=2)
    diamond(draw, W//2, y, 6, (*GOLD, 230))
    if caption:
        caption_font = f(CN_SANS, 24) if any(ord(c) > 127 for c in caption) else f(SERIF_ITALIC, 24)
        text_center(draw, (W//2, top+104), caption, caption_font, (*SILVER, 195))


def create_start():
    im = cover(BG / "pillow.jpg", pos=(0.5, 0.46))
    im = ImageEnhance.Contrast(im).enhance(1.08)
    im = ImageEnhance.Color(im).enhance(0.80)
    im = vertical_shade(im, top=145, mid=68, bottom=230)
    d = ImageDraw.Draw(im)
    # restrained diagonal streaks keep the poster cinematic without a UI box.
    d.line((-140, 1170, 460, 1920), fill=(*GOLD, 58), width=2)
    d.line((645, 0, 1080, 460), fill=(*SILVER, 38), width=2)
    title_art(d, 190)
    action_text(d, 1670)
    return im.convert("RGB")


def create_opening():
    # Prologue is a sentence-by-sentence VN state, not a poster with a paragraph.
    im = cover(BG / "remeet.jpg", pos=(0.5, 0.44))
    im = ImageEnhance.Color(im).enhance(0.60)
    im = vertical_shade(im, top=180, mid=118, bottom=238)
    d = ImageDraw.Draw(im)
    line_label(d, 235, "开场白 · 01 / 08", 410)
    text_center(d, (W//2, 990), "「好麻烦。」", f(CN_SERIF, 54), (*WHITE, 248))
    d.line((W//2-126, 1070, W//2+126, 1070), fill=(*GOLD, 150), width=1)
    text_center(d, (W//2, 1168), "Nagi", f(SERIF_ITALIC, 26), (*GOLD, 220))
    text_center(d, (W//2, 1640), "轻触继续", f(CN_SANS, 26), (*SILVER, 220))
    diamond(d, W//2, 1698, 5, (*GOLD, 210))
    return im.convert("RGB")


def create_name_input():
    im = cover(BG / "remeet.jpg", pos=(0.5, 0.44)).filter(ImageFilter.GaussianBlur(9))
    im = ImageEnhance.Color(im).enhance(0.50)
    im = vertical_shade(im, top=190, mid=132, bottom=235)
    d = ImageDraw.Draw(im)
    line_label(d, 510, "开始之前", 360)
    text_center(d, (W//2, 630), "写下你的名字", f(CN_SERIF, 67), (*WHITE, 246))
    text_center(d, (W//2, 704), "故事会从这里开始。", f(CN_SERIF, 30), (*SILVER, 210))
    y = 930
    text_center(d, (W//2, y), "你的名字", f(CN_SANS, 25), (*SILVER, 225))
    text_center(d, (W//2, y+48), "在故事里的称呼", f(CN_SANS, 27), (180, 191, 203, 180))
    d.line((W//2-150, y+88, W//2+150, y+88), fill=(*SILVER, 150), width=1)
    diamond(d, W//2, y+88, 4, (*GOLD, 205))
    action_text(d, 1460, label="进入故事", caption="轻触确认")
    return im.convert("RGB")


def create_chapter_start():
    im = cover(BG / "pillow.jpg", pos=(0.5, 0.43))
    im = ImageEnhance.Color(im).enhance(0.58)
    im = vertical_shade(im, top=165, mid=88, bottom=232)
    d = ImageDraw.Draw(im)
    line_label(d, 1070, "第一部 · 原作前置篇", 470)
    text_center(d, (W//2, 1200), "他还没看见你", f(CN_SERIF, 66), (*WHITE, 248))
    text_center(d, (W//2, 1290), "你已经看见了他", f(CN_SERIF, 44), (*GOLD, 235))
    d.line((250, 1415, 830, 1415), fill=(*GOLD, 130), width=1)
    text_center(d, (W//2, 1530), "轻触继续", f(CN_SANS, 25), (*SILVER, 210))
    diamond(d, W//2, 1588, 5, (*GOLD, 210))
    return im.convert("RGB")


def create_section_clear():
    im = cover(BG / "hug.jpg", pos=(0.5, 0.48)).filter(ImageFilter.GaussianBlur(8))
    im = ImageEnhance.Color(im).enhance(0.46)
    im = vertical_shade(im, top=185, mid=125, bottom=228)
    d = ImageDraw.Draw(im)
    line_label(d, 735, "本幕完成", 330)
    diamond(d, W//2, 865, 16, (*GOLD, 220))
    text_center(d, (W//2, 987), "第一部・作战室・初遇", f(CN_SERIF, 55), (*WHITE, 247))
    text_center(d, (W//2, 1072), "本幕已记录", f(CN_SERIF, 31), (*SILVER, 220))
    action_text(d, 1345, label="前往下一幕", caption="轻触继续")
    return im.convert("RGB")


def contact_sheet(files):
    tile_w, tile_h = 270, 480
    out = Image.new("RGB", (tile_w * len(files), tile_h + 74), NAVY)
    d = ImageDraw.Draw(out)
    for i, path in enumerate(files):
        im = Image.open(path).convert("RGB").resize((tile_w, tile_h), Image.Resampling.LANCZOS)
        out.paste(im, (i * tile_w, 0))
        d.text((i * tile_w + 13, tile_h + 20), path.stem, font=f(CN_SANS, 16), fill=WHITE)
    out.save(OUT / "start_flow_v2_contact_sheet.jpg", quality=94)


def main():
    (OUT / "start_pages").mkdir(parents=True, exist_ok=True)
    (OUT / "flow_pages").mkdir(parents=True, exist_ok=True)
    outputs = [
        (OUT / "start_pages/start_poster_v2_pillow.png", create_start()),
        (OUT / "flow_pages/prologue_opening_v2.png", create_opening()),
        (OUT / "flow_pages/name_input_v2.png", create_name_input()),
        (OUT / "flow_pages/chapter_start_v2.png", create_chapter_start()),
        (OUT / "flow_pages/section_clear_v2.png", create_section_clear()),
    ]
    for path, image in outputs:
        image.save(path, optimize=True)
    contact_sheet([p for p, _ in outputs])


if __name__ == "__main__":
    main()
