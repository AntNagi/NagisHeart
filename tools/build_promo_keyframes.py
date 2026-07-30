from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
BG = ROOT / "assets" / "bg"
OUT = ROOT / "output" / "promo" / "keyframes"
W, H = 1080, 1920


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(Path("C:/Windows/Fonts") / name), size)


def cover(image: Image.Image, width: int, height: int, focus=(0.5, 0.42)) -> Image.Image:
    image = ImageOps.exif_transpose(image).convert("RGB")
    ratio = max(width / image.width, height / image.height)
    image = image.resize(
        (round(image.width * ratio), round(image.height * ratio)),
        Image.Resampling.LANCZOS,
    )
    left = round((image.width - width) * focus[0])
    top = round((image.height - height) * focus[1])
    left = max(0, min(image.width - width, left))
    top = max(0, min(image.height - height, top))
    return image.crop((left, top, left + width, top + height))


def rounded_panel(image: Image.Image, size: tuple[int, int], radius: int,
                  focus=(0.5, 0.42)) -> Image.Image:
    panel = cover(image, *size, focus=focus).convert("RGBA")
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0], size[1]), radius=radius, fill=255)
    panel.putalpha(mask)
    return panel


def contained_panel(image: Image.Image, size: tuple[int, int], radius: int) -> Image.Image:
    image = ImageOps.exif_transpose(image).convert("RGB")
    background = cover(image, *size, focus=(0.5, 0.5))
    background = background.filter(ImageFilter.GaussianBlur(34))
    background = ImageEnhance.Brightness(background).enhance(0.82).convert("RGBA")

    ratio = min(size[0] / image.width, size[1] / image.height)
    foreground = image.resize(
        (round(image.width * ratio), round(image.height * ratio)),
        Image.Resampling.LANCZOS,
    ).convert("RGBA")
    x = (size[0] - foreground.width) // 2
    y = (size[1] - foreground.height) // 2
    background.alpha_composite(foreground, (x, y))

    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0], size[1]), radius=radius, fill=255)
    background.putalpha(mask)
    return background


def shadow(size: tuple[int, int], radius: int, opacity=78) -> Image.Image:
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    ImageDraw.Draw(layer).rounded_rectangle(
        (34, 38, size[0] - 34, size[1] - 34),
        radius=radius,
        fill=(25, 25, 40, opacity),
    )
    return layer.filter(ImageFilter.GaussianBlur(28))


def build_hero() -> None:
    source = Image.open(OUT / "01_romance_hero_source.png")
    hero = cover(source, W, H, focus=(0.5, 0.5))
    hero = ImageEnhance.Color(hero).enhance(0.96)

    # Keep this clean for motion in the editor. Only a restrained cinematic grade.
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse((-120, -160, 850, 720), fill=(255, 222, 206, 34))
    glow = glow.filter(ImageFilter.GaussianBlur(120))
    hero = Image.alpha_composite(hero.convert("RGBA"), glow)

    shade = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shade)
    for y in range(H):
        a = int(26 * max(0, (y - 1380) / 540))
        sd.line((0, y, W, y), fill=(23, 27, 42, a))
    hero = Image.alpha_composite(hero, shade)
    hero.save(OUT / "01_romance_hero_1080x1920.png")


def build_hero_exact_character() -> None:
    background = cover(
        Image.open(OUT / "01_romance_empty_room_source.png"),
        W,
        H,
        focus=(0.5, 0.5),
    ).convert("RGBA")

    original = ImageOps.exif_transpose(Image.open(BG / "pillow.jpg")).convert("RGBA")
    ratio = W / original.width
    original = original.resize(
        (W, round(original.height * ratio)),
        Image.Resampling.LANCZOS,
    )

    rgb = np.asarray(original.convert("RGB")).astype(np.int32)
    # The source backdrop is a nearly uniform neutral gray. Build transparency only
    # from pixels close to that gray, preserving the original character pixels.
    gray = np.array([184, 183, 188], dtype=np.int32)
    distance = np.sqrt(np.sum((rgb - gray) ** 2, axis=2))
    alpha = np.clip((distance - 12.0) / 34.0 * 255.0, 0, 255).astype(np.uint8)
    alpha_image = Image.fromarray(alpha, mode="L").filter(ImageFilter.GaussianBlur(1.1))
    original.putalpha(alpha_image)

    # Anchor the untouched source art to the bottom. Nothing below the original
    # canvas is invented; the crop ends naturally outside the 9:16 frame.
    y = H - original.height
    background.alpha_composite(original, (0, y))

    # Mild lower-edge shade only; no character deformation or generative repaint.
    grade = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grade)
    for py in range(H):
        a = int(20 * max(0, (py - 1560) / 360))
        gd.line((0, py, W, py), fill=(22, 26, 40, a))
    background = Image.alpha_composite(background, grade)
    background.save(OUT / "01_romance_hero_exact_character_1080x1920.png")


def build_hero_safe_unedited() -> None:
    source = ImageOps.exif_transpose(Image.open(BG / "pillow.jpg")).convert("RGB")
    # Lossless-in-spirit reframing: resize and crop only. No masking, generative
    # extension, redrawing, or edge extraction touches the character.
    reframed = cover(source, W, H, focus=(0.48, 0.5))
    reframed.save(OUT / "01_romance_hero_SAFE_original_crop_1080x1920.png")


def build_memories() -> None:
    base = Image.new("RGBA", (W, H), (239, 234, 232, 255))

    # Soft photographic field, intentionally calmer than a scrapbook template.
    back = cover(Image.open(BG / "nagi_with_cat.jpg"), W, H, focus=(0.50, 0.40))
    back = back.filter(ImageFilter.GaussianBlur(42))
    back = ImageEnhance.Color(back).enhance(0.58)
    back = ImageEnhance.Brightness(back).enhance(1.12)
    base = Image.blend(base, back.convert("RGBA"), 0.34)

    veil = Image.new("RGBA", (W, H), (248, 243, 242, 102))
    base = Image.alpha_composite(base, veil)

    panels = [
        (BG / "nagi_with_cat.jpg", (82, 142), (916, 510), 44),
        (BG / "wakeup.jpg", (82, 702), (916, 510), 44),
        (BG / "valentine.jpg", (82, 1262), (916, 510), 44),
    ]
    for path, pos, size, radius in panels:
        sh = shadow((size[0] + 80, size[1] + 80), radius + 18)
        base.alpha_composite(sh, (pos[0] - 40, pos[1] - 30))
        panel = contained_panel(Image.open(path), size, radius)
        base.alpha_composite(panel, pos)

    # A single fine editorial line gives structure without adding an extra slogan.
    line = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ld = ImageDraw.Draw(line)
    ld.rounded_rectangle((72, 92, 282, 98), radius=3, fill=(178, 116, 137, 170))
    ld.rounded_rectangle((798, 1822, 1008, 1828), radius=3, fill=(178, 116, 137, 125))
    base = Image.alpha_composite(base, line)
    base.convert("RGB").save(OUT / "02_romance_memories_1080x1920.jpg", quality=96)


def centered(draw: ImageDraw.ImageDraw, text: str, used_font: ImageFont.FreeTypeFont,
             y: int, fill, width=W) -> None:
    box = draw.textbbox((0, 0), text, font=used_font)
    x = (width - (box[2] - box[0])) // 2
    draw.text((x, y), text, font=used_font, fill=fill)


def build_ending() -> None:
    ending = cover(Image.open(BG / "true_end.jpg"), W, H, focus=(0.52, 0.40)).convert("RGBA")
    ending = ImageEnhance.Contrast(ending).enhance(1.04)
    ending = ImageEnhance.Color(ending).enhance(0.93)

    gradient = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(gradient)
    for y in range(H):
        top = max(0.0, 1.0 - y / 760)
        bottom = max(0.0, (y - 1480) / 440)
        alpha = int(126 * top + 118 * bottom)
        gd.line((0, y, W, y), fill=(6, 18, 47, min(alpha, 190)))
    ending = Image.alpha_composite(ending, gradient)
    ending.save(OUT / "03_world_center_clean_1080x1920.png")

    text = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    td = ImageDraw.Draw(text)
    q1 = font("msyh.ttc", 43)
    q2 = font("msyhbd.ttc", 62)
    title = font("georgiab.ttf", 72)
    subtitle = font("msyh.ttc", 34)

    centered(td, "面对终将走向世界中心的 Nagi，", q1, 184, (250, 247, 248, 244))
    centered(td, "爱的结局会在哪里？", q2, 252, (255, 249, 250, 255))

    td.rounded_rectangle((458, 365, 622, 371), radius=3, fill=(215, 156, 177, 220))
    centered(td, "Nagi’s Heart", title, 1582, (255, 250, 251, 255))
    centered(td, "爱与自我的旅程", subtitle, 1684, (245, 237, 241, 248))
    text.save(OUT / "03_world_center_text_overlay_1080x1920.png")

    composed = Image.alpha_composite(ending, text)
    composed.save(OUT / "03_world_center_final_1080x1920.png")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    build_hero()
    build_hero_exact_character()
    build_hero_safe_unedited()
    build_memories()
    build_ending()
    print(OUT)


if __name__ == "__main__":
    main()
