from __future__ import annotations

import base64
import mimetypes
from pathlib import Path
from xml.sax.saxutils import escape


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = Path(__file__).resolve().parent
BG_DIR = ROOT / "assets" / "bg"
COVER_DIR = OUT_DIR / "covers"
SYSTEM_BG_PATH = ROOT / "android" / "app" / "src" / "main" / "res" / "drawable-nodpi" / "splash_bg.png"

W = 1080
H = 1920
lines: list[str] = []


def add(value: str) -> None:
    lines.append(value)


def data_uri(filename: str) -> str:
    path = BG_DIR / filename
    mime = mimetypes.guess_type(path.name)[0] or "image/jpeg"
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode("ascii")


def cover_data_uri(filename: str) -> str:
    path = COVER_DIR / filename
    mime = mimetypes.guess_type(path.name)[0] or "image/jpeg"
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode("ascii")


def path_data_uri(path: Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or "image/png"
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode("ascii")


IMAGES = {
    "system_bg": path_data_uri(SYSTEM_BG_PATH),
    "first_meet": data_uri("first_meet.png"),
    "openday": data_uri("openday.jpg"),
    "falling": data_uri("falling_down.jpg"),
    "return": data_uri("living_room.jpg"),
    "lemontea": data_uri("lemontea.jpg"),
    "worldcup": data_uri("bg_u20j_worldcup_goal_kick.jpg"),
    "worldcup_person": data_uri("king.jpg"),
    "summer": data_uri("bg_summer_festival_coconut.jpg"),
    "summer_person": data_uri("summer_festival.jpg"),
    "club": data_uri("bg_club_media_press_room.png"),
    "club_person": data_uri("new_home.jpg"),
    "agency": data_uri("bg_agency_launch_stage.png"),
    "holiday_person": data_uri("scarf.jpg"),
    "manchester_night": data_uri("bg_manchester_bedroom_city_night.jpg"),
    "dream_match": data_uri("bg_bad_impact_kick_cutin.jpg"),
    "true_end": data_uri("true_end.jpg"),
    "chapter_01": cover_data_uri("chapter_01.jpg"),
    "chapter_02": cover_data_uri("chapter_02.jpg"),
    "chapter_03": cover_data_uri("chapter_03.jpg"),
    "chapter_04": cover_data_uri("chapter_04.jpg"),
    "chapter_05": cover_data_uri("chapter_05.jpg"),
    "chapter_06": cover_data_uri("chapter_06.jpg"),
    "chapter_07": cover_data_uri("chapter_07.jpg"),
    "chapter_08": cover_data_uri("chapter_08.jpg"),
}


def cut_path(x: float, y: float, w: float, h: float, cut: float = 24) -> str:
    return (
        f"M{x+cut},{y} H{x+w-cut} L{x+w},{y+cut} V{y+h-cut} "
        f"L{x+w-cut},{y+h} H{x+cut} L{x},{y+h-cut} V{y+cut} Z"
    )


def pentagon(cx: float, cy: float, r: float) -> str:
    import math
    points = []
    for index in range(5):
        angle = -math.pi / 2 + index * math.pi * 2 / 5
        points.append(f"{cx + math.cos(angle) * r:.1f},{cy + math.sin(angle) * r:.1f}")
    return " ".join(points)


def base_page(background_uri: str, chapter_num: str, chapter_name: str,
              chapter_sub: str, progress: str) -> None:
    add(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">')
    add('<style>')
    add("text { font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif; }")
    add(".serif { font-family: 'Noto Serif CJK SC', 'Songti SC', 'SimSun', serif; }")
    add(".page-kicker { font-size: 18px; letter-spacing: 4px; fill: #D7BE86; }")
    add(".page-title { font-size: 43px; font-weight: 550; fill: #F4EEDF; }")
    add(".page-sub { font-size: 19px; fill: #9AA8BA; }")
    add(".node-title { font-size: 23px; font-weight: 550; paint-order: stroke; stroke: #07111E; stroke-width: 5px; stroke-opacity: 0.82; }")
    add(".node-index { font-size: 14px; letter-spacing: 2px; }")
    add(".landmark-title { font-size: 30px; font-weight: 700; paint-order: stroke; stroke: #07111E; stroke-width: 7px; stroke-opacity: 0.88; }")
    add(".landmark-sub { font-size: 16px; letter-spacing: 3px; paint-order: stroke; stroke: #07111E; stroke-width: 5px; stroke-opacity: 0.8; }")
    add(".route-base { fill: none; stroke: #DCE4ED; stroke-opacity: 0.25; stroke-width: 2; stroke-linecap: square; stroke-linejoin: miter; }")
    add(".route-done { fill: none; stroke: #D7BE86; stroke-opacity: 0.95; stroke-width: 3; stroke-linecap: square; stroke-linejoin: miter; filter: url(#gold-glow); }")
    add(".route-current { fill: none; stroke: #78B7FF; stroke-width: 3; stroke-dasharray: 10 8; filter: url(#blue-glow); }")
    add('</style>')
    add('<defs>')
    add('<linearGradient id="system-shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#132033" stop-opacity="0.52"/><stop offset="42%" stop-color="#132033" stop-opacity="0.34"/><stop offset="100%" stop-color="#132033" stop-opacity="0.78"/></linearGradient>')
    add('<radialGradient id="system-vignette" cx="50%" cy="38%" r="72%"><stop offset="0%" stop-color="#132033" stop-opacity="0"/><stop offset="18%" stop-color="#132033" stop-opacity="0"/><stop offset="62%" stop-color="#132033" stop-opacity="0.38"/><stop offset="100%" stop-color="#132033" stop-opacity="0.72"/></radialGradient>')
    add('<linearGradient id="system-breath" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.04"/><stop offset="18%" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="70%" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.02"/></linearGradient>')
    add('<linearGradient id="hud-button-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0F1827" stop-opacity="0.34"/><stop offset="100%" stop-color="#0F1827" stop-opacity="0.22"/></linearGradient>')
    add('<radialGradient id="hud-button-light" cx="50%" cy="50%" r="60%"><stop offset="0%" stop-color="#F7F9FC" stop-opacity="0.08"/><stop offset="100%" stop-color="#F7F9FC" stop-opacity="0"/></radialGradient>')
    add('<linearGradient id="image-shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#07111D" stop-opacity="0.04"/><stop offset="55%" stop-color="#07111D" stop-opacity="0.14"/><stop offset="100%" stop-color="#07111D" stop-opacity="0.94"/></linearGradient>')
    add('<filter id="bg-blur"><feGaussianBlur stdDeviation="17"/></filter>')
    add('<filter id="gold-glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>')
    add('<filter id="blue-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>')
    add('<filter id="hud-shadow" x="-60%" y="-60%" width="220%" height="240%"><feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#000000" flood-opacity="0.42"/></filter>')
    add('<filter id="locked-image"><feColorMatrix type="saturate" values="0.08"/><feComponentTransfer><feFuncA type="linear" slope="0.34"/></feComponentTransfer></filter>')
    add('</defs>')
    add(f'<image href="{IMAGES["system_bg"]}" x="0" y="0" width="{W}" height="{H}" preserveAspectRatio="xMidYMid slice"/>')
    add(f'<rect width="{W}" height="{H}" fill="url(#system-shade)"/>')
    add(f'<rect width="{W}" height="{H}" fill="url(#system-vignette)"/>')
    add(f'<rect width="{W}" height="{H}" fill="url(#system-breath)"/>')
    # Exact system-page NagiIconButton language.
    back_d = cut_path(46, 44, 84, 84, 12)
    add(f'<path d="{back_d}" fill="url(#hud-button-fill)" stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="1.2" filter="url(#hud-shadow)"/>')
    add(f'<path d="{back_d}" fill="url(#hud-button-light)"/>')
    add('<path d="M94 65 L72 86 L94 107" fill="none" stroke="#F7F9FC" stroke-opacity="0.94" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>')
    # chapter heading
    add(f'<text x="72" y="227" class="page-kicker">CHAPTER {chapter_num}</text>')
    add(f'<text x="72" y="283" class="serif page-title">{escape(chapter_name)}</text>')
    add(f'<text x="74" y="321" class="page-sub">{escape(chapter_sub)}</text>')


def end_page(chapter_num: str, chapter_name: str, chapter_index: str) -> None:
    # bottom chapter switcher: only this control uses a restrained glass plane
    d = cut_path(58, 1708, 964, 150, 23)
    add(f'<path d="{d}" fill="#091522" fill-opacity="0.88" stroke="#D7BE86" stroke-opacity="0.24" stroke-width="1.5"/>')
    add('<path d="M90 1783 l18 -15 v30 z" fill="#D7BE86" fill-opacity="0.62"/>')
    add('<path d="M990 1783 l-18 -15 v30 z" fill="#D7BE86" fill-opacity="0.62"/>')
    add(f'<text x="540" y="1763" text-anchor="middle" class="page-kicker">第 {chapter_num} 部</text>')
    add(f'<text x="540" y="1810" text-anchor="middle" class="serif" font-size="29" fill="#F1E7D3">{escape(chapter_name)}</text>')
    add(f'<text x="540" y="1840" text-anchor="middle" font-size="16" letter-spacing="3" fill="#8E9BAE">{chapter_index}</text>')
    add('<line x1="410" y1="1878" x2="670" y2="1878" stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="3"/>')
    add('<line x1="410" y1="1878" x2="476" y2="1878" stroke="#D7BE86" stroke-width="3"/>')
    add('</svg>')


def small_node(cx: float, cy: float, title: str, index: str, state: str = "locked",
               label_side: str = "right") -> None:
    colors = {
        "done": ("#D7BE86", "#F4E9D1", 1.0),
        "current": ("#78B7FF", "#E8F4FF", 1.0),
        "locked": ("#66758A", "#8390A2", 0.58),
    }
    color, text_color, opacity = colors[state]
    if state == "current":
        add(f'<circle cx="{cx}" cy="{cy}" r="39" fill="none" stroke="#78B7FF" stroke-opacity="0.18" stroke-width="11"/>')
        add(f'<circle cx="{cx}" cy="{cy}" r="28" fill="none" stroke="#78B7FF" stroke-opacity="0.45" stroke-width="3"/>')
    add(f'<polygon points="{pentagon(cx, cy, 16)}" fill="#081422" stroke="{color}" stroke-width="{3 if state == "current" else 2}" opacity="{opacity}"{(" filter=\"url(#blue-glow)\"" if state == "current" else "")}/>')
    add(f'<circle cx="{cx}" cy="{cy}" r="4.5" fill="{color}" opacity="{opacity}"/>')
    if label_side == "right":
        tx, anchor = cx + 34, "start"
    else:
        tx, anchor = cx - 34, "end"
    add(f'<text x="{tx}" y="{cy-8}" text-anchor="{anchor}" class="node-index" fill="{color}" opacity="{opacity}">{escape(index)}</text>')
    add(f'<text x="{tx}" y="{cy+23}" text-anchor="{anchor}" class="node-title" fill="{text_color}" opacity="{opacity}">{escape(title)}</text>')


def landmark(cx: float, cy: float, w: float, h: float, image_uri: str, title: str,
             subtitle: str, state: str = "done") -> None:
    x, y = cx - w / 2, cy - h / 2
    clip_id = f"clip_{int(cx)}_{int(cy)}"
    d = cut_path(x, y, w, h, 28)
    accent = {"done": "#D7BE86", "current": "#78B7FF", "locked": "#65758A"}[state]
    add(f'<clipPath id="{clip_id}"><path d="{d}"/></clipPath>')
    image_filter = ' filter="url(#locked-image)"' if state == "locked" else ""
    add(f'<g{(" filter=\"url(#gold-glow)\"" if state == "done" else "")}>')
    add(f'<image href="{image_uri}" x="{x}" y="{y}" width="{w}" height="{h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#{clip_id})"{image_filter}/>')
    add(f'<path d="{d}" fill="url(#image-shade)" stroke="{accent}" stroke-opacity="{0.92 if state != "locked" else 0.38}" stroke-width="2.5"/>')
    add(f'<text x="{x+22}" y="{y+h-52}" class="landmark-sub" fill="{accent}">{escape(subtitle)}</text>')
    add(f'<text x="{x+22}" y="{y+h-18}" class="serif landmark-title" fill="#FFF8E9">{escape(title)}</text>')
    add('</g>')


def route(d: str, state: str = "locked") -> None:
    add(f'<path d="{d}" class="route-base"/>')
    if state == "done":
        add(f'<path d="{d}" class="route-done"/>')
    elif state == "current":
        add(f'<path d="{d}" class="route-current"/>')


def make_page_relationship() -> str:
    global lines
    lines = []
    base_page(IMAGES["openday"], "02", "关系确立", "开放日之后，彼此的生活第一次真正重叠。", "02 / 08")
    # thin stepped track, inspired only by the information rhythm of the reference
    route("M110 520 H210 V545 H300", "done")
    route("M530 545 H710 V690 H850", "done")
    route("M850 690 V890 H710", "current")
    route("M710 890 H390 V1080 H260", "locked")
    route("M260 1080 V1280 H560", "locked")
    landmark(415, 545, 390, 250, IMAGES["openday"], "开放日", "关系确立 · 已完成", "done")
    small_node(850, 690, "你的，我的", "02", "done", "left")
    small_node(710, 890, "假期的消息", "03", "current", "right")
    small_node(260, 1080, "高级公寓的邀请", "04", "locked", "right")
    small_node(560, 1280, "棒棒糖·自动刷脸", "05", "locked", "right")
    # one selected-node cue, still not a card
    add('<text x="710" y="964" text-anchor="middle" font-size="17" letter-spacing="4" fill="#78B7FF">继续故事</text>')
    add('<path d="M675 980 H745" stroke="#78B7FF" stroke-opacity="0.48"/>')
    end_page("二", "关系确立", "02 / 08")
    path = OUT_DIR / "NagisHeart_StoryMap_Page_02_Relationship_v4.svg"
    path.write_text("\n".join(lines), encoding="utf-8")
    return str(path)


def make_page_elimination() -> str:
    global lines
    lines = []
    base_page(IMAGES["falling"], "03", "淘汰与重返", "刚确认彼此，就被赛程、失败与沉默推向远处。", "03 / 08")
    route("M95 465 H200 V520 H350", "done")
    route("M620 520 H855 V725 H910", "done")
    route("M910 725 V930 H720", "done")
    route("M720 930 H390 V1105 H270", "done")
    route("M270 1105 V1300 H470", "done")
    route("M470 1300 H700 V1440", "current")
    route("M700 1440 H820 V1515", "locked")
    small_node(200, 465, "NEL启程·闭关送别", "01", "done", "right")
    landmark(520, 520, 390, 250, IMAGES["falling"], "从高光到淘汰", "关键剧情 · 已完成", "done")
    small_node(910, 725, "Nagi做的咖喱饭", "03", "done", "left")
    small_node(720, 930, "被遗忘的生日", "04", "done", "left")
    small_node(270, 1105, "拥抱", "05", "done", "right")
    small_node(470, 1300, "亲密", "06", "current", "right")
    landmark(820, 1490, 340, 210, IMAGES["return"], "重返蓝色监狱", "尚未抵达", "locked")
    add('<text x="470" y="1370" text-anchor="middle" font-size="17" letter-spacing="4" fill="#78B7FF">当前小节</text>')
    end_page("三", "淘汰与重返", "03 / 08")
    path = OUT_DIR / "NagisHeart_StoryMap_Page_03_Elimination_v4.svg"
    path.write_text("\n".join(lines), encoding="utf-8")
    return str(path)


def make_page_worldcup() -> str:
    global lines
    lines = []
    base_page(IMAGES["worldcup"], "04", "世界杯", "从追加名单到生死局，他重新站回世界的视线中央。", "04 / 08")
    route("M95 500 H200 V540 H390", "done")
    route("M390 540 H820 V700", "done")
    route("M820 700 H760 V865 H700", "done")
    route("M360 865 H250 V1160 H410", "current")
    small_node(200, 500, "世界杯追加名单", "01", "done", "right")
    small_node(820, 700, "淘汰赛前训练·花环", "02", "done", "left")
    landmark(530, 865, 390, 250, IMAGES["worldcup"], "生死局·世界看见他", "关键剧情 · 已完成", "done")
    small_node(410, 1160, "豪门来信", "04", "current", "right")
    add('<text x="410" y="1232" text-anchor="middle" font-size="17" letter-spacing="4" fill="#78B7FF">继续故事</text>')
    add('<path d="M374 1248 H446" stroke="#78B7FF" stroke-opacity="0.48"/>')
    end_page("四", "世界杯", "04 / 08")
    path = OUT_DIR / "NagisHeart_StoryMap_Page_04_WorldCup_v4.svg"
    path.write_text("\n".join(lines), encoding="utf-8")
    return str(path)


def make_page_world_center() -> str:
    global lines
    lines = []
    base_page(IMAGES["manchester_night"], "08", "世界中心", "同一个春天，通向三种不同的未来。", "08 / 08")
    # common gate and route split
    route("M540 590 V720", "done")
    landmark(540, 500, 410, 230, IMAGES["manchester_night"], "假期结束·春季名单", "最终路线选择 · 已完成", "done")
    add(f'<polygon points="{pentagon(540, 720, 22)}" fill="#091522" stroke="#D7BE86" stroke-width="3" filter="url(#gold-glow)"/>')
    add('<circle cx="540" cy="720" r="5" fill="#D7BE86"/>')
    add('<text x="540" y="763" text-anchor="middle" font-size="16" letter-spacing="4" fill="#D7BE86">路线已选择</text>')

    # three route entrances; only Dream is expanded on this screen
    add('<path d="M540 720 H245 V830" fill="none" stroke="#9290E8" stroke-width="3" stroke-opacity="0.88"/>')
    add('<path d="M540 720 H760 V825" fill="none" stroke="#D7BE86" stroke-width="2" stroke-opacity="0.28"/>')
    add('<path d="M540 720 H920 V980" fill="none" stroke="#D98278" stroke-width="2" stroke-opacity="0.24"/>')
    add('<text x="245" y="807" text-anchor="middle" font-size="18" letter-spacing="4" fill="#AAA7FF">世界第一</text>')
    add('<text x="760" y="807" text-anchor="middle" font-size="18" letter-spacing="4" fill="#B7A77F">陪我</text>')
    add('<text x="920" y="962" text-anchor="middle" font-size="18" letter-spacing="4" fill="#A9706D">抓住我</text>')

    # collapsed, unselected routes
    add(f'<polygon points="{pentagon(760, 850, 15)}" fill="#091522" stroke="#D7BE86" stroke-opacity="0.42" stroke-width="2"/>')
    add('<text x="760" y="891" text-anchor="middle" font-size="19" fill="#8C8065">日常线 · 5节</text>')
    add('<text x="760" y="921" text-anchor="middle" font-size="15" letter-spacing="3" fill="#6C7480">未展开</text>')
    add(f'<polygon points="{pentagon(920, 1005, 15)}" fill="#091522" stroke="#D98278" stroke-opacity="0.38" stroke-width="2"/>')
    add('<text x="920" y="1046" text-anchor="middle" font-size="19" fill="#8D6665">野心线 · 7节</text>')
    add('<text x="920" y="1076" text-anchor="middle" font-size="15" letter-spacing="3" fill="#6C7480">未展开</text>')

    # selected Dream route unfolds into its independent sections
    add('<path d="M245 830 V900 H285" fill="none" stroke="#9290E8" stroke-width="3"/>')
    small_node(285, 900, "没有你的世界", "D1", "done", "right")
    add('<path d="M285 900 V1010 H350" fill="none" stroke="#9290E8" stroke-width="3"/>')
    landmark(485, 1070, 350, 215, IMAGES["dream_match"], "他的名字", "梦想线 · 当前剧情", "current")
    add('<path d="M485 1178 V1260 H280" fill="none" stroke="#78B7FF" stroke-width="3" stroke-dasharray="10 8"/>')
    small_node(280, 1260, "看台上的庆祝", "D3", "locked", "right")
    add('<path d="M280 1260 V1375 H455" fill="none" stroke="#DCE4ED" stroke-opacity="0.20" stroke-width="2"/>')
    small_node(455, 1375, "久别重逢", "D4", "locked", "right")
    add('<path d="M455 1375 H705 V1480" fill="none" stroke="#DCE4ED" stroke-opacity="0.20" stroke-width="2"/>')
    small_node(705, 1480, "花园别墅·秘密基地", "D5", "locked", "left")
    add('<path d="M705 1480 V1570 H790" fill="none" stroke="#DCE4ED" stroke-opacity="0.20" stroke-width="2"/>')
    landmark(820, 1600, 300, 170, IMAGES["true_end"], "世界第一，与你", "终局地标", "locked")
    add('<text x="485" y="1218" text-anchor="middle" font-size="17" letter-spacing="4" fill="#78B7FF">继续梦想线</text>')

    end_page("八", "世界中心", "08 / 08")
    path = OUT_DIR / "NagisHeart_StoryMap_Page_08_WorldCenter_v4.svg"
    path.write_text("\n".join(lines), encoding="utf-8")
    return str(path)


def overview_landmark(
    cx: float,
    cy: float,
    w: float,
    h: float,
    image_uri: str,
    chapter: str,
    title: str,
    state: str,
    focus: str = "xMidYMid",
    zoom: float = 1.0,
    offset_x: float = 0.0,
    offset_y: float = 0.0,
) -> None:
    x, y = cx - w / 2, cy - h / 2
    d = cut_path(x, y, w, h, 22)
    clip_id = f"overview_clip_{int(cx)}_{int(cy)}"
    accent = {"played": "#D7BE86", "unplayed": "#536174"}[state]
    add(f'<clipPath id="{clip_id}"><path d="{d}"/></clipPath>')
    glow = ' filter="url(#gold-glow)"' if state == "played" else ""
    image_x = x - w * (zoom - 1) / 2 + offset_x
    image_y = y - h * (zoom - 1) / 2 + offset_y
    image_w = w * zoom
    image_h = h * zoom
    add(f'<g{glow}>')
    if state == "played":
        add(
            f'<image href="{image_uri}" x="{image_x}" y="{image_y}" width="{image_w}" height="{image_h}" '
            f'preserveAspectRatio="{focus} slice" clip-path="url(#{clip_id})"/>'
        )
        add(
            f'<path d="{d}" fill="url(#image-shade)" stroke="{accent}" '
            f'stroke-opacity="0.76" stroke-width="2.2"/>'
        )
    else:
        # Locked chapters intentionally contain no image asset.
        add(f'<path d="{d}" fill="#101B2A" fill-opacity="0.78" stroke="{accent}" stroke-opacity="0.34" stroke-width="1.6"/>')
        add(f'<path d="M{x+18},{y+h*0.30} C{x+w*0.34},{y+h*0.12} {x+w*0.66},{y+h*0.64} {x+w-18},{y+h*0.34}" fill="none" stroke="#9AABBE" stroke-opacity="0.10" stroke-width="1.4" clip-path="url(#{clip_id})"/>')
        add(f'<path d="M{x+18},{y+h*0.48} C{x+w*0.34},{y+h*0.30} {x+w*0.66},{y+h*0.82} {x+w-18},{y+h*0.52}" fill="none" stroke="#9AABBE" stroke-opacity="0.08" stroke-width="1.2" clip-path="url(#{clip_id})"/>')
        add(f'<polygon points="{pentagon(cx, cy-13, 23)}" fill="none" stroke="#78889C" stroke-opacity="0.24" stroke-width="1.5"/>')
        add(f'<circle cx="{cx}" cy="{cy-13}" r="4" fill="#78889C" fill-opacity="0.28"/>')
    add(
        f'<text x="{x+22}" y="{y+h-48}" font-size="13" letter-spacing="3" '
        f'fill="{accent}">{escape(chapter)}</text>'
    )
    add(
        f'<text x="{x+22}" y="{y+h-17}" class="serif" font-size="25" '
        f'font-weight="650" fill="#FFF8E9">{escape(title)}</text>'
    )
    add('</g>')


def make_overview() -> str:
    global lines
    lines = []
    base_page(
        IMAGES["worldcup"],
        "总览",
        "他的世界，正在展开",
        "走过的故事会亮起来。点击亮起的章节，靠近那段记忆。",
        "65 小节",
    )
    # A single winding journey. It reads as one large map rather than eight tiles.
    add('<path d="M170 490 C360 430 600 455 790 565 C920 642 900 770 725 820 C535 875 250 805 175 945 C105 1075 285 1170 520 1160 C760 1150 930 1230 875 1370 C828 1490 650 1530 470 1480 C315 1435 190 1480 175 1605" fill="none" stroke="#DCE4ED" stroke-opacity="0.17" stroke-width="2"/>')
    add('<path d="M170 490 C360 430 600 455 790 565 C920 642 900 770 725 820" fill="none" stroke="#D7BE86" stroke-opacity="0.88" stroke-width="3" filter="url(#gold-glow)"/>')
    add('<path d="M725 820 C535 875 250 805 175 945" fill="none" stroke="#D7BE86" stroke-opacity="0.88" stroke-width="3" filter="url(#gold-glow)"/>')

    overview_landmark(205, 470, 265, 155, IMAGES["chapter_01"], "第一部", "初见", "played")
    overview_landmark(525, 520, 285, 165, IMAGES["chapter_02"], "第二部", "关系确立", "played")
    overview_landmark(820, 665, 270, 160, IMAGES["chapter_03"], "第三部", "淘汰与重返", "played")
    overview_landmark(555, 865, 330, 195, IMAGES["chapter_04"], "第四部", "世界杯", "played")

    overview_landmark(205, 1135, 275, 160, IMAGES["chapter_05"], "第五部", "？？？？？？？", "unplayed")
    overview_landmark(715, 1215, 285, 165, IMAGES["chapter_06"], "第六部", "？？？？", "unplayed")
    overview_landmark(850, 1435, 270, 160, IMAGES["chapter_07"], "第七部", "？？？？？", "unplayed")
    overview_landmark(330, 1545, 300, 175, IMAGES["chapter_08"], "第八部", "？？？？", "unplayed")

    add('<text x="72" y="1788" font-size="15" letter-spacing="3" fill="#8D99A9">点击章节，图片将拉近并展开全部小节</text>')
    add('</svg>')
    path = OUT_DIR / "NagisHeart_StoryMap_Overview_v4.svg"
    path.write_text("\n".join(lines), encoding="utf-8")
    return str(path)


if __name__ == "__main__":
    print(make_page_relationship())
    print(make_page_elimination())
    print(make_page_worldcup())
    print(make_page_world_center())
    print(make_overview())
