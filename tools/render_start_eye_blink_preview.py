from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "design/authority/icon_start_tt/start/previews/start_v23_static_preview_1080x1920.png"
OUT = ROOT / "output/preview/start_eye_blink_20260725"
FULL_SIZE = (1080, 1920)
GIF_SIZE = (540, 960)


def smoothstep(t: float) -> float:
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)


def blink_amount(frame: int, total: int, strength: float) -> float:
    # One quiet blink in the loop: open -> close -> open, with long stillness.
    phase = frame / total
    start = 0.42
    close = 0.50
    open_again = 0.59
    if phase < start or phase > open_again:
        return 0.0
    if phase <= close:
        return smoothstep((phase - start) / (close - start)) * strength
    return smoothstep((open_again - phase) / (open_again - close)) * strength


def soft_polygon_mask(size: tuple[int, int], polygon: list[tuple[float, float]], blur: float) -> Image.Image:
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    draw.polygon([(round(x), round(y)) for x, y in polygon], fill=255)
    return mask.filter(ImageFilter.GaussianBlur(blur))


def overlay_color(base: Image.Image, mask: Image.Image, color: tuple[int, int, int], opacity: float) -> None:
    alpha = mask.point(lambda p: round(p * opacity))
    layer = Image.new("RGBA", base.size, (*color, 0))
    layer.putalpha(alpha)
    base.alpha_composite(layer)


def draw_lid_line(
    frame: Image.Image,
    points: list[tuple[float, float]],
    width: int,
    opacity: int,
    blur: float = 0.6,
) -> None:
    line = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(line)
    draw.line([(round(x), round(y)) for x, y in points], fill=(21, 19, 20, opacity), width=width, joint="curve")
    if blur > 0:
        line = line.filter(ImageFilter.GaussianBlur(blur))
    frame.alpha_composite(line)


def add_right_eye_blink(frame: Image.Image, amount: float) -> None:
    # Viewer-right eye. The eyelid should feel like existing line art closing,
    # not a new sticker pasted on the face.
    skin = (239, 232, 222)
    shadow = (188, 181, 171)

    upper_y = 775 + 210 * amount
    lower_y = 1110 - 118 * amount
    center_y = (upper_y + lower_y) / 2

    upper_poly = [
        (620, 735), (1080, 720), (1080, upper_y + 80), (1000, upper_y + 54),
        (905, upper_y + 32), (790, upper_y + 20), (690, upper_y + 42), (620, upper_y + 72),
    ]
    lower_poly = [
        (610, lower_y - 46), (700, lower_y - 32), (805, lower_y - 16),
        (930, lower_y - 25), (1080, lower_y - 50), (1080, 1180), (610, 1180),
    ]

    overlay_color(frame, soft_polygon_mask(frame.size, upper_poly, 4), skin, 0.84 * amount)
    overlay_color(frame, soft_polygon_mask(frame.size, lower_poly, 4), skin, 0.52 * amount)

    # Soft inner shadow where lids meet.
    shadow_mask = Image.new("L", frame.size, 0)
    draw = ImageDraw.Draw(shadow_mask)
    draw.ellipse((640, center_y - 42, 1100, center_y + 78), fill=round(120 * amount))
    shadow_mask = shadow_mask.filter(ImageFilter.GaussianBlur(24))
    overlay_color(frame, shadow_mask, shadow, 0.16 * amount)

    lid_line = [
        (635, center_y + 14),
        (720, center_y - 10),
        (815, center_y - 22),
        (925, center_y - 8),
        (1060, center_y + 38),
    ]
    draw_lid_line(frame, lid_line, width=8, opacity=round(172 * amount), blur=0.7)


def add_left_eye_blink(frame: Image.Image, amount: float) -> None:
    # Viewer-left eye is smaller and partially hidden; keep it quieter.
    skin = (239, 232, 222)
    upper_y = 560 + 116 * amount
    lower_y = 750 - 70 * amount
    center_y = (upper_y + lower_y) / 2

    upper_poly = [
        (145, 500), (470, 500), (470, upper_y + 54), (390, upper_y + 22),
        (300, upper_y + 8), (215, upper_y + 26), (145, upper_y + 58),
    ]
    lower_poly = [
        (145, lower_y - 30), (250, lower_y - 16), (355, lower_y - 18),
        (470, lower_y - 42), (470, 790), (145, 790),
    ]

    overlay_color(frame, soft_polygon_mask(frame.size, upper_poly, 4), skin, 0.72 * amount)
    overlay_color(frame, soft_polygon_mask(frame.size, lower_poly, 4), skin, 0.40 * amount)
    lid_line = [(160, center_y + 8), (250, center_y - 8), (350, center_y - 6), (455, center_y + 24)]
    draw_lid_line(frame, lid_line, width=6, opacity=round(130 * amount), blur=0.8)


def compose_frame(base: Image.Image, amount: float) -> Image.Image:
    frame = base.convert("RGBA")
    if amount > 0:
        add_left_eye_blink(frame, amount * 0.82)
        add_right_eye_blink(frame, amount)
    return frame.convert("RGB")


def add_label_strip(img: Image.Image, label: str) -> Image.Image:
    out = img.copy()
    draw = ImageDraw.Draw(out, "RGBA")
    draw.rectangle((0, 0, out.width, 58), fill=(0, 0, 0, 74))
    draw.text((24, 18), label, fill=(244, 241, 234, 218))
    return out


def render_variant(base: Image.Image, slug: str, label_prefix: str, strength: float) -> None:
    total = 36
    amounts = [blink_amount(i, total, strength) for i in range(total)]
    full_frames = [compose_frame(base, a) for a in amounts]
    gif_frames = [f.resize(GIF_SIZE, Image.Resampling.LANCZOS) for f in full_frames]

    gif_path = OUT / f"start_eye_blink_{slug}_preview.gif"
    gif_frames[0].save(
        gif_path,
        save_all=True,
        append_images=gif_frames[1:],
        duration=95,
        loop=0,
        optimize=True,
    )

    peak_idx = max(range(total), key=lambda i: amounts[i])
    full_frames[peak_idx].save(OUT / f"start_eye_blink_{slug}_closed_frame_1080x1920.jpg", quality=94)

    sheet_items = [
        ("01 original / open", base),
        (f"02 {label_prefix} half", full_frames[max(0, peak_idx - 2)]),
        (f"03 {label_prefix} closed", full_frames[peak_idx]),
    ]
    sheet = Image.new("RGB", (GIF_SIZE[0] * 3, GIF_SIZE[1]), (12, 12, 16))
    for idx, (label, img) in enumerate(sheet_items):
        small = img.resize(GIF_SIZE, Image.Resampling.LANCZOS)
        sheet.paste(add_label_strip(small, label), (idx * GIF_SIZE[0], 0))
    sheet.save(OUT / f"start_eye_blink_{slug}_contact_sheet.jpg", quality=92)

    crop_box = (120, 440, 1080, 1180)
    crop_w = crop_box[2] - crop_box[0]
    crop_h = crop_box[3] - crop_box[1]
    detail = Image.new("RGB", (crop_w * 3, crop_h), (12, 12, 16))
    for idx, (label, img) in enumerate(sheet_items):
        crop = add_label_strip(img.crop(crop_box), label)
        detail.paste(crop, (idx * crop_w, 0))
    detail.save(OUT / f"start_eye_blink_{slug}_eye_detail_sheet.jpg", quality=94)

    print(gif_path)
    print(OUT / f"start_eye_blink_{slug}_contact_sheet.jpg")
    print(OUT / f"start_eye_blink_{slug}_eye_detail_sheet.jpg")
    print(OUT / f"start_eye_blink_{slug}_closed_frame_1080x1920.jpg")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    base = Image.open(SRC).convert("RGB").resize(FULL_SIZE, Image.Resampling.LANCZOS)
    render_variant(base, "a_micro", "A micro blink", 0.58)
    render_variant(base, "b_full", "B full blink", 1.0)


if __name__ == "__main__":
    main()
