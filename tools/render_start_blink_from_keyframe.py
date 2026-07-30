from __future__ import annotations

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OPEN = ROOT / "design/authority/icon_start_tt/start/previews/start_v23_static_preview_1080x1920.png"
CLOSED = ROOT / "output/preview/start_eye_blink_imagegen_20260725/start_eye_blink_closed_keyframe_imagegen.png"
OUT = ROOT / "output/preview/start_eye_blink_imagegen_20260725"
SIZE = (540, 960)


def blend(a: Image.Image, b: Image.Image, t: float) -> Image.Image:
    return Image.blend(a, b, t)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    open_img = Image.open(OPEN).convert("RGB").resize(SIZE, Image.Resampling.LANCZOS)
    closed_img = Image.open(CLOSED).convert("RGB").resize(SIZE, Image.Resampling.LANCZOS)

    sequence: list[tuple[Image.Image, int]] = []
    # Long open hold; the blink should feel occasional, not busy.
    sequence.extend((open_img.copy(), 120) for _ in range(14))
    for t in [0.25, 0.55, 0.82, 1.0]:
        sequence.append((blend(open_img, closed_img, t), 52))
    sequence.append((closed_img.copy(), 68))
    for t in [0.76, 0.44, 0.18]:
        sequence.append((blend(open_img, closed_img, t), 48))
    sequence.extend((open_img.copy(), 120) for _ in range(8))

    frames = [img for img, _ in sequence]
    durations = [duration for _, duration in sequence]

    gif_path = OUT / "start_eye_blink_imagegen_preview.gif"
    frames[0].save(
        gif_path,
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=0,
        optimize=True,
    )

    sheet = Image.new("RGB", (SIZE[0] * 3, SIZE[1]), (12, 12, 16))
    sheet.paste(open_img, (0, 0))
    sheet.paste(blend(open_img, closed_img, 0.55), (SIZE[0], 0))
    sheet.paste(closed_img, (SIZE[0] * 2, 0))
    sheet.save(OUT / "start_eye_blink_imagegen_contact_sheet.jpg", quality=92)

    print(gif_path)
    print(OUT / "start_eye_blink_closed_keyframe_imagegen.png")
    print(OUT / "start_eye_blink_imagegen_contact_sheet.jpg")


if __name__ == "__main__":
    main()
