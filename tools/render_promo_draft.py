from __future__ import annotations

import math
import os
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
BG = ROOT / "assets" / "bg"
OUT = ROOT / "output" / "promo"
TOOLS = ROOT.parent / ".video-tools"

WIDTH, HEIGHT = 540, 960
FPS = 24
DURATION = 12.0

SHOTS = [
    ("pillow.jpg", 0.0, 1.45, 1.05, 1.13, 0.47, 0.40),
    ("nagi_with_cat.jpg", 1.35, 2.75, 1.04, 1.11, 0.50, 0.39),
    ("curry.jpg", 2.65, 3.95, 1.02, 1.09, 0.50, 0.43),
    ("wakeup.jpg", 3.85, 5.15, 1.04, 1.12, 0.51, 0.43),
    ("valentine.jpg", 5.05, 6.40, 1.03, 1.10, 0.50, 0.43),
    ("scarf.jpg", 6.30, 7.55, 1.03, 1.10, 0.50, 0.42),
    ("hug.jpg", 7.45, 8.70, 1.04, 1.12, 0.50, 0.41),
    ("summer_festival.jpg", 8.60, 9.70, 1.03, 1.11, 0.50, 0.39),
    ("true_end.jpg", 9.55, 12.0, 1.04, 1.17, 0.54, 0.38),
]


def ease(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return value * value * (3.0 - 2.0 * value)


def cover(image: Image.Image, scale: float, focus_x: float, focus_y: float) -> Image.Image:
    source_ratio = image.width / image.height
    target_ratio = WIDTH / HEIGHT
    if source_ratio > target_ratio:
        base_h = HEIGHT
        base_w = round(base_h * source_ratio)
    else:
        base_w = WIDTH
        base_h = round(base_w / source_ratio)

    new_w = max(WIDTH, round(base_w * scale))
    new_h = max(HEIGHT, round(base_h * scale))
    resized = image.resize((new_w, new_h), Image.Resampling.LANCZOS)

    left = round((new_w - WIDTH) * focus_x)
    top = round((new_h - HEIGHT) * focus_y)
    left = max(0, min(new_w - WIDTH, left))
    top = max(0, min(new_h - HEIGHT, top))
    return resized.crop((left, top, left + WIDTH, top + HEIGHT))


def shot_frame(image: Image.Image, local: float, start_scale: float, end_scale: float,
               focus_x: float, focus_y: float, global_t: float) -> Image.Image:
    progress = ease(local)
    breathing = math.sin(global_t * math.pi * 1.15) * 0.0025
    scale = start_scale + (end_scale - start_scale) * progress + breathing
    frame = cover(image, scale, focus_x, focus_y)
    frame = ImageEnhance.Color(frame).enhance(0.92)
    frame = ImageEnhance.Contrast(frame).enhance(1.03)

    glow = Image.new("RGBA", (WIDTH, HEIGHT), (255, 232, 240, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_x = int(WIDTH * (0.2 + 0.65 * progress))
    glow_draw.ellipse(
        (glow_x - 240, -150, glow_x + 260, 430),
        fill=(255, 235, 243, 30),
    )
    glow = glow.filter(ImageFilter.GaussianBlur(55))
    return Image.alpha_composite(frame.convert("RGBA"), glow)


def fade_weight(t: float, start: float, end: float) -> float:
    fade = 0.18
    if t < start or t > end:
        return 0.0
    fade_in = ease((t - start) / fade)
    fade_out = ease((end - t) / fade)
    return min(fade_in, fade_out, 1.0)


def fit_font(text: str, font_path: Path, max_width: int, start_size: int) -> ImageFont.FreeTypeFont:
    size = start_size
    while size > 18:
        font = ImageFont.truetype(str(font_path), size)
        if font.getbbox(text)[2] <= max_width:
            return font
        size -= 1
    return ImageFont.truetype(str(font_path), size)


def text_layer(t: float, font_path: Path) -> Image.Image:
    layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)

    if t >= 9.70:
        darkness = int(95 * ease((t - 9.70) / 0.55))
        draw.rectangle((0, 0, WIDTH, HEIGHT), fill=(15, 19, 31, darkness))

    if 9.95 <= t < 11.35:
        alpha = int(255 * min(ease((t - 9.95) / 0.25), ease((11.35 - t) / 0.25)))
        lines = [
            "面对终将走向世界中心的 Nagi，",
            "爱的结局会在哪里？",
        ]
        font = fit_font(lines[0], font_path, WIDTH - 72, 28)
        line_font = fit_font(lines[1], font_path, WIDTH - 72, 30)
        y = 690
        for line, used_font in ((lines[0], font), (lines[1], line_font)):
            box = draw.textbbox((0, 0), line, font=used_font)
            x = (WIDTH - (box[2] - box[0])) // 2
            draw.text(
                (x + 1, y + 2),
                line,
                font=used_font,
                fill=(20, 20, 30, int(alpha * 0.7)),
            )
            draw.text((x, y), line, font=used_font, fill=(255, 248, 250, alpha))
            y += 48

    if t >= 11.25:
        alpha = int(255 * ease((t - 11.25) / 0.3))
        title_font = ImageFont.truetype(str(font_path), 42)
        sub_font = ImageFont.truetype(str(font_path), 24)
        title = "Nagi’s Heart"
        subtitle = "爱与自我的旅程"
        for text, font, y in ((title, title_font, 740), (subtitle, sub_font, 803)):
            box = draw.textbbox((0, 0), text, font=font)
            x = (WIDTH - (box[2] - box[0])) // 2
            draw.text((x, y), text, font=font, fill=(255, 248, 250, alpha))

    return layer


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    sys.path.insert(0, str(TOOLS))
    import imageio_ffmpeg

    ffmpeg = Path(imageio_ffmpeg.get_ffmpeg_exe())
    font_path = Path(os.environ.get("WINDIR", "C:/Windows")) / "Fonts" / "msyh.ttc"
    images = {name: Image.open(BG / name).convert("RGB") for name, *_ in SHOTS}

    silent = OUT / "nagis_heart_promo_draft_silent.mp4"
    final = OUT / "nagis_heart_promo_draft_v1.mp4"
    command = [
        str(ffmpeg),
        "-y",
        "-f", "rawvideo",
        "-pix_fmt", "rgb24",
        "-s", f"{WIDTH}x{HEIGHT}",
        "-r", str(FPS),
        "-i", "-",
        "-an",
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "19",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        str(silent),
    ]

    process = subprocess.Popen(command, stdin=subprocess.PIPE)
    assert process.stdin is not None

    for frame_index in range(round(DURATION * FPS)):
        t = frame_index / FPS
        active = []
        for name, start, end, start_scale, end_scale, focus_x, focus_y in SHOTS:
            weight = fade_weight(t, start, end)
            if weight <= 0:
                continue
            local = (t - start) / (end - start)
            active.append((
                shot_frame(images[name], local, start_scale, end_scale, focus_x, focus_y, t),
                weight,
            ))

        if not active:
            frame = Image.new("RGBA", (WIDTH, HEIGHT), (12, 15, 24, 255))
        else:
            frame = active[0][0]
            if len(active) > 1:
                total = active[0][1] + active[1][1]
                blend = active[1][1] / total if total else 0.5
                frame = Image.blend(frame, active[1][0], blend)

        if t < 9.55:
            vignette = Image.new("L", (WIDTH, HEIGHT), 0)
            vg = ImageDraw.Draw(vignette)
            vg.ellipse((-130, -80, WIDTH + 130, HEIGHT + 160), fill=160)
            vignette = Image.eval(vignette.filter(ImageFilter.GaussianBlur(90)), lambda p: 255 - p)
            shade = Image.new("RGBA", (WIDTH, HEIGHT), (23, 16, 26, 0))
            shade.putalpha(vignette.point(lambda p: int(p * 0.30)))
            frame = Image.alpha_composite(frame, shade)

        frame = Image.alpha_composite(frame, text_layer(t, font_path))
        process.stdin.write(frame.convert("RGB").tobytes())

    process.stdin.close()
    if process.wait() != 0:
        raise SystemExit("Video encoding failed")

    bgm = ROOT / "assets" / "bgm.mp3"
    mux = [
        str(ffmpeg),
        "-y",
        "-i", str(silent),
        "-stream_loop", "-1",
        "-i", str(bgm),
        "-t", str(DURATION),
        "-filter:a", "volume=0.32,afade=t=in:st=0:d=0.5,afade=t=out:st=10.8:d=1.2",
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "160k",
        "-shortest",
        "-movflags", "+faststart",
        str(final),
    ]
    subprocess.run(mux, check=True)
    print(final)


if __name__ == "__main__":
    main()
