from __future__ import annotations

import base64
import json
import math
import mimetypes
import random
from pathlib import Path
from xml.sax.saxutils import escape


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = Path(__file__).resolve().parent
SVG_PATH = OUT_DIR / "NagisHeart_Story_Memory_Garden_XoXo_v3.svg"
CHAPTERS = json.loads((ROOT / "story-data" / "chapters.json").read_text(encoding="utf-8"))
CHAPTER_BY_ID = {chapter["id"]: chapter for chapter in CHAPTERS}
BG_DIR = ROOT / "assets" / "bg"

W = 4096
H = 4096
lines: list[str] = []
random.seed(20260724)


def add(value: str) -> None:
    lines.append(value)


def data_uri(filename: str) -> str:
    path = BG_DIR / filename
    mime = mimetypes.guess_type(path.name)[0] or "image/jpeg"
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode("ascii")


KEY_IMAGES = {
    "c1a": "first_meet.png",
    "c3": "openday.jpg",
    "c6a": "falling_down.jpg",
    "side_b_return": "living_room.jpg",
    "wc_keygoal": "bg_u20j_worldcup_goal_kick.jpg",
    "mt3": "pillow.jpg",
    "transfer_contract": "bg_bluelock_meeting_contract_room.png",
    "e_agency_launch": "bg_agency_launch_stage.png",
    "p8_route": "bg_manchester_bedroom_city_night.jpg",
    "dream_match": "bg_bad_impact_kick_cutin.jpg",
    "dream_final": "true_end.jpg",
    "stay_final": "bg_stay_final_tv_glow_living_room.png",
    "bad_match": "king.jpg",
    "bad_far": "goal_faraway.jpg",
}
IMAGE_DATA = {key: data_uri(filename) for key, filename in KEY_IMAGES.items()}

PLAYED = {
    "p1", "p2", "c1a", "c1b", "u20j",
    "c3", "e_lemontea", "c2", "e_invite", "e_lolly",
    "e_depart", "c6a", "e_curry", "e_bday", "e_hug", "e_intimate", "side_b_return",
    "wc_roster", "wc_interval", "wc_keygoal",
}
CURRENT = "wc_offer"


def status(chapter_id: str, node_id: str) -> str:
    if chapter_id == "prologue" or node_id in PLAYED:
        return "played"
    if node_id == CURRENT:
        return "current"
    return "locked"


nodes: dict[str, dict] = {}


def register(chapter_id: str, index: int, point: tuple[float, float], scope: str | None = None) -> str:
    section = CHAPTER_BY_ID[chapter_id]["sections"][index]
    key = f"{chapter_id}:{index}:{section['startNode']}"
    nodes[key] = {
        "key": key,
        "chapter_id": chapter_id,
        "index": index,
        "title": section["title"],
        "node_id": section["startNode"],
        "x": point[0],
        "y": point[1],
        "scope": scope or section.get("scope"),
        "status": status(chapter_id, section["startNode"]),
        "is_key": section["startNode"] in KEY_IMAGES,
    }
    return key


GROUPS: dict[str, list[str]] = {}

# An organic, clockwise memory trail. Every catalog section receives one point.
GROUPS["part1"] = [
    register("prologue", 0, (360, 610)),
    register("part1", 0, (610, 470)),
    register("part1", 1, (900, 520)),
    register("part1", 2, (1130, 700)),
    register("part1", 3, (980, 930)),
    register("part1", 4, (680, 1010)),
]
GROUPS["part2"] = [
    register("part2", 0, (830, 1210)),
    register("part2", 1, (1070, 1380)),
    register("part2", 2, (1360, 1320)),
    register("part2", 3, (1530, 1100)),
    register("part2", 4, (1700, 860)),
]
GROUPS["part3"] = [
    register("part3", 0, (1930, 700)),
    register("part3", 1, (2220, 610)),
    register("part3", 2, (2500, 720)),
    register("part3", 3, (2670, 950)),
    register("part3", 4, (2500, 1180)),
    register("part3", 5, (2190, 1220)),
    register("part3", 6, (1980, 1400)),
]
GROUPS["part4"] = [
    register("part4", 0, (2170, 1590)),
    register("part4", 1, (2460, 1700)),
    register("part4", 2, (2760, 1580)),
    register("part4", 3, (2980, 1780)),
]
GROUPS["part5"] = [
    register("part5", 0, (3180, 1990)),
    register("part5", 1, (3060, 2240)),
    register("part5", 2, (2820, 2390)),
    register("part5", 3, (2540, 2320)),
    register("part5", 4, (2280, 2180)),
    register("part5", 5, (2040, 2310)),
    register("part5", 6, (1900, 2530)),
    register("part5", 7, (1670, 2630)),
    register("part5", 8, (1420, 2490)),
    register("part5", 9, (1260, 2280)),
    register("part5", 10, (1030, 2170)),
]
GROUPS["part6"] = [
    register("part6", 0, (800, 2290)),
    register("part6", 1, (590, 2470)),
    register("part6", 2, (500, 2710)),
    register("part6", 3, (650, 2920)),
    register("part6", 4, (900, 3000)),
    register("part6", 5, (1110, 2860)),
    register("part6", 6, (1280, 3050)),
]

# Part 7 grows as two emotional tendrils.
P7_COMMON = register("part7", 0, (1010, 3260))
P7_M = [
    register("part7", 1, (1240, 3400), "M"),
    register("part7", 2, (1530, 3440), "M"),
]
P7_J = [
    register("part7", 3, (1130, 3550), "J"),
    register("part7", 4, (1390, 3690), "J"),
    register("part7", 5, (1690, 3680), "J"),
]
GROUPS["part7"] = [P7_COMMON] + P7_M + P7_J

# Part 8 blossoms into three ending gardens.
P8_COMMON = register("part8", 0, (2030, 3350), "common")
P8_DREAM = [
    register("part8", 1, (2200, 3520), "dream"),
    register("part8", 2, (1980, 3690), "dream"),
    register("part8", 3, (1660, 3740), "dream"),
    register("part8", 4, (1370, 3820), "dream"),
    register("part8", 5, (1030, 3740), "dream"),
    register("part8", 6, (690, 3880), "dream"),
]
P8_STAY = [
    register("part8", 7, (2310, 3540), "stay"),
    register("part8", 8, (2510, 3680), "stay"),
    register("part8", 9, (2740, 3760), "stay"),
    register("part8", 10, (2990, 3670), "stay"),
    register("part8", 11, (3180, 3860), "stay"),
]
P8_BAD = [
    register("part8", 12, (2350, 3450), "bad"),
    register("part8", 13, (2630, 3460), "bad"),
    register("part8", 14, (2900, 3340), "bad"),
    register("part8", 15, (3180, 3440), "bad"),
    register("part8", 16, (3410, 3590), "bad"),
    register("part8", 17, (3670, 3510), "bad"),
    register("part8", 18, (3860, 3790), "bad"),
]

assert len(nodes) == 65, f"Expected 65 independent section nodes, got {len(nodes)}"


def bezier_segment(a: dict, b: dict, index: int = 0) -> str:
    x1, y1, x2, y2 = a["x"], a["y"], b["x"], b["y"]
    dx, dy = x2 - x1, y2 - y1
    length = max(1.0, math.hypot(dx, dy))
    nx, ny = -dy / length, dx / length
    bend = (32 + min(70, length * 0.12)) * (1 if index % 2 == 0 else -1)
    c1x, c1y = x1 + dx * 0.34 + nx * bend, y1 + dy * 0.34 + ny * bend
    c2x, c2y = x1 + dx * 0.68 + nx * bend, y1 + dy * 0.68 + ny * bend
    return f"M{x1:.1f},{y1:.1f} C{c1x:.1f},{c1y:.1f} {c2x:.1f},{c2y:.1f} {x2:.1f},{y2:.1f}"


def draw_memory_thread(a_key: str, b_key: str, index: int = 0, route: str = "main") -> None:
    a, b = nodes[a_key], nodes[b_key]
    d = bezier_segment(a, b, index)
    add(f'<path d="{d}" class="thread-shadow"/>')
    if b["status"] == "played":
        add(f'<path d="{d}" class="thread-lit"/>')
    elif b["status"] == "current":
        add(f'<path d="{d}" class="thread-current"/>')
    elif route == "dream":
        add(f'<path d="{d}" class="thread-dream"/>')
    elif route == "stay":
        add(f'<path d="{d}" class="thread-stay"/>')
    elif route == "bad":
        add(f'<path d="{d}" class="thread-bad"/>')


def blob_path(cx: float, cy: float, w: float, h: float, variant: int) -> str:
    wobble = [0.05, -0.035, 0.025, -0.045][variant % 4]
    x0, x1 = cx - w / 2, cx + w / 2
    y0, y1 = cy - h / 2, cy + h / 2
    return (
        f"M {cx - w * 0.34:.1f} {y0 + h * 0.03:.1f} "
        f"C {cx - w * 0.05:.1f} {y0 - h * wobble:.1f}, {cx + w * 0.30:.1f} {y0 + h * 0.01:.1f}, {x1 - w * 0.03:.1f} {cy - h * 0.16:.1f} "
        f"C {x1 + w * wobble:.1f} {cy + h * 0.15:.1f}, {x1 - w * 0.10:.1f} {y1 - h * 0.02:.1f}, {cx + w * 0.15:.1f} {y1:.1f} "
        f"C {cx - w * 0.20:.1f} {y1 + h * wobble:.1f}, {x0 + w * 0.02:.1f} {y1 - h * 0.16:.1f}, {x0:.1f} {cy + h * 0.02:.1f} "
        f"C {x0 - w * wobble:.1f} {cy - h * 0.22:.1f}, {x0 + w * 0.06:.1f} {y0 + h * 0.10:.1f}, {cx - w * 0.34:.1f} {y0 + h * 0.03:.1f} Z"
    )


def split_title(text: str, limit: int = 11) -> tuple[str, str]:
    if len(text) <= limit:
        return text, ""
    for separator in ("·", "／", "/", "，"):
        if separator in text:
            left, right = text.split(separator, 1)
            if len(left) <= limit + 2:
                return left + separator, right
    return text[:limit], text[limit:]


def flower(cx: float, cy: float, radius: float, fill: str, stroke: str, opacity: float) -> None:
    add(f'<g opacity="{opacity}">')
    for angle in range(0, 360, 72):
        rad = math.radians(angle)
        px = cx + math.cos(rad) * radius * 0.72
        py = cy + math.sin(rad) * radius * 0.72
        add(f'<ellipse cx="{px:.1f}" cy="{py:.1f}" rx="{radius * 0.45:.1f}" ry="{radius * 0.70:.1f}" transform="rotate({angle + 90} {px:.1f} {py:.1f})" fill="{fill}" stroke="{stroke}" stroke-width="2"/>')
    add(f'<circle cx="{cx}" cy="{cy}" r="{radius * 0.34}" fill="{stroke}"/>')
    add('</g>')


def star(cx: float, cy: float, r: float, fill: str, stroke: str, opacity: float) -> None:
    pts = []
    for i in range(8):
        angle = -math.pi / 2 + i * math.pi / 4
        rr = r if i % 2 == 0 else r * 0.32
        pts.append(f"{cx + math.cos(angle) * rr:.1f},{cy + math.sin(angle) * rr:.1f}")
    add(f'<polygon points="{" ".join(pts)}" fill="{fill}" stroke="{stroke}" stroke-width="2" opacity="{opacity}"/>')


def pearl(cx: float, cy: float, r: float, fill: str, stroke: str, opacity: float) -> None:
    add(f'<g opacity="{opacity}"><circle cx="{cx}" cy="{cy}" r="{r + 9}" fill="none" stroke="{stroke}" stroke-opacity="0.22" stroke-width="3"/>')
    add(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="3"/>')
    add(f'<circle cx="{cx - r * 0.28}" cy="{cy - r * 0.30}" r="{r * 0.24}" fill="#FFFFFF" fill-opacity="0.60"/></g>')


def charm(cx: float, cy: float, r: float, fill: str, stroke: str, opacity: float) -> None:
    add(f'<g opacity="{opacity}"><path d="M {cx:.1f} {cy-r:.1f} C {cx+r:.1f} {cy-r*0.65:.1f}, {cx+r*0.75:.1f} {cy+r*0.70:.1f}, {cx:.1f} {cy+r:.1f} C {cx-r*0.75:.1f} {cy+r*0.70:.1f}, {cx-r:.1f} {cy-r*0.65:.1f}, {cx:.1f} {cy-r:.1f} Z" fill="{fill}" stroke="{stroke}" stroke-width="3"/>')
    add(f'<circle cx="{cx}" cy="{cy}" r="{r * 0.20}" fill="{stroke}"/></g>')


def draw_small_node(node: dict, variant: int) -> None:
    state = node["status"]
    if state == "played":
        fill, stroke, text, opacity = "#F2D994", "#FFF0B7", "#F8EDD2", 1.0
    elif state == "current":
        fill, stroke, text, opacity = "#79C5FF", "#CBEAFF", "#EAF7FF", 1.0
    else:
        route_color = {"dream": "#A58CFF", "stay": "#D7BE86", "bad": "#F18B7C"}.get(node.get("scope"), "#43516A")
        fill, stroke, text, opacity = "#111B2A", route_color, "#657188", 0.72
    if state == "current":
        add(f'<circle cx="{node["x"]}" cy="{node["y"]}" r="54" fill="none" stroke="#79C5FF" stroke-opacity="0.18" stroke-width="10" filter="url(#blue-glow)"/>')
        add(f'<circle cx="{node["x"]}" cy="{node["y"]}" r="39" fill="none" stroke="#79C5FF" stroke-opacity="0.55" stroke-width="4"/>')
    shape = variant % 4
    if shape == 0:
        flower(node["x"], node["y"], 23, fill, stroke, opacity)
    elif shape == 1:
        star(node["x"], node["y"], 30, fill, stroke, opacity)
    elif shape == 2:
        pearl(node["x"], node["y"], 20, fill, stroke, opacity)
    else:
        charm(node["x"], node["y"], 25, fill, stroke, opacity)
    label_right = node["x"] < 2050
    tx = node["x"] + (46 if label_right else -46)
    anchor = "start" if label_right else "end"
    line1, line2 = split_title(node["title"], 10)
    add(f'<text x="{tx}" y="{node["y"] - (6 if line2 else -5)}" text-anchor="{anchor}" class="node-label" fill="{text}" opacity="{opacity}">{escape(line1)}</text>')
    if line2:
        add(f'<text x="{tx}" y="{node["y"] + 23}" text-anchor="{anchor}" class="node-label node-label-small" fill="{text}" opacity="{opacity}">{escape(line2)}</text>')


def draw_key_node(node: dict, variant: int) -> None:
    state = node["status"]
    scope = node.get("scope")
    accent = {
        "played": "#F0D38A",
        "current": "#79C5FF",
        "locked": {"dream": "#A58CFF", "stay": "#D7BE86", "bad": "#F18B7C"}.get(scope, "#748197"),
    }[state]
    w, h = (330, 245) if node["node_id"] not in ("p8_route",) else (380, 280)
    d = blob_path(node["x"], node["y"], w, h, variant)
    clip_id = "memory_" + node["key"].replace(":", "_")
    add(f'<clipPath id="{clip_id}"><path d="{d}"/></clipPath>')
    add(f'<g{" filter=\"url(#gold-glow)\"" if state == "played" else ""}>')
    image_filter = ' filter="url(#sleeping-memory)"' if state == "locked" else ""
    add(f'<image href="{IMAGE_DATA[node["node_id"]]}" x="{node["x"]-w/2}" y="{node["y"]-h/2}" width="{w}" height="{h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#{clip_id})"{image_filter}/>')
    add(f'<path d="{d}" fill="url(#memory-shade)" stroke="{accent}" stroke-opacity="{0.95 if state != "locked" else 0.52}" stroke-width="{4 if state == "current" else 3}"/>')
    # tiny drifting gold leaves instead of a UI badge
    add(f'<path d="M {node["x"]-w*0.34:.1f} {node["y"]-h*0.37:.1f} q-28 -34 -54 -4 q30 15 54 4" fill="{accent}" fill-opacity="0.72"/>')
    add(f'<circle cx="{node["x"]-w*0.34:.1f}" cy="{node["y"]-h*0.37:.1f}" r="6" fill="{accent}"/>')
    line1, line2 = split_title(node["title"], 11)
    ty = node["y"] + h * 0.28 - (17 if line2 else 0)
    add(f'<text x="{node["x"]}" y="{ty:.1f}" text-anchor="middle" class="memory-title" fill="#FFF9EC">{escape(line1)}</text>')
    if line2:
        add(f'<text x="{node["x"]}" y="{ty+34:.1f}" text-anchor="middle" class="memory-title memory-title-small" fill="#FFF9EC">{escape(line2)}</text>')
    if state == "locked":
        add(f'<text x="{node["x"]}" y="{node["y"]-h*0.28:.1f}" text-anchor="middle" class="sleep-label" fill="{accent}">沉睡的记忆</text>')
    add('</g>')


add(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">')
add('<style>')
add("text { font-family: 'Noto Serif CJK SC', 'Songti SC', 'SimSun', serif; }")
add(".map-title { font-size: 72px; font-weight: 650; letter-spacing: 6px; }")
add(".map-sub { font-size: 24px; letter-spacing: 3px; }")
add(".chapter-name { font-size: 34px; font-weight: 650; letter-spacing: 4px; paint-order: stroke; stroke: #07101B; stroke-width: 8px; stroke-opacity: 0.65; }")
add(".chapter-time { font-size: 18px; letter-spacing: 2px; }")
add(".node-label { font-size: 21px; font-weight: 600; paint-order: stroke; stroke: #07101B; stroke-width: 6px; stroke-opacity: 0.78; }")
add(".node-label-small { font-size: 17px; font-weight: 500; }")
add(".memory-title { font-size: 31px; font-weight: 700; paint-order: stroke; stroke: #06101A; stroke-width: 8px; stroke-opacity: 0.88; }")
add(".memory-title-small { font-size: 25px; }")
add(".sleep-label { font-size: 16px; letter-spacing: 4px; }")
add(".thread-shadow { fill: none; stroke: #25344C; stroke-opacity: 0.36; stroke-width: 15; stroke-linecap: round; }")
add(".thread-lit { fill: none; stroke: url(#gold-thread); stroke-width: 7; stroke-linecap: round; filter: url(#gold-glow); }")
add(".thread-current { fill: none; stroke: #79C5FF; stroke-width: 8; stroke-dasharray: 18 15; stroke-linecap: round; filter: url(#blue-glow); }")
add(".thread-dream { fill: none; stroke: #A58CFF; stroke-opacity: 0.32; stroke-width: 6; stroke-linecap: round; }")
add(".thread-stay { fill: none; stroke: #D7BE86; stroke-opacity: 0.30; stroke-width: 6; stroke-linecap: round; }")
add(".thread-bad { fill: none; stroke: #F18B7C; stroke-opacity: 0.30; stroke-width: 6; stroke-linecap: round; }")
add('</style>')
add('<defs>')
add('<linearGradient id="night" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#06101B"/><stop offset="42%" stop-color="#102744"/><stop offset="72%" stop-color="#16233A"/><stop offset="100%" stop-color="#070C16"/></linearGradient>')
add('<radialGradient id="wash-blue"><stop offset="0%" stop-color="#4386C5" stop-opacity="0.22"/><stop offset="100%" stop-color="#4386C5" stop-opacity="0"/></radialGradient>')
add('<radialGradient id="wash-rose"><stop offset="0%" stop-color="#D5849B" stop-opacity="0.15"/><stop offset="100%" stop-color="#D5849B" stop-opacity="0"/></radialGradient>')
add('<radialGradient id="wash-violet"><stop offset="0%" stop-color="#806ED0" stop-opacity="0.16"/><stop offset="100%" stop-color="#806ED0" stop-opacity="0"/></radialGradient>')
add('<linearGradient id="gold-thread" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#A98A4F"/><stop offset="45%" stop-color="#FFF0B7"/><stop offset="100%" stop-color="#D1A95D"/></linearGradient>')
add('<linearGradient id="memory-shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#06101A" stop-opacity="0.03"/><stop offset="52%" stop-color="#06101A" stop-opacity="0.12"/><stop offset="100%" stop-color="#06101A" stop-opacity="0.90"/></linearGradient>')
add('<filter id="gold-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>')
add('<filter id="blue-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="11" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>')
add('<filter id="sleeping-memory"><feColorMatrix type="saturate" values="0.1"/><feComponentTransfer><feFuncA type="linear" slope="0.28"/></feComponentTransfer></filter>')
add('<filter id="paper"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="8"/><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 .055 0"/></filter>')
add('</defs>')

# Painterly midnight paper.
add(f'<rect width="{W}" height="{H}" fill="url(#night)"/>')
add('<ellipse cx="850" cy="820" rx="900" ry="760" fill="url(#wash-blue)"/>')
add('<ellipse cx="2500" cy="2180" rx="1300" ry="1000" fill="url(#wash-rose)"/>')
add('<ellipse cx="2250" cy="3530" rx="1700" ry="720" fill="url(#wash-violet)"/>')
add(f'<rect width="{W}" height="{H}" filter="url(#paper)" opacity="0.45"/>')

# Stars and drifting dust.
for _ in range(175):
    x = random.randint(60, W - 60)
    y = random.randint(280, H - 80)
    r = random.choice([1.4, 1.8, 2.2, 3.0])
    color = random.choice(["#EFD89D", "#BFDFFF", "#FFFFFF", "#D7C9FF"])
    add(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{color}" opacity="{random.uniform(0.15, 0.55):.2f}"/>')

# Decorative moon and title.
add('<circle cx="3680" cy="285" r="105" fill="none" stroke="#F1DEAE" stroke-opacity="0.26" stroke-width="2"/>')
add('<circle cx="3722" cy="257" r="104" fill="#08131F"/>')
add('<path d="M3548 330 C3590 365 3630 372 3680 360" fill="none" stroke="#F1DEAE" stroke-opacity="0.24" stroke-width="2"/>')
add('<text x="170" y="148" class="map-title" fill="#FAF3E4">故事地图</text>')
add('<text x="174" y="196" class="map-sub" fill="#A9B9CC">走过的故事，会在夜色里一盏一盏亮起来</text>')
add('<text x="3750" y="430" text-anchor="middle" font-size="22" fill="#D8C79E">21 / 65</text>')
add('<text x="3750" y="460" text-anchor="middle" font-size="15" letter-spacing="4" fill="#7E8EA4">MEMORIES</text>')

# Watercolor "chapter weather" without containers.
chapter_washes = [
    (700, 720, 720, 560, "#2F6B9B", 0.12),
    (1250, 1160, 620, 500, "#BE8B77", 0.10),
    (2250, 900, 790, 580, "#45698B", 0.12),
    (2620, 1630, 720, 490, "#D0A34D", 0.08),
    (2300, 2280, 1250, 700, "#C6798F", 0.09),
    (760, 2670, 650, 650, "#455B93", 0.11),
    (1250, 3430, 760, 520, "#91A9C4", 0.07),
]
for cx, cy, rx, ry, color, opacity in chapter_washes:
    add(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{color}" opacity="{opacity}"/>')

# Chapter names float like place names on an illustrated atlas.
chapter_labels = [
    (240, 360, "序章 · 第一部", "相遇之前"),
    (860, 1050, "第二部", "关系确立"),
    (1900, 390, "第三部", "淘汰与重返"),
    (2720, 1370, "第四部", "世界杯"),
    (3150, 2470, "第五部", "同居夏天"),
    (340, 2260, "第六部", "曼城新星"),
    (560, 3290, "第七部", "东京冬日"),
    (2070, 3150, "第八部", "世界中心"),
]
for x, y, title, subtitle in chapter_labels:
    add(f'<text x="{x}" y="{y}" class="chapter-name" fill="#F2E8D2">{title}</text>')
    add(f'<text x="{x+3}" y="{y+34}" class="chapter-time" fill="#8293A8">{subtitle}</text>')

# Memory threads: main line, then emotional and ending tendrils.
main_sequence = GROUPS["part1"] + GROUPS["part2"] + GROUPS["part3"] + GROUPS["part4"] + GROUPS["part5"] + GROUPS["part6"] + [P7_COMMON]
for i, (a, b) in enumerate(zip(main_sequence, main_sequence[1:])):
    draw_memory_thread(a, b, i)
draw_memory_thread(P7_COMMON, P7_M[0], 0)
draw_memory_thread(P7_M[0], P7_M[1], 1)
draw_memory_thread(P7_COMMON, P7_J[0], 2)
draw_memory_thread(P7_J[0], P7_J[1], 3)
draw_memory_thread(P7_J[1], P7_J[2], 4)
draw_memory_thread(P7_M[-1], P8_COMMON, 1)
draw_memory_thread(P7_J[-1], P8_COMMON, 2)
for scope, group in (("dream", P8_DREAM), ("stay", P8_STAY), ("bad", P8_BAD)):
    draw_memory_thread(P8_COMMON, group[0], 0, scope)
    for i, (a, b) in enumerate(zip(group, group[1:])):
        draw_memory_thread(a, b, i + 1, scope)

# Small seasonal motifs: rose, fireworks, snow, football halo.
flower(1420, 2420, 34, "#8AA4C5", "#D8E3F2", 0.34)
flower(1320, 2230, 28, "#7E9EC4", "#BDD5F0", 0.28)
for angle in range(0, 360, 30):
    rad = math.radians(angle)
    x2 = 2850 + math.cos(rad) * 115
    y2 = 1520 + math.sin(rad) * 115
    add(f'<path d="M2850 1520 Q {(2850+x2)/2:.1f} {(1520+y2)/2-18:.1f} {x2:.1f} {y2:.1f}" stroke="#F3D692" stroke-opacity="0.22" stroke-width="3" fill="none"/>')
for _ in range(34):
    x = random.randint(650, 1800)
    y = random.randint(3150, 3850)
    add(f'<circle cx="{x}" cy="{y}" r="{random.choice([2,3,4])}" fill="#DCEAFF" opacity="{random.uniform(0.15,0.38):.2f}"/>')

# Nodes over threads.
for index, node in enumerate(nodes.values()):
    if node["is_key"]:
        draw_key_node(node, index)
    else:
        draw_small_node(node, index)

# Route captions live directly in the landscape.
add('<text x="1490" y="3540" text-anchor="middle" font-size="23" letter-spacing="4" fill="#A58CFF">见证他的世界</text>')
add('<text x="2740" y="3570" text-anchor="middle" font-size="23" letter-spacing="4" fill="#D7BE86">留在日常里</text>')
add('<text x="3330" y="3310" text-anchor="middle" font-size="23" letter-spacing="4" fill="#F18B7C">推向聚光灯</text>')

# Tiny poetic legend, no panel.
add('<g transform="translate(170 3995)">')
add('<circle cx="0" cy="0" r="9" fill="#F2D994"/><text x="25" y="7" font-size="18" fill="#9BA9BC">已经走过</text>')
add('<circle cx="190" cy="0" r="9" fill="#79C5FF"/><text x="215" y="7" font-size="18" fill="#9BA9BC">正在发生</text>')
add('<circle cx="405" cy="0" r="9" fill="#43516A"/><text x="430" y="7" font-size="18" fill="#9BA9BC">仍在沉睡</text>')
add('<text x="3700" y="7" text-anchor="end" font-size="15" letter-spacing="2" fill="#637187">DESIGN PREVIEW · 实机未解锁内容隐藏标题与画面</text>')
add('</g>')

add("</svg>")
SVG_PATH.write_text("\n".join(lines), encoding="utf-8")
print(SVG_PATH)
print(f"Independent story nodes: {len(nodes)}")
