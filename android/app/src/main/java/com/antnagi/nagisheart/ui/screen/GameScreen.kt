package com.antnagi.nagisheart.ui.screen

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.material3.LocalTextStyle
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import android.graphics.BlurMaskFilter
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.graphics.drawscope.drawIntoCanvas
import androidx.compose.ui.graphics.nativeCanvas
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.rememberAsyncImagePainter
import com.antnagi.nagisheart.ui.component.NagiDialog
import com.antnagi.nagisheart.ui.component.*
import com.antnagi.nagisheart.ui.theme.*
import com.antnagi.nagisheart.ui.viewmodel.GamePhase
import com.antnagi.nagisheart.ui.viewmodel.GameViewModel

@Composable
fun GameScreen(
    viewModel: GameViewModel,
    onNavigateToSave: () -> Unit,
    onNavigateToBacklog: () -> Unit = {},
    onNavigateToBack: () -> Unit = {},
    onReplayFinished: () -> Unit = {},
    onReturnToHome: () -> Unit = {}
) {
    val state by viewModel.uiState.collectAsState()
    var debugOverlayVisible by remember { mutableStateOf(false) }

    val nagiUiTheme = when (state.uiTheme.lowercase()) {
        "light" -> NagiUiTheme.Light
        "dark" -> NagiUiTheme.Dark
        else -> NagiUiTheme.Auto
    }

    NagiTheme(uiTheme = nagiUiTheme) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(NagiTheme.colors.backgroundPrimary)
        ) {
            // Background image
            if (state.bgAssetPath != null) {
                Image(
                    painter = rememberAsyncImagePainter(
                        model = "file:///android_asset/${state.bgAssetPath}"
                    ),
                    contentDescription = null,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
            }

            // Tap target for advancing dialogue / chapter transition
            // Suppressed during long_narration — LongNarrationLayer handles its own clicks
            if ((state.phase == GamePhase.Dialogue || state.phase == GamePhase.Response || state.phase == GamePhase.ChapterTransition || state.phase == GamePhase.SectionTransition)
                && state.displayType != "long_narration"
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .clickable(
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null,
                            onClick = { viewModel.onTap() }
                        )
                )
            }

            // HUD
            val inReplay = viewModel.isInReplayMode()
            NagiHud(
                chapterTitle = if (inReplay) "回看中" else state.sceneTitle,
                onBack = if (inReplay) {{ viewModel.stopReplay(); onReplayFinished() }} else onNavigateToBack,
                onSave = if (inReplay) {{}} else onNavigateToSave,
                onBacklog = onNavigateToBacklog,
                onAuto = { viewModel.toggleAuto() },
                isAutoActive = state.isAutoPlaying,
                onTitleLongPress = { debugOverlayVisible = !debugOverlayVisible },
                modifier = Modifier.align(Alignment.TopCenter)
            )

            // Content based on phase
            when (state.phase) {
                GamePhase.Dialogue, GamePhase.Response -> {
                    if (state.displayType == "long_narration" && state.longNarrationTexts.isNotEmpty()) {
                        LongNarrationLayer(
                            paragraphs = state.longNarrationTexts,
                            onFinished = { viewModel.onTap() }
                        )
                    } else if (state.displayType == "center" || state.displayType == "fullscreen") {
                        DialogueLayer(
                            speaker = state.speaker,
                            text = state.text,
                            displayType = "center"
                        )
                    } else {
                        DialogueLayer(
                            speaker = state.speaker,
                            text = state.text,
                            displayType = "bottom",
                            modifier = Modifier
                                .align(Alignment.BottomCenter)
                                .navigationBarsPadding()
                        )
                    }
                }

                GamePhase.Choice -> {
                    ChoiceLayer(
                        choices = state.choices,
                        onChoiceSelected = { viewModel.onChoiceSelected(it) }
                    )
                }

                GamePhase.Ending -> {
                    if (viewModel.isInReplayMode()) {
                        ReplayCompleteOverlay(onBack = {
                            viewModel.stopReplay()
                            onReplayFinished()
                        })
                    } else {
                        state.ending?.let { ending ->
                            EndingOverlay(
                                ending = ending,
                                bgAssetPath = state.bgAssetPath,
                                onReturnToHome = onReturnToHome
                            )
                        }
                    }
                }

                GamePhase.ChapterEnding -> {
                    state.chapterTransition?.let { info ->
                        ChapterEndingOverlay(
                            chapterName = info.chapterName,
                            chapterTitle = info.chapterTitle,
                            bgAssetPath = state.bgAssetPath,
                            onReturnToMenu = onNavigateToBack,
                            onContinue = { viewModel.onTap() }
                        )
                    }
                }

                GamePhase.ChapterTransition -> {
                    state.chapterTransition?.let { info ->
                        ChapterOpeningOverlay(
                            chapterName = info.chapterName,
                            chapterTitle = info.chapterTitle,
                            bgAssetPath = state.bgAssetPath,
                            onTap = { viewModel.onTap() }
                        )
                    }
                }

                GamePhase.SectionTransition -> {
                    state.sectionTransition?.let { info ->
                        SectionOpeningOverlay(
                            sectionTitle = info.sectionTitle,
                            chapterName = info.chapterName,
                            bgAssetPath = state.bgAssetPath,
                            onTap = { viewModel.onTap() }
                        )
                    }
                }

                GamePhase.Error -> {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = state.errorMessage ?: "Unknown error",
                            color = NagiPalette.driedWine,
                            style = NagiTheme.typography.dialogue
                        )
                    }
                }

                GamePhase.Loading -> {}
            }

            // Debug overlay — hidden by default, toggle via long-press on HUD title
            if (debugOverlayVisible && state.phase != GamePhase.Ending) {
                state.debugInfo?.let { info ->
                    DebugOverlay(
                        debugInfo = info,
                        modifier = Modifier
                            .align(Alignment.TopStart)
                            .statusBarsPadding()
                            .padding(top = NagiTheme.sizes.hudButton),
                    )
                }
            }

            // Skip section button (not in HUD, separate element)
            // Hidden during long narration (LongNarrationLayer has its own UI)
            var showSkipConfirm by remember { mutableStateOf(false) }
            val showSkipButton = !inReplay
                && (state.phase == GamePhase.Dialogue || state.phase == GamePhase.Choice)
                && state.displayType != "long_narration"
            if (showSkipButton) {
                Box(
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .statusBarsPadding()
                        .padding(top = 62.dp, end = 12.dp)
                        .height(34.dp)
                        .drawBehind {
                            drawIntoCanvas { canvas ->
                                val paint = android.graphics.Paint().apply {
                                    isAntiAlias = true
                                    color = Color.Black.copy(alpha = 0.42f).toArgb()
                                    maskFilter = BlurMaskFilter(12.dp.toPx(), BlurMaskFilter.Blur.NORMAL)
                                }
                                canvas.nativeCanvas.drawRoundRect(
                                    0f, 3.dp.toPx(),
                                    size.width, size.height,
                                    8.dp.toPx(), 8.dp.toPx(),
                                    paint
                                )
                            }
                        }
                        .clip(NagiShapes.cutSmall)
                        .background(
                            Brush.verticalGradient(
                                listOf(
                                    NagiTokens.hudBlue.copy(alpha = 0.30f),
                                    NagiTokens.hudBlue.copy(alpha = 0.12f)
                                )
                            )
                        )
                        .border(
                            width = 1.dp,
                            color = NagiTokens.borderGlass12,
                            shape = NagiShapes.cutSmall
                        )
                        .clickable { showSkipConfirm = true }
                        .padding(horizontal = 15.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "跳过本节",
                        fontFamily = FontFamily.Default,
                        fontWeight = FontWeight.Medium,
                        fontSize = 12.sp,
                        letterSpacing = 0.02.sp,
                        color = NagiTokens.parchment.copy(alpha = 0.90f)
                    )
                }
            }

            if (showSkipConfirm) {
                val sectionTitle = viewModel.getCurrentSectionTitle()
                NagiDialog(
                    onDismissRequest = { showSkipConfirm = false },
                    title = "跳过本节",
                    text = if (sectionTitle.isNotEmpty()) "确定跳过「$sectionTitle」？跳过后将直接进入后续内容。"
                           else "确定跳过当前章节？跳过后将直接进入后续内容。",
                    confirmText = "确定跳过",
                    onConfirm = {
                        showSkipConfirm = false
                        viewModel.skipSection()
                    },
                    onDismiss = { showSkipConfirm = false }
                )
            }

            // Save success toast
            if (state.showSaveToast) {
                LaunchedEffect(Unit) {
                    kotlinx.coroutines.delay(1500L)
                    viewModel.dismissSaveToast()
                }
                Box(
                    modifier = Modifier
                        .align(Alignment.TopCenter)
                        .statusBarsPadding()
                        .padding(top = 56.dp)
                        .background(
                            NagiPalette.deepBlueNight.copy(alpha = 0.82f),
                            shape = androidx.compose.foundation.shape.RoundedCornerShape(6.dp)
                        )
                        .padding(horizontal = 20.dp, vertical = 10.dp)
                ) {
                    Text(
                        text = "存档成功",
                        style = NagiTheme.typography.caption,
                        color = NagiPalette.paleGold
                    )
                }
            }
        }
    }
}

@Composable
private fun EndingOverlay(
    ending: com.antnagi.nagisheart.data.EndingDefinition,
    bgAssetPath: String? = null,
    onReturnToHome: () -> Unit = {}
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = {}
            )
    ) {
        // Scene BG
        if (bgAssetPath != null) {
            Image(
                painter = rememberAsyncImagePainter(
                    model = "file:///android_asset/$bgAssetPath"
                ),
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )
        } else {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(NagiPalette.deepBlueNight)
            )
        }

        // §18.1: ending gradient overlay
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        0f to NagiTokens.scrimDark.copy(alpha = 0.10f),
                        0.35f to NagiTokens.scrimDark.copy(alpha = 0.28f),
                        0.65f to NagiTokens.scrimDark.copy(alpha = 0.62f),
                        1f to NagiTokens.scrimDark.copy(alpha = 0.82f)
                    )
                )
        )

        // §18.1: ending-card
        Column(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .navigationBarsPadding()
                .padding(horizontal = 18.dp)
                .padding(bottom = 34.dp)
                .drawBehind {
                    drawIntoCanvas { canvas ->
                        val paint = android.graphics.Paint().apply {
                            isAntiAlias = true
                            color = Color.Black.copy(alpha = 0.40f).toArgb()
                            maskFilter = BlurMaskFilter(54.dp.toPx(), BlurMaskFilter.Blur.NORMAL)
                        }
                        canvas.nativeCanvas.drawRect(
                            0f, 22.dp.toPx(), size.width, size.height, paint
                        )
                    }
                }
                .clip(NagiShapes.cutMedium)
                .background(
                    Brush.verticalGradient(
                        listOf(
                            NagiTokens.deepBlue.copy(alpha = 0.56f),
                            NagiTokens.deepBlue.copy(alpha = 0.80f)
                        )
                    )
                )
                .drawBehind {
                    drawRect(
                        brush = Brush.radialGradient(
                            0f to NagiTokens.goldPlayer,
                            0.42f to Color.Transparent,
                            center = Offset(size.width * 0.7f, 0f),
                            radius = size.width * 0.6f
                        )
                    )
                    drawRect(
                        brush = Brush.radialGradient(
                            0f to NagiTokens.gold.copy(alpha = 0.06f),
                            0.5f to Color.Transparent,
                            center = Offset(size.width * 0.3f, size.height),
                            radius = size.width * 0.6f
                        )
                    )
                    drawLine(
                        color = Color.White.copy(alpha = 0.06f),
                        start = Offset(0f, 0.5f),
                        end = Offset(size.width, 0.5f),
                        strokeWidth = 1.dp.toPx()
                    )
                }
                .border(
                    width = 1.dp,
                    color = NagiTokens.borderGlass10,
                    shape = NagiShapes.cutMedium
                )
                .padding(start = 24.dp, end = 24.dp, top = 26.dp, bottom = 22.dp)
        ) {
            // Layer 1 — Content
            Text(
                text = ending.tag,
                fontSize = 12.sp,
                letterSpacing = (0.14 * 12).sp,
                color = NagiTokens.gold,
                style = LocalTextStyle.current.copy(
                    shadow = Shadow(
                        color = Color.Black.copy(alpha = 0.60f),
                        offset = Offset(0f, 1f),
                        blurRadius = 3f
                    )
                )
            )
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = ending.subtitle,
                fontSize = 13.sp,
                letterSpacing = (0.06 * 13).sp,
                color = NagiTokens.gold.copy(alpha = 0.92f),
                style = LocalTextStyle.current.copy(
                    shadow = Shadow(
                        color = NagiTokens.gold.copy(alpha = 0.24f),
                        offset = Offset(0f, 0f),
                        blurRadius = 12f
                    )
                )
            )
            Spacer(modifier = Modifier.height(10.dp))
            Text(
                text = ending.title,
                fontFamily = FontFamily.Serif,
                fontSize = 32.sp,
                fontWeight = FontWeight.Normal,
                lineHeight = (32 * 1.16).sp,
                color = NagiPalette.snowWhite,
                style = LocalTextStyle.current.copy(
                    shadow = Shadow(
                        color = Color.Black.copy(alpha = 0.50f),
                        offset = Offset(0f, 2f),
                        blurRadius = 16f
                    )
                )
            )
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = ending.description,
                fontSize = 15.sp,
                lineHeight = (15 * 1.9).sp,
                color = NagiTokens.snow.copy(alpha = 0.88f),
                style = LocalTextStyle.current.copy(
                    shadow = Shadow(
                        color = Color.Black.copy(alpha = 0.40f),
                        offset = Offset(0f, 1f),
                        blurRadius = 6f
                    )
                )
            )

            // Layer 2 — Status feedback
            Spacer(modifier = Modifier.height(14.dp))
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(5.dp)
                        .drawBehind {
                            drawIntoCanvas { canvas ->
                                val paint = android.graphics.Paint().apply {
                                    isAntiAlias = true
                                    color = NagiTokens.goldPlayer.toArgb()
                                    maskFilter = BlurMaskFilter(
                                        8.dp.toPx(), BlurMaskFilter.Blur.NORMAL
                                    )
                                }
                                canvas.nativeCanvas.drawCircle(
                                    size.width / 2, size.height / 2,
                                    size.width / 2, paint
                                )
                            }
                        }
                        .clip(androidx.compose.foundation.shape.CircleShape)
                        .background(NagiTokens.gold.copy(alpha = 0.72f))
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "已解锁：${ending.tag} / 回忆画廊新增 1 项",
                    fontSize = 11.sp,
                    letterSpacing = (0.02 * 11).sp,
                    color = NagiTokens.parchment.copy(alpha = 0.70f)
                )
            }

            // Layer 3 — Primary action
            Spacer(modifier = Modifier.height(22.dp))
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(min = 38.dp)
                    .clip(NagiShapes.cutSmall)
                    .background(
                        Brush.horizontalGradient(
                            listOf(
                                NagiTokens.goldGlow,
                                NagiTokens.white7
                            )
                        )
                    )
                    .border(
                        width = 1.dp,
                        color = NagiTokens.gold.copy(alpha = 0.26f),
                        shape = NagiShapes.cutSmall
                    )
                    .clickable(onClick = onReturnToHome),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "返回主页",
                    fontSize = 13.sp,
                    color = NagiTokens.snow
                )
            }
        }
    }
}

@Composable
private fun ReplayCompleteOverlay(onBack: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(NagiPalette.deepBlueNight.copy(alpha = 0.95f))
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onBack
            )
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier
                .align(Alignment.Center)
                .padding(horizontal = NagiTheme.spacing.xxl)
        ) {
            Text(
                text = "回看结束",
                style = NagiTheme.typography.titlePage,
                color = NagiPalette.snowWhite.copy(alpha = 0.85f)
            )
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = "轻触返回章节目录",
                style = NagiTheme.typography.caption,
                color = NagiPalette.silverBlue.copy(alpha = 0.5f)
            )
        }
    }
}

@Composable
private fun PosterPageBackground(bgAssetPath: String?) {
    val bgPath = bgAssetPath ?: "bg/pillow.jpg"
    Image(
        painter = rememberAsyncImagePainter("file:///android_asset/$bgPath"),
        contentDescription = null,
        contentScale = ContentScale.Crop,
        modifier = Modifier.fillMaxSize()
    )
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    0f to NagiTokens.systemDim.copy(alpha = 0.22f),
                    0.24f to NagiTokens.systemDim.copy(alpha = 0.10f),
                    0.58f to NagiTokens.systemDim.copy(alpha = 0.18f),
                    1f to NagiTokens.systemDim.copy(alpha = 0.42f)
                )
            )
    )
}

@Composable
private fun KickerLabel(text: String) {
    val goldColor = NagiTokens.gold
    Row(verticalAlignment = Alignment.CenterVertically) {
        Box(
            modifier = Modifier
                .width(22.dp)
                .height(1.dp)
                .background(
                    Brush.horizontalGradient(listOf(Color.Transparent, goldColor))
                )
        )
        Spacer(modifier = Modifier.width(30.dp))
        Text(
            text = text,
            fontSize = 12.sp,
            color = goldColor
        )
    }
}

@Composable
private fun GlassBacking(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit
) {
    Column(
        modifier = modifier
            .clip(NagiShapes.cutMedium)
            .background(
                Brush.horizontalGradient(
                    0f to NagiTokens.deepBlue.copy(alpha = 0.30f),
                    0.62f to NagiTokens.deepBlue.copy(alpha = 0.14f),
                    1f to Color.Transparent
                )
            )
            // Authority §14.1: center highlight rgba(247,249,252,0.09)
            .drawBehind {
                drawCircle(
                    brush = Brush.radialGradient(
                        colors = listOf(NagiTokens.white9, Color.Transparent),
                        center = Offset(size.width / 2, size.height / 2),
                        radius = size.width * 0.5f
                    ),
                    radius = size.width * 0.5f,
                    center = Offset(size.width / 2, size.height / 2)
                )
            }
            .border(
                width = 1.dp,
                color = NagiTokens.borderGlass,
                shape = NagiShapes.cutMedium
            )
            .padding(start = 24.dp, end = 24.dp, top = 22.dp, bottom = 20.dp),
        content = content
    )
}

@Composable
private fun ClearCard(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit
) {
    Column(
        modifier = modifier
            .clip(NagiShapes.cutMedium)
            .background(
                Brush.verticalGradient(
                    0f to NagiTokens.inkNavy.copy(alpha = 0.20f),
                    0.5f to NagiTokens.inkNavy.copy(alpha = 0.14f),
                    1f to NagiTokens.inkNavy.copy(alpha = 0.24f)
                )
            )
            // Authority §14.2: center micro-light rgba(247,249,252,0.10)
            .drawBehind {
                drawCircle(
                    brush = Brush.radialGradient(
                        colors = listOf(NagiTokens.snow.copy(alpha = 0.10f), Color.Transparent),
                        center = Offset(size.width / 2, size.height / 2),
                        radius = size.width * 0.45f
                    ),
                    radius = size.width * 0.45f,
                    center = Offset(size.width / 2, size.height / 2)
                )
            }
            .border(
                width = 1.dp,
                color = NagiTokens.borderGlass,
                shape = NagiShapes.cutMedium
            )
            .padding(start = 24.dp, end = 24.dp, top = 28.dp, bottom = 22.dp),
        content = content
    )
}

@Composable
private fun ChapterOpeningOverlay(
    chapterName: String,
    chapterTitle: String,
    bgAssetPath: String?,
    onTap: () -> Unit
) {
    val goldColor = NagiTokens.gold
    val titleColor = NagiTokens.textSnow94
    val hintColor = NagiTokens.snow.copy(alpha = 0.82f)

    Box(modifier = Modifier
        .fillMaxSize()
        .clickable(
            interactionSource = remember { MutableInteractionSource() },
            indication = null,
            onClick = onTap
        )
    ) {
        PosterPageBackground(bgAssetPath)

        GlassBacking(
            modifier = Modifier
                .align(Alignment.BottomStart)
                .fillMaxWidth()
                .navigationBarsPadding()
                .padding(start = 30.dp, end = 30.dp, bottom = 72.dp)
        ) {
            KickerLabel("Chapter Opening")
            Spacer(modifier = Modifier.height(14.dp))
            Text(
                text = chapterName,
                fontFamily = FontFamily.Serif,
                fontSize = 14.sp,
                color = goldColor
            )
            Spacer(modifier = Modifier.height(14.dp))
            Text(
                text = chapterTitle,
                fontFamily = FontFamily.Serif,
                fontSize = 29.sp,
                lineHeight = (29 * 1.24).sp,
                color = titleColor,
                style = LocalTextStyle.current.copy(
                    shadow = Shadow(
                        color = Color.Black.copy(alpha = 0.78f),
                        offset = Offset(0f, 3f),
                        blurRadius = 28f
                    )
                )
            )
            Spacer(modifier = Modifier.height(14.dp))
            Text(
                text = "轻触继续，进入本章内容。",
                fontSize = 16.sp,
                lineHeight = (16 * 1.9).sp,
                color = hintColor
            )
        }
    }
}

@Composable
private fun SectionOpeningOverlay(
    sectionTitle: String,
    chapterName: String,
    bgAssetPath: String?,
    onTap: () -> Unit
) {
    val goldColor = NagiTokens.gold
    val titleColor = NagiTokens.textSnow94
    val hintColor = NagiTokens.snow.copy(alpha = 0.82f)

    Box(modifier = Modifier
        .fillMaxSize()
        .clickable(
            interactionSource = remember { MutableInteractionSource() },
            indication = null,
            onClick = onTap
        )
    ) {
        PosterPageBackground(bgAssetPath)

        GlassBacking(
            modifier = Modifier
                .align(Alignment.BottomStart)
                .fillMaxWidth()
                .navigationBarsPadding()
                .padding(start = 30.dp, end = 30.dp, bottom = 96.dp)
        ) {
            KickerLabel("Section Opening")
            Spacer(modifier = Modifier.height(14.dp))
            Text(
                text = chapterName,
                fontFamily = FontFamily.Serif,
                fontSize = 14.sp,
                color = goldColor
            )
            Spacer(modifier = Modifier.height(14.dp))
            Text(
                text = sectionTitle,
                fontFamily = FontFamily.Serif,
                fontSize = 29.sp,
                lineHeight = (29 * 1.24).sp,
                color = titleColor,
                style = LocalTextStyle.current.copy(
                    shadow = Shadow(
                        color = Color.Black.copy(alpha = 0.78f),
                        offset = Offset(0f, 3f),
                        blurRadius = 28f
                    )
                )
            )
            Spacer(modifier = Modifier.height(14.dp))
            Text(
                text = "轻触继续，进入本节内容。",
                fontSize = 16.sp,
                lineHeight = (16 * 1.9).sp,
                color = hintColor
            )
        }
    }
}

@Composable
private fun ChapterEndingOverlay(
    chapterName: String,
    chapterTitle: String,
    bgAssetPath: String?,
    onReturnToMenu: () -> Unit,
    onContinue: () -> Unit
) {
    val goldColor = NagiTokens.gold
    val titleColor = NagiTokens.textSnow94
    val descColor = NagiTokens.snow.copy(alpha = 0.78f)
    val dismissColor = NagiTokens.parchment.copy(alpha = 0.86f)
    val confirmColor = NagiTokens.snow

    Box(modifier = Modifier.fillMaxSize()) {
        PosterPageBackground(bgAssetPath)

        ClearCard(
            modifier = Modifier
                .align(Alignment.BottomStart)
                .fillMaxWidth()
                .navigationBarsPadding()
                .padding(start = 28.dp, end = 28.dp, bottom = 82.dp)
        ) {
            Text(
                text = "CHAPTER CLEAR",
                fontFamily = FontFamily.Default,
                fontWeight = FontWeight.Normal,
                fontSize = 11.sp,
                letterSpacing = (0.14 * 11).sp,
                color = goldColor
            )
            Spacer(modifier = Modifier.height(14.dp))
            Text(
                text = "$chapterName · $chapterTitle",
                fontFamily = FontFamily.Serif,
                fontSize = 30.sp,
                lineHeight = (30 * 1.25).sp,
                maxLines = 2,
                color = titleColor
            )
            Spacer(modifier = Modifier.height(14.dp))
            Text(
                text = "本章完成。你可以返回目录，或继续下一章内容。",
                fontSize = 13.sp,
                lineHeight = (13 * 1.8).sp,
                color = descColor
            )
            Spacer(modifier = Modifier.height(22.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "返回目录",
                    fontSize = 14.sp,
                    color = dismissColor,
                    modifier = Modifier.clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                        onClick = onReturnToMenu
                    )
                )
                Text(
                    text = "继续下一章",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium,
                    color = confirmColor,
                    modifier = Modifier.clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                        onClick = onContinue
                    )
                )
            }
        }
    }
}
