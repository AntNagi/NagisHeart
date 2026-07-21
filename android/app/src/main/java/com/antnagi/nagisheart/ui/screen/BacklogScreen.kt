package com.antnagi.nagisheart.ui.screen

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
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
    val goldColor = NagiTokens.speakerGold
    val textColor = Color(0xFFF6F3EE) // token-exempt
    val textShadow = Shadow(
        color = Color.Black.copy(alpha = 0.34f),
        offset = Offset(0f, 3f),
        blurRadius = 12f
    )
    val speakerShadow = Shadow(
        color = Color.Black.copy(alpha = 0.72f),
        offset = Offset(0f, 1f),
        blurRadius = 2f
    )
    val speakerHalo = Shadow(
        color = NagiTokens.goldGlow,
        offset = Offset(0f, 0f),
        blurRadius = 10f
    )

    Column(modifier = Modifier.fillMaxWidth()) {
        if (entry.speaker.isNotEmpty()) {
            if (!isFirst) {
                Spacer(modifier = Modifier.height(26.dp))
            }
            Box {
                Text(
                    text = entry.speaker,
                    style = TextStyle(
                        fontFamily = FontFamily.Default,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 13.sp,
                        letterSpacing = 0.04.sp,
                        shadow = speakerHalo
                    ),
                    color = goldColor
                )
                Text(
                    text = entry.speaker,
                    style = TextStyle(
                        fontFamily = FontFamily.Default,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 13.sp,
                        letterSpacing = 0.04.sp,
                        shadow = speakerShadow
                    ),
                    color = goldColor
                )
            }
            Spacer(modifier = Modifier.height(10.dp))
        } else if (!isFirst) {
            Spacer(modifier = Modifier.height(22.dp))
        }

        Text(
            text = entry.text,
            style = TextStyle(
                fontFamily = FontFamily.Serif,
                fontWeight = FontWeight.Normal,
                fontSize = 16.sp,
                lineHeight = 32.sp,
                shadow = textShadow
            ),
            color = textColor
        )
    }
}
