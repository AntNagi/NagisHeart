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
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalDensity
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
    listState: LazyListState,
    nodeBgPath: (String) -> String?,
    onOpenChapter: (Chapter) -> Unit
) {
    Box(modifier = Modifier.fillMaxSize()) {
        LazyColumn(
            state = listState,
            modifier = Modifier
                .fillMaxSize()
                .padding(top = 150.dp, start = 24.dp, end = 24.dp, bottom = 28.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            itemsIndexed(chapters) { index, chapter ->
                val playedSections = chapter.sections.count { it.startNode in unlockedNodes }
                val isOpen = playedSections > 0
                val firstPlayableBg = chapter.sections
                    .firstOrNull { it.startNode in unlockedNodes }
                    ?.let { nodeBgPath(it.startNode) }
                val align = storyMapNodeAlignment(index)
                Box(modifier = Modifier.fillMaxWidth()) {
                    ChapterLandmark(
                        index = index,
                        chapter = chapter,
                        playedSections = playedSections,
                        isOpen = isOpen,
                        bgPath = firstPlayableBg,
                        modifier = Modifier
                            .align(align)
                            .width(248.dp),
                        onClick = { if (isOpen) onOpenChapter(chapter) }
                    )
                }
                if (index < chapters.lastIndex) {
                    Spacer(modifier = Modifier.height(28.dp))
                }
            }
        }
        Column(
            modifier = Modifier
                .align(Alignment.TopStart)
                .padding(start = 40.dp, top = 44.dp, end = 32.dp)
        ) {
            Text(
                text = "CHAPTER 总览",
                color = NagiTokens.gold,
                fontSize = 11.sp,
                lineHeight = 15.sp,
                letterSpacing = 2.4.sp
            )
            Spacer(modifier = Modifier.height(5.dp))
            Text(
                text = "他的世界，正在展开",
                color = Color(0xFFF4EEDF),
                fontFamily = FontFamily.Serif,
                fontSize = 28.sp,
                lineHeight = 34.sp
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "走过的故事会亮起来。点击亮起的章节，靠近那段记忆。",
                color = Color(0xFF9AA8BA),
                fontSize = 11.sp,
                lineHeight = 16.sp
            )
        }
    }
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
    Box(modifier = Modifier.fillMaxSize()) {
        LazyColumn(
            state = listState,
            modifier = Modifier
                .fillMaxSize()
                .padding(top = 150.dp, start = 18.dp, end = 18.dp, bottom = 20.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            if (chapter.sections.any { !it.scope.isNullOrBlank() } && chapter.sections.size >= 12) {
                item {
                    RouteForkSection(
                        chapter = chapter,
                        sectionStates = sectionStates,
                        nodeBgPath = nodeBgPath,
                        onNodeClick = onNodeClick
                    )
                }
            } else {
                itemsIndexed(chapter.sections) { index, section ->
                    val state = sectionStates["${chapter.id}:$index"] ?: SectionState.LOCKED
                    val isImportant = isImportantSection(chapter, section, index)
                    Box(modifier = Modifier.fillMaxWidth()) {
                        SectionNode(
                            section = section,
                            index = index,
                            state = state,
                            isImportant = isImportant,
                            bgPath = nodeBgPath(section.startNode),
                            modifier = Modifier
                                .align(storyMapNodeAlignment(index))
                                .width(if (isImportant) 246.dp else 202.dp),
                            onClick = { onNodeClick(section, index, state) }
                        )
                    }
                    if (index < chapter.sections.lastIndex) {
                        Spacer(modifier = Modifier.height(if (isImportant) 34.dp else 22.dp))
                    }
                }
            }

            item {
                Spacer(modifier = Modifier.height(10.dp))
                AdjacentChapterNav(
                    current = chapter,
                    chapters = chapters,
                    onSwitchChapter = onSwitchChapter
                )
            }
        }
        ChapterIdentity(
            chapter = chapter,
            modifier = Modifier
                .align(Alignment.TopStart)
                .padding(start = 40.dp, top = 44.dp, end = 32.dp)
        )
    }
}

@Composable
private fun ChapterIdentity(
    chapter: Chapter,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxWidth(),
        horizontalAlignment = Alignment.Start
    ) {
        Text(
            text = chapter.name,
            fontFamily = FontFamily.Serif,
            fontSize = 14.sp,
            letterSpacing = 2.4.sp,
            color = NagiTokens.speakerGold.copy(alpha = 0.86f),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = chapter.title,
            fontFamily = FontFamily.Serif,
            fontSize = 28.sp,
            lineHeight = 34.sp,
            color = NagiTokens.textSnow94,
            textAlign = TextAlign.Start,
            maxLines = 2,
            overflow = TextOverflow.Ellipsis
        )
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
            .height(560.dp)
            .clipToBounds()
    ) {
        val density = LocalDensity.current
        val viewportW = with(density) { maxWidth.toPx() }
        val viewportH = with(density) { maxHeight.toPx() }
        val contentW = with(density) { 960.dp.toPx() }
        val contentH = with(density) { 1540.dp.toPx() }
        var pan by remember { mutableStateOf(Offset(-180f, 0f)) }

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
                    .size(960.dp, 1540.dp)
            ) {
                commonSections.firstOrNull()?.let { indexed ->
                    RouteMapNode(
                        chapter = chapter,
                        indexed = indexed,
                        sectionStates = sectionStates,
                        nodeBgPath = nodeBgPath,
                        isImportant = true,
                        modifier = Modifier
                            .offset(x = 610.dp, y = 30.dp)
                            .width(250.dp),
                        onNodeClick = onNodeClick
                    )
                }

                val routeOrder = storyRouteOrder(routeSections.keys.toList())
                routeOrder.forEachIndexed { routeIndex, scope ->
                    val route = routeSections[scope].orEmpty()
                    val x = when (scope) {
                        "dream" -> 56.dp
                        "stay" -> 360.dp
                        "bad" -> 660.dp
                        else -> (56 + routeIndex * 300).dp
                    }
                    val yStart = when (scope) {
                        "dream" -> 170.dp
                        "stay" -> 260.dp
                        "bad" -> 350.dp
                        else -> 220.dp
                    }
                    RouteMapLabel(
                        text = routeLabel(scope),
                        modifier = Modifier.offset(x = x, y = yStart - 34.dp)
                    )
                    route.forEachIndexed { idx, indexed ->
                        val y = yStart + (idx * 172).dp
                        RouteMapNode(
                            chapter = chapter,
                            indexed = indexed,
                            sectionStates = sectionStates,
                            nodeBgPath = nodeBgPath,
                            isImportant = idx == 0 || isImportantSection(chapter, indexed.value, indexed.index),
                            modifier = Modifier
                                .offset(x = x, y = y)
                                .width(if (idx == 0) 250.dp else 218.dp),
                            onNodeClick = onNodeClick
                        )
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
        fontSize = 13.sp,
        letterSpacing = 1.8.sp,
        color = NagiTokens.speakerGold.copy(alpha = 0.78f),
        maxLines = 1,
        overflow = TextOverflow.Ellipsis
    )
}

@Composable
private fun RouteMapNode(
    chapter: Chapter,
    indexed: IndexedValue<ChapterSection>,
    sectionStates: Map<String, SectionState>,
    nodeBgPath: (String) -> String?,
    isImportant: Boolean,
    modifier: Modifier = Modifier,
    onNodeClick: (ChapterSection, Int, SectionState) -> Unit
) {
    val index = indexed.index
    val section = indexed.value
    val state = sectionStates["${chapter.id}:$index"] ?: SectionState.LOCKED
    SectionNode(
        section = section,
        index = index,
        state = state,
        isImportant = isImportant,
        bgPath = nodeBgPath(section.startNode),
        modifier = modifier,
        onClick = { onNodeClick(section, index, state) }
    )
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
    "?".repeat(text.length.coerceAtLeast(1))
