package com.antnagi.nagisheart.ui.screen

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.rememberAsyncImagePainter
import com.antnagi.nagisheart.ui.icon.NagiIcon
import com.antnagi.nagisheart.ui.icon.NagiIconButton
import com.antnagi.nagisheart.ui.theme.*
import com.antnagi.nagisheart.ui.viewmodel.BacklogEntry
import com.antnagi.nagisheart.ui.viewmodel.GameViewModel

private const val ENTRIES_PER_PAGE = 8

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun BacklogScreen(
    viewModel: GameViewModel,
    onBack: () -> Unit
) {
    val entries = remember { viewModel.getBacklog() }
    val bgAssetPath = viewModel.uiState.collectAsState().value.bgAssetPath
    val totalPages = ((entries.size + ENTRIES_PER_PAGE - 1) / ENTRIES_PER_PAGE).coerceAtLeast(1)
    val pagerState = rememberPagerState(
        initialPage = 0,
        pageCount = { totalPages }
    )

    NagiTheme(uiTheme = NagiUiTheme.Dark) {
        Box(modifier = Modifier.fillMaxSize()) {
            if (bgAssetPath != null) {
                Image(
                    painter = rememberAsyncImagePainter("file:///android_asset/$bgAssetPath"),
                    contentDescription = null,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
            }

            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(NagiTokens.systemDim.copy(alpha = 0.58f))
            )

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .statusBarsPadding()
                    .navigationBarsPadding()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 17.dp)
                        .height(44.dp)
                        .padding(top = 14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    NagiIconButton(
                        icon = NagiIcon.Back,
                        onClick = onBack
                    )
                    Spacer(modifier = Modifier.weight(1f))
                    Text(
                        text = "剧情回顾",
                        style = TextStyle(
                            fontFamily = FontFamily.Serif,
                            fontSize = 14.sp,
                            shadow = Shadow(
                                color = Color.Black.copy(alpha = 0.45f),
                                offset = Offset(0f, 1f),
                                blurRadius = 2f
                            )
                        ),
                        color = NagiTheme.colors.textPrimary
                    )
                    Spacer(modifier = Modifier.weight(1f))
                    Spacer(modifier = Modifier.width(36.dp))
                }

                Spacer(modifier = Modifier.height(22.dp))

                HorizontalPager(
                    state = pagerState,
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth()
                ) { page ->
                    val startIdx = page * ENTRIES_PER_PAGE
                    val endIdx = (startIdx + ENTRIES_PER_PAGE).coerceAtMost(entries.size)
                    val pageEntries = if (startIdx < entries.size) entries.subList(startIdx, endIdx) else emptyList()

                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(start = 50.dp, end = 50.dp)
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .verticalScroll(rememberScrollState())
                        ) {
                            pageEntries.forEachIndexed { index, entry ->
                                BacklogItem(
                                    entry = entry,
                                    isFirst = index == 0
                                )
                            }
                        }
                    }
                }

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 16.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "${pagerState.currentPage + 1} / $totalPages",
                        fontSize = 12.sp,
                        color = NagiTokens.parchment.copy(alpha = 0.60f)
                    )
                }
            }
        }
    }
}

@Composable
private fun BacklogItem(
    entry: BacklogEntry,
    isFirst: Boolean
) {
    if (entry.speaker.isNotBlank()) {
        RecapDialogueItem(entry = entry, isFirst = isFirst)
    } else {
        RecapNarrationItem(entry = entry, isFirst = isFirst)
    }
}

@Composable
private fun RecapNarrationItem(
    entry: BacklogEntry,
    isFirst: Boolean
) {
    val textShadow = Shadow(
        color = Color.Black.copy(alpha = 0.34f),
        offset = Offset(0f, 3f),
        blurRadius = 12f
    )

    Column(modifier = Modifier.fillMaxWidth()) {
        if (!isFirst) {
            Spacer(modifier = Modifier.height(22.dp))
        }

        Text(
            text = entry.text,
            style = TextStyle(
                fontFamily = FontFamily.Serif,
                fontWeight = FontWeight.Normal,
                fontSize = 16.sp,
                lineHeight = (16 * 1.92).sp,
                shadow = textShadow
            ),
            color = NagiTokens.parchment.copy(alpha = 0.92f)
        )
    }
}

@Composable
private fun RecapDialogueItem(
    entry: BacklogEntry,
    isFirst: Boolean
) {
    val speakerShadow = Shadow(
        color = Color.Black.copy(alpha = 0.48f),
        offset = Offset(0f, 1f),
        blurRadius = 8f
    )
    val dialogueShadow = Shadow(
        color = Color.Black.copy(alpha = 0.36f),
        offset = Offset(0f, 1f),
        blurRadius = 10f
    )

    Column(modifier = Modifier.fillMaxWidth()) {
        if (!isFirst) {
            Spacer(modifier = Modifier.height(24.dp))
        }

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .drawBehind {
                    val lineTop = 12.dp.toPx()
                    val lineHeight = size.height - (24.dp.toPx())
                    val lineWidth = 1.dp.toPx()
                    val glowWidth = 8.dp.toPx()

                    drawRect(
                        brush = Brush.verticalGradient(
                            0f to Color.Transparent,
                            0.5f to NagiTokens.speakerGold.copy(alpha = 0.08f),
                            1f to Color.Transparent
                        ),
                        topLeft = Offset(0f, lineTop),
                        size = Size(glowWidth, lineHeight)
                    )
                    drawRect(
                        brush = Brush.verticalGradient(
                            0f to Color.Transparent,
                            0.5f to NagiTokens.speakerGold.copy(alpha = 0.72f),
                            1f to Color.Transparent
                        ),
                        topLeft = Offset(0f, lineTop),
                        size = Size(lineWidth, lineHeight)
                    )
                }
                .background(
                    Brush.horizontalGradient(
                        0f to NagiTokens.deepBlue.copy(alpha = 0.40f),
                        0.62f to NagiTokens.deepBlue.copy(alpha = 0.18f),
                        1f to NagiTokens.deepBlue.copy(alpha = 0.04f)
                    )
                )
                .padding(start = 17.dp, top = 13.dp, end = 15.dp, bottom = 15.dp)
        ) {
            Column(
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    text = entry.speaker,
                    style = TextStyle(
                        fontFamily = FontFamily.Default,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 12.sp,
                        letterSpacing = (12 * 0.08).sp,
                        shadow = speakerShadow
                    ),
                    color = NagiTokens.speakerGold
                )

                Text(
                    text = entry.text,
                    style = TextStyle(
                        fontFamily = FontFamily.Default,
                        fontWeight = FontWeight.Normal,
                        fontSize = 15.sp,
                        lineHeight = (15 * 1.82).sp,
                        letterSpacing = (15 * 0.01).sp,
                        shadow = dialogueShadow
                    ),
                    color = NagiTokens.snow.copy(alpha = 0.94f)
                )
            }
        }
    }
}
