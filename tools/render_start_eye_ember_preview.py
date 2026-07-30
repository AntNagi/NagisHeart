from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "design/authority/icon_start_tt/start/previews/start_v23_static_preview_1080x1920.png"
OUT = ROOT / "output/preview/start_eye_ember_20260724"
FULL_SIZE = (1080, 1920)
GIF_SIZE = (540, 960)


def ease_in_out(t: float) -> float:
    return 0.5 - 0.5 * math.cos(math.pi * t)


def triangle_wave(t: float) -> float:
    t = t % 1.0
    return 1.0 - abs(t * 2.0 - 1.0)


def make_soft_wisp(
    size: tuple[int, int],
    points: list[tuple[int, int]],
    width: int,
    blur: float,
    alpha: int,
) -> Image.Image:
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    draw.line(points, fill=alpha, width=width, joint="curve")
    for x, y in points:
        r = width // 2
        draw.ellipse((x - r, y - r, x + r, y + r), fill=alpha)
    mask = mask.filter(ImageFilter.GaussianBlur(blur))

    layer = Image.new("RGBA", size, (9, 9, 12, 0))
    layer.putalpha(mask)
    return layer


def make_eye_ember_layer(size: tuple[int, int], phase: float, intensity: float) -> Image.Image:
    # Everything is intentionally almost invisible: the effect should read as
    # "the original eye shadow is alive", not as added fantasy fire.
    pulse = ease_in_out(triangle_wave(phase))
    drift_y = round(-5 * pulse)
    drift_x = round(2 * math.sin(phase * math.tau))
    strength = 0.35 + 0.65 * pulse

    layer = Image.new("RGBA", size, (0, 0, 0, 0))

    wisps = [
        # viewer-right eye, above iris: the existing black lash/shadow area.
        ([(710, 840), (760, 806), (820, 786), (890, 792), (950, 835)], 34, 17, 26),
        # lower-right small curl, kept within the eye shadow.
        ([(760, 1016), (832, 996), (900, 958), (970, 915)], 24, 15, 20),
        # tiny left-eye echo, much weaker so it does not become symmetrical magic.
        ([(260, 690), (300, 660), (350, 648), (400, 668)], 18, 13, 10),
    ]

    for points, width, blur, alpha in wisps:
        shifted = [(x + drift_x, y + drift_y) for x, y in points]
        wisp = make_soft_wisp(size, shifted, width, blur, round(alpha * strength * intensity))
        layer.alpha_composite(wisp)

    # A very soft local deepening around the right iris; no glow, no color.
    iris_mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(iris_mask)
    draw.ellipse(
        (690 + drift_x, 800 + drift_y, 1040 + drift_x, 1110 + drift_y),
        fill=round(18 * strength * intensity),
    )
    iris_mask = iris_mask.filter(ImageFilter.GaussianBlur(44))
    iris_layer = Image.new("RGBA", size, (5, 5, 8, 0))
    iris_layer.putalpha(iris_mask)
    layer.alpha_composite(iris_layer)

    return layer


def compose_frame(base: Image.Image, phase: float, intensity: float) -> Image.Image:
    frame = base.convert("RGBA")
    frame.alpha_composite(make_eye_ember_layer(FULL_SIZE, phase, intensity))
    return frame.convert("RGB")


def add_label_strip(img: Image.Image, label: str) -> Image.Image:
    out = img.copy()
    draw = ImageDraw.Draw(out, "RGBA")
    draw.rectangle((0, 0, out.width, 58), fill=(0, 0, 0, 74))
    draw.text((24, 18), label, fill=(244, 241, 234, 210))
    return out


def render_variant(base: Image.Image, slug: str, label_prefix: str, intensity: float) -> None:
    phases = [i / 24 for i in range(24)]
    full_frames = [compose_frame(base, p, intensity) for p in phases]
    gif_frames = [f.resize(GIF_SIZE, Image.Resampling.LANCZOS) for f in full_frames]

    gif_path = OUT / f"start_eye_ember_{slug}_preview.gif"
    gif_frames[0].save(
        gif_path,
        save_all=True,
        append_images=gif_frames[1:],
        duration=120,
        loop=0,
        optimize=True,
    )

    full_frames[12].save(OUT / f"start_eye_ember_{slug}_peak_frame_1080x1920.jpg", quality=94)

    sheet_labels = [
        ("01 original / no ember", base),
        (f"02 {label_prefix} low", full_frames[4]),
        (f"03 {label_prefix} peak", full_frames[12]),
    ]
    sheet = Image.new("RGB", (GIF_SIZE[0] * 3, GIF_SIZE[1]), (12, 12, 16))
    for idx, (label, img) in enumerate(sheet_labels):
        small = img.resize(GIF_SIZE, Image.Resampling.LANCZOS)
        sheet.paste(add_label_strip(small, label), (idx * GIF_SIZE[0], 0))
    sheet.save(OUT / f"start_eye_ember_{slug}_contact_sheet.jpg", quality=92)

    crop_box = (570, 620, 1080, 1170)
    eye_sheet = Image.new("RGB", (510 * 3, 550), (12, 12, 16))
    for idx, (label, img) in enumerate(sheet_labels):
        crop = img.crop(crop_box)
        eye_sheet.paste(add_label_strip(crop, label), (idx * 510, 0))
    eye_sheet.save(OUT / f"start_eye_ember_{slug}_eye_detail_sheet.jpg", quality=94)

    print(gif_path)
    print(OUT / f"start_eye_ember_{slug}_contact_sheet.jpg")
    print(OUT / f"start_eye_ember_{slug}_eye_detail_sheet.jpg")
    print(OUT / f"start_eye_ember_{slug}_peak_frame_1080x1920.jpg")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    base = Image.open(SRC).convert("RGB").resize(FULL_SIZE, Image.Resampling.LANCZOS)
    render_variant(base, "a_subtle", "A subtle ember", 1.0)
    render_variant(base, "b_defined", "B defined ember", 1.55)


if __name__ == "__main__":
    main()
