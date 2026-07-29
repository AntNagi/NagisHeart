package com.antnagi.nagisheart.ui.screen

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.ExperimentalAnimationApi
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.Image
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.rememberTransformableState
import androidx.compose.foundation.gestures.transformable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyListState
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.BiasAlignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.graphics.TransformOrigin
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.layout.positionInRoot
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.rememberAsyncImagePainter
import com.antnagi.nagisheart.data.Chapter
import com.antnagi.nagisheart.data.ChapterSection
import com.antnagi.nagisheart.data.SectionState
import com.antnagi.nagisheart.ui.component.SystemPageBackground
import com.antnagi.nagisheart.ui.icon.NagiIcon
import com.antnagi.nagisheart.ui.icon.NagiIconButton
import com.antnagi.nagisheart.ui.theme.NagiShapes
import com.antnagi.nagisheart.ui.theme.NagiTheme
import com.antnagi.nagisheart.ui.theme.NagiTokens
import com.antnagi.nagisheart.ui.theme.NagiUiTheme
import com.antnagi.nagisheart.ui.viewmodel.GameViewModel
import kotlin.math.roundToInt

@OptIn(ExperimentalAnimationApi::class)
@Composable
fun ChapterScreen(
    viewModel: GameViewModel,
    onBack: () -> Unit,
    onJumpToNode: (String) -> Unit,
    onReplaySection: (startNode: String, chapterId: String, sectionIndex: Int) -> Unit = { _, _, _ -> }
) {
    val chapters = remember {
        viewModel.getChapters().filter { chapter ->
            chapter.id != "prologue" && chapter.sections.isNotEmpty()
        }
    }
    val unlockedNodes = remember { viewModel.getUnlockedNodes() }
    val sectionStates = remember(chapters, unlockedNodes) {
        chapters.flatMap { chapter ->
            chapter.sections.mapIndexed { index, section ->
                "${chapter.id}:$index" to viewModel.getSectionState(chapter.id, index, section.startNode)
            }
        }.toMap()
    }
    var selectedChapterId by rememberSaveable { mutableStateOf<String?>(null) }
    val overviewScrollState = remember { LazyListState() }
    val chapterScrollPositions = remember { mutableStateMapOf<String, Pair<Int, Int>>() }
    val selectedChapter = chapters.firstOrNull { it.id == selectedChapterId }

    NagiTheme(uiTheme = NagiUiTheme.Dark) {
        SystemPageBackground {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .statusBarsPadding()
                    .navigationBarsPadding()
            ) {
                AnimatedContent(
                    targetState = selectedChapterId,
                    transitionSpec = {
                        (
                            fadeIn(animationSpec = tween(280)) +
                                scaleIn(animationSpec = tween(280), initialScale = 0.96f)
                            ) togetherWith (
                            fadeOut(animationSpec = tween(220)) +
                                scaleOut(animationSpec = tween(220), targetScale = 1.04f)
                            )
                    },
                    label = "story-map-zoom",
                    modifier = Modifier.fillMaxSize()
                ) { chapterId ->
                    val chapter = chapters.firstOrNull { it.id == chapterId }
                    if (chapter == null) {
                        StoryMapOverview(
                            chapters = chapters,
                            unlockedNodes = unlockedNodes,
                            sectionStates = sectionStates,
                            listState = overviewScrollState,
                            nodeBgPath = viewModel::getNodeBgPath,
                            onOpenChapter = { selectedChapterId = it.id }
                        )
                    } else {
                        val saved = chapterScrollPositions[chapter.id] ?: (0 to 0)
                        val chapterListState = remember(chapter.id) {
                            LazyListState(saved.first, saved.second)
                        }
                        DisposableEffect(chapter.id) {
                            onDispose {
                                chapterScrollPositions[chapter.id] =
                                    chapterListState.firstVisibleItemIndex to chapterListState.firstVisibleItemScrollOffset
                            }
                        }
                        StoryMapChapterDetail(
                            chapter = chapter,
                            chapters = chapters,
                            sectionStates = sectionStates,
                            listState = chapterListState,
                            nodeBgPath = viewModel::getNodeBgPath,
                            onNodeClick = { section, index, state ->
                                when (state) {
                                    SectionState.COMPLETED,
                                    SectionState.SKIPPED_COMPLETED ->
                                        onReplaySection(section.startNode, chapter.id, index)
                                    SectionState.IN_PROGRESS ->
                                        onJumpToNode(section.startNode)
                                    SectionState.LOCKED -> Unit
                                }
                            },
                            onSwitchChapter = { target ->
                                chapterScrollPositions[chapter.id] =
                                    chapterListState.firstVisibleItemIndex to chapterListState.firstVisibleItemScrollOffset
                                selectedChapterId = target.id
                            }
                        )
                    }
                }

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(44.dp)
                        .padding(horizontal = 17.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    val currentSelectedChapter by rememberUpdatedState(selectedChapter)
                    NagiIconButton(
                        icon = NagiIcon.Back,
                        onClick = {
                            if (currentSelectedChapter != null) {
                                selectedChapterId = null
                            } else {
                                onBack()
                            }
                        }
                    )
                    Spacer(modifier = Modifier.weight(1f))
                    Spacer(modifier = Modifier.width(36.dp))
                }
            }
        }
    }
}

@Composable
private fun StoryMapOverview(
    chapters: List<Chapter>,
    unlockedNodes: Set<String>,
    sectionStates: Map<String, SectionState>,
    listState: LazyListState,
    nodeBgPath: (String) -> String?,
    onOpenChapter: (Chapter) -> Unit
) {
    StoryOverviewList(
        chapters = chapters,
        unlockedNodes = unlockedNodes,
        sectionStates = sectionStates,
        listState = listState,
        nodeBgPath = nodeBgPath,
        onOpenChapter = onOpenChapter
    )
}

@Composable
private fun StoryMapChapterDetail(
    chapter: Chapter,
    chapters: List<Chapter>,
    sectionStates: Map<String, SectionState>,
    listState: LazyListState,
    nodeBgPath: (String) -> String?,
    onNodeClick: (ChapterSection, Int, SectionState) -> Unit,
    onSwitchChapter: (Chapter) -> Unit
) {
    StoryChapterList(
        chapter = chapter,
        chapters = chapters,
        sectionStates = sectionStates,
        listState = listState,
        nodeBgPath = nodeBgPath,
        onNodeClick = onNodeClick,
        onSwitchChapter = onSwitchChapter
    )
}

/** §27.10 normal-chapter path: an actual right-angle connection between adjacent nodes. */
/**
 * Exact Chapter 01 v7 composition.  The coordinates are transcribed from the
 * authority SVG after removing the fixed header offset (350px at 3px = 1dp).
 * The line and nodes live in one canvas, rather than in a generic card list.
 */
@Composable
private fun ChapterOneMap(
    chapter: Chapter,
    sectionStates: Map<String, SectionState>,
    nodeBgPath: (String) -> String?,
    onNodeClick: (ChapterSection, Int, SectionState) -> Unit
) {
    Box(Modifier.fillMaxWidth().height(500.dp)) {
        Canvas(Modifier.fillMaxSize()) {
            fun p(x: Float, y: Float) = Offset(x.dp.toPx(), y.dp.toPx())
            val route = Path().apply {
                moveTo(p(33.33f, 55f).x, p(33.33f, 55f).y)
                lineTo(p(110f, 55f).x, p(110f, 55f).y)
                lineTo(p(110f, 106.67f).x, p(110f, 106.67f).y)
                lineTo(p(270f, 106.67f).x, p(270f, 106.67f).y)
                lineTo(p(270f, 161.67f).x, p(270f, 161.67f).y)
                lineTo(p(203.33f, 161.67f).x, p(203.33f, 161.67f).y)
                lineTo(p(203.33f, 243.33f).x, p(203.33f, 243.33f).y)
                lineTo(p(83.33f, 243.33f).x, p(83.33f, 243.33f).y)
                lineTo(p(83.33f, 326.67f).x, p(83.33f, 326.67f).y)
                lineTo(p(203.33f, 326.67f).x, p(203.33f, 326.67f).y)
                lineTo(p(203.33f, 453.33f).x, p(203.33f, 453.33f).y)
            }
            drawPath(
                path = route,
                color = NagiTokens.speakerGold.copy(alpha = 0.18f),
                style = Stroke(4.2.dp.toPx(), cap = StrokeCap.Round, join = StrokeJoin.Round)
            )
            drawPath(
                path = route,
                color = NagiTokens.speakerGold.copy(alpha = 0.62f),
                style = Stroke(1.35.dp.toPx(), cap = StrokeCap.Round, join = StrokeJoin.Round)
            )
            listOf(p(270f, 106.67f), p(83.33f, 326.67f)).forEach { center ->
                drawCircle(NagiTokens.speakerGold.copy(alpha = 0.16f), 10.dp.toPx(), center)
                drawCircle(NagiTokens.authorityVoid.copy(alpha = 0.92f), 7.1.dp.toPx(), center)
                drawCircle(
                    color = NagiTokens.speakerGold.copy(alpha = 0.82f),
                    radius = 6.dp.toPx(),
                    center = center,
                    style = Stroke(1.2.dp.toPx())
                )
                drawCircle(NagiTokens.speakerGold.copy(alpha = 0.86f), 2.2.dp.toPx(), center)
            }
        }
        ChapterOneImageNode(chapter.sections.getOrNull(0), 0, sectionStates["${chapter.id}:0"] ?: SectionState.LOCKED, chapter.sections.getOrNull(0)?.let { nodeBgPath(it.startNode) }, Modifier.offset(30.dp, 20.dp).size(160.dp, 94.dp), onNodeClick)
        ChapterOneTextNode(chapter.sections.getOrNull(1), 1, sectionStates["${chapter.id}:1"] ?: SectionState.LOCKED, true, Modifier.offset(188.dp, 113.dp).width(78.dp), onNodeClick)
        ChapterOneImageNode(chapter.sections.getOrNull(2), 2, sectionStates["${chapter.id}:2"] ?: SectionState.LOCKED, chapter.sections.getOrNull(2)?.let { nodeBgPath(it.startNode) }, Modifier.offset(120.dp, 173.dp).size(167.dp, 95.dp), onNodeClick)
        ChapterOneTextNode(chapter.sections.getOrNull(3), 3, sectionStates["${chapter.id}:3"] ?: SectionState.LOCKED, false, Modifier.offset(89.dp, 331.dp).width(100.dp), onNodeClick)
        ChapterOneImageNode(chapter.sections.getOrNull(4), 4, sectionStates["${chapter.id}:4"] ?: SectionState.LOCKED, chapter.sections.getOrNull(4)?.let { nodeBgPath(it.startNode) }, Modifier.offset(113.dp, 386.dp).size(180.dp, 102.dp), onNodeClick)
    }
}

@Composable
private fun ChapterOneImageNode(
    section: ChapterSection?, index: Int, state: SectionState, bgPath: String?,
    modifier: Modifier, onNodeClick: (ChapterSection, Int, SectionState) -> Unit
) {
    val isOpen = section != null && state != SectionState.LOCKED
    Box(
        modifier = modifier
            .alpha(if (isOpen) 1f else 0.34f)
            .clip(NagiShapes.cutSmall)
            .background(NagiTokens.deepBlue.copy(alpha = 0.66f))
            .border(0.7.dp, NagiTokens.speakerGold.copy(alpha = if (isOpen) 0.68f else 0.24f), NagiShapes.cutSmall)
            .then(if (isOpen) Modifier.clickable(remember { MutableInteractionSource() }, null) { section?.let { onNodeClick(it, index, state) } } else Modifier)
    ) {
        if (isOpen && bgPath != null) StoryMapImage(bgPath, Modifier.fillMaxSize())
        Box(
            Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .height(42.dp)
                .background(
                    Brush.verticalGradient(
                        0f to Color.Transparent,
                        0.52f to NagiTokens.authorityVoid.copy(alpha = 0.48f),
                        1f to NagiTokens.authorityVoid.copy(alpha = 0.86f)
                    )
                )
        )
        Column(Modifier.align(Alignment.BottomStart).padding(start = 8.dp, end = 8.dp, bottom = 6.dp)) {
            Text(
                "${index + 1}".padStart(2, '0'),
                fontSize = 7.5.sp,
                letterSpacing = 1.2.sp,
                color = NagiTokens.speakerGold.copy(alpha = 0.82f),
                style = TextStyle(shadow = Shadow(NagiTokens.authorityVoid.copy(alpha = 0.75f), Offset(0f, 1.2f), 2.5f))
            )
            Text(
                if (isOpen) section?.title.orEmpty() else questionMarks(section?.title.orEmpty()),
                fontFamily = FontFamily.Serif,
                fontSize = 11.sp,
                lineHeight = 13.sp,
                color = NagiTokens.textSnow94.copy(alpha = 0.95f),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                style = TextStyle(shadow = Shadow(NagiTokens.authorityVoid.copy(alpha = 0.86f), Offset(0f, 1.4f), 3f))
            )
        }
    }
}

@Composable
private fun ChapterOneTextNode(
    section: ChapterSection?, index: Int, state: SectionState, alignEnd: Boolean,
    modifier: Modifier, onNodeClick: (ChapterSection, Int, SectionState) -> Unit
) {
    val isOpen = section != null && state != SectionState.LOCKED
    Column(
        modifier = modifier.alpha(if (isOpen) 1f else 0.34f)
            .then(if (isOpen) Modifier.clickable(remember { MutableInteractionSource() }, null) { section?.let { onNodeClick(it, index, state) } } else Modifier),
        horizontalAlignment = if (alignEnd) Alignment.End else Alignment.Start
    ) {
        Text("${index + 1}".padStart(2, '0'), fontSize = 7.5.sp, letterSpacing = 1.2.sp, color = NagiTokens.speakerGold.copy(alpha = 0.82f))
        Text(if (isOpen) section?.title.orEmpty() else questionMarks(section?.title.orEmpty()), fontFamily = FontFamily.Serif, fontSize = 11.sp, lineHeight = 14.sp, textAlign = if (alignEnd) TextAlign.End else TextAlign.Start, color = NagiTokens.textSnow94.copy(alpha = 0.88f), maxLines = 2, overflow = TextOverflow.Ellipsis)
    }
}

@Composable
private fun ChapterMapConnector(
    fromIndex: Int,
    fromImportant: Boolean,
    toIndex: Int,
    toImportant: Boolean,
    modifier: Modifier = Modifier
) {
    Canvas(modifier = modifier.fillMaxWidth()) {
        fun centerX(index: Int, important: Boolean): Float {
            val nodeWidth = if (important) 246.dp.toPx() else 202.dp.toPx()
            return when (index % 3) {
                0 -> size.width / 2f
                1 -> nodeWidth / 2f
                else -> size.width - nodeWidth / 2f
            }
        }
        val fromX = centerX(fromIndex, fromImportant)
        val toX = centerX(toIndex, toImportant)
        val midpointY = size.height / 2f
        val path = Path().apply {
            moveTo(fromX, 0f)
            lineTo(fromX, midpointY)
            lineTo(toX, midpointY)
            lineTo(toX, size.height)
        }
        drawPath(
            path = path,
            color = NagiTokens.speakerGold.copy(alpha = 0.76f),
            style = Stroke(
                width = 2.6.dp.toPx(),
                cap = StrokeCap.Round,
                join = StrokeJoin.Round
            )
        )
    }
}

@Composable
private fun ChapterIdentity(
    chapter: Chapter,
    modifier: Modifier = Modifier
) {
    val kicker = if (chapter.id == "part1") "CHAPTER 01" else chapter.name
    val title = if (chapter.id == "part1") "初见" else chapter.title
    val subtitle = if (chapter.id == "part1") {
        "从作战室到 U-20，日本第一次看见他的名字。"
    } else {
        ""
    }
    Column(
        modifier = modifier
            .fillMaxWidth(),
        horizontalAlignment = Alignment.Start
    ) {
        Text(
            text = kicker,
            fontFamily = FontFamily.Serif,
            fontSize = 14.sp,
            letterSpacing = 2.4.sp,
            color = NagiTokens.speakerGold.copy(alpha = 0.86f),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = title,
            fontFamily = FontFamily.Serif,
            fontSize = 28.sp,
            lineHeight = 34.sp,
            color = NagiTokens.textSnow94,
            textAlign = TextAlign.Start,
            maxLines = 2,
            overflow = TextOverflow.Ellipsis
        )
        if (subtitle.isNotEmpty()) {
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = subtitle,
                fontSize = 11.sp,
                lineHeight = 16.sp,
                color = Color(0xFF9AA8BA),
                maxLines = 2,
                overflow = TextOverflow.Clip
            )
        }
    }
}

@Composable
private fun ChapterLandmark(
    index: Int,
    chapter: Chapter,
    playedSections: Int,
    isOpen: Boolean,
    bgPath: String?,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    val alpha = if (isOpen) 1f else 0.38f
    Column(
        modifier = modifier
            .alpha(alpha)
            .clip(NagiShapes.cutMedium)
            .background(
                Brush.horizontalGradient(
                    listOf(
                        NagiTokens.deepBlue.copy(alpha = if (isOpen) 0.54f else 0.28f),
                        NagiTokens.deepBlue.copy(alpha = if (isOpen) 0.18f else 0.08f),
                        NagiTokens.white4.copy(alpha = 0f)
                    )
                )
            )
            .border(
                1.dp,
                if (isOpen) NagiTokens.borderGoldSubtle else NagiTokens.borderGlass10,
                NagiShapes.cutMedium
            )
            .then(
                if (isOpen) Modifier.clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    onClick = onClick
                ) else Modifier
            )
            .padding(12.dp)
    ) {
        if (isOpen && bgPath != null) {
            StoryMapImage(
                bgPath = bgPath,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(92.dp)
                    .clip(NagiShapes.cutSmall)
            )
            Spacer(modifier = Modifier.height(10.dp))
        }
        Text(
            text = "Chapter ${index + 1}",
            fontSize = 11.sp,
            letterSpacing = 1.8.sp,
            color = NagiTokens.speakerGold.copy(alpha = 0.82f)
        )
        Spacer(modifier = Modifier.height(5.dp))
        Text(
            text = if (isOpen) chapter.name else questionMarks(chapter.name),
            fontFamily = FontFamily.Serif,
            fontSize = 18.sp,
            color = NagiTokens.textSnow94,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
        Text(
            text = if (isOpen) chapter.title else questionMarks(chapter.title),
            fontFamily = FontFamily.Serif,
            fontSize = 13.sp,
            lineHeight = 18.sp,
            color = NagiTokens.parchment.copy(alpha = 0.72f),
            maxLines = 2,
            overflow = TextOverflow.Ellipsis
        )
        Spacer(modifier = Modifier.height(8.dp))
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            repeat(chapter.sections.size) { dot ->
                Box(
                    modifier = Modifier
                        .size(if (dot < playedSections) 5.dp else 4.dp)
                        .clip(CircleShape)
                        .background(
                            if (dot < playedSections) {
                                NagiTokens.speakerGold.copy(alpha = 0.82f)
                            } else {
                                NagiTokens.white9.copy(alpha = 0.42f)
                            }
                        )
                )
                Spacer(modifier = Modifier.width(5.dp))
            }
        }
    }
}

@Composable
private fun SectionNode(
    section: ChapterSection,
    index: Int,
    state: SectionState,
    isImportant: Boolean,
    bgPath: String?,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    val isOpen = state != SectionState.LOCKED
    val isCurrent = state == SectionState.IN_PROGRESS
    val title = if (isOpen) section.title else questionMarks(section.title)
    val shouldShowImage = isOpen && isImportant && bgPath != null

    Column(
        modifier = modifier
            .alpha(if (isOpen) 1f else 0.36f)
            .defaultMinSize(minHeight = if (isImportant) 102.dp else 58.dp)
            .clip(NagiShapes.cutSmall)
            .background(
                Brush.horizontalGradient(
                    listOf(
                        NagiTokens.deepBlue.copy(alpha = if (isCurrent) 0.66f else 0.42f),
                        NagiTokens.deepBlue.copy(alpha = if (isCurrent) 0.26f else 0.14f),
                        NagiTokens.white4.copy(alpha = 0f)
                    )
                )
            )
            .border(
                1.dp,
                when {
                    isCurrent -> NagiTokens.borderGoldAccent
                    isOpen -> NagiTokens.borderGlass12
                    else -> NagiTokens.borderGlass10
                },
                NagiShapes.cutSmall
            )
            .then(
                if (isOpen) Modifier.clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    onClick = onClick
                ) else Modifier
            )
            .padding(10.dp)
    ) {
        if (shouldShowImage) {
            StoryMapImage(
                bgPath = bgPath,
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(1.92f)
                    .clip(NagiShapes.cutSmall)
            )
            Spacer(modifier = Modifier.height(8.dp))
        }
        Text(
            text = "${index + 1}".padStart(2, '0'),
            fontSize = 10.sp,
            letterSpacing = 1.2.sp,
            color = NagiTokens.speakerGold.copy(alpha = if (isOpen) 0.78f else 0.52f)
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = title,
            fontFamily = FontFamily.Serif,
            fontSize = if (isImportant) 17.sp else 15.sp,
            lineHeight = if (isImportant) 22.sp else 20.sp,
            color = NagiTokens.textSnow94,
            maxLines = if (isImportant) 2 else 1,
            overflow = TextOverflow.Ellipsis
        )
    }
}

@Composable
private fun RouteForkSection(
    chapter: Chapter,
    sectionStates: Map<String, SectionState>,
    nodeBgPath: (String) -> String?,
    onNodeClick: (ChapterSection, Int, SectionState) -> Unit
) {
    val commonSections = chapter.sections.withIndex()
        .filter { it.value.scope.isNullOrBlank() || it.value.scope == "common" }
    val routeSections = chapter.sections.withIndex()
        .filter { !it.value.scope.isNullOrBlank() && it.value.scope != "common" }
        .groupBy { it.value.scope.orEmpty() }
    if (chapter.id == "part8") {
        RouteForkDraggableMap(
            chapter = chapter,
            commonSections = commonSections,
            routeSections = routeSections,
            sectionStates = sectionStates,
            nodeBgPath = nodeBgPath,
            onNodeClick = onNodeClick
        )
        return
    }

    Column {
        commonSections.forEachIndexed { commonIndex, indexed ->
            val index = indexed.index
            val section = indexed.value
            val state = sectionStates["${chapter.id}:$index"] ?: SectionState.LOCKED
            Box(modifier = Modifier.fillMaxWidth()) {
                SectionNode(
                    section = section,
                    index = index,
                    state = state,
                    isImportant = isImportantSection(chapter, section, index),
                    bgPath = nodeBgPath(section.startNode),
                    modifier = Modifier
                        .align(Alignment.Center)
                        .width(246.dp),
                    onClick = { onNodeClick(section, index, state) }
                )
            }
            if (commonIndex < commonSections.lastIndex) {
                Spacer(modifier = Modifier.height(26.dp))
            }
        }

        Spacer(modifier = Modifier.height(18.dp))
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            storyRouteOrder(routeSections.keys.toList()).forEach { scope ->
                val route = routeSections[scope].orEmpty()
                Column(
                    modifier = Modifier.weight(1f),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = routeLabel(scope),
                        fontSize = 11.sp,
                        letterSpacing = 1.0.sp,
                        color = NagiTokens.speakerGold.copy(alpha = 0.76f),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    route.forEachIndexed { routeIndex, indexed ->
                        val index = indexed.index
                        val section = indexed.value
                        val state = sectionStates["${chapter.id}:$index"] ?: SectionState.LOCKED
                        SectionNode(
                            section = section,
                            index = index,
                            state = state,
                            isImportant = routeIndex == 0 || isImportantSection(chapter, section, index),
                            bgPath = nodeBgPath(section.startNode),
                            modifier = Modifier.fillMaxWidth(),
                            onClick = { onNodeClick(section, index, state) }
                        )
                        if (routeIndex < route.lastIndex) {
                            Box(
                                modifier = Modifier
                                    .height(20.dp)
                                    .fillMaxWidth(),
                                contentAlignment = Alignment.Center
                            ) {
                                Box(
                                    modifier = Modifier
                                        .width(1.dp)
                                        .fillMaxHeight()
                                        .background(NagiTokens.borderGoldSubtle)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun RouteForkDraggableMap(
    chapter: Chapter,
    commonSections: List<IndexedValue<ChapterSection>>,
    routeSections: Map<String, List<IndexedValue<ChapterSection>>>,
    sectionStates: Map<String, SectionState>,
    nodeBgPath: (String) -> String?,
    onNodeClick: (ChapterSection, Int, SectionState) -> Unit
) {
    BoxWithConstraints(
        modifier = Modifier
            .fillMaxWidth()
            .height(590.dp)
            .clipToBounds()
    ) {
        val density = LocalDensity.current
        val viewportW = with(density) { maxWidth.toPx() }
        val viewportH = with(density) { maxHeight.toPx() }
        // v7 is a 1080px-wide map.  Per §27.8 it is transcribed at 360dp,
        // while the vertical canvas is intentionally longer than the viewport.
        val mapScale = 1.6f
        val contentW = with(density) { (360.dp * mapScale).toPx() }
        val contentH = with(density) { (1120.dp * mapScale).toPx() }
        var pan by remember(chapter.id, viewportW) {
            mutableStateOf(Offset(((viewportW - contentW) / 2f).coerceAtMost(0f), 0f))
        }

        fun clamp(value: Offset): Offset {
            return Offset(
                value.x.coerceIn((viewportW - contentW).coerceAtMost(0f), 0f),
                value.y.coerceIn((viewportH - contentH).coerceAtMost(0f), 0f)
            )
        }

        val transformState = rememberTransformableState { _, panChange, _ ->
            pan = clamp(pan + panChange)
        }

        Box(
            modifier = Modifier
                .fillMaxSize()
                .transformable(transformState)
        ) {
            Box(
                modifier = Modifier
                    .offset { IntOffset(pan.x.roundToInt(), pan.y.roundToInt()) }
                    .size(360.dp, 1120.dp)
                    .graphicsLayer(
                        scaleX = mapScale,
                        scaleY = mapScale,
                        transformOrigin = TransformOrigin(0f, 0f)
                    )
            ) {
                Canvas(modifier = Modifier.fillMaxSize()) {
                    drawPartEightRoutes(this.density)
                }
                commonSections.firstOrNull()?.let { indexed ->
                    RouteMapImageNode(
                        chapter = chapter,
                        indexed = indexed,
                        sectionStates = sectionStates,
                        nodeBgPath = nodeBgPath,
                        routeIndex = "01 · 共同线",
                        modifier = Modifier
                            .offset(x = 80.dp, y = 0.dp)
                            .size(width = 200.dp, height = 112.dp),
                        onNodeClick = onNodeClick
                    )
                }

                val routeOrder = storyRouteOrder(routeSections.keys.toList())
                routeOrder.forEachIndexed { routeIndex, scope ->
                    val route = routeSections[scope].orEmpty()
                    val x = partEightColumnX(scope, routeIndex)
                    RouteMapLabel(
                        text = partEightRouteLabel(scope),
                        modifier = Modifier
                            .offset(x = x - 58.dp, y = 146.dp)
                            .width(116.dp)
                    )
                    route.forEachIndexed { idx, indexed ->
                        val imagePosition = partEightImagePosition(scope, idx)
                        if (imagePosition != null) {
                            RouteMapImageNode(
                                chapter = chapter,
                                indexed = indexed,
                                sectionStates = sectionStates,
                                nodeBgPath = nodeBgPath,
                                routeIndex = partEightNodePrefix(scope, idx),
                                modifier = Modifier
                                    .offset(x = imagePosition.first, y = imagePosition.second)
                                    .size(width = 124.dp, height = 68.dp),
                                onNodeClick = onNodeClick
                            )
                        } else {
                            RouteMapTextNode(
                                chapter = chapter,
                                indexed = indexed,
                                sectionStates = sectionStates,
                                routeIndex = partEightNodePrefix(scope, idx),
                                modifier = Modifier
                                    .offset(x = x - 58.dp, y = partEightTextNodeY(idx, scope))
                                    .width(116.dp),
                                onNodeClick = onNodeClick
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun RouteMapLabel(
    text: String,
    modifier: Modifier = Modifier
) {
    Text(
        text = text,
        modifier = modifier,
        textAlign = TextAlign.Center,
        fontSize = 13.sp,
        letterSpacing = 1.4.sp,
        color = NagiTokens.speakerGold.copy(alpha = 0.78f),
        maxLines = 1,
        overflow = TextOverflow.Ellipsis
    )
}

@Composable
private fun RouteMapTextNode(
    chapter: Chapter,
    indexed: IndexedValue<ChapterSection>,
    sectionStates: Map<String, SectionState>,
    routeIndex: String,
    modifier: Modifier = Modifier,
    onNodeClick: (ChapterSection, Int, SectionState) -> Unit
) {
    val index = indexed.index
    val section = indexed.value
    val state = sectionStates["${chapter.id}:$index"] ?: SectionState.LOCKED
    val isOpen = state != SectionState.LOCKED
    Column(
        modifier = modifier
            .alpha(if (isOpen) 1f else 0.58f)
            .then(
                if (isOpen) Modifier.clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    onClick = { onNodeClick(section, index, state) }
                ) else Modifier
            ),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .size(12.dp)
                .clip(CircleShape)
                .background(NagiTokens.authorityVoid)
                .border(1.2.dp, NagiTokens.speakerGold, CircleShape)
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = routeIndex,
            fontSize = 11.sp,
            letterSpacing = 1.sp,
            color = NagiTokens.speakerGold.copy(alpha = 0.84f),
            textAlign = TextAlign.Center
        )
        Spacer(modifier = Modifier.height(3.dp))
        Text(
            text = if (isOpen) section.title else questionMarks(section.title),
            fontFamily = FontFamily.Serif,
            fontSize = 18.sp,
            lineHeight = 22.sp,
            color = NagiTokens.textSnow94,
            textAlign = TextAlign.Center,
            maxLines = 2,
            overflow = TextOverflow.Clip
        )
    }
}

@Composable
private fun RouteMapImageNode(
    chapter: Chapter,
    indexed: IndexedValue<ChapterSection>,
    sectionStates: Map<String, SectionState>,
    nodeBgPath: (String) -> String?,
    routeIndex: String,
    modifier: Modifier = Modifier,
    onNodeClick: (ChapterSection, Int, SectionState) -> Unit
) {
    val index = indexed.index
    val section = indexed.value
    val state = sectionStates["${chapter.id}:$index"] ?: SectionState.LOCKED
    val isOpen = state != SectionState.LOCKED
    Box(
        modifier = modifier
            .alpha(if (isOpen) 1f else 0.58f)
            .clip(NagiShapes.cutSmall)
            .background(NagiTokens.authorityVoid.copy(alpha = 0.82f))
            .border(1.dp, NagiTokens.speakerGold.copy(alpha = 0.72f), NagiShapes.cutSmall)
            .then(
                if (isOpen) Modifier.clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    onClick = { onNodeClick(section, index, state) }
                ) else Modifier
            )
    ) {
        if (isOpen) {
            nodeBgPath(section.startNode)?.let { bgPath ->
                StoryMapImage(bgPath = bgPath, modifier = Modifier.fillMaxSize())
            }
        }
        Column(
            modifier = Modifier
                .align(Alignment.BottomStart)
                .padding(start = 5.dp, end = 4.dp, bottom = 4.dp)
        ) {
            Text(
                text = routeIndex,
                fontSize = 8.sp,
                letterSpacing = 0.8.sp,
                color = NagiTokens.speakerGold,
                maxLines = 1
            )
            Text(
                text = if (isOpen) section.title else questionMarks(section.title),
                fontFamily = FontFamily.Serif,
                fontSize = 12.sp,
                lineHeight = 14.sp,
                color = NagiTokens.textSnow94,
                maxLines = 2,
                overflow = TextOverflow.Clip
            )
        }
    }
}

private fun partEightColumnX(scope: String, routeIndex: Int): androidx.compose.ui.unit.Dp = when (scope) {
    "dream" -> 60.dp
    "stay" -> 180.dp
    "bad" -> 300.dp
    else -> (60 + routeIndex * 120).dp
}

private fun partEightRouteLabel(scope: String): String = when (scope) {
    "dream" -> "DREAM · 世界第一"
    "stay" -> "STAY · 陪我"
    "bad" -> "BAD · 抓住我"
    else -> scope
}

private fun partEightNodePrefix(scope: String, index: Int): String = when (scope) {
    "dream" -> "D${index + 1}"
    "stay" -> "S${index + 1}"
    "bad" -> "B${index + 1}"
    else -> "${index + 1}"
}

private fun partEightTextNodeY(index: Int, scope: String): androidx.compose.ui.unit.Dp {
    val y = when (scope) {
        "dream" -> listOf(184, 0, 444, 574, 704, 0)
        "stay" -> listOf(184, 314, 444, 574, 0)
        "bad" -> listOf(184, 0, 444, 0, 704, 834, 0)
        else -> List(index + 1) { 184 + it * 130 }
    }
    return (y.getOrElse(index) { 184 + index * 130 }).dp
}

private fun partEightImagePosition(scope: String, index: Int): Pair<androidx.compose.ui.unit.Dp, androidx.compose.ui.unit.Dp>? =
    when (scope to index) {
        "dream" to 1 -> 0.dp to 300.dp
        "dream" to 5 -> 0.dp to 820.dp
        "stay" to 4 -> 118.dp to 690.dp
        "bad" to 1 -> 236.dp to 300.dp
        "bad" to 3 -> 236.dp to 560.dp
        "bad" to 6 -> 236.dp to 923.dp
        else -> null
    }

/** §27.10/§27.11: exact right-angle branch trunk and three route guide lines. */
private fun DrawScope.drawPartEightRoutes(density: Float) {
    fun point(x: Float, y: Float) = Offset(x * density, y * density)
    fun route(vararg corners: Pair<Float, Float>) = Path().apply {
        val start = corners.first()
        moveTo(start.first * density, start.second * density)
        corners.drop(1).forEach { lineTo(it.first * density, it.second * density) }
    }
    fun drawRoute(path: Path, alpha: Float, width: Float) {
        drawPath(
            path = path,
            color = NagiTokens.speakerGold.copy(alpha = alpha),
            style = Stroke(width = width * density)
        )
    }

    // Common 01 → vertical trunk → three route starts.  Values are the v7
    // 1080px coordinate system transcribed to dp (÷3) with the common card
    // at the local map origin.
    drawRoute(route(180f to 100f, 180f to 137f, 60f to 137f, 60f to 160f), 0.76f, 2.6f)
    drawRoute(route(180f to 137f, 180f to 160f), 0.76f, 2.6f)
    drawRoute(route(180f to 137f, 300f to 137f, 300f to 160f), 0.76f, 2.6f)

    // The thin vertical guides continue through every route; image nodes are
    // still attached to their guide rather than floating as cards.
    listOf(60f, 180f, 300f).forEach { x ->
        drawPath(
            path = Path().apply {
                moveTo(point(x, 160f).x, point(x, 160f).y)
                lineTo(point(x, 1080f).x, point(x, 1080f).y)
            },
            color = Color(0xFFDCE4ED).copy(alpha = 0.18f),
            style = Stroke(width = 1.4f * density)
        )
    }
}

@Composable
private fun StoryChapterList(
    chapter: Chapter,
    chapters: List<Chapter>,
    sectionStates: Map<String, SectionState>,
    listState: LazyListState,
    nodeBgPath: (String) -> String?,
    onNodeClick: (ChapterSection, Int, SectionState) -> Unit,
    onSwitchChapter: (Chapter) -> Unit
) {
    LazyColumn(
        state = listState,
        modifier = Modifier
            .fillMaxSize()
            .padding(start = 18.dp, end = 18.dp, bottom = 20.dp)
    ) {
        item {
            StoryChapterHeader(
                chapter = chapter,
                modifier = Modifier.padding(start = 22.dp, top = 72.dp, end = 14.dp, bottom = 22.dp)
            )
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(1.dp)
                    .background(Color.White.copy(alpha = 0.08f))
            )
            Spacer(modifier = Modifier.height(30.dp))
        }

        if (chapter.id == "part8") {
            item {
                StoryPartEightMap(
                    chapter = chapter,
                    sectionStates = sectionStates,
                    nodeBgPath = nodeBgPath,
                    onNodeClick = onNodeClick
                )
            }
        } else {
            itemsIndexed(chapter.sections) { index, section ->
                val state = sectionStates["${chapter.id}:$index"] ?: SectionState.LOCKED
                val important = section.startNode in storyImportantNodes
                StoryNodeRow(
                    section = section,
                    indexLabel = "${index + 1}".padStart(2, '0'),
                    state = state,
                    important = important,
                    nodeOnRight = storyNodeCenterFraction(index) > 0.5f,
                    centerFraction = storyNodeCenterFraction(index),
                    bgPath = nodeBgPath(section.startNode),
                    onClick = { onNodeClick(section, index, state) }
                )
                if (index < chapter.sections.lastIndex) {
                    val next = chapter.sections[index + 1]
                    val nextState = sectionStates["${chapter.id}:${index + 1}"] ?: SectionState.LOCKED
                    StorySimpleConnector(
                        fromFraction = storyNodeCenterFraction(index),
                        toFraction = storyNodeCenterFraction(index + 1),
                        fromImportant = important,
                        toImportant = next.startNode in storyImportantNodes,
                        destinationLit = nextState != SectionState.LOCKED
                    )
                }
            }
        }

        item {
            StoryChapterFooter(
                chapter = chapter,
                chapters = chapters,
                onSwitchChapter = onSwitchChapter,
                modifier = Modifier.padding(top = 28.dp, bottom = 22.dp)
            )
        }
    }
}

@Composable
private fun StoryChapterHeader(chapter: Chapter, modifier: Modifier = Modifier) {
    val presentation = storyChapterPresentations[chapter.id]
    Column(modifier = modifier.fillMaxWidth()) {
        Text(
            text = presentation?.kicker ?: chapter.name,
            fontSize = 10.sp,
            letterSpacing = 2.4.sp,
            color = NagiTokens.speakerGold.copy(alpha = 0.86f)
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = presentation?.title ?: chapter.title,
            fontFamily = FontFamily.Serif,
            fontSize = 28.sp,
            lineHeight = 34.sp,
            color = Color(0xFFF4EEDF),
            maxLines = 2,
            overflow = TextOverflow.Clip
        )
        presentation?.subtitle?.let { subtitle ->
            Spacer(modifier = Modifier.height(5.dp))
            Text(
                text = subtitle,
                fontSize = 11.sp,
                lineHeight = 16.sp,
                color = Color(0xFF9AA8BA),
                maxLines = 2,
                overflow = TextOverflow.Clip
            )
        }
    }
}

@Composable
private fun StoryNodeRow(
    section: ChapterSection,
    indexLabel: String,
    state: SectionState,
    important: Boolean,
    nodeOnRight: Boolean,
    centerFraction: Float,
    bgPath: String?,
    onClick: () -> Unit
) {
    val nodeWidth = if (important) 224.dp else 220.dp
    val nodeHeight = if (important) 158.dp else 62.dp
    BoxWithConstraints(
        modifier = Modifier
            .fillMaxWidth()
            .height(nodeHeight)
    ) {
        val x = (maxWidth * centerFraction - nodeWidth / 2f)
            .coerceIn(0.dp, (maxWidth - nodeWidth).coerceAtLeast(0.dp))
        StorySectionNode(
            section = section,
            indexLabel = indexLabel,
            state = state,
            important = important,
            nodeOnRight = nodeOnRight,
            bgPath = bgPath,
            modifier = Modifier
                .offset(x = x)
                .size(nodeWidth, nodeHeight),
            onClick = onClick
        )
    }
}

@Composable
private fun StorySectionNode(
    section: ChapterSection,
    indexLabel: String,
    state: SectionState,
    important: Boolean,
    nodeOnRight: Boolean,
    bgPath: String?,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    val isOpen = state != SectionState.LOCKED
    val title = if (isOpen) storyDisplayTitle(section.title) else questionMarks(section.title)
    val clickable = if (isOpen) {
        Modifier.clickable(
            interactionSource = remember { MutableInteractionSource() },
            indication = null,
            onClick = onClick
        )
    } else {
        Modifier
    }

    if (important) {
        Box(
            modifier = modifier
                .alpha(if (isOpen) 1f else 0.48f)
                .clip(NagiShapes.cutMedium)
                .background(Color(0xFF07111D).copy(alpha = 0.80f))
                .border(
                    1.dp,
                    if (isOpen) Color(0xFFD7BE86).copy(alpha = 0.62f)
                    else Color(0xFF9AA8BA).copy(alpha = 0.22f),
                    NagiShapes.cutMedium
                )
                .then(clickable)
        ) {
            if (isOpen && bgPath != null) {
                StoryMapImage(bgPath = bgPath, modifier = Modifier.fillMaxSize())
            } else {
                Text(
                    text = "◇",
                    modifier = Modifier.align(Alignment.Center),
                    color = Color(0xFF9AA8BA).copy(alpha = 0.26f),
                    fontSize = 25.sp
                )
            }
            Box(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .fillMaxWidth()
                    .height(70.dp)
                    .background(
                        Brush.verticalGradient(
                            listOf(Color.Transparent, Color(0xFF07111D).copy(alpha = 0.94f))
                        )
                    )
            )
            Column(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .padding(start = 14.dp, end = 14.dp, bottom = 10.dp)
            ) {
                Text(
                    text = indexLabel,
                    fontSize = 9.sp,
                    letterSpacing = 1.8.sp,
                    color = NagiTokens.speakerGold.copy(alpha = if (isOpen) 0.86f else 0.42f)
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = title,
                    fontFamily = FontFamily.Serif,
                    fontSize = 16.sp,
                    lineHeight = 20.sp,
                    color = if (isOpen) Color(0xFFFFF8E9) else Color(0xFF8390A2),
                    maxLines = 2,
                    overflow = TextOverflow.Clip,
                    style = TextStyle(
                        shadow = Shadow(
                            color = Color(0xFF07111E).copy(alpha = 0.88f),
                            offset = Offset(0f, 1.5f),
                            blurRadius = 4f
                        )
                    )
                )
            }
        }
    } else {
        Box(
            modifier = modifier
                .alpha(if (isOpen) 1f else 0.58f)
                .then(clickable)
        ) {
            Box(
                modifier = Modifier
                    .align(Alignment.Center)
                    .size(16.dp)
                    .clip(CircleShape)
                    .background(Color(0xFF091522))
                    .border(
                        1.2.dp,
                        if (isOpen) Color(0xFFD7BE86) else Color(0xFF66758A),
                        CircleShape
                    )
            ) {
                Box(
                    modifier = Modifier
                        .align(Alignment.Center)
                        .size(4.dp)
                        .clip(CircleShape)
                        .background(if (isOpen) Color(0xFFD7BE86) else Color(0xFF66758A))
                )
            }
            Column(
                modifier = Modifier
                    .align(if (nodeOnRight) Alignment.CenterStart else Alignment.CenterEnd)
                    .width(96.dp),
                horizontalAlignment = if (nodeOnRight) Alignment.End else Alignment.Start
            ) {
                Text(
                    text = indexLabel,
                    fontSize = 8.sp,
                    letterSpacing = 1.4.sp,
                    color = if (isOpen) Color(0xFFD7BE86) else Color(0xFF8390A2),
                    textAlign = if (nodeOnRight) TextAlign.End else TextAlign.Start,
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = title,
                    fontFamily = FontFamily.Serif,
                    fontSize = 13.sp,
                    lineHeight = 17.sp,
                    color = if (isOpen) Color(0xFFF4EEDF) else Color(0xFF8390A2),
                    textAlign = if (nodeOnRight) TextAlign.End else TextAlign.Start,
                    modifier = Modifier.fillMaxWidth(),
                    maxLines = 2,
                    overflow = TextOverflow.Clip,
                    style = TextStyle(
                        shadow = Shadow(
                            color = Color(0xFF07111E).copy(alpha = 0.80f),
                            offset = Offset.Zero,
                            blurRadius = 3f
                        )
                    )
                )
            }
        }
    }
}

@Composable
private fun StorySimpleConnector(
    fromFraction: Float,
    toFraction: Float,
    fromImportant: Boolean,
    toImportant: Boolean,
    destinationLit: Boolean
) {
    val height = (
        190.dp -
            (if (fromImportant) 79.dp else 31.dp) -
            (if (toImportant) 79.dp else 31.dp)
        ).coerceAtLeast(32.dp)
    Canvas(
        modifier = Modifier
            .fillMaxWidth()
            .height(height)
    ) {
        val fromX = size.width * fromFraction
        val toX = size.width * toFraction
        val foldY = size.height / 2f
        val path = Path().apply {
            moveTo(fromX, 0f)
            lineTo(fromX, foldY)
            lineTo(toX, foldY)
            lineTo(toX, size.height)
        }
        drawPath(
            path = path,
            color = if (destinationLit) {
                Color(0xFFD7BE86).copy(alpha = 0.70f)
            } else {
                Color(0xFF9AA8BA).copy(alpha = 0.26f)
            },
            style = Stroke(
                width = (if (destinationLit) 1.3.dp else 1.05.dp).toPx(),
                cap = StrokeCap.Square,
                join = StrokeJoin.Miter
            )
        )
    }
}

@Composable
private fun StoryPartEightMap(
    chapter: Chapter,
    sectionStates: Map<String, SectionState>,
    nodeBgPath: (String) -> String?,
    onNodeClick: (ChapterSection, Int, SectionState) -> Unit
) {
    val indexed = chapter.sections.withIndex().toList()
    val common = indexed.firstOrNull { it.value.scope.isNullOrBlank() || it.value.scope == "common" }
    val routes = indexed
        .filter { !it.value.scope.isNullOrBlank() && it.value.scope != "common" }
        .groupBy { it.value.scope.orEmpty() }

    Column(modifier = Modifier.fillMaxWidth()) {
        common?.let { commonNode ->
            val state = sectionStates["${chapter.id}:${commonNode.index}"] ?: SectionState.LOCKED
            StoryNodeRow(
                section = commonNode.value,
                indexLabel = "01 · 共同线",
                state = state,
                important = true,
                nodeOnRight = false,
                centerFraction = 0.5f,
                bgPath = nodeBgPath(commonNode.value.startNode),
                onClick = { onNodeClick(commonNode.value, commonNode.index, state) }
            )
        }

        StoryPartEightBranchHub()

        listOf("dream", "stay", "bad").forEachIndexed { routeOrdinal, scope ->
            val route = routes[scope].orEmpty()
            if (route.isNotEmpty()) {
                StoryRouteSectionHeader(
                    ordinal = routeOrdinal + 1,
                    label = storyRouteLabel(scope)
                )
                Spacer(modifier = Modifier.height(78.dp))
                route.forEachIndexed { routeIndex, node ->
                    val state = sectionStates["${chapter.id}:${node.index}"] ?: SectionState.LOCKED
                    val important = node.value.startNode in storyImportantNodes
                    StoryNodeRow(
                        section = node.value,
                        indexLabel = "${storyRoutePrefix(scope)}${routeIndex + 1}",
                        state = state,
                        important = important,
                        nodeOnRight = storyNodeCenterFraction(routeIndex) > 0.5f,
                        centerFraction = storyNodeCenterFraction(routeIndex),
                        bgPath = nodeBgPath(node.value.startNode),
                        onClick = { onNodeClick(node.value, node.index, state) }
                    )
                    if (routeIndex < route.lastIndex) {
                        val next = route[routeIndex + 1]
                        val nextState = sectionStates["${chapter.id}:${next.index}"] ?: SectionState.LOCKED
                        StorySimpleConnector(
                            fromFraction = storyNodeCenterFraction(routeIndex),
                            toFraction = storyNodeCenterFraction(routeIndex + 1),
                            fromImportant = important,
                            toImportant = next.value.startNode in storyImportantNodes,
                            destinationLit = nextState != SectionState.LOCKED
                        )
                    }
                }
                Spacer(modifier = Modifier.height(34.dp))
            }
        }
    }
}

@Composable
private fun StoryPartEightBranchHub() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(126.dp)
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val centerX = size.width / 2f
            val branchY = 42.dp.toPx()
            val gateY = 78.dp.toPx()
            val leftX = size.width * 0.17f
            val rightX = size.width * 0.83f
            val path = Path().apply {
                moveTo(centerX, 0f)
                lineTo(centerX, branchY)
                moveTo(centerX, branchY)
                lineTo(leftX, branchY)
                lineTo(leftX, gateY)
                moveTo(centerX, branchY)
                lineTo(centerX, gateY)
                moveTo(centerX, branchY)
                lineTo(rightX, branchY)
                lineTo(rightX, gateY)
            }
            drawPath(
                path = path,
                color = Color(0xFFD7BE86).copy(alpha = 0.58f),
                style = Stroke(
                    width = 1.2.dp.toPx(),
                    cap = StrokeCap.Square,
                    join = StrokeJoin.Miter
                )
            )
        }
        Row(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            listOf("DREAM", "STAY", "BAD").forEach { label ->
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .padding(horizontal = 4.dp)
                        .height(40.dp)
                        .background(Color(0xFF0A1523).copy(alpha = 0.42f))
                        .border(1.dp, Color(0xFFD7BE86).copy(alpha = 0.18f)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = label,
                        fontSize = 8.sp,
                        letterSpacing = 1.4.sp,
                        color = Color(0xFFD7BE86).copy(alpha = 0.74f)
                    )
                }
            }
        }
    }
}

@Composable
private fun StoryRouteSectionHeader(ordinal: Int, label: String) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(NagiShapes.cutSmall)
            .background(Color(0xFF0B1726).copy(alpha = 0.26f))
            .border(1.dp, Color(0xFFD7BE86).copy(alpha = 0.16f), NagiShapes.cutSmall)
            .padding(start = 18.dp, top = 15.dp, bottom = 15.dp)
    ) {
        Text(
            text = "ROUTE ${ordinal.toString().padStart(2, '0')}",
            fontSize = 8.sp,
            letterSpacing = 1.8.sp,
            color = Color(0xFFD7BE86).copy(alpha = 0.74f)
        )
        Spacer(modifier = Modifier.height(6.dp))
        Text(
            text = label,
            fontFamily = FontFamily.Serif,
            fontSize = 19.sp,
            color = Color(0xFFF6EFDF).copy(alpha = 0.94f)
        )
    }
}

@Composable
private fun StoryChapterFooter(
    chapter: Chapter,
    chapters: List<Chapter>,
    onSwitchChapter: (Chapter) -> Unit,
    modifier: Modifier = Modifier
) {
    val index = chapters.indexOfFirst { it.id == chapter.id }
    val previous = chapters.getOrNull(index - 1)
    val next = chapters.getOrNull(index + 1)
    val title = storyChapterPresentations[chapter.id]?.title ?: chapter.name
    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(118.dp)
            .clip(NagiShapes.cutMedium)
            .background(Color(0xFF091522).copy(alpha = 0.74f))
            .border(1.dp, Color(0xFFD7BE86).copy(alpha = 0.24f), NagiShapes.cutMedium)
    ) {
        Text(
            text = "‹",
            modifier = Modifier
                .align(Alignment.CenterStart)
                .clickable(
                    enabled = previous != null,
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null
                ) { previous?.let(onSwitchChapter) }
                .padding(20.dp),
            fontSize = 24.sp,
            color = Color(0xFFD7BE86).copy(alpha = if (previous != null) 0.62f else 0.18f)
        )
        Column(
            modifier = Modifier.align(Alignment.Center),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "第 ${index + 1} 章",
                fontSize = 9.sp,
                letterSpacing = 2.sp,
                color = Color(0xFFD7BE86).copy(alpha = 0.72f)
            )
            Spacer(modifier = Modifier.height(7.dp))
            Text(
                text = title,
                fontFamily = FontFamily.Serif,
                fontSize = 19.sp,
                color = Color(0xFFF1E7D3)
            )
            Spacer(modifier = Modifier.height(5.dp))
            Text(
                text = "${(index + 1).toString().padStart(2, '0')} / 08",
                fontSize = 9.sp,
                letterSpacing = 1.8.sp,
                color = Color(0xFF8E9BAE)
            )
        }
        Text(
            text = "›",
            modifier = Modifier
                .align(Alignment.CenterEnd)
                .clickable(
                    enabled = next != null,
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null
                ) { next?.let(onSwitchChapter) }
                .padding(20.dp),
            fontSize = 24.sp,
            color = Color(0xFFD7BE86).copy(alpha = if (next != null) 0.62f else 0.18f)
        )
    }
}

@Composable
private fun StoryOverviewList(
    chapters: List<Chapter>,
    unlockedNodes: Set<String>,
    sectionStates: Map<String, SectionState>,
    listState: LazyListState,
    nodeBgPath: (String) -> String?,
    onOpenChapter: (Chapter) -> Unit
) {
    LazyColumn(
        state = listState,
        modifier = Modifier
            .fillMaxSize()
            .padding(top = 62.dp, start = 14.dp, end = 14.dp, bottom = 30.dp)
    ) {
        itemsIndexed(chapters) { index, chapter ->
            val playedSections = chapter.sections.indices.count { sectionIndex ->
                sectionStates["${chapter.id}:$sectionIndex"] != SectionState.LOCKED
            }
            val isOpen = playedSections > 0
            val presentation = storyChapterPresentations[chapter.id]
            val coverBg = presentation
                ?.overviewCoverNode
                ?.takeIf { it in unlockedNodes }
                ?.let(nodeBgPath)
                ?: chapter.sections
                    .firstOrNull { it.startNode in unlockedNodes && it.startNode in storyImportantNodes }
                    ?.let { nodeBgPath(it.startNode) }

            Box(modifier = Modifier.fillMaxWidth()) {
                StoryGlassChapterCard(
                    index = index,
                    chapter = chapter,
                    playedSections = playedSections,
                    isOpen = isOpen,
                    bgPath = coverBg,
                    modifier = Modifier
                        .align(if (index % 2 == 0) Alignment.CenterEnd else Alignment.CenterStart)
                        .fillMaxWidth(0.76f),
                    onClick = { if (isOpen) onOpenChapter(chapter) }
                )
            }

            if (index < chapters.lastIndex) {
                val next = chapters[index + 1]
                val nextLit = next.sections.indices.any { sectionIndex ->
                    sectionStates["${next.id}:$sectionIndex"] != SectionState.LOCKED
                }
                StoryOverviewConnector(
                    fromRight = index % 2 == 0,
                    lit = nextLit,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(66.dp)
                )
            }
        }
        item {
            Text(
                text = "向下浏览 · 走过的章节会亮起来",
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 10.dp, bottom = 8.dp),
                textAlign = TextAlign.Center,
                color = Color(0xFFCDD8E5).copy(alpha = 0.46f),
                fontSize = 9.sp,
                letterSpacing = 1.2.sp
            )
        }
    }
}

@Composable
private fun StoryOverviewConnector(
    fromRight: Boolean,
    lit: Boolean,
    modifier: Modifier = Modifier
) {
    Canvas(modifier = modifier) {
        val fromX = size.width * if (fromRight) 0.62f else 0.38f
        val toX = size.width * if (fromRight) 0.38f else 0.62f
        val foldY = size.height / 2f
        val path = Path().apply {
            moveTo(fromX, 0f)
            lineTo(fromX, foldY)
            lineTo(toX, foldY)
            lineTo(toX, size.height)
        }
        drawPath(
            path = path,
            color = if (lit) {
                Color(0xFFD7BE86).copy(alpha = 0.70f)
            } else {
                Color(0xFF9AA8BA).copy(alpha = 0.26f)
            },
            style = Stroke(
                width = (if (lit) 1.3.dp else 1.05.dp).toPx(),
                cap = StrokeCap.Square,
                join = StrokeJoin.Miter
            )
        )
    }
}

@Composable
private fun StoryGlassChapterCard(
    index: Int,
    chapter: Chapter,
    playedSections: Int,
    isOpen: Boolean,
    bgPath: String?,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    val presentation = storyChapterPresentations[chapter.id]
    Box(
        modifier = modifier
            .height(284.dp)
            .alpha(if (isOpen) 1f else 0.48f)
            .clip(NagiShapes.cutMedium)
            .background(
                Brush.verticalGradient(
                    listOf(
                        Color.White.copy(alpha = 0.075f),
                        Color(0xFF0F1B2C).copy(alpha = 0.60f),
                        Color(0xFF0B1626).copy(alpha = 0.44f)
                    )
                )
            )
            .border(
                1.dp,
                if (isOpen) Color(0xFFD7BE86).copy(alpha = 0.32f)
                else Color(0xFF9AA8BA).copy(alpha = 0.20f),
                NagiShapes.cutMedium
            )
            .then(
                if (isOpen) Modifier.clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    onClick = onClick
                ) else Modifier
            )
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(160.dp)
                .padding(14.dp)
                .clip(NagiShapes.cutSmall)
                .background(Color(0xFF07111D).copy(alpha = 0.72f))
        ) {
            if (isOpen && bgPath != null) {
                StoryMapImage(bgPath = bgPath, modifier = Modifier.fillMaxSize())
            } else {
                Text(
                    text = "◇",
                    modifier = Modifier.align(Alignment.Center),
                    color = Color(0xFF9AA8BA).copy(alpha = 0.28f),
                    fontSize = 26.sp
                )
            }
        }
        Column(
            modifier = Modifier
                .align(Alignment.TopStart)
                .padding(start = 18.dp, top = 166.dp, end = 18.dp)
        ) {
            Text(
                text = "Chapter ${index + 1}",
                fontSize = 10.sp,
                letterSpacing = 1.9.sp,
                color = NagiTokens.speakerGold.copy(alpha = if (isOpen) 0.86f else 0.42f)
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = if (isOpen) presentation?.number ?: chapter.name else questionMarks(chapter.name),
                fontFamily = FontFamily.Serif,
                fontSize = 22.sp,
                lineHeight = 25.sp,
                color = Color(0xFFF7F3EA).copy(alpha = 0.94f),
                maxLines = 1,
                overflow = TextOverflow.Clip
            )
            Spacer(modifier = Modifier.height(5.dp))
            Text(
                text = if (isOpen) presentation?.subtitle.orEmpty()
                else questionMarks(presentation?.subtitle.orEmpty()),
                fontFamily = FontFamily.Serif,
                fontSize = 11.sp,
                lineHeight = 17.sp,
                color = Color(0xFFDAE1E9).copy(alpha = 0.66f),
                maxLines = 2,
                overflow = TextOverflow.Clip
            )
        }
        Row(
            modifier = Modifier
                .align(Alignment.BottomStart)
                .padding(start = 18.dp, bottom = 14.dp),
            horizontalArrangement = Arrangement.spacedBy(7.dp)
        ) {
            repeat(chapter.sections.size.coerceAtMost(11)) { marker ->
                Box(
                    modifier = Modifier
                        .size(6.dp)
                        .graphicsLayer(rotationZ = 45f)
                        .background(
                            if (marker < playedSections) {
                                NagiTokens.speakerGold.copy(alpha = 0.76f)
                            } else {
                                Color(0xFF9AA8BA).copy(alpha = 0.22f)
                            }
                        )
                )
            }
        }
    }
}

@Composable
private fun StoryMapImage(
    bgPath: String,
    modifier: Modifier = Modifier
) {
    Box(modifier = modifier) {
        Image(
            painter = rememberAsyncImagePainter("file:///android_asset/$bgPath"),
            contentDescription = null,
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop,
            alignment = storyMapImageAlignment(bgPath)
        )
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        listOf(
                            NagiTokens.white4.copy(alpha = 0f),
                            NagiTokens.authorityVoid.copy(alpha = 0.24f)
                        )
                    )
                )
        )
    }
}

@Composable
private fun AdjacentChapterNav(
    current: Chapter,
    chapters: List<Chapter>,
    onSwitchChapter: (Chapter) -> Unit,
    modifier: Modifier = Modifier
) {
    val currentIndex = chapters.indexOfFirst { it.id == current.id }
    val previous = chapters.getOrNull(currentIndex - 1)
    val next = chapters.getOrNull(currentIndex + 1)
    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        ChapterSwitch(
            label = previous?.let { "上一章 · ${it.name}" } ?: "上一章 · ???",
            enabled = previous != null,
            modifier = Modifier.weight(1f),
            onClick = { previous?.let(onSwitchChapter) }
        )
        ChapterSwitch(
            label = next?.let { "下一章 · ${it.name}" } ?: "下一章 · ???",
            enabled = next != null,
            modifier = Modifier.weight(1f),
            onClick = { next?.let(onSwitchChapter) }
        )
    }
}

@Composable
private fun ChapterSwitch(
    label: String,
    enabled: Boolean,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Box(
        modifier = modifier
            .alpha(if (enabled) 0.86f else 0.32f)
            .clip(NagiShapes.cutSmall)
            .background(NagiTokens.deepBlue.copy(alpha = 0.22f))
            .border(1.dp, NagiTokens.borderGlass10, NagiShapes.cutSmall)
            .then(
                if (enabled) Modifier.clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    onClick = onClick
                ) else Modifier
            )
            .padding(horizontal = 10.dp, vertical = 12.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = label,
            fontSize = 12.sp,
            color = NagiTokens.parchment.copy(alpha = 0.74f),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
    }
}

private fun storyMapNodeAlignment(index: Int): Alignment =
    when (index % 3) {
        0 -> Alignment.Center
        1 -> Alignment.CenterStart
        else -> Alignment.CenterEnd
    }

/** Screen-space bounds reported by each overview landmark, so the route follows cards while they move. */
private data class StoryMapLandmarkBounds(
    val positionInRoot: Offset,
    val width: Float,
    val height: Float
) {
    fun center(rootInWindow: Offset): Offset = Offset(
        x = positionInRoot.x - rootInWindow.x + width / 2f,
        y = positionInRoot.y - rootInWindow.y + height / 2f
    )
}

/**
 * Overview-v4 route treatment: a continuous cool-grey Bezier road with a gold, softly glowing
 * overlay for the visited portion. The route is derived from landmark bounds instead of fixed
 * viewport coordinates, which keeps it attached to the cards during scrolling and on resize.
 */
private fun DrawScope.drawOverviewRoutes(
    chapters: List<Chapter>,
    unlockedNodes: Set<String>,
    bounds: Map<String, StoryMapLandmarkBounds>,
    rootInWindow: Offset,
    density: Float
) {
    if (chapters.size < 2) return

    chapters.zipWithNext().forEach { (fromChapter, toChapter) ->
        val fromBounds = bounds[fromChapter.id] ?: return@forEach
        val toBounds = bounds[toChapter.id] ?: return@forEach
        val fromCenter = fromBounds.center(rootInWindow)
        val toCenter = toBounds.center(rootInWindow)
        val (start, end) = overviewRouteEdgePoints(fromCenter, toCenter, fromBounds, toBounds)
        val path = overviewBezierPath(start, end)

        // Landmark cards render above this canvas and hide the middle of the stroke, leaving
        // the route visibly joined to their edges.
        drawPath(
            path = path,
            color = Color(0xFFDCE4ED).copy(alpha = 0.25f),
            style = Stroke(width = 2f * density)
        )

        val destinationVisited = toChapter.sections.any { it.startNode in unlockedNodes }
        if (destinationVisited) {
            drawPath(
                path = path,
                color = Color(0xFFD7BE86).copy(alpha = 0.16f),
                style = Stroke(width = 8f * density)
            )
            drawPath(
                path = path,
                color = Color(0xFFD7BE86).copy(alpha = 0.95f),
                style = Stroke(width = 3f * density)
            )
        }
    }
}

private fun overviewRouteEdgePoints(
    from: Offset,
    to: Offset,
    fromBounds: StoryMapLandmarkBounds,
    toBounds: StoryMapLandmarkBounds
): Pair<Offset, Offset> {
    val dx = to.x - from.x
    val dy = to.y - from.y
    return if (kotlin.math.abs(dx) > kotlin.math.abs(dy)) {
        val fromX = if (dx >= 0f) from.x + fromBounds.width / 2f else from.x - fromBounds.width / 2f
        val toX = if (dx >= 0f) to.x - toBounds.width / 2f else to.x + toBounds.width / 2f
        Offset(fromX, from.y) to Offset(toX, to.y)
    } else {
        val fromY = if (dy >= 0f) from.y + fromBounds.height / 2f else from.y - fromBounds.height / 2f
        val toY = if (dy >= 0f) to.y - toBounds.height / 2f else to.y + toBounds.height / 2f
        Offset(from.x, fromY) to Offset(to.x, toY)
    }
}

private fun overviewBezierPath(start: Offset, end: Offset): Path {
    val dx = end.x - start.x
    val dy = end.y - start.y
    return Path().apply {
        moveTo(start.x, start.y)
        if (kotlin.math.abs(dx) >= kotlin.math.abs(dy)) {
            cubicTo(
                start.x + dx * 0.36f, start.y,
                end.x - dx * 0.36f, end.y,
                end.x, end.y
            )
        } else {
            cubicTo(
                start.x, start.y + dy * 0.32f,
                end.x, end.y - dy * 0.32f,
                end.x, end.y
            )
        }
    }
}

private fun isImportantSection(chapter: Chapter, section: ChapterSection, index: Int): Boolean {
    if (index == 0 || index == chapter.sections.lastIndex) return true
    val title = section.title
    val key = section.startNode
    return title.contains("初见") ||
        title.contains("关系") ||
        title.contains("淘汰") ||
        title.contains("世界杯") ||
        title.contains("世界第一") ||
        title.contains("高级公寓") ||
        title.contains("最终") ||
        title.contains("结局") ||
        key.contains("final") ||
        key.contains("end_") ||
        key.contains("world") ||
        key.contains("drive") ||
        key.contains("halloween")
}

private fun storyMapImageAlignment(bgPath: String): Alignment {
    val key = bgPath.lowercase()
    return when {
        key.contains("first_meet") -> BiasAlignment(horizontalBias = 0f, verticalBias = -0.96f)
        key.contains("easygoing") -> BiasAlignment(horizontalBias = 0f, verticalBias = -1.00f)
        key.contains("nel_start") -> BiasAlignment(horizontalBias = 0f, verticalBias = -0.92f)
        key.contains("falling_down") -> BiasAlignment(horizontalBias = 0f, verticalBias = -1.00f)
        key.contains("lolly") -> BiasAlignment(horizontalBias = -0.06f, verticalBias = -0.82f)
        key.contains("birthday_at_home") -> BiasAlignment(horizontalBias = 0f, verticalBias = -0.70f)
        key.contains("hug") -> BiasAlignment(horizontalBias = 0f, verticalBias = -0.76f)
        key.contains("bedroom") -> BiasAlignment(horizontalBias = 0f, verticalBias = -0.72f)
        key.contains("pillow") -> BiasAlignment(horizontalBias = 0f, verticalBias = -0.78f)
        key.contains("wakeup") -> BiasAlignment(horizontalBias = 0f, verticalBias = -0.78f)
        key.contains("drive") -> BiasAlignment(horizontalBias = 0f, verticalBias = -0.72f)
        key.contains("scarf") -> BiasAlignment(horizontalBias = 0f, verticalBias = -0.72f)
        key.contains("dressup") -> BiasAlignment(horizontalBias = 0f, verticalBias = -0.76f)
        key.contains("softrice") -> BiasAlignment(horizontalBias = 0f, verticalBias = -0.72f)
        key.contains("remeet") -> BiasAlignment(horizontalBias = 0f, verticalBias = -0.76f)
        key.contains("back.") -> BiasAlignment(horizontalBias = 0f, verticalBias = -0.72f)
        key.contains("valentine") -> BiasAlignment(horizontalBias = 0f, verticalBias = -0.72f)
        key.contains("bad_impact") -> BiasAlignment(horizontalBias = 0f, verticalBias = -0.68f)
        key.contains("nagi_with_cat") -> BiasAlignment(horizontalBias = 0f, verticalBias = -0.72f)
        key.contains("nagi_at_home_2") -> BiasAlignment(horizontalBias = 0f, verticalBias = -0.70f)
        key.contains("nagi_at_home_3") -> BiasAlignment(horizontalBias = 0f, verticalBias = -0.68f)
        key.contains("daily_city_room_icecream") -> BiasAlignment(horizontalBias = 0f, verticalBias = -0.84f)
        key.contains("home_soft_nagi") -> BiasAlignment(horizontalBias = 0f, verticalBias = -0.82f)
        key.contains("goal_faraway") -> BiasAlignment(horizontalBias = 0f, verticalBias = -0.10f)
        key.contains("soft_gaze") -> BiasAlignment(horizontalBias = 0f, verticalBias = -0.90f)
        key.contains("true_end") -> BiasAlignment(horizontalBias = 0f, verticalBias = -0.84f)
        key.contains("king") -> BiasAlignment(horizontalBias = -0.08f, verticalBias = -0.86f)
        key.contains("nagi") -> BiasAlignment(horizontalBias = 0f, verticalBias = -0.78f)
        key.contains("face") || key.contains("portrait") -> BiasAlignment(horizontalBias = 0f, verticalBias = -0.82f)
        else -> Alignment.Center
    }
}

private fun storyRouteOrder(scopes: List<String>): List<String> {
    val ordered = listOf("dream", "stay", "bad")
    return ordered.filter { it in scopes } + scopes.filterNot { it in ordered }.sorted()
}

private fun routeLabel(scope: String): String =
    when (scope) {
        "dream" -> "梦线"
        "stay" -> "留下"
        "bad" -> "远处"
        else -> scope.ifBlank { "分支" }
    }

private fun questionMarks(text: String): String =
    "?".repeat(
        text.count { character ->
            !character.isWhitespace() && character !in "·，。、“”‘’：:；;（）()/\\-"
        }.coerceAtLeast(1)
    )
