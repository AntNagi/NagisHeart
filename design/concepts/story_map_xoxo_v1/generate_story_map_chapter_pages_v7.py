from __future__ import annotations

import base64
import mimetypes
from pathlib import Path
from xml.sax.saxutils import escape


ROOT = Path(__file__).resolve().parents[3]
OUT = Path(__file__).resolve().parent
BG = ROOT / "assets" / "bg"
COVERS = OUT / "covers"
SYSTEM_BG = (
    ROOT
    / "android"
    / "app"
    / "src"
    / "main"
    / "res"
    / "drawable-nodpi"
    / "splash_bg.png"
)
W = 1080
PAGE_H = 1920
svg: list[str] = []


def add(value: str) -> None:
    svg.append(value)


def uri(path: Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or "image/jpeg"
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode("ascii")


IMAGES = {
    "system": uri(SYSTEM_BG),
    "monitor_room": uri(BG / "bluelock_monitor_room.jpg"),
    "first_meet": uri(BG / "first_meet.png"),
    "meeting": uri(BG / "bg_c1a_bluelock_bench_meeting_temp.jpg"),
    "u20": uri(BG / "vs_u20_japan_kick.jpg"),
    "openday": uri(BG / "openday.jpg"),
    "lemontea": uri(BG / "lemontea.jpg"),
    "falling": uri(BG / "falling_down.jpg"),
    "hug": uri(BG / "hug.jpg"),
    "return": uri(BG / "living_room.jpg"),
    "worldcup": uri(BG / "bg_u20j_worldcup_goal_kick.jpg"),
    "qixi": uri(BG / "qixi.jpg"),
    "festival": uri(BG / "summer_festival.jpg"),
    "new_home": uri(BG / "new_home.jpg"),
    "manchester_living": uri(BG / "bg_manchester_living_piano.jpg"),
    "pitch": uri(BG / "pitch.jpg"),
    "bar": uri(BG / "bar.png"),
    "goal_faraway": uri(BG / "goal_faraway.jpg"),
    "press": uri(BG / "bg_club_media_press_room.png"),
    "halloween": uri(BG / "Halloween.jpg"),
    "agency": uri(BG / "bg_agency_launch_stage.png"),
    "scarf": uri(BG / "scarf.jpg"),
    "moody": uri(BG / "moody.jpg"),
    "manchester": uri(BG / "bg_manchester_bedroom_city_night.jpg"),
    "dream": uri(BG / "bg_bad_impact_kick_cutin.jpg"),
    "true_end": uri(BG / "true_end.jpg"),
    "stay": uri(BG / "bg_stay_final_tv_glow_living_room.png"),
    "bad_plan": uri(BG / "bg_bad_plan_data_war_room.png"),
    "bad_media": uri(BG / "bg_bad_afterglow_media_wall.png"),
    "bad_award": uri(BG / "bg_bad_far_award_broadcast.png"),
    "soft_gaze": uri(BG / "ending_true_nagi_soft_gaze.jpg"),
    "face_action": uri(BG / "微信图片_20260710215330_241_2.jpg"),
    "cover_01": uri(COVERS / "chapter_01.jpg"),
    "cover_02": uri(COVERS / "chapter_02.jpg"),
    "cover_03": uri(COVERS / "chapter_03.jpg"),
    "cover_04": uri(COVERS / "chapter_04.jpg"),
    "cover_05": uri(COVERS / "chapter_05.jpg"),
    "cover_06": uri(COVERS / "chapter_06.jpg"),
    "cover_07": uri(COVERS / "chapter_07.jpg"),
}


def cut_path(x: float, y: float, w: float, h: float, cut: float = 22) -> str:
    return (
        f"M{x + cut},{y} H{x + w - cut} L{x + w},{y + cut} "
        f"V{y + h - cut} L{x + w - cut},{y + h} H{x + cut} "
        f"L{x},{y + h - cut} V{y + cut} Z"
    )


def start_page(num: int, title: str, subtitle: str, height: int) -> None:
    global svg, PAGE_H
    svg = []
    PAGE_H = height
    add(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {PAGE_H}">')
    add(
        """<style>
text{font-family:'PingFang SC','Microsoft YaHei',sans-serif}
.serif{font-family:'Noto Serif CJK SC','Songti SC','SimSun',serif}
.kicker{font-size:18px;letter-spacing:4px;fill:#D7BE86}
.title{font-size:43px;font-weight:550;fill:#F4EEDF}
.subtitle{font-size:18px;fill:#9AA8BA}
.node-title{font-size:22px;font-weight:550;fill:#F4EEDF;paint-order:stroke;stroke:#07111E;stroke-width:5px;stroke-opacity:.8}
.node-index{font-size:13px;letter-spacing:2px;fill:#D7BE86}
.image-title{font-size:28px;font-weight:700;fill:#FFF8E9;paint-order:stroke;stroke:#07111E;stroke-width:7px;stroke-opacity:.88}
.image-sub{font-size:14px;letter-spacing:3px;fill:#D7BE86;paint-order:stroke;stroke:#07111E;stroke-width:5px;stroke-opacity:.82}
.route{fill:none;stroke:#D7BE86;stroke-width:2.6;stroke-opacity:.76;stroke-linecap:round;stroke-linejoin:round}
.route-soft{fill:none;stroke:#DCE4ED;stroke-width:1.4;stroke-opacity:.18;stroke-linecap:round}
</style>"""
    )
    add(
        """<defs>
<linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#132033" stop-opacity=".52"/><stop offset="42%" stop-color="#132033" stop-opacity=".34"/><stop offset="100%" stop-color="#132033" stop-opacity=".78"/></linearGradient>
<radialGradient id="vignette" cx="50%" cy="38%" r="72%"><stop offset="0%" stop-color="#132033" stop-opacity="0"/><stop offset="62%" stop-color="#132033" stop-opacity=".38"/><stop offset="100%" stop-color="#132033" stop-opacity=".72"/></radialGradient>
<linearGradient id="breath" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFFFFF" stop-opacity=".04"/><stop offset="18%" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="100%" stop-color="#FFFFFF" stop-opacity=".02"/></linearGradient>
<linearGradient id="button" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0F1827" stop-opacity=".34"/><stop offset="100%" stop-color="#0F1827" stop-opacity=".22"/></linearGradient>
<linearGradient id="imageShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#07111D" stop-opacity=".02"/><stop offset="55%" stop-color="#07111D" stop-opacity=".14"/><stop offset="100%" stop-color="#07111D" stop-opacity=".94"/></linearGradient>
<filter id="goldGlow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="shadow" x="-60%" y="-60%" width="220%" height="240%"><feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#000" flood-opacity=".42"/></filter>
</defs>"""
    )
    add(f'<rect width="{W}" height="{PAGE_H}" fill="#2A3747"/>')
    for y in range(0, PAGE_H, 1920):
        add(f'<image href="{IMAGES["system"]}" x="0" y="{y}" width="{W}" height="1920" preserveAspectRatio="xMidYMid slice"/>')
        add(f'<rect x="0" y="{y}" width="{W}" height="1920" fill="url(#shade)"/>')
        add(f'<rect x="0" y="{y}" width="{W}" height="1920" fill="url(#vignette)"/>')
        add(f'<rect x="0" y="{y}" width="{W}" height="1920" fill="url(#breath)"/>')
    back = cut_path(46, 44, 84, 84, 12)
    add(f'<path d="{back}" fill="url(#button)" stroke="#FFF" stroke-opacity=".12" filter="url(#shadow)"/>')
    add('<path d="M94 65 L72 86 L94 107" fill="none" stroke="#F7F9FC" stroke-opacity=".94" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>')
    add(f'<text x="72" y="227" class="kicker">CHAPTER {num:02d}</text>')
    add(f'<text x="72" y="283" class="serif title">{escape(title)}</text>')
    add(f'<text x="74" y="321" class="subtitle">{escape(subtitle)}</text>')
    add('<path d="M72 350 H1008" stroke="#FFFFFF" stroke-opacity=".08"/>')


def finish_page(num: int, title: str, filename: str) -> Path:
    nav_y = PAGE_H - 212
    d = cut_path(58, nav_y, 964, 150, 23)
    add(f'<path d="{d}" fill="#091522" fill-opacity=".88" stroke="#D7BE86" stroke-opacity=".24" stroke-width="1.5"/>')
    add(f'<path d="M90 {nav_y + 75} l18 -15 v30 z" fill="#D7BE86" fill-opacity=".62"/>')
    add(f'<path d="M990 {nav_y + 75} l-18 -15 v30 z" fill="#D7BE86" fill-opacity=".62"/>')
    add(f'<text x="540" y="{nav_y + 55}" text-anchor="middle" class="kicker">第 {num} 章</text>')
    add(f'<text x="540" y="{nav_y + 102}" text-anchor="middle" class="serif" font-size="29" fill="#F1E7D3">{escape(title)}</text>')
    add(f'<text x="540" y="{nav_y + 132}" text-anchor="middle" font-size="16" letter-spacing="3" fill="#8E9BAE">{num:02d} / 08</text>')
    add(f'<line x1="410" y1="{PAGE_H - 42}" x2="670" y2="{PAGE_H - 42}" stroke="#FFF" stroke-opacity=".12" stroke-width="3"/>')
    add(f'<line x1="410" y1="{PAGE_H - 42}" x2="{410 + 260 * num / 8:.1f}" y2="{PAGE_H - 42}" stroke="#D7BE86" stroke-width="3"/>')
    add('</svg>')
    path = OUT / filename
    path.write_text("\n".join(svg), encoding="utf-8")
    return path


def route(points: list[tuple[float, float]], soft: bool = False) -> None:
    if len(points) < 2:
        return
    d = f"M{points[0][0]},{points[0][1]} " + " ".join(f"L{x},{y}" for x, y in points[1:])
    add(f'<path d="{d}" class="{"route-soft" if soft else "route"}"/>')


def text_lines(x: float, y: float, value: str, css: str, anchor: str = "start", gap: int = 25) -> None:
    parts = value.split("\n")
    add(f'<text x="{x}" y="{y}" text-anchor="{anchor}" class="{css}">')
    for i, part in enumerate(parts):
        dy = 0 if i == 0 else gap
        add(f'<tspan x="{x}" dy="{dy}">{escape(part)}</tspan>')
    add('</text>')


def node(cx: float, cy: float, title: str, index: str, side: str = "right") -> None:
    add(f'<circle cx="{cx}" cy="{cy}" r="18" fill="#091522" stroke="#D7BE86" stroke-width="2.2" filter="url(#goldGlow)"/>')
    add(f'<circle cx="{cx}" cy="{cy}" r="4.5" fill="#D7BE86"/>')
    tx = cx + 35 if side == "right" else cx - 35
    anchor = "start" if side == "right" else "end"
    add(f'<text x="{tx}" y="{cy - 8}" text-anchor="{anchor}" class="node-index">{escape(index)}</text>')
    text_lines(tx, cy + 22, title, "node-title", anchor, 27)


def image_node(cx: float, cy: float, w: float, h: float, image: str, title: str, index: str, focus: str = "xMidYMid") -> None:
    x, y = cx - w / 2, cy - h / 2
    d = cut_path(x, y, w, h, 24)
    clip = f"clip_{len(svg)}"
    add(f'<clipPath id="{clip}"><path d="{d}"/></clipPath>')
    add('<g filter="url(#goldGlow)">')
    add(f'<image href="{IMAGES[image]}" x="{x}" y="{y}" width="{w}" height="{h}" preserveAspectRatio="{focus} slice" clip-path="url(#{clip})"/>')
    add(f'<path d="{d}" fill="url(#imageShade)" stroke="#D7BE86" stroke-opacity=".88" stroke-width="2.2"/>')
    add(f'<text x="{x + 22}" y="{y + h - 51}" class="image-sub">{escape(index)}</text>')
    add(f'<text x="{x + 22}" y="{y + h - 17}" class="serif image-title">{escape(title)}</text>')
    add('</g>')


def branch_item(cx: float, cy: float, title: str, index: str, image: str | None = None) -> None:
    if image:
        w, h = 280, 140
        x, y = cx - w / 2, cy - h / 2
        d = cut_path(x, y, w, h, 15)
        clip = f"branch_clip_{len(svg)}"
        add(f'<clipPath id="{clip}"><path d="{d}"/></clipPath>')
        if image in {"soft_gaze", "dream"}:
            focus = "xMidYMin"
        elif image in {"true_end", "goal_faraway"}:
            focus = "xMidYMax"
        else:
            focus = "xMidYMid"
        add(f'<image href="{IMAGES[image]}" x="{x}" y="{y}" width="{w}" height="{h}" preserveAspectRatio="{focus} slice" clip-path="url(#{clip})"/>')
        add(f'<path d="{d}" fill="url(#imageShade)" stroke="#D7BE86" stroke-opacity=".72" stroke-width="1.5"/>')
        add(f'<text x="{x + 12}" y="{y + 20}" font-size="11" letter-spacing="1.5" fill="#D7BE86">{escape(index)}</text>')
        text_lines(cx, y + h - 14, title, "node-title", "middle", 20)
    else:
        add(f'<circle cx="{cx}" cy="{cy}" r="12" fill="#091522" stroke="#D7BE86" stroke-width="1.7"/>')
        add(f'<circle cx="{cx}" cy="{cy}" r="3.5" fill="#D7BE86"/>')
        add(f'<text x="{cx}" y="{cy - 23}" text-anchor="middle" class="node-index">{escape(index)}</text>')
        text_lines(cx, cy + 34, title, "node-title", "middle", 20)


def page_1() -> Path:
    start_page(1, "初见", "从作战室到 U-20，日本第一次看见他的名字。", 2400)
    route([(100, 515), (330, 515), (330, 670), (810, 670), (810, 835), (610, 835), (610, 1080), (250, 1080), (250, 1330), (610, 1330), (610, 1710)])
    image_node(330, 550, 480, 280, "monitor_room", "作战室·初遇", "01")
    node(810, 760, "投资的私心", "02", "left")
    image_node(610, 1010, 500, 285, "first_meet", "会议室初见", "03")
    node(250, 1320, "不麻烦的人", "04", "right")
    image_node(610, 1660, 540, 305, "u20", "被日本看见", "05 · U-20 日本代表战", "xMidYMin")
    return finish_page(1, "初见", "NagisHeart_StoryMap_Page_01_FirstMeet_v7.svg")


def page_2() -> Path:
    start_page(2, "关系确立", "开放日之后，彼此的生活第一次真正重叠。", 2350)
    route([(100, 520), (340, 520), (340, 675), (800, 675), (800, 900), (650, 900), (650, 1160), (250, 1160), (250, 1430), (620, 1430), (620, 1740)])
    image_node(340, 550, 500, 290, "openday", "开放日", "01 · 关系确立")
    image_node(800, 825, 430, 250, "lemontea", "你的，我的", "02")
    node(650, 1110, "假期的消息", "03", "left")
    node(250, 1400, "高级公寓的邀请", "04", "right")
    node(620, 1710, "棒棒糖·自动刷脸", "05", "right")
    return finish_page(2, "关系确立", "NagisHeart_StoryMap_Page_02_Relationship_v7.svg")


def page_3() -> Path:
    start_page(3, "淘汰与重返", "刚确认彼此，就被赛程、失败与沉默推向远处。", 2750)
    route([(100, 500), (220, 500), (220, 650), (560, 650), (560, 830), (850, 830), (850, 1080), (670, 1080), (670, 1340), (250, 1340), (250, 1650), (520, 1650), (520, 1930), (820, 1930), (820, 2180)])
    node(220, 500, "NEL启程·闭关送别", "01", "right")
    image_node(560, 700, 500, 285, "falling", "从高光到淘汰", "02 · 聚少离多")
    node(850, 990, "Nagi做的咖喱饭", "03", "left")
    node(670, 1270, "被遗忘的生日", "04", "left")
    image_node(250, 1580, 430, 250, "hug", "拥抱", "05")
    node(520, 1880, "亲密", "06", "right")
    image_node(800, 2160, 440, 255, "return", "重返蓝色监狱", "07 · SIDE-B")
    return finish_page(3, "淘汰与重返", "NagisHeart_StoryMap_Page_03_Elimination_v7.svg")


def page_4() -> Path:
    start_page(4, "世界杯", "从追加名单到生死局，他重新站回世界的视线中央。", 2250)
    route([(100, 520), (220, 520), (220, 700), (810, 700), (810, 950), (540, 950), (540, 1320), (280, 1320), (280, 1660)])
    node(220, 520, "世界杯追加名单", "01", "right")
    node(810, 790, "淘汰赛前训练·花环", "02", "left")
    image_node(540, 1160, 600, 340, "worldcup", "世界看见他", "03 · 生死局")
    node(280, 1640, "豪门来信", "04", "right")
    return finish_page(4, "世界杯", "NagisHeart_StoryMap_Page_04_WorldCup_v7.svg")


def page_5() -> Path:
    start_page(5, "归来与同居", "日常越靠越近，盛夏也把下一次远行带到门前。", 3500)
    route([(100, 510), (320, 510), (320, 690), (820, 690), (820, 900), (620, 900), (620, 1110), (240, 1110), (240, 1340), (520, 1340), (520, 1570), (825, 1570), (825, 1810), (570, 1810), (570, 2110), (250, 2110), (250, 2500), (720, 2500), (720, 2800), (880, 2800), (880, 3130)])
    image_node(320, 550, 480, 280, "return", "沙发上的拥抱", "01 · 归来")
    node(820, 760, "同居·这里太舒服了", "02", "left")
    node(620, 1010, "同居·靠近\n客气的距离", "03", "left")
    node(240, 1260, "甜蜜同居·深夜等你", "04", "right")
    node(520, 1500, "酸奶与泡面哲学", "05 · 深夜", "right")
    node(825, 1740, "游戏冷战\nADC走脸事件", "06", "left")
    image_node(570, 2020, 470, 270, "qixi", "蓝色玫瑰与夏夜", "07 · 七夕")
    node(250, 2290, "微醺之夜", "08", "right")
    node(250, 2500, "早安赖床", "09", "right")
    image_node(720, 2800, 440, 255, "festival", "浴衣与烟火", "10 · 夏日祭")
    node(880, 3130, "夏窗·签约桌上的\n好麻烦", "11", "left")
    return finish_page(5, "归来与同居", "NagisHeart_StoryMap_Page_05_Homecoming_v7.svg")


def page_6() -> Path:
    start_page(6, "曼城", "陌生城市、语言与赛场，让两个人学会新的靠近方式。", 2750)
    route([(100, 510), (330, 510), (330, 690), (815, 690), (815, 940), (600, 940), (600, 1230), (235, 1230), (235, 1510), (560, 1510), (560, 1780), (830, 1780), (830, 2070), (430, 2070), (430, 2240)])
    image_node(330, 550, 500, 290, "manchester_living", "曼城·新的房间", "01")
    node(815, 790, "一个人的曼城", "02", "left")
    image_node(600, 1100, 500, 285, "pitch", "球不会等我", "03 · 耳机能翻译")
    node(235, 1420, "它翻译得很对\n但不像我", "04", "right")
    node(560, 1710, "读书之秋", "05", "right")
    image_node(830, 1990, 440, 255, "halloween", "专属恶魔", "06 · 万圣夜")
    node(430, 2250, "飙车实录", "07", "right")
    return finish_page(6, "曼城", "NagisHeart_StoryMap_Page_06_Manchester_v7.svg")


def page_7() -> Path:
    start_page(7, "假日与心意", "聚光灯之外，那些没说出口的心意在冬日里发热。", 2550)
    route([(100, 510), (340, 510), (340, 690), (820, 690), (820, 960), (620, 960), (620, 1250), (250, 1250), (250, 1540), (560, 1540), (560, 1810), (820, 1810), (820, 2040)])
    image_node(340, 550, 500, 290, "agency", "她站在光里", "01")
    image_node(820, 850, 430, 250, "scarf", "送围巾", "02")
    node(620, 1170, "还是感冒了", "03", "left")
    node(250, 1460, "任人打扮", "04", "right")
    node(560, 1740, "软饭王哲学", "05", "right")
    image_node(820, 2020, 440, 255, "bar", "借着醉意", "06")
    return finish_page(7, "假日与心意", "NagisHeart_StoryMap_Page_07_Holiday_v7.svg")


def page_8() -> Path:
    start_page(8, "世界中心", "同一个春天，通向三种不同的未来。", 3700)
    image_node(540, 500, 540, 300, "manchester", "假期结束·春季名单", "01 · 共同线")
    route([(540, 650), (540, 760), (180, 760), (180, 830)])
    route([(540, 760), (540, 830)])
    route([(540, 760), (900, 760), (900, 830)])
    add('<text x="180" y="810" text-anchor="middle" font-size="16" letter-spacing="4" fill="#D7BE86">DREAM · 世界第一</text>')
    add('<text x="540" y="810" text-anchor="middle" font-size="16" letter-spacing="4" fill="#D7BE86">STAY · 陪我</text>')
    add('<text x="900" y="810" text-anchor="middle" font-size="16" letter-spacing="4" fill="#D7BE86">BAD · 抓住我</text>')

    dream_y = [930, 1320, 1710, 2100, 2490, 2880]
    stay_y = [930, 1320, 1710, 2100, 2490]
    bad_y = [930, 1320, 1710, 2100, 2490, 2880, 3190]
    route([(180, 830), (180, 3270)], soft=True)
    route([(540, 830), (540, 3270)], soft=True)
    route([(900, 830), (900, 3270)], soft=True)

    dream = [
        ("没有你的世界", "D1", None),
        ("他的名字", "D2", "dream"),
        ("看台上的庆祝", "D3", None),
        ("久别重逢", "D4", None),
        ("花园别墅\n秘密基地", "D5", None),
        ("世界第一，与你", "D6", "true_end"),
    ]
    stay = [
        ("还不是今天", "S1", None),
        ("他常回来", "S2", None),
        ("暗爽\n可可白兰地", "S3", None),
        ("情人节玩偶熊", "S4", None),
        ("关掉的比赛录像", "S5", "stay"),
    ]
    bad = [
        ("优雅与世俗", "B1", None),
        ("他的名字\n由我来写", "B2", "bad_plan"),
        ("加冕之夜", "B3", None),
        ("全世界都看见你", "B4", "bad_media"),
        ("渐行渐远", "B5", None),
        ("我不是不想\n这样赢", "B6", None),
        ("远处的世界第一", "B7", "goal_faraway"),
    ]
    for y, item in zip(dream_y, dream):
        branch_item(180, y, *item)
    for y, item in zip(stay_y, stay):
        branch_item(540, y, *item)
    for y, item in zip(bad_y, bad):
        branch_item(900, y, *item)
    return finish_page(8, "世界中心", "NagisHeart_StoryMap_Page_08_WorldCenter_v7.svg")


if __name__ == "__main__":
    pages = [page_1(), page_2(), page_3(), page_4(), page_5(), page_6(), page_7(), page_8()]
    for page in pages:
        print(page)
