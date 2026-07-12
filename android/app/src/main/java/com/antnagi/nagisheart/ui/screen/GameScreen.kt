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
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shadow
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
    onNavigateToSectionClear: () -> Unit = {},
    onReplayFinished: () -> Unit = {}
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
                                bgAssetPath = state.bgAssetPath
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
                            bgAssetPath = state.bgAssetPath
                        )
                    }
                }

                GamePhase.SectionTransition -> {
                    state.sectionTransition?.let { info ->
                        SectionOpeningOverlay(
                            sectionTitle = info.sectionTitle,
                            chapterName = info.chapterName,
                            bgAssetPath = state.bgAssetPath
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
            if (debugOverlayVisible) {
                state.debugInfo?.let { info ->
                    DebugOverlay(
                        debugInfo = info,
                        modifier = Modifier
                            .align(Alignment.TopStart)
                            .statusBarsPadding()
                            .padding(top = NagiTheme.sizes.hudButton)
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
                        .padding(top = 52.dp, end = 12.dp)
                        .background(
                            NagiTheme.colors.glassBg,
                            shape = androidx.compose.foundation.shape.RoundedCornerShape(14.dp)
                        )
                        .border(
                            width = 0.5.dp,
                            color = NagiTheme.colors.borderSubtle,
                            shape = androidx.compose.foundation.shape.RoundedCornerShape(14.dp)
                        )
                        .clickable { showSkipConfirm = true }
                        .padding(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Text(
                        text = "跳过本节",
                        style = NagiTheme.typography.micro,
                        color = NagiTheme.colors.textSecondary.copy(alpha = 0.7f)
                    )
                }
            }

            if (showSkipConfirm) {
                val sectionTitle = viewModel.getCurrentSectionTitle()
                NagiDialog(
                    onDismissRequest = { showSkipConfirm = false },
                    title = "跳过本节",
                    text = if (sectionTitle.isNotEmpty()) "确定跳过「$sectionTitle」？跳过后将直接进入本节结束页。"
                           else "确定跳过当前章节？跳过后将直接进入本节结束页。",
                    confirmText = "确定跳过",
                    onConfirm = {
                        showSkipConfirm = false
                        viewModel.skipSection()
                        onNavigateToSectionClear()
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
    bgAssetPath: String? = null
) {
    val accentColor = when {
        ending.tag.contains("TRUE") -> NagiPalette.paleGold
        ending.tag.contains("GOOD") -> NagiPalette.roseGold
        ending.tag.contains("BAD") -> NagiPalette.driedWine
        else -> NagiPalette.nagiGrayBlue
    }

    Box(
        modifier = Modifier.fillMaxSize()
    ) {
        if (bgAssetPath != null) {
            Image(
                painter = rememberAsyncImagePainter(
                    model = "file:///android_asset/$bgAssetPath"
                ),
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(NagiPalette.deepBlueNight.copy(alpha = 0.4f))
            )
        } else {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(NagiPalette.deepBlueNight)
            )
        }

        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier
                .align(Alignment.Center)
                .padding(horizontal = NagiTheme.spacing.xl)
        ) {
            Text(
                text = ending.tag,
                style = NagiTheme.typography.caption,
                color = accentColor
            )
            Spacer(modifier = Modifier.height(NagiTheme.spacing.s))
            Text(
                text = ending.title,
                style = NagiTheme.typography.titlePage,
                color = NagiPalette.snowWhite
            )
            Spacer(modifier = Modifier.height(NagiTheme.spacing.xxl))
            Text(
                text = ending.description,
                style = NagiTheme.typography.narration,
                color = NagiPalette.silverBlue
            )
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
                    0f to Color(0x38132033),
                    0.24f to Color(0x1A132033),
                    0.58f to Color(0x2E132033),
                    1f to Color(0x6B132033)
                )
            )
    )
}

@Composable
private fun KickerLabel(text: String) {
    val goldColor = Color(0xFFD7BE86)
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
private fun ChapterOpeningOverlay(
    chapterName: String,
    chapterTitle: String,
    bgAssetPath: String?
) {
    val goldColor = Color(0xFFD7BE86)
    val titleColor = Color(0xF5F7F9FC)
    val hintColor = Color(0xF0F7F9FC)

    Box(modifier = Modifier.fillMaxSize()) {
        PosterPageBackground(bgAssetPath)

        Column(
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
                        color = Color(0xC7000000),
                        offset = Offset(0f, 3f),
                        blurRadius = 28f
                    )
                )
            )
            Spacer(modifier = Modifier.height(14.dp))
            Box(
                modifier = Modifier
                    .widthIn(max = 320.dp)
                    .background(
                        Brush.horizontalGradient(
                            listOf(Color(0x33101827), Color.Transparent)
                        )
                    )
                    .padding(vertical = 4.dp)
            ) {
                Text(
                    text = "轻触继续，进入本章内容。",
                    fontSize = 16.sp,
                    lineHeight = (16 * 1.9).sp,
                    color = hintColor,
                    style = LocalTextStyle.current.copy(
                        shadow = Shadow(
                            color = Color(0xB8000000),
                            offset = Offset(0f, 2f),
                            blurRadius = 22f
                        )
                    )
                )
            }
        }
    }
}

@Composable
private fun SectionOpeningOverlay(
    sectionTitle: String,
    chapterName: String,
    bgAssetPath: String?
) {
    val goldColor = Color(0xFFD7BE86)
    val titleColor = Color(0xF5F7F9FC)
    val hintColor = Color(0xF0F7F9FC)

    Box(modifier = Modifier.fillMaxSize()) {
        PosterPageBackground(bgAssetPath)

        Column(
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
                        color = Color(0xC7000000),
                        offset = Offset(0f, 3f),
                        blurRadius = 28f
                    )
                )
            )
            Spacer(modifier = Modifier.height(14.dp))
            Box(
                modifier = Modifier
                    .widthIn(max = 320.dp)
                    .background(
                        Brush.horizontalGradient(
                            listOf(Color(0x33101827), Color.Transparent)
                        )
                    )
                    .padding(vertical = 4.dp)
            ) {
                Text(
                    text = "轻触继续，进入本节内容。",
                    fontSize = 16.sp,
                    lineHeight = (16 * 1.9).sp,
                    color = hintColor,
                    style = LocalTextStyle.current.copy(
                        shadow = Shadow(
                            color = Color(0xB8000000),
                            offset = Offset(0f, 2f),
                            blurRadius = 22f
                        )
                    )
                )
            }
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
    val goldColor = Color(0xFFD7BE86)
    val titleColor = Color(0xF5F7F9FC)
    val descColor = Color(0xC7F7F9FC)
    val dismissColor = Color(0xB8F4F1EA)
    val confirmColor = Color(0xFFF4F1EA)

    Box(modifier = Modifier.fillMaxSize()) {
        PosterPageBackground(bgAssetPath)

        Column(
            modifier = Modifier
                .align(Alignment.BottomStart)
                .fillMaxWidth()
                .navigationBarsPadding()
                .padding(start = 30.dp, end = 30.dp, bottom = 72.dp)
        ) {
            KickerLabel("CHAPTER CLEAR")
            Spacer(modifier = Modifier.height(14.dp))
            Text(
                text = "$chapterName · $chapterTitle",
                fontFamily = FontFamily.Serif,
                fontSize = 29.sp,
                lineHeight = (29 * 1.24).sp,
                color = titleColor,
                style = LocalTextStyle.current.copy(
                    shadow = Shadow(
                        color = Color(0xC7000000),
                        offset = Offset(0f, 3f),
                        blurRadius = 28f
                    )
                )
            )
            Spacer(modifier = Modifier.height(14.dp))
            Text(
                text = "本章完成。你可以返回目录，或继续下一章内容。",
                fontSize = 16.sp,
                lineHeight = (16 * 1.9).sp,
                color = descColor,
                style = LocalTextStyle.current.copy(
                    shadow = Shadow(
                        color = Color(0xB8000000),
                        offset = Offset(0f, 2f),
                        blurRadius = 22f
                    )
                )
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
