package com.antnagi.nagisheart.ui.screen

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CutCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.graphics.drawscope.translate
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.ExperimentalTextApi
import androidx.compose.ui.text.TextLayoutResult
import androidx.compose.ui.text.TextMeasurer
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.drawText
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.rememberTextMeasurer
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.antnagi.nagisheart.ui.component.SystemPageBackground
import com.antnagi.nagisheart.ui.icon.NagiIcon
import com.antnagi.nagisheart.ui.icon.NagiIconButton
import com.antnagi.nagisheart.ui.screen.StoryMapLayout.MapNode
import com.antnagi.nagisheart.ui.screen.StoryMapLayout.NodeKind
import com.antnagi.nagisheart.ui.screen.StoryMapLayout.NodeSide
import com.antnagi.nagisheart.ui.theme.*
import com.antnagi.nagisheart.ui.viewmodel.GameViewModel
import kotlin.math.roundToInt

// ─────────────────────────────────────────────────────────────────────────────
// MinSpec §27 story map. All geometry is authored on a 1080-wide canvas
// (StoryMapLayout, transcribed from the v7 / v4 SVGs per §27.14) and scaled by
// `s = screenWidth / 1080` at draw time.
// ─────────────────────────────────────────────────────────────────────────────

// §27.9.1 text node
private val NodeRingFill = Color(0xFF091522)      // token-exempt: §27.9.1 ring fill
private val MapGold = NagiTokens.gold             // §27 gold = #D7BE86
private val NodeTitleColor = Color(0xFFF4EEDF)    // token-exempt: §27.9.1 title
private val TextOutline = Color(0xFF07111E)       // token-exempt: §27.9.x text outline
private val ImageTitleColor = Color(0xFFFFF8E9)   // token-exempt: §27.9.2 / §27.12
private val SoftRoute = Color(0xFFDCE4ED)         // token-exempt: §27.10 weak route
private val LockedText = Color(0xFF8390A2)        // token-exempt: §27.13
private val LockedOutline = Color(0xFF66758A)     // token-exempt: §27.13 / §27.12
private val LockedPanel = Color(0xFF081422)       // token-exempt: §27.12 watermark fill
private val SubtitleColor = Color(0xFF9AA8BA)     // token-exempt: §27.8 sub-header
private val FooterName = Color(0xFFF1E7D3)        // token-exempt: §27.8 footer
private val FooterCount = Color(0xFF8E9BAE)       // token-exempt: §27.8 footer
private val FooterPanel = Color(0xFF091522)       // token-exempt: §27.8 footer panel
private val HintColor = Color(0xFF8D99A9)         // token-exempt: §27.12 bottom hint

private const val LOCKED_ALPHA = 0.58f            // §27.13

/** §27.16 — map-page chapter copy. Deliberately NOT chapters.json name/title. */
private data class ChapterCopy(val kicker: String, val title: String, val subtitle: String)

private val CHAPTER_COPY = listOf(
    ChapterCopy("CHAPTER 01", "初见", "从作战室到 U-20，日本第一次看见他的名字。"),
    ChapterCopy("CHAPTER 02", "关系确立", "开放日之后，彼此的生活第一次真正重叠。"),
    ChapterCopy("CHAPTER 03", "淘汰与重返", "刚确认彼此，就被赛程、失败与沉默推向远处。"),
    ChapterCopy("CHAPTER 04", "世界杯", "从追加名单到生死局，他重新站回世界的视线中央。"),
    ChapterCopy("CHAPTER 05", "归来与同居", "日常越靠越近，盛夏也把下一次远行带到门前。"),
    ChapterCopy("CHAPTER 06", "曼城", "陌生城市、语言与赛场，让两个人学会新的靠近方式。"),
    ChapterCopy("CHAPTER 07", "假日与心意", "聚光灯之外，那些没说出口的心意在冬日里发热。"),
    ChapterCopy("CHAPTER 08", "世界中心", "同一个春天，通向三种不同的未来。")
)

/** §27.13 — locked titles show one full-width question mark per visible glyph. */
private fun maskTitle(lines: List<String>): List<String> =
    lines.map { line -> "？".repeat(line.count { it.isLetterOrDigit() || it.code > 0x2FFF }) }

@Composable
fun ChapterScreen(
    viewModel: GameViewModel,
    onBack: () -> Unit,
    onJumpToNode: (String) -> Unit,
    onReplaySection: (startNode: String, chapterId: String, sectionIndex: Int) -> Unit = { _, _, _ -> }
) {
    val chapters = remember { viewModel.getChapters().filter { it.id != "prologue" } }
    val unlocked = remember { viewModel.getUnlockedNodes() }
    var openChapter by rememberSaveable { mutableStateOf<String?>(null) }

    NagiTheme(uiTheme = NagiUiTheme.Dark) {
        SystemPageBackground {                       // §27.8 — same three dim layers as §1
            val current = openChapter
            if (current == null) {
                OverviewPage(
                    chapterIds = chapters.map { it.id },
                    unlocked = unlocked,
                    viewModel = viewModel,
                    onOpen = { openChapter = it }
                )
            } else {
                ChapterPage(
                    chapterId = current,
                    chapterIds = chapters.map { it.id },
                    unlocked = unlocked,
                    viewModel = viewModel,
                    onSwitchChapter = { openChapter = it },
                    onEnter = { node, chapterId, index, replay ->
                        if (replay) onReplaySection(node, chapterId, index) else onJumpToNode(node)
                    }
                )
            }

            // §27.2 — reuse the existing system back button; no new title bar.
            Box(modifier = Modifier.statusBarsPadding().padding(start = 15.dp, top = 15.dp)) {
                NagiIconButton(
                    icon = NagiIcon.Back,
                    onClick = { if (openChapter != null) openChapter = null else onBack() }
                )
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Overview — §27.12
// ─────────────────────────────────────────────────────────────────────────────

@OptIn(ExperimentalTextApi::class)
@Composable
private fun BoxScope.OverviewPage(
    chapterIds: List<String>,
    unlocked: Set<String>,
    viewModel: GameViewModel,
    onOpen: (String) -> Unit
) {
    val measurer = rememberTextMeasurer()

    BoxWithConstraints(modifier = Modifier.fillMaxSize()) {
        val density = LocalDensity.current
        val wPx = with(density) { maxWidth.toPx() }
        val hPx = with(density) { maxHeight.toPx() }
        // §27.12 single screen, never scrolls — fit the whole 1080x1920 canvas.
        val s = minOf(wPx / StoryMapLayout.OVERVIEW_W, hPx / StoryMapLayout.OVERVIEW_H)
        val offX = (wPx - StoryMapLayout.OVERVIEW_W * s) / 2f
        val offY = (hPx - StoryMapLayout.OVERVIEW_H * s) / 2f

        val lit = chapterIds.mapIndexed { i, id ->
            i to StoryMapLayout.forChapter(id)?.nodes.orEmpty()
                .any { it.startNode != null && it.startNode in unlocked }
        }.toMap()

        Canvas(modifier = Modifier.fillMaxSize()) {
            translate(offX, offY) {
                val litCount = lit.count { it.value }

                // trail — §27.14: v4 authors this as cubic curves, not orthogonal segments
                fun trail(from: Int, to: Int, color: Color, alpha: Float, width: Float) {
                    val p = Path()
                    StoryMapLayout.overviewTrail.forEachIndexed { i, c ->
                        if (i in from until to) {
                            if (i == from) p.moveTo(c[0] * s, c[1] * s)
                            p.cubicTo(c[2] * s, c[3] * s, c[4] * s, c[5] * s, c[6] * s, c[7] * s)
                        }
                    }
                    drawPath(p, color = color.copy(alpha = alpha), style = Stroke(width * s))
                }
                trail(0, StoryMapLayout.overviewTrail.size, SoftRoute, 0.17f, 2f)
                if (litCount > 1) trail(0, (litCount - 1).coerceAtMost(StoryMapLayout.overviewTrail.size), MapGold, 0.88f, 3f)

                StoryMapLayout.overviewLandmarks.forEachIndexed { i, lm ->
                    val isLit = lit[i] == true
                    val stroke = if (isLit) MapGold.copy(alpha = 0.92f) else LockedOutline.copy(alpha = 0.38f)
                    val card = cutRect(lm.x * s, lm.y * s, lm.w * s, lm.h * s, 28f * s)
                    if (!isLit) {
                        drawPath(card, color = LockedPanel.copy(alpha = 0.72f))
                        // §27.12 pentagon watermark, r=16 — no character art when locked
                        drawPath(
                            pentagon(lm.cx * s, lm.cy * s, 16f * s),
                            color = LockedPanel, style = Stroke(2f * s)
                        )
                    }
                    drawPath(card, color = stroke, style = Stroke(2.5f * s))

                    val copy = CHAPTER_COPY.getOrNull(i) ?: return@forEachIndexed
                    val sub = "第${listOf("一","二","三","四","五","六","七","八")[i]}部"
                    val title = if (isLit) copy.title else "？".repeat(copy.title.length)
                    anchoredOutlined(
                        measurer, sub, lm.x * s + 22f * s, lm.y * s + lm.h * s - 52f * s,
                        16f * s, if (isLit) MapGold else LockedText, s, 1f, end = false,
                        letterSpacing = 3f, outline = 5f, outlineAlpha = 0.8f
                    )
                    anchoredOutlined(
                        measurer, title, lm.x * s + 22f * s, lm.y * s + lm.h * s - 18f * s,
                        30f * s, ImageTitleColor, s, 1f, end = false,
                        serif = true, weight = FontWeight.Bold, outline = 7f, outlineAlpha = 0.88f
                    )
                }

                // header + bottom hint — §27.12
                plainText(measurer, "CHAPTER 总览", 72f * s, 227f * s, 18f * s, MapGold, letterSpacing = 4f)
                plainText(measurer, "他的世界，正在展开", 72f * s, 283f * s, 43f * s, NodeTitleColor, serif = true, weight = FontWeight.W500)
                plainText(measurer, "走过的故事会亮起来。点击亮起的章节，靠近那段记忆。", 74f * s, 321f * s, 19f * s, SubtitleColor)
                plainText(measurer, "点击章节，图片将拉近并展开全部小节", 72f * s, 1788f * s, 15f * s, HintColor, letterSpacing = 3f)
            }
        }

        // hit targets + character art for lit chapters
        StoryMapLayout.overviewLandmarks.forEachIndexed { i, lm ->
            val id = chapterIds.getOrNull(i) ?: return@forEachIndexed
            val isLit = lit[i] == true
            val bg = if (isLit) {
                StoryMapLayout.forChapter(id)?.nodes?.firstOrNull { it.startNode != null }
                    ?.startNode?.let { viewModel.getNodeBgPath(it) }
            } else null
            Box(
                modifier = Modifier
                    .offset {
                        IntOffset((offX + lm.x * s).roundToInt(), (offY + lm.y * s).roundToInt())
                    }
                    .size(with(density) { (lm.w * s).toDp() }, with(density) { (lm.h * s).toDp() })
                    .clip(CutCornerShape(with(density) { (28f * s).toDp() }))
                    .then(
                        if (isLit) Modifier.clickable(
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null
                        ) { onOpen(id) } else Modifier
                    )
            ) {
                if (bg != null) {
                    AsyncImage(
                        model = "file:///android_asset/$bg",
                        contentDescription = null,
                        contentScale = ContentScale.Crop,
                        alignment = focusFor(bg),
                        modifier = Modifier.fillMaxSize()
                    )
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(
                                Brush.verticalGradient(
                                    0f to TextOutline.copy(alpha = 0.02f),
                                    0.55f to TextOutline.copy(alpha = 0.14f),
                                    1f to TextOutline.copy(alpha = 0.94f)
                                )
                            )
                    )
                }
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Chapter sub-page — §27.8 / §27.9 / §27.10 / §27.11
// ─────────────────────────────────────────────────────────────────────────────

@OptIn(ExperimentalTextApi::class)
@Composable
private fun BoxScope.ChapterPage(
    chapterId: String,
    chapterIds: List<String>,
    unlocked: Set<String>,
    viewModel: GameViewModel,
    onSwitchChapter: (String) -> Unit,
    onEnter: (String, String, Int, Boolean) -> Unit
) {
    val map = StoryMapLayout.forChapter(chapterId) ?: return
    val chIndex = chapterIds.indexOf(chapterId)
    val copy = CHAPTER_COPY.getOrNull(chIndex) ?: return
    val measurer = rememberTextMeasurer()
    val scroll = rememberScrollState()
    // §27.2 — 240–320ms zoom-in when entering a chapter
    val zoom by animateFloatAsState(1f, tween(280), label = "chapterZoom")

    BoxWithConstraints(modifier = Modifier.fillMaxSize()) {
        val density = LocalDensity.current
        val wPx = with(density) { maxWidth.toPx() }
        val s = wPx / StoryMapLayout.CANVAS_W
        val pageH = map.canvasH * s

        Box(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(scroll)          // §27.3 — chapter pages may scroll
        ) {
            Box(modifier = Modifier.fillMaxWidth().height(with(density) { pageH.toDp() })) {

                // ---- image nodes first, so routes and text sit above the art
                map.nodes.filter { it.kind == NodeKind.IMAGE }.forEach { nd ->
                    val isLit = nd.startNode != null && nd.startNode in unlocked
                    val bg = if (isLit) nd.startNode?.let { viewModel.getNodeBgPath(it) } else null
                    val cut = if (nd.w <= 320f) 15f else 24f
                    Box(
                        modifier = Modifier
                            .offset { IntOffset((nd.x * s).roundToInt(), (nd.y * s).roundToInt()) }
                            .size(with(density) { (nd.w * s).toDp() }, with(density) { (nd.h * s).toDp() })
                            .clip(CutCornerShape(with(density) { (cut * s).toDp() }))
                            .then(if (!isLit) Modifier.background(LockedPanel.copy(alpha = 0.82f)) else Modifier)
                            .then(
                                if (isLit && nd.startNode != null) Modifier.clickable(
                                    interactionSource = remember { MutableInteractionSource() },
                                    indication = null
                                ) {
                                    val idx = map.nodes.indexOf(nd)
                                    onEnter(nd.startNode, chapterId, idx, true)
                                } else Modifier
                            )
                    ) {
                        if (bg != null) {
                            AsyncImage(
                                model = "file:///android_asset/$bg",
                                contentDescription = null,
                                contentScale = ContentScale.Crop,
                                alignment = focusFor(bg),     // §27.6 / §27.14 — per-image focus
                                modifier = Modifier.fillMaxSize()
                            )
                            Box(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .background(
                                        Brush.verticalGradient(
                                            0f to TextOutline.copy(alpha = 0.02f),
                                            0.55f to TextOutline.copy(alpha = 0.14f),
                                            1f to TextOutline.copy(alpha = 0.94f)
                                        )
                                    )
                            )
                        }
                    }
                }

                Canvas(modifier = Modifier.fillMaxSize()) {
                    // ---- routes (§27.10) — orthogonal polylines through node centres
                    map.softRoutes.forEach { drawPolyline(it, s, SoftRoute, 0.18f, 1.4f) }
                    map.routes.forEach { drawPolyline(it, s, MapGold, 0.76f, 2.6f) }

                    // ---- chapter-8 column labels (§27.11)
                    map.columnLabels.forEach { (x, text) ->
                        centeredText(measurer, text, x * s, 810f * s, 16f * s, MapGold, letterSpacing = 4f)
                    }

                    // ---- nodes
                    map.nodes.forEach { nd ->
                        val isLit = nd.startNode != null && nd.startNode in unlocked
                        if (nd.kind == NodeKind.TEXT) drawTextNode(measurer, nd, s, isLit)
                        else drawImageNodeChrome(measurer, nd, s, isLit)
                    }

                    // ---- header (§27.8)
                    plainText(measurer, copy.kicker, 72f * s, 227f * s, 18f * s, MapGold, letterSpacing = 4f)
                    plainText(measurer, copy.title, 72f * s, 283f * s, 43f * s, NodeTitleColor, serif = true, weight = FontWeight.W500)
                    plainText(measurer, copy.subtitle, 74f * s, 321f * s, 18f * s, SubtitleColor)
                    drawLine(
                        Color.White.copy(alpha = 0.08f),
                        Offset(72f * s, 350f * s), Offset(1008f * s, 350f * s), 1f * s
                    )

                    // ---- footer chapter nav (§27.8) — a footer, not a sticky bar
                    val navTop = map.canvasH - 212f
                    drawPath(
                        cutRect(58f * s, navTop * s, 964f * s, 150f * s, 23f * s),
                        color = FooterPanel.copy(alpha = 0.88f)
                    )
                    drawPath(
                        cutRect(58f * s, navTop * s, 964f * s, 150f * s, 23f * s),
                        color = MapGold.copy(alpha = 0.24f), style = Stroke(1.5f * s)
                    )
                    if (chIndex > 0) drawArrow(90f * s, (navTop + 75f) * s, s, left = true)
                    if (chIndex < chapterIds.lastIndex) drawArrow(990f * s, (navTop + 75f) * s, s, left = false)
                    centeredText(measurer, "第 ${chIndex + 1} 章", 540f * s, (navTop + 55f) * s, 18f * s, MapGold, letterSpacing = 4f)
                    centeredText(measurer, copy.title, 540f * s, (navTop + 102f) * s, 29f * s, FooterName, serif = true)
                    centeredText(
                        measurer, "%02d / 08".format(chIndex + 1), 540f * s, (navTop + 132f) * s,
                        16f * s, FooterCount, letterSpacing = 3f
                    )
                    // progress bar
                    val barY = (map.canvasH - 42f) * s
                    drawLine(Color.White.copy(alpha = 0.12f), Offset(410f * s, barY), Offset(670f * s, barY), 3f * s)
                    drawLine(
                        MapGold, Offset(410f * s, barY),
                        Offset((410f + 260f * (chIndex + 1) / 8f) * s, barY), 3f * s
                    )
                }

                // ---- text-node hit targets
                map.nodes.filter { it.kind == NodeKind.TEXT && it.startNode != null }.forEach { nd ->
                    val isLit = nd.startNode in unlocked
                    if (!isLit) return@forEach
                    val half = 60f * s
                    Box(
                        modifier = Modifier
                            .offset {
                                IntOffset((nd.cx * s - half).roundToInt(), (nd.cy * s - half).roundToInt())
                            }
                            .size(with(density) { (half * 2).toDp() })
                            .clickable(
                                interactionSource = remember { MutableInteractionSource() },
                                indication = null
                            ) {
                                val idx = map.nodes.indexOf(nd)
                                onEnter(nd.startNode!!, chapterId, idx, true)
                            }
                    )
                }

                // ---- footer nav hit targets
                val navTop = map.canvasH - 212f
                if (chIndex > 0) {
                    NavHit(density, 58f * s, navTop * s, 200f * s, 150f * s) {
                        onSwitchChapter(chapterIds[chIndex - 1])
                    }
                }
                if (chIndex < chapterIds.lastIndex) {
                    NavHit(density, 822f * s, navTop * s, 200f * s, 150f * s) {
                        onSwitchChapter(chapterIds[chIndex + 1])
                    }
                }
            }
        }
    }
}

@Composable
private fun NavHit(
    density: androidx.compose.ui.unit.Density,
    x: Float, y: Float, w: Float, h: Float,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .offset { IntOffset(x.roundToInt(), y.roundToInt()) }
            .size(with(density) { w.toDp() }, with(density) { h.toDp() })
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onClick
            )
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Draw helpers
// ─────────────────────────────────────────────────────────────────────────────

private fun DrawScope.drawPolyline(
    pts: List<Pair<Float, Float>>, s: Float, color: Color, alpha: Float, width: Float
) {
    if (pts.size < 2) return
    val p = Path()
    p.moveTo(pts[0].first * s, pts[0].second * s)
    pts.drop(1).forEach { p.lineTo(it.first * s, it.second * s) }
    drawPath(
        p, color = color.copy(alpha = alpha),
        style = Stroke(width * s, cap = StrokeCap.Round, join = StrokeJoin.Round)
    )
}

/** Cut-corner rectangle, matching the SVG card outline (all four corners). */
private fun cutRect(x: Float, y: Float, w: Float, h: Float, cut: Float): Path = Path().apply {
    moveTo(x + cut, y)
    lineTo(x + w - cut, y); lineTo(x + w, y + cut)
    lineTo(x + w, y + h - cut); lineTo(x + w - cut, y + h)
    lineTo(x + cut, y + h); lineTo(x, y + h - cut)
    lineTo(x, y + cut); close()
}

private fun pentagon(cx: Float, cy: Float, r: Float): Path = Path().apply {
    for (i in 0 until 5) {
        val a = (-90f + i * 72f) * (Math.PI / 180f).toFloat()
        val px = cx + r * kotlin.math.cos(a)
        val py = cy + r * kotlin.math.sin(a)
        if (i == 0) moveTo(px, py) else lineTo(px, py)
    }
    close()
}

private fun DrawScope.drawArrow(x: Float, y: Float, s: Float, left: Boolean) {
    val w = 18f * s
    val h = 30f * s
    val p = Path().apply {
        if (left) { moveTo(x + w, y - h / 2); lineTo(x, y); lineTo(x + w, y + h / 2) }
        else { moveTo(x - w, y - h / 2); lineTo(x, y); lineTo(x - w, y + h / 2) }
    }
    drawPath(p, MapGold.copy(alpha = 0.62f), style = Stroke(2.5f * s, cap = StrokeCap.Round, join = StrokeJoin.Round))
}

@OptIn(ExperimentalTextApi::class)
private fun DrawScope.drawTextNode(measurer: TextMeasurer, nd: MapNode, s: Float, isLit: Boolean) {
    val branch = nd.r <= 12f
    val alpha = if (isLit) 1f else LOCKED_ALPHA
    val ringStroke = if (branch) 1.7f else 2.2f

    drawCircle(NodeRingFill.copy(alpha = alpha), nd.r * s, Offset(nd.cx * s, nd.cy * s))
    drawCircle(
        (if (isLit) MapGold else LockedOutline).copy(alpha = alpha),
        nd.r * s, Offset(nd.cx * s, nd.cy * s), style = Stroke(ringStroke * s)
    )
    drawCircle(
        (if (isLit) MapGold else LockedOutline).copy(alpha = alpha),
        (if (branch) 3.5f else 4.5f) * s, Offset(nd.cx * s, nd.cy * s)
    )

    val idxDy = if (branch) -23f else -8f
    val ttlDy = if (branch) 34f else 22f
    val lineGap = if (branch) 20f else 27f
    val dx = when (nd.side) { NodeSide.RIGHT -> 35f; NodeSide.LEFT -> -35f; NodeSide.CENTER -> 0f }
    val tx = (nd.cx + dx) * s
    val titleColor = if (isLit) NodeTitleColor else LockedText
    val idxColor = if (isLit) MapGold else LockedText
    val lines = if (isLit) nd.titleLines else maskTitle(nd.titleLines)

    when (nd.side) {
        NodeSide.CENTER -> {
            centeredText(measurer, nd.label, tx, (nd.cy + idxDy) * s, (if (branch) 11f else 13f) * s, idxColor, alpha, letterSpacing = if (branch) 1.5f else 2f)
            lines.forEachIndexed { i, ln ->
                centeredOutlined(measurer, ln, tx, (nd.cy + ttlDy + i * lineGap) * s, (if (branch) 18f else 22f) * s, titleColor, s, alpha)
            }
        }
        else -> {
            val end = nd.side == NodeSide.LEFT
            anchoredText(measurer, nd.label, tx, (nd.cy + idxDy) * s, 13f * s, idxColor, alpha, end, letterSpacing = 2f)
            lines.forEachIndexed { i, ln ->
                anchoredOutlined(measurer, ln, tx, (nd.cy + ttlDy + i * lineGap) * s, 22f * s, titleColor, s, alpha, end)
            }
        }
    }
}

@OptIn(ExperimentalTextApi::class)
private fun DrawScope.drawImageNodeChrome(measurer: TextMeasurer, nd: MapNode, s: Float, isLit: Boolean) {
    val branch = nd.w <= 320f
    val cut = if (branch) 15f else 24f
    val alpha = if (isLit) 1f else LOCKED_ALPHA
    drawPath(
        cutRect(nd.x * s, nd.y * s, nd.w * s, nd.h * s, cut * s),
        color = (if (isLit) MapGold else LockedOutline).copy(alpha = if (isLit) (if (branch) 0.72f else 0.88f) else 0.38f),
        style = Stroke((if (branch) 1.5f else 2.2f) * s)
    )
    if (!isLit) {
        drawPath(pentagon(nd.x * s + nd.w * s / 2, nd.y * s + nd.h * s / 2, 16f * s), LockedPanel, style = Stroke(2f * s))
    }
    val lines = if (isLit) nd.titleLines else maskTitle(nd.titleLines)
    val label = if (isLit) nd.label else nd.label.substringBefore(" ·")

    if (branch) {
        anchoredText(measurer, label, (nd.x + 12f) * s, (nd.y + 20f) * s, 11f * s, if (isLit) MapGold else LockedText, alpha, false, letterSpacing = 1.5f)
        lines.forEachIndexed { i, ln ->
            centeredOutlined(measurer, ln, (nd.x + nd.w / 2) * s, (nd.y + nd.h - 14f + i * 20f) * s, 18f * s, if (isLit) ImageTitleColor else LockedText, s, alpha)
        }
    } else {
        anchoredOutlined(measurer, label, (nd.x + 22f) * s, (nd.y + nd.h - 51f) * s, 14f * s, if (isLit) MapGold else LockedText, s, alpha, false, letterSpacing = 3f, outline = 5f, outlineAlpha = 0.82f)
        lines.forEachIndexed { i, ln ->
            anchoredOutlined(measurer, ln, (nd.x + 22f) * s, (nd.y + nd.h - 17f + i * 27f) * s, 28f * s, if (isLit) ImageTitleColor else LockedText, s, alpha, false, serif = true, weight = FontWeight.Bold, outline = 7f, outlineAlpha = 0.88f)
        }
    }
}

// --- text primitives -----------------------------------------------------

@OptIn(ExperimentalTextApi::class)
private fun styleOf(
    size: Float, color: Color, alpha: Float, serif: Boolean, weight: FontWeight, letterSpacing: Float
) = TextStyle(
    color = color.copy(alpha = color.alpha * alpha),
    fontSize = size.sp,
    fontFamily = if (serif) FontFamily.Serif else FontFamily.Default,
    fontWeight = weight,
    letterSpacing = letterSpacing.sp
)

@OptIn(ExperimentalTextApi::class)
private fun DrawScope.measure(
    m: TextMeasurer, text: String, size: Float, color: Color, alpha: Float,
    serif: Boolean, weight: FontWeight, ls: Float
): TextLayoutResult = m.measure(text, styleOf(size, color, alpha, serif, weight, ls))

@OptIn(ExperimentalTextApi::class)
private fun DrawScope.plainText(
    m: TextMeasurer, text: String, x: Float, baselineY: Float, size: Float, color: Color,
    serif: Boolean = false, weight: FontWeight = FontWeight.Normal, letterSpacing: Float = 0f
) {
    val r = measure(m, text, size, color, 1f, serif, weight, letterSpacing)
    drawText(r, topLeft = Offset(x, baselineY - r.size.height * 0.78f))
}

@OptIn(ExperimentalTextApi::class)
private fun DrawScope.centeredText(
    m: TextMeasurer, text: String, cx: Float, baselineY: Float, size: Float, color: Color,
    alpha: Float = 1f, serif: Boolean = false, letterSpacing: Float = 0f
) {
    val r = measure(m, text, size, color, alpha, serif, FontWeight.Normal, letterSpacing)
    drawText(r, topLeft = Offset(cx - r.size.width / 2f, baselineY - r.size.height * 0.78f))
}

@OptIn(ExperimentalTextApi::class)
private fun DrawScope.anchoredText(
    m: TextMeasurer, text: String, x: Float, baselineY: Float, size: Float, color: Color,
    alpha: Float, end: Boolean, letterSpacing: Float = 0f
) {
    val r = measure(m, text, size, color, alpha, false, FontWeight.Normal, letterSpacing)
    drawText(r, topLeft = Offset(if (end) x - r.size.width else x, baselineY - r.size.height * 0.78f))
}

/**
 * §27.9.1 — the title outline is what keeps node text readable on top of the
 * background art; it explicitly replaces the old card backing.
 */
@OptIn(ExperimentalTextApi::class)
private fun DrawScope.anchoredOutlined(
    m: TextMeasurer, text: String, x: Float, baselineY: Float, size: Float, color: Color,
    s: Float, alpha: Float, end: Boolean, serif: Boolean = false,
    weight: FontWeight = FontWeight.W500, letterSpacing: Float = 0f,
    outline: Float = 5f, outlineAlpha: Float = 0.8f
) {
    val fill = measure(m, text, size, color, alpha, serif, weight, letterSpacing)
    val left = if (end) x - fill.size.width else x
    val top = baselineY - fill.size.height * 0.78f
    val ring = m.measure(
        text,
        styleOf(size, TextOutline.copy(alpha = outlineAlpha * alpha), 1f, serif, weight, letterSpacing)
            .copy(drawStyle = Stroke(outline * s * 0.5f))
    )
    drawText(ring, topLeft = Offset(left, top))
    drawText(fill, topLeft = Offset(left, top))
}

@OptIn(ExperimentalTextApi::class)
private fun DrawScope.centeredOutlined(
    m: TextMeasurer, text: String, cx: Float, baselineY: Float, size: Float, color: Color,
    s: Float, alpha: Float
) {
    val fill = measure(m, text, size, color, alpha, false, FontWeight.W500, 0f)
    val left = cx - fill.size.width / 2f
    val top = baselineY - fill.size.height * 0.78f
    val ring = m.measure(
        text,
        styleOf(size, TextOutline.copy(alpha = 0.8f * alpha), 1f, false, FontWeight.W500, 0f)
            .copy(drawStyle = Stroke(5f * s * 0.5f))
    )
    drawText(ring, topLeft = Offset(left, top))
    drawText(fill, topLeft = Offset(left, top))
}

/**
 * §27.6 / §27.14 — focus is tuned per background here, not transcribed from the
 * SVG (the v7 generator left 19 of 20 image nodes on plain centre-crop).
 */
private fun focusFor(bgKey: String): Alignment = when {
    bgKey.contains("bad_impact") -> Alignment.TopCenter
    bgKey.contains("nagi_at_home") -> Alignment.TopCenter
    bgKey.contains("kick") || bgKey.contains("goal") -> Alignment.TopCenter
    bgKey.contains("true_end") || bgKey.contains("soft_gaze") -> Alignment.TopCenter
    bgKey.contains("pillow") || bgKey.contains("wakeup") -> Alignment.Center
    else -> Alignment.TopCenter
}
