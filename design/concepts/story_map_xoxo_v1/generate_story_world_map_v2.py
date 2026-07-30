from __future__ import annotations

import base64
import json
import mimetypes
from pathlib import Path
from xml.sax.saxutils import escape


ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = Path(__file__).resolve().parent
CHAPTERS_PATH = ROOT / "story-data" / "chapters.json"
ASSETS_BG = ROOT / "assets" / "bg"
SVG_PATH = OUT_DIR / "NagisHeart_Story_World_Map_XoXo_v2.svg"

W = 4096
H = 4096
lines: list[str] = []


def add(value: str) -> None:
    lines.append(value)


def image_data_uri(filename: str) -> str:
    path = ASSETS_BG / filename
    mime = mimetypes.guess_type(path.name)[0] or "image/jpeg"
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


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

IMAGE_URIS = {node_id: image_data_uri(filename) for node_id, filename in KEY_IMAGES.items()}


chapters = json.loads(CHAPTERS_PATH.read_text(encoding="utf-8"))
chapter_by_id = {chapter["id"]: chapter for chapter in chapters}

all_section_keys: list[str] = []
for chapter in chapters:
    for index, section in enumerate(chapter["sections"]):
        all_section_keys.append(f'{chapter["id"]}:{index}:{section["startNode"]}')
assert len(all_section_keys) == 65, f"Expected 65 sections, got {len(all_section_keys)}"


PLAYED_NODE_IDS = {
    "p1", "p2", "c1a", "c1b", "u20j",
    "c3", "e_lemontea", "c2", "e_invite", "e_lolly",
    "e_depart", "c6a", "e_curry", "e_bday", "e_hug", "e_intimate", "side_b_return",
    "wc_roster", "wc_interval", "wc_keygoal",
}
CURRENT_NODE_ID = "wc_offer"


def node_status(chapter_id: str, index: int, node_id: str) -> str:
    if chapter_id == "prologue":
        return "played"
    if node_id in PLAYED_NODE_IDS:
        return "played"
    if node_id == CURRENT_NODE_ID:
        return "current"
    return "locked"


positions: dict[str, dict] = {}


def register_node(chapter_id: str, index: int, section: dict, cx: float, cy: float,
                  w: float, h: float, status: str | None = None) -> str:
    key = f'{chapter_id}:{index}:{section["startNode"]}'
    positions[key] = {
        "key": key,
        "chapter_id": chapter_id,
        "index": index,
        "node_id": section["startNode"],
        "title": section["title"],
        "cx": cx,
        "cy": cy,
        "w": w,
        "h": h,
        "status": status or node_status(chapter_id, index, section["startNode"]),
        "scope": section.get("scope"),
        "is_key": section["startNode"] in KEY_IMAGES,
    }
    return key


def snake_layout(chapter_id: str, zone: tuple[float, float, float, float], cols: int,
                 include_prologue: bool = False) -> list[str]:
    x, y, w, h = zone
    sections: list[tuple[str, int, dict]] = []
    if include_prologue:
        p = chapter_by_id["prologue"]["sections"][0]
        sections.append(("prologue", 0, p))
    chapter = chapter_by_id[chapter_id]
    sections.extend((chapter_id, i, section) for i, section in enumerate(chapter["sections"]))
    rows = (len(sections) + cols - 1) // cols
    left = x + 150
    right = x + w - 150
    top = y + 210
    bottom = y + h - 120
    x_step = 0 if cols == 1 else (right - left) / (cols - 1)
    y_step = 0 if rows == 1 else (bottom - top) / (rows - 1)
    result: list[str] = []
    for n, (real_chapter_id, index, section) in enumerate(sections):
        row = n // cols
        col_in_row = n % cols
        col = col_in_row if row % 2 == 0 else cols - 1 - col_in_row
        cx = left + col * x_step
        cy = top + row * y_step
        is_key = section["startNode"] in KEY_IMAGES
        node_w, node_h = ((330, 230) if is_key else (250, 112))
        result.append(register_node(real_chapter_id, index, section, cx, cy, node_w, node_h))
    return result


ZONES = {
    "part1": (140, 340, 1190, 790),
    "part2": (1453, 340, 1190, 790),
    "part3": (2766, 340, 1190, 790),
    "part4": (2766, 1245, 1190, 820),
    "part5": (1453, 1245, 1190, 1115),
    "part6": (140, 1245, 1190, 1115),
    "part7": (140, 2475, 1190, 1425),
    "part8": (1453, 2475, 2503, 1425),
}

sequence_groups: dict[str, list[str]] = {}
sequence_groups["part1"] = snake_layout("part1", ZONES["part1"], cols=3, include_prologue=True)
sequence_groups["part2"] = snake_layout("part2", ZONES["part2"], cols=3)
sequence_groups["part3"] = snake_layout("part3", ZONES["part3"], cols=3)
sequence_groups["part4"] = snake_layout("part4", ZONES["part4"], cols=2)
sequence_groups["part5"] = snake_layout("part5", ZONES["part5"], cols=4)
sequence_groups["part6"] = snake_layout("part6", ZONES["part6"], cols=3)


# Part 7: one common landmark, then visible M/J branch nodes.
part7 = chapter_by_id["part7"]
p7_keys: list[str] = []
p7_keys.append(register_node("part7", 0, part7["sections"][0], 735, 2745, 370, 250))
p7_keys.append(register_node("part7", 1, part7["sections"][1], 410, 3090, 250, 112))
p7_keys.append(register_node("part7", 2, part7["sections"][2], 410, 3370, 250, 112))
p7_keys.append(register_node("part7", 3, part7["sections"][3], 1060, 2990, 250, 112))
p7_keys.append(register_node("part7", 4, part7["sections"][4], 1060, 3230, 250, 112))
p7_keys.append(register_node("part7", 5, part7["sections"][5], 1060, 3470, 250, 112))
sequence_groups["part7"] = p7_keys


# Part 8: common route gate plus three long route columns.
part8 = chapter_by_id["part8"]
p8_common = register_node("part8", 0, part8["sections"][0], 2705, 2735, 420, 250)
p8_groups: dict[str, list[str]] = {"dream": [], "stay": [], "bad": []}
route_x = {"dream": 1845, "stay": 2705, "bad": 3565}
route_sections = {
    "dream": list(range(1, 7)),
    "stay": list(range(7, 12)),
    "bad": list(range(12, 19)),
}
for scope, indexes in route_sections.items():
    count = len(indexes)
    y0, y1 = 2990, 3770
    step = (y1 - y0) / max(1, count - 1)
    for order, index in enumerate(indexes):
        section = part8["sections"][index]
        is_key = section["startNode"] in KEY_IMAGES
        w, h = ((330, 190) if is_key else (260, 96))
        p8_groups[scope].append(
            register_node("part8", index, section, route_x[scope], y0 + order * step, w, h)
        )


def edge_points(a: dict, b: dict) -> tuple[float, float, float, float]:
    dx = b["cx"] - a["cx"]
    dy = b["cy"] - a["cy"]
    if abs(dx) >= abs(dy):
        if dx >= 0:
            return a["cx"] + a["w"] / 2, a["cy"], b["cx"] - b["w"] / 2, b["cy"]
        return a["cx"] - a["w"] / 2, a["cy"], b["cx"] + b["w"] / 2, b["cy"]
    if dy >= 0:
        return a["cx"], a["cy"] + a["h"] / 2, b["cx"], b["cy"] - b["h"] / 2
    return a["cx"], a["cy"] - a["h"] / 2, b["cx"], b["cy"] + b["h"] / 2


def route_path(a_key: str, b_key: str, branch: str = "main", custom: str | None = None) -> None:
    a, b = positions[a_key], positions[b_key]
    x1, y1, x2, y2 = edge_points(a, b)
    if custom:
        d = custom
    elif abs(x2 - x1) < 8 or abs(y2 - y1) < 8:
        d = f"M {x1:.1f} {y1:.1f} L {x2:.1f} {y2:.1f}"
    else:
        if abs(x2 - x1) > abs(y2 - y1):
            mx = (x1 + x2) / 2
            d = f"M {x1:.1f} {y1:.1f} H {mx:.1f} V {y2:.1f} H {x2:.1f}"
        else:
            my = (y1 + y2) / 2
            d = f"M {x1:.1f} {y1:.1f} V {my:.1f} H {x2:.1f} V {y2:.1f}"
    add(f'<path d="{d}" class="road-base"/>')
    destination_status = b["status"]
    if destination_status == "played":
        add(f'<path d="{d}" class="road-lit"/>')
    elif destination_status == "current":
        add(f'<path d="{d}" class="road-current"/>')
    elif branch == "dream":
        add(f'<path d="{d}" class="road-dream"/>')
    elif branch == "stay":
        add(f'<path d="{d}" class="road-stay"/>')
    elif branch == "bad":
        add(f'<path d="{d}" class="road-bad"/>')


def draw_zone(chapter_id: str, zone: tuple[float, float, float, float], subtitle: str) -> None:
    x, y, w, h = zone
    chapter = chapter_by_id[chapter_id]
    add('<g class="chapter-zone">')
    add(
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="34" '
        f'fill="#0D1727" fill-opacity="0.72" stroke="#AAB7CA" stroke-opacity="0.16" stroke-width="2"/>'
    )
    add(f'<path d="M {x + 34} {y + 112} H {x + w - 34}" stroke="#FFFFFF" stroke-opacity="0.07"/>')
    add(f'<text x="{x + 42}" y="{y + 58}" class="zone-title">{escape(chapter["name"])}</text>')
    add(f'<text x="{x + 42}" y="{y + 91}" class="zone-sub">{escape(subtitle)}</text>')
    add(f'<text x="{x + w - 42}" y="{y + 59}" text-anchor="end" class="zone-count">{len(chapter["sections"])} SECTIONS</text>')
    add('</g>')


def split_title(title: str, max_chars: int = 13) -> tuple[str, str]:
    if len(title) <= max_chars:
        return title, ""
    for separator in ("·", "／", "/", "，"):
        if separator in title:
            left, right = title.split(separator, 1)
            if len(left) <= max_chars + 2:
                return left + separator, right
    return title[:max_chars], title[max_chars:]


def draw_regular_node(node: dict) -> None:
    x = node["cx"] - node["w"] / 2
    y = node["cy"] - node["h"] / 2
    status = node["status"]
    scope = node.get("scope")
    colors = {
        "played": ("#152A3C", "#D7BE86", "#F7F1E4", "1"),
        "current": ("#102846", "#74B9FF", "#FFFFFF", "1"),
        "locked": ("#09111C", "#FFFFFF", "#657286", "0.58"),
    }
    fill, stroke, text_color, opacity = colors[status]
    extra = ' filter="url(#current-glow)"' if status == "current" else ""
    add(f'<g class="story-node"{extra} opacity="{opacity}">')
    add(
        f'<rect x="{x}" y="{y}" width="{node["w"]}" height="{node["h"]}" rx="23" '
        f'fill="{fill}" stroke="{stroke}" stroke-opacity="{0.9 if status != "locked" else 0.2}" '
        f'stroke-width="{4 if status == "current" else 2}"/>'
    )
    if status == "played":
        add(f'<circle cx="{x + 24}" cy="{y + 24}" r="9" fill="#D7BE86"/>')
        add(f'<path d="M {x + 19} {y + 24} l4 4 7 -9" fill="none" stroke="#08111F" stroke-width="3"/>')
    elif status == "current":
        add(f'<circle cx="{x + 24}" cy="{y + 24}" r="10" fill="#74B9FF"/>')
        add(f'<circle cx="{x + 24}" cy="{y + 24}" r="17" fill="none" stroke="#74B9FF" stroke-opacity="0.34" stroke-width="3"/>')
    else:
        add(f'<path d="M {x + 18} {y + 25} v-5 a6 6 0 0 1 12 0 v5 M {x + 16} {y + 25} h16 v13 h-16 z" fill="none" stroke="#778397" stroke-width="2"/>')
    if scope:
        scope_color = {"dream": "#A58CFF", "stay": "#D7BE86", "bad": "#F18B7C", "M": "#78B7FF", "J": "#F18B7C"}.get(scope, "#9AA7B8")
        add(f'<rect x="{x + node["w"] - 48}" y="{y + 13}" width="34" height="26" rx="13" fill="{scope_color}" fill-opacity="0.18" stroke="{scope_color}" stroke-opacity="0.7"/>')
        add(f'<text x="{x + node["w"] - 31}" y="{y + 32}" text-anchor="middle" font-size="16" fill="{scope_color}">{escape(scope.upper())}</text>')
    line1, line2 = split_title(node["title"], 13)
    base_y = node["cy"] + (2 if not line2 else -10)
    add(f'<text x="{node["cx"]}" y="{base_y}" text-anchor="middle" class="node-label" fill="{text_color}">{escape(line1)}</text>')
    if line2:
        add(f'<text x="{node["cx"]}" y="{base_y + 29}" text-anchor="middle" class="node-label node-label-small" fill="{text_color}">{escape(line2)}</text>')
    add('</g>')


def draw_key_node(node: dict) -> None:
    x = node["cx"] - node["w"] / 2
    y = node["cy"] - node["h"] / 2
    clip_id = "clip_" + node["key"].replace(":", "_")
    status = node["status"]
    scope = node.get("scope")
    border = {
        "played": "#D7BE86",
        "current": "#74B9FF",
        "locked": {"dream": "#A58CFF", "stay": "#D7BE86", "bad": "#F18B7C"}.get(scope, "#69778C"),
    }[status]
    add(f'<clipPath id="{clip_id}"><rect x="{x}" y="{y}" width="{node["w"]}" height="{node["h"]}" rx="28"/></clipPath>')
    extra = ' filter="url(#landmark-glow)"' if status in ("played", "current") else ""
    add(f'<g class="landmark"{extra}>')
    image_filter = ' filter="url(#locked-image)"' if status == "locked" else ""
    add(
        f'<image href="{IMAGE_URIS[node["node_id"]]}" x="{x}" y="{y}" width="{node["w"]}" height="{node["h"]}" '
        f'preserveAspectRatio="xMidYMid slice" clip-path="url(#{clip_id})"{image_filter}/>'
    )
    add(
        f'<rect x="{x}" y="{y}" width="{node["w"]}" height="{node["h"]}" rx="28" '
        f'fill="url(#landmark-shade)" stroke="{border}" stroke-width="{5 if status == "current" else 3}" '
        f'stroke-opacity="{0.96 if status != "locked" else 0.48}"/>'
    )
    add(f'<rect x="{x + 16}" y="{y + 16}" width="112" height="34" rx="17" fill="#07101B" fill-opacity="0.72"/>')
    badge = "已点亮" if status == "played" else ("继续故事" if status == "current" else "未解锁地标")
    add(f'<text x="{x + 72}" y="{y + 40}" text-anchor="middle" class="landmark-badge" fill="{border}">{badge}</text>')
    line1, line2 = split_title(node["title"], 12)
    title_y = y + node["h"] - (42 if not line2 else 65)
    add(f'<text x="{x + 22}" y="{title_y}" class="landmark-title" fill="#FFFFFF">{escape(line1)}</text>')
    if line2:
        add(f'<text x="{x + 22}" y="{title_y + 34}" class="landmark-title landmark-title-small" fill="#FFFFFF">{escape(line2)}</text>')
    add('</g>')


# SVG shell and style.
add(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">')
add('<style>')
add("text { font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif; }")
add(".map-title { font-size: 66px; font-weight: 760; fill: #F8F3E8; letter-spacing: 1px; }")
add(".map-sub { font-size: 24px; fill: #9EADBF; }")
add(".zone-title { font-size: 42px; font-weight: 700; fill: #F6F0E4; }")
add(".zone-sub { font-size: 20px; fill: #8291A5; }")
add(".zone-count { font-size: 17px; fill: #D7BE86; letter-spacing: 2px; }")
add(".node-label { font-size: 25px; font-weight: 650; }")
add(".node-label-small { font-size: 21px; font-weight: 520; }")
add(".landmark-title { font-size: 30px; font-weight: 750; paint-order: stroke; stroke: #07101B; stroke-width: 6px; stroke-opacity: 0.65; }")
add(".landmark-title-small { font-size: 25px; }")
add(".landmark-badge { font-size: 16px; font-weight: 700; letter-spacing: 1px; }")
add(".road-base { fill: none; stroke: #314056; stroke-opacity: 0.34; stroke-width: 13; stroke-linecap: round; stroke-linejoin: round; }")
add(".road-lit { fill: none; stroke: #D7BE86; stroke-width: 7; stroke-linecap: round; stroke-linejoin: round; filter: url(#road-glow); }")
add(".road-current { fill: none; stroke: #74B9FF; stroke-width: 8; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 20 15; filter: url(#road-glow); }")
add(".road-dream { fill: none; stroke: #A58CFF; stroke-opacity: 0.24; stroke-width: 6; }")
add(".road-stay { fill: none; stroke: #D7BE86; stroke-opacity: 0.22; stroke-width: 6; }")
add(".road-bad { fill: none; stroke: #F18B7C; stroke-opacity: 0.22; stroke-width: 6; }")
add("</style>")
add("<defs>")
add('<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#050B14"/><stop offset="48%" stop-color="#12233A"/><stop offset="100%" stop-color="#060B13"/></linearGradient>')
add('<radialGradient id="ambient-a" cx="25%" cy="18%" r="50%"><stop offset="0%" stop-color="#3F82C8" stop-opacity="0.18"/><stop offset="100%" stop-color="#3F82C8" stop-opacity="0"/></radialGradient>')
add('<radialGradient id="ambient-b" cx="74%" cy="76%" r="48%"><stop offset="0%" stop-color="#7E64D8" stop-opacity="0.12"/><stop offset="100%" stop-color="#7E64D8" stop-opacity="0"/></radialGradient>')
add('<pattern id="micro-grid" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M64 0H0V64" fill="none" stroke="#FFFFFF" stroke-opacity="0.018" stroke-width="1"/></pattern>')
add('<linearGradient id="landmark-shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#07101B" stop-opacity="0.08"/><stop offset="48%" stop-color="#07101B" stop-opacity="0.16"/><stop offset="100%" stop-color="#07101B" stop-opacity="0.94"/></linearGradient>')
add('<filter id="road-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>')
add('<filter id="current-glow" x="-35%" y="-35%" width="170%" height="170%"><feGaussianBlur stdDeviation="12" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>')
add('<filter id="landmark-glow" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>')
add('<filter id="locked-image"><feColorMatrix type="saturate" values="0.1"/><feComponentTransfer><feFuncA type="linear" slope="0.24"/></feComponentTransfer></filter>')
add("</defs>")

add(f'<rect width="{W}" height="{H}" fill="url(#bg)"/>')
add(f'<rect width="{W}" height="{H}" fill="url(#ambient-a)"/>')
add(f'<rect width="{W}" height="{H}" fill="url(#ambient-b)"/>')
add(f'<rect width="{W}" height="{H}" fill="url(#micro-grid)"/>')

# Header HUD
add('<text x="142" y="112" class="map-title">故事地图</text>')
add('<text x="146" y="158" class="map-sub">每一个小节，都是走过以后才会亮起的一段路</text>')
add('<g transform="translate(2870 66)">')
add('<rect x="0" y="0" width="1085" height="126" rx="26" fill="#0B1422" fill-opacity="0.82" stroke="#FFFFFF" stroke-opacity="0.12"/>')
add('<text x="34" y="44" font-size="18" fill="#7F8FA5" letter-spacing="2">MAP PROGRESS</text>')
add('<text x="34" y="91" font-size="38" font-weight="750" fill="#F5E9CD">21 / 65</text>')
add('<rect x="210" y="64" width="610" height="13" rx="7" fill="#FFFFFF" fill-opacity="0.09"/>')
add('<rect x="210" y="64" width="197" height="13" rx="7" fill="#D7BE86"/>')
add('<circle cx="867" cy="70" r="10" fill="#D7BE86"/><text x="890" y="77" font-size="18" fill="#AEBBCD">已点亮</text>')
add('<circle cx="983" cy="70" r="10" fill="#74B9FF"/><text x="1006" y="77" font-size="18" fill="#AEBBCD">当前</text>')
add('</g>')
add('<line x1="142" y1="220" x2="3954" y2="220" stroke="#FFFFFF" stroke-opacity="0.10"/>')

# Zones
draw_zone("part1", ZONES["part1"], "相遇之前 · 2018.11—2019.2")
draw_zone("part2", ZONES["part2"], "关系确立 · 2019.2—3")
draw_zone("part3", ZONES["part3"], "淘汰与重返 · 2019.3—5")
draw_zone("part4", ZONES["part4"], "世界杯 · 2019.6—7")
draw_zone("part5", ZONES["part5"], "同居夏天 · 2019.7—9")
draw_zone("part6", ZONES["part6"], "曼城新星 · 2019.9—11")
draw_zone("part7", ZONES["part7"], "东京返日假期 · 2019.12—2020.1")
draw_zone("part8", ZONES["part8"], "世界中心 · 2020.1—5")

# Part 8 route lane backgrounds.
for scope, x, color, label in [
    ("dream", 1585, "#A58CFF", "见证他的世界"),
    ("stay", 2445, "#D7BE86", "留在日常里"),
    ("bad", 3305, "#F18B7C", "推向聚光灯"),
]:
    add(f'<rect x="{x}" y="2890" width="520" height="920" rx="30" fill="{color}" fill-opacity="0.035" stroke="{color}" stroke-opacity="0.16" stroke-width="2"/>')
    add(f'<text x="{x + 260}" y="2936" text-anchor="middle" font-size="23" font-weight="650" fill="{color}">{label}</text>')

# Roads within linear chapters.
for group_name in ("part1", "part2", "part3", "part4", "part5", "part6"):
    group = sequence_groups[group_name]
    for a_key, b_key in zip(group, group[1:]):
        route_path(a_key, b_key)

# Cross-chapter roads using open gutters.
cross_pairs = [
    (sequence_groups["part1"][-1], sequence_groups["part2"][0]),
    (sequence_groups["part2"][-1], sequence_groups["part3"][0]),
    (sequence_groups["part3"][-1], sequence_groups["part4"][0]),
    (sequence_groups["part4"][-1], sequence_groups["part5"][0]),
    (sequence_groups["part5"][-1], sequence_groups["part6"][0]),
    (sequence_groups["part6"][-1], p7_keys[0]),
]
for a_key, b_key in cross_pairs:
    route_path(a_key, b_key)

# Part 7 split.
route_path(p7_keys[0], p7_keys[1])
route_path(p7_keys[1], p7_keys[2])
route_path(p7_keys[0], p7_keys[3])
route_path(p7_keys[3], p7_keys[4])
route_path(p7_keys[4], p7_keys[5])

# Both emotional branches meet the final route gate.
for branch_end in (p7_keys[2], p7_keys[5]):
    a, b = positions[branch_end], positions[p8_common]
    x1, y1, x2, y2 = edge_points(a, b)
    d = f"M {x1:.1f} {y1:.1f} V 3855 H 1400 V 2630 H {x2:.1f} V {y2:.1f}"
    route_path(branch_end, p8_common, custom=d)

# Part 8 route split and each route chain.
for scope, group in p8_groups.items():
    route_path(p8_common, group[0], branch=scope)
    for a_key, b_key in zip(group, group[1:]):
        route_path(a_key, b_key, branch=scope)

# Draw nodes after roads.
for node in positions.values():
    if node["is_key"]:
        draw_key_node(node)
    else:
        draw_regular_node(node)

# Chapter travel arrows in gutters.
add('<g opacity="0.72">')
for x, y, rotation in [
    (1388, 740, 0), (2701, 740, 0), (3360, 1178, 90),
    (2700, 2250, 180), (1388, 2250, 180), (735, 2410, 90),
]:
    add(f'<g transform="translate({x} {y}) rotate({rotation})"><path d="M-18 -12 L16 0 L-18 12 Z" fill="#D7BE86"/></g>')
add('</g>')

# Legend and design-preview note.
add('<g transform="translate(147 3952)">')
add('<rect x="0" y="0" width="2240" height="92" rx="24" fill="#08111D" fill-opacity="0.9" stroke="#FFFFFF" stroke-opacity="0.10"/>')
legend = [
    (36, "#D7BE86", "已完成：节点与道路点亮"),
    (520, "#74B9FF", "当前小节：呼吸蓝光，可进入剧情"),
    (1150, "#657286", "未解锁：沉入雾中"),
    (1590, "#A58CFF", "大幅图片：关键剧情地标"),
]
for x, color, label in legend:
    add(f'<circle cx="{x}" cy="46" r="11" fill="{color}"/>')
    add(f'<text x="{x + 28}" y="54" font-size="21" fill="#AEBBCD">{label}</text>')
add('</g>')
add('<text x="3948" y="4008" text-anchor="end" font-size="18" fill="#728197">DESIGN PREVIEW · 实机未解锁节点隐藏标题与画面</text>')

add("</svg>")

SVG_PATH.write_text("\n".join(lines), encoding="utf-8")
print(f"Generated {SVG_PATH}")
print(f"Sections: {len(positions)}")
