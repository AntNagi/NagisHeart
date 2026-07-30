from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "design/authority/icon_start_tt/start/previews/start_v23_static_preview_1080x1920.png"
BASE_SRC = ROOT / "design/authority/icon_start_tt/start/base/start_clean_remeet_1080x1920.png"
OUT = ROOT / "output/preview/start_vignette_20260725"
SIZE = (1080, 1920)
SHEET_SIZE = (360, 640)


def smoothstep(t: float) -> float:
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)


def vignette_mask(
    size: tuple[int, int],
    center: tuple[float, float],
    inner: float,
    outer: float,
    max_alpha: int,
    side_alpha: int,
    top_alpha: int,
    bottom_alpha: int,
) -> Image.Image:
    w, h = size
    cx, cy = center
    max_r = max(w, h)
    px = bytearray(w * h)
    for y in range(h):
        yn = y / max(h - 1, 1)
        for x in range(w):
            xn = x / max(w - 1, 1)
            radial = math.hypot(x - cx, y - cy) / max_r
            edge = smoothstep((radial - inner) / max(outer - inner, 0.001)) * max_alpha

            side = max(smoothstep((0.19 - xn) / 0.19), smoothstep((xn - 0.81) / 0.19)) * side_alpha
            top = smoothstep((0.14 - yn) / 0.14) * top_alpha
            bottom = smoothstep((yn - 0.62) / 0.38) * bottom_alpha
            px[y * w + x] = min(255, round(max(edge, side, top, bottom)))
    return Image.frombytes("L", size, bytes(px))


def soft_highlight_mask(size: tuple[int, int], center: tuple[float, float], radius: float, alpha: int) -> Image.Image:
    w, h = size
    cx, cy = center
    px = bytearray(w * h)
    for y in range(h):
        for x in range(w):
            d = math.hypot(x - cx, y - cy) / radius
            px[y * w + x] = round((1 - smoothstep(d)) * alpha)
    return Image.frombytes("L", size, bytes(px))


def vertical_gradient_mask(size: tuple[int, int], stops: list[tuple[float, int]]) -> Image.Image:
    w, h = size
    stops = sorted(stops)
    px = bytearray(w * h)
    for y in range(h):
        p = y / max(h - 1, 1)
        value = stops[-1][1]
        for i in range(len(stops) - 1):
            p0, a0 = stops[i]
            p1, a1 = stops[i + 1]
            if p0 <= p <= p1:
                t = (p - p0) / max(p1 - p0, 0.001)
                value = round(a0 + (a1 - a0) * t)
                break
        row = bytes([value]) * w
        px[y * w : (y + 1) * w] = row
    return Image.frombytes("L", size, bytes(px))


def radial_gradient_mask(
    size: tuple[int, int],
    center: tuple[float, float],
    radius: float,
    stops: list[tuple[float, int]],
) -> Image.Image:
    w, h = size
    cx, cy = center
    stops = sorted(stops)
    px = bytearray(w * h)
    for y in range(h):
        for x in range(w):
            p = math.hypot(x - cx, y - cy) / radius
            value = stops[-1][1]
            for i in range(len(stops) - 1):
                p0, a0 = stops[i]
                p1, a1 = stops[i + 1]
                if p0 <= p <= p1:
                    t = (p - p0) / max(p1 - p0, 0.001)
                    value = round(a0 + (a1 - a0) * t)
                    break
            px[y * w + x] = value
    return Image.frombytes("L", size, bytes(px))


def apply_home_exact_vignette(base: Image.Image) -> Path:
    img = base.convert("RGBA")
    dim = (7, 7, 12)

    vertical = Image.new("RGBA", SIZE, (*dim, 0))
    vertical.putalpha(
        vertical_gradient_mask(
            SIZE,
            [
                (0.00, round(255 * 0.52)),
                (0.42, round(255 * 0.34)),
                (1.00, round(255 * 0.78)),
            ],
        )
    )
    img.alpha_composite(vertical)

    radial = Image.new("RGBA", SIZE, (*dim, 0))
    radial.putalpha(
        radial_gradient_mask(
            SIZE,
            center=(SIZE[0] * 0.5, SIZE[1] * 0.38),
            radius=max(SIZE) * 0.72,
            stops=[
                (0.00, 0),
                (0.18, 0),
                (0.62, round(255 * 0.38)),
                (1.00, round(255 * 0.72)),
            ],
        )
    )
    img.alpha_composite(radial)

    white = Image.new("RGBA", SIZE, (255, 255, 255, 0))
    white.putalpha(
        vertical_gradient_mask(
            SIZE,
            [
                (0.00, round(255 * 0.04)),
                (0.18, 0),
                (0.70, 0),
                (1.00, round(255 * 0.02)),
            ],
        )
    )
    img.alpha_composite(white)

    out = OUT / "start_vignette_d_home_exact_1080x1920.png"
    img.convert("RGB").save(out, quality=96)
    return out


def apply_vignette(
    base: Image.Image,
    slug: str,
    label: str,
    max_alpha: int,
    side_alpha: int,
    top_alpha: int,
    bottom_alpha: int,
    center_y: float,
    warmth: tuple[int, int, int],
) -> Path:
    img = base.convert("RGBA")
    mask = vignette_mask(
        SIZE,
        center=(SIZE[0] * 0.50, SIZE[1] * center_y),
        inner=0.31,
        outer=0.72,
        max_alpha=max_alpha,
        side_alpha=side_alpha,
        top_alpha=top_alpha,
        bottom_alpha=bottom_alpha,
    )
    dark = Image.new("RGBA", SIZE, (*warmth, 0))
    dark.putalpha(mask)
    img.alpha_composite(dark)

    # Keep the face/hair center airy, like a lens opening rather than smoke.
    highlight = Image.new("RGBA", SIZE, (255, 255, 255, 0))
    highlight.putalpha(soft_highlight_mask(SIZE, (SIZE[0] * 0.48, SIZE[1] * 0.39), SIZE[1] * 0.38, 18))
    img.alpha_composite(highlight)

    out = OUT / f"start_vignette_{slug}_1080x1920.png"
    img.convert("RGB").save(out, quality=96)
    return out


def add_label(img: Image.Image, text: str) -> Image.Image:
    out = img.copy()
    draw = ImageDraw.Draw(out, "RGBA")
    draw.rectangle((0, 0, out.width, 42), fill=(0, 0, 0, 84))
    draw.text((14, 13), text, fill=(244, 241, 234, 224))
    return out


def extract_start_overlay(static_preview: Image.Image, clean_base: Image.Image) -> Image.Image:
    # Extract only the bottom START / Tap to start layer from the approved v23 preview.
    # This keeps the typography above the vignette without redrawing or changing it.
    from PIL import ImageChops, ImageFilter

    diff = ImageChops.difference(static_preview.convert("RGB"), clean_base.convert("RGB")).convert("L")
    alpha = diff.point(lambda p: 0 if p < 8 else min(255, round(p * 2.8)))

    crop_gate = Image.new("L", SIZE, 0)
    draw = ImageDraw.Draw(crop_gate)
    draw.rectangle((0, 1500, SIZE[0], SIZE[1]), fill=255)
    crop_gate = crop_gate.filter(ImageFilter.GaussianBlur(1.2))
    alpha = ImageChops.multiply(alpha, crop_gate)

    overlay = static_preview.convert("RGBA")
    overlay.putalpha(alpha)
    return overlay


def apply_c_with_start_top(static_preview: Image.Image, clean_base: Image.Image) -> Path:
    # C's exact parameters, but with the START layer composited after the vignette.
    c_path = apply_vignette(
        static_preview,
        "c_start_top",
        "C start top",
        142,
        76,
        30,
        182,
        0.39,
        (8, 8, 12),
    )
    img = Image.open(c_path).convert("RGBA")
    img.alpha_composite(extract_start_overlay(static_preview, clean_base))
    out = OUT / "start_vignette_c_start_top_1080x1920.png"
    img.convert("RGB").save(out, quality=96)
    return out


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    base = Image.open(SRC).convert("RGB").resize(SIZE, Image.Resampling.LANCZOS)
    clean_base = Image.open(BASE_SRC).convert("RGB").resize(SIZE, Image.Resampling.LANCZOS)

    variants = [
        ("a_subtle_home", "A subtle home vignette", 118, 66, 34, 118, 0.41, (7, 8, 12)),
        ("b_balanced_depth", "B balanced depth", 150, 86, 44, 150, 0.40, (7, 8, 13)),
        ("c_bottom_readability", "C bottom readability", 142, 76, 30, 182, 0.39, (8, 8, 12)),
    ]

    outputs: list[tuple[str, Path]] = []
    for variant in variants:
        slug, label, max_alpha, side_alpha, top_alpha, bottom_alpha, center_y, warmth = variant
        outputs.append((label, apply_vignette(base, slug, label, max_alpha, side_alpha, top_alpha, bottom_alpha, center_y, warmth)))
    outputs.append(("D home exact values", apply_home_exact_vignette(base)))
    outputs.append(("C + START top", apply_c_with_start_top(base, clean_base)))

    sheet = Image.new("RGB", (SHEET_SIZE[0] * 6, SHEET_SIZE[1]), (12, 12, 16))
    sheet.paste(add_label(base.resize(SHEET_SIZE, Image.Resampling.LANCZOS), "Original v23"), (0, 0))
    for idx, (label, path) in enumerate(outputs, start=1):
        img = Image.open(path).convert("RGB").resize(SHEET_SIZE, Image.Resampling.LANCZOS)
        sheet.paste(add_label(img, label), (SHEET_SIZE[0] * idx, 0))
    sheet_path = OUT / "start_vignette_contact_sheet.jpg"
    sheet.save(sheet_path, quality=92)

    print(sheet_path)
    for _, path in outputs:
        print(path)


if __name__ == "__main__":
    main()
