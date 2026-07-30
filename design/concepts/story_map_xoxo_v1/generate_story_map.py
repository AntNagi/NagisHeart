from pathlib import Path
from xml.sax.saxutils import escape


OUT_DIR = Path(__file__).resolve().parent
SVG_PATH = OUT_DIR / "NagisHeart_Story_Map_XoXo_Square_v1.svg"

W = 1800
H = 1800
lines = []


def add(value: str) -> None:
    lines.append(value)


def multiline_text(x, y, title, subtitle="", anchor="middle", title_size=28, sub_size=17,
                   title_fill="#F7F1E4", sub_fill="#AAB6C8"):
    add(
        f'<text x="{x}" y="{y}" text-anchor="{anchor}" class="node-title" '
        f'font-size="{title_size}" fill="{title_fill}">{escape(title)}</text>'
    )
    if subtitle:
        add(
            f'<text x="{x}" y="{y + 30}" text-anchor="{anchor}" class="node-sub" '
            f'font-size="{sub_size}" fill="{sub_fill}">{escape(subtitle)}</text>'
        )


def glass_node(x, y, w, h, title, subtitle="", kind="main", current=False):
    palettes = {
        "main": ("#D7BE86", "#111B2A", "#E5D6B3"),
        "router": ("#78B7FF", "#10233D", "#A8D0FF"),
        "dream": ("#A58CFF", "#201A3C", "#CFC3FF"),
        "stay": ("#D7BE86", "#2A2419", "#F1DCAC"),
        "spotlight": ("#F18B7C", "#321D26", "#FFC1B5"),
        "ending": ("#D7BE86", "#151D2A", "#E5D6B3"),
    }
    stroke, fill, accent = palettes[kind]
    glow = ' filter="url(#soft-glow)"' if current or kind == "router" else ""
    add(f'<g class="node node-{kind}"{glow}>')
    add(
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="18" '
        f'fill="{fill}" fill-opacity="0.92" stroke="{stroke}" '
        f'stroke-opacity="0.78" stroke-width="{2.4 if current else 1.6}"/>'
    )
    add(
        f'<path d="M {x + 18} {y + 1} H {x + w - 18}" '
        f'stroke="{accent}" stroke-opacity="0.46" stroke-width="1.2"/>'
    )
    if current:
        add(f'<circle cx="{x + 20}" cy="{y + 20}" r="6" fill="#D7BE86"/>')
    multiline_text(x + w / 2, y + h / 2 - (5 if subtitle else -9), title, subtitle,
                   title_size=25 if w < 250 else 27, sub_size=15 if w < 250 else 17)
    add('</g>')


def ending_node(x, y, w, h, code, title, color):
    add('<g class="ending-node">')
    add(
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="18" '
        f'fill="#101826" fill-opacity="0.95" stroke="{color}" stroke-width="1.8"/>'
    )
    add(f'<rect x="{x}" y="{y}" width="{w}" height="9" rx="5" fill="{color}" opacity="0.92"/>')
    add(
        f'<text x="{x + w / 2}" y="{y + 45}" text-anchor="middle" '
        f'font-size="24" font-weight="700" fill="{color}">{escape(code)}</text>'
    )
    add(
        f'<text x="{x + w / 2}" y="{y + 77}" text-anchor="middle" '
        f'font-size="19" fill="#F7F1E4">{escape(title)}</text>'
    )
    add('</g>')


def route(d, kind="main", end=True, opacity=0.9):
    colors = {
        "main": ("#D7BE86", "arrow-gold"),
        "branch": ("#78B7FF", "arrow-blue"),
        "dream": ("#A58CFF", "arrow-purple"),
        "stay": ("#D7BE86", "arrow-gold"),
        "spotlight": ("#F18B7C", "arrow-coral"),
    }
    color, marker = colors[kind]
    marker_attr = f' marker-end="url(#{marker})"' if end else ""
    add(
        f'<path d="{d}" fill="none" stroke="{color}" stroke-width="3.2" '
        f'stroke-linecap="round" stroke-linejoin="round" opacity="{opacity}"{marker_attr}/>'
    )


add(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">')
add('<style>')
add("text { font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif; }")
add(".node-title { font-weight: 650; letter-spacing: 0.5px; }")
add(".node-sub { font-weight: 400; letter-spacing: 0.2px; }")
add("</style>")
add("<defs>")
add('<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">')
add('<stop offset="0%" stop-color="#08111F"/><stop offset="48%" stop-color="#111D31"/><stop offset="100%" stop-color="#070D17"/>')
add("</linearGradient>")
add('<radialGradient id="glow-blue" cx="52%" cy="45%" r="52%"><stop offset="0%" stop-color="#3F82C8" stop-opacity="0.19"/><stop offset="100%" stop-color="#3F82C8" stop-opacity="0"/></radialGradient>')
add('<radialGradient id="glow-gold" cx="50%" cy="9%" r="45%"><stop offset="0%" stop-color="#D7BE86" stop-opacity="0.13"/><stop offset="100%" stop-color="#D7BE86" stop-opacity="0"/></radialGradient>')
add('<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" stroke-opacity="0.025" stroke-width="1"/></pattern>')
add('<filter id="soft-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>')
for marker_id, color in [
    ("arrow-gold", "#D7BE86"),
    ("arrow-blue", "#78B7FF"),
    ("arrow-purple", "#A58CFF"),
    ("arrow-coral", "#F18B7C"),
]:
    add(f'<marker id="{marker_id}" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">')
    add(f'<path d="M0,0 L10,4 L0,8 Z" fill="{color}"/>')
    add("</marker>")
add("</defs>")

add(f'<rect width="{W}" height="{H}" fill="url(#bg)"/>')
add(f'<rect width="{W}" height="{H}" fill="url(#glow-blue)"/>')
add(f'<rect width="{W}" height="{H}" fill="url(#glow-gold)"/>')
add(f'<rect width="{W}" height="{H}" fill="url(#grid)"/>')

# Header
add('<text x="82" y="92" font-size="46" font-weight="700" fill="#F7F1E4">故事地图</text>')
add('<text x="84" y="128" font-size="18" fill="#93A3BA">回看故事走向、关系分歧，以及它们最终通向的结局</text>')
add('<text x="1718" y="93" text-anchor="end" font-size="17" fill="#D7BE86">NAGI’S HEART · ROUTE MAP</text>')
add('<line x1="82" y1="154" x2="1718" y2="154" stroke="#FFFFFF" stroke-opacity="0.12"/>')

# Stage labels
for y, label in [(208, "相遇与同行"), (400, "同居距离"), (852, "假期分线"), (1304, "最终选择"), (1648, "结局")]:
    add(f'<text x="82" y="{y}" font-size="15" font-weight="600" fill="#75869D" letter-spacing="2">{label}</text>')

# Edges: top timeline
top_y = 250
top_x = [100, 375, 650, 925, 1200, 1475]
top_w = 225
for x1, x2 in zip(top_x, top_x[1:]):
    route(f"M {x1 + top_w} {top_y + 42} H {x2 - 13}", "main")
route("M 1588 334 V 358 H 900 V 387", "main")

# First split and merge
route("M 900 477 C 805 495 660 495 520 530", "branch")
route("M 900 477 C 995 495 1140 495 1280 530", "branch")
route("M 520 616 C 620 655 735 670 900 668", "branch")
route("M 1280 616 C 1180 655 1065 670 900 668", "branch")
route("M 900 758 V 792", "main")

# Second split and merge
route("M 900 878 V 910", "main")
route("M 900 1000 C 795 1016 655 1024 505 1050", "branch")
route("M 900 1000 C 1005 1016 1145 1024 1295 1050", "branch")
route("M 505 1136 C 615 1175 735 1190 900 1188", "branch")
route("M 1295 1136 C 1185 1175 1065 1190 900 1188", "branch")
route("M 900 1278 V 1312", "main")

# Final route split
route("M 900 1398 C 760 1410 590 1418 380 1446", "dream")
route("M 900 1398 V 1446", "stay")
route("M 900 1398 C 1040 1410 1210 1418 1420 1446", "spotlight")
route("M 380 1538 C 545 1570 700 1574 900 1570", "dream")
route("M 900 1538 V 1570", "stay")
route("M 1420 1538 C 1255 1570 1100 1574 900 1570", "spotlight")
for x in [220, 650, 1080, 1510]:
    route(f"M 900 1648 C 900 1660 {x} 1655 {x} 1682", "main")

# Nodes: top timeline
top_nodes = [
    ("开场白", "作战室", True),
    ("第一部", "相遇之前", False),
    ("第二部", "开放日", False),
    ("第三部", "NEL低谷", False),
    ("第四部", "世界杯", False),
    ("第五部", "同居夏天", False),
]
for x, (title, subtitle, current) in zip(top_x, top_nodes):
    glass_node(x, top_y, top_w, 84, title, subtitle, "main", current)

glass_node(735, 387, 330, 90, "同居距离", "靠近，或保持客气", "router")
glass_node(355, 530, 330, 86, "更靠近", "亲密同居", "main")
glass_node(1115, 530, 330, 86, "保持距离", "客气相处", "main")
glass_node(730, 668, 340, 90, "夏天后半", "冷战 · 七夕 · 夏窗签约", "main")

glass_node(735, 792, 330, 86, "第六部", "豪门新星", "main")
glass_node(735, 910, 330, 90, "假期分线", "不同的靠近方式", "router")
glass_node(340, 1050, 330, 86, "围巾与感冒", "照顾他的脆弱", "main")
glass_node(1130, 1050, 330, 86, "打扮与醉意", "玩笑里的试探", "main")
glass_node(730, 1188, 340, 90, "关系温度", "一路选择留下的答案", "router")

glass_node(735, 1312, 330, 86, "第八部", "春季名单 · 他的名字", "main")
glass_node(210, 1446, 340, 92, "见证他的世界", "梦想路线", "dream")
glass_node(730, 1446, 340, 92, "留在日常里", "陪伴路线", "stay")
glass_node(1250, 1446, 340, 92, "推向聚光灯", "野心路线", "spotlight")
glass_node(735, 1570, 330, 78, "最终结局", "选择与关系共同判定", "router")

ending_node(85, 1682, 270, 98, "TRUE END", "世界第一，与你", "#A58CFF")
ending_node(515, 1682, 270, 98, "GOOD END", "那么完美，那么爱你", "#D7BE86")
ending_node(945, 1682, 270, 98, "NORMAL END", "普通情侣", "#78B7FF")
ending_node(1375, 1682, 270, 98, "BAD END", "好麻烦", "#F18B7C")

# Legend
add('<g transform="translate(82 1580)">')
add('<rect x="0" y="0" width="470" height="54" rx="16" fill="#FFFFFF" fill-opacity="0.035" stroke="#FFFFFF" stroke-opacity="0.10"/>')
legend_items = [
    (24, "#D7BE86", "主线"),
    (134, "#78B7FF", "关系分歧"),
    (292, "#A58CFF", "终局路线"),
]
for x, color, label in legend_items:
    add(f'<line x1="{x}" y1="27" x2="{x + 34}" y2="27" stroke="{color}" stroke-width="3"/>')
    add(f'<circle cx="{x + 17}" cy="27" r="4" fill="{color}"/>')
    add(f'<text x="{x + 45}" y="33" font-size="16" fill="#AAB6C8">{label}</text>')
add('</g>')

add("</svg>")

SVG_PATH.write_text("\n".join(lines), encoding="utf-8")
print(SVG_PATH)
