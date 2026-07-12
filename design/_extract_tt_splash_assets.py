from pathlib import Path
from PIL import Image, ImageChops


ROOT = Path(r"D:\Nagi's Heart\NagisHeart")
POSTER = Path(r"D:\Nagi‘s Heart\PM_AGENT_OUTBOX\tt_opening_poster\opening_poster_v15_main_remeet_1080x1920.png")
SOURCE = ROOT / "assets" / "bg" / "remeet.jpg"
OUT = ROOT / "handoff" / "yiyi_final_visual_slices_20260711" / "start_flow" / "splash_layers"
ANDROID_BG = ROOT / "android" / "app" / "src" / "main" / "assets" / "bg"

SIZE = (1080, 1920)
TITLE_REGION = (0, 0, 1080, 620)
START_REGION = (0, 1440, 1080, 1920)
MASK_THRESHOLD = 18


def fit_cover(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    src_w, src_h = image.size
    dst_w, dst_h = size
    scale = max(dst_w / src_w, dst_h / src_h)
    resized = image.resize((round(src_w * scale), round(src_h * scale)), Image.Resampling.LANCZOS)
    left = (resized.width - dst_w) // 2
    top = (resized.height - dst_h) // 2
    return resized.crop((left, top, left + dst_w, top + dst_h))


def build_mask(diff: Image.Image) -> Image.Image:
    diff = diff.convert("L")
    mask = diff.point(lambda p: 255 if p > MASK_THRESHOLD else 0)
    return mask


def masked_overlay(poster: Image.Image, mask: Image.Image, region: tuple[int, int, int, int]) -> Image.Image:
    overlay = Image.new("RGBA", poster.size, (0, 0, 0, 0))
    left, top, right, bottom = region
    cropped_rgba = poster.crop(region).convert("RGBA")
    cropped_mask = mask.crop(region)
    cropped_rgba.putalpha(cropped_mask)
    overlay.paste(cropped_rgba, (left, top), cropped_rgba)
    return overlay


def tight_crop(image: Image.Image, fallback_region: tuple[int, int, int, int]) -> Image.Image:
    bbox = image.getbbox()
    if bbox is None:
        bbox = fallback_region
    return image.crop(bbox)


def save_png(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, format="PNG")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    ANDROID_BG.mkdir(parents=True, exist_ok=True)

    poster = Image.open(POSTER).convert("RGB")
    source = Image.open(SOURCE).convert("RGB")
    bg = fit_cover(source, SIZE)

    diff = ImageChops.difference(poster, bg)
    mask = build_mask(diff)

    title_overlay = masked_overlay(poster, mask, TITLE_REGION)
    start_overlay = masked_overlay(poster, mask, START_REGION)

    title_tight = tight_crop(title_overlay, TITLE_REGION)
    start_tight = tight_crop(start_overlay, START_REGION)

    save_png(bg, OUT / "splash_bg_remeet_clean_1080x1920.png")
    save_png(poster.convert("RGBA"), OUT / "splash_poster_tt_v15_full_1080x1920.png")
    save_png(title_overlay, OUT / "splash_title_overlay_fullcanvas.png")
    save_png(start_overlay, OUT / "splash_start_overlay_fullcanvas.png")
    save_png(title_tight, OUT / "splash_title_overlay_tight.png")
    save_png(start_tight, OUT / "splash_start_overlay_tight.png")

    save_png(poster.convert("RGBA"), ANDROID_BG / "poster_start_nagis_heart_keyart.png")
    save_png(bg, ANDROID_BG / "poster_start_nagis_heart_bg_clean.png")
    save_png(title_overlay, ANDROID_BG / "poster_start_title_overlay.png")
    save_png(start_overlay, ANDROID_BG / "poster_start_start_overlay.png")


if __name__ == "__main__":
    main()
