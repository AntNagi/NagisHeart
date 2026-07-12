from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(r"D:/Nagi's Heart/NagisHeart/handoff/yiyi_final_visual_slices_20260711")
FILES = [
    ROOT / "start_flow/01_splash_start_poster_9x16.png",
    ROOT / "start_flow/02_prologue_opening_sentence_9x16.png",
    ROOT / "start_flow/03_name_input_9x16.png",
    ROOT / "start_flow/04_chapter_opening_9x16.png",
    ROOT / "start_flow/05_section_clear_9x16.png",
]
LABELS = [
    "01_splash_tt_v15",
    "02_prologue",
    "03_name_input_single",
    "04_chapter_opening",
    "05_section_clear",
]
OUT = ROOT / "preview/start_flow_contact_sheet.jpg"
FONT = r"C:/Windows/Fonts/NotoSansSC-VF.ttf"


def main() -> None:
    tile_w, tile_h = 270, 480
    out = Image.new("RGB", (tile_w * len(FILES), tile_h + 74), (13, 22, 35))
    draw = ImageDraw.Draw(out)
    font = ImageFont.truetype(FONT, 16)

    for i, (path, label) in enumerate(zip(FILES, LABELS)):
        image = Image.open(path).convert("RGB").resize((tile_w, tile_h), Image.Resampling.LANCZOS)
        out.paste(image, (i * tile_w, 0))
        draw.text((i * tile_w + 12, tile_h + 20), label, font=font, fill=(242, 246, 249))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    out.save(OUT, quality=94)


if __name__ == "__main__":
    main()
