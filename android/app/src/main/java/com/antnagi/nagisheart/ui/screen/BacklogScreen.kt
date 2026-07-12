package com.antnagi.nagisheart.ui.screen

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.lazy.rememberLazyListState
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

@Composable
fun BacklogScreen(
    viewModel: GameViewModel,
    onBack: () -> Unit
) {
    val entries = remember { viewModel.getBacklog() }
    val bgAssetPath = viewModel.uiState.collectAsState().value.bgAssetPath
    val listState = rememberLazyListState(
        initialFirstVisibleItemIndex = (entries.size - 1).coerceAtLeast(0)
    )

    NagiTheme(uiTheme = NagiUiTheme.Dark) {
        Box(modifier = Modifier.fillMaxSize()) {
            // Current scene bg
            if (bgAssetPath != null) {
                Image(
                    painter = rememberAsyncImagePainter("file:///android_asset/$bgAssetPath"),
                    contentDescription = null,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
            }

            // Heavy dark overlay for readability
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color(0xFF132033).copy(alpha = 0.52f))
            )

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .statusBarsPadding()
                    .navigationBarsPadding()
            ) {
                // HUD header
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
                                color = Color(0xB8000000),
                                offset = Offset(0f, 2f),
                                blurRadius = 14f
                            )
                        ),
                        color = NagiTheme.colors.hudColor.copy(alpha = 0.64f)
                    )
                    Spacer(modifier = Modifier.weight(1f))
                    Spacer(modifier = Modifier.width(36.dp))
                }

                Spacer(modifier = Modifier.height(22.dp))

                // Content — immersive full-page text
                LazyColumn(
                    state = listState,
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(start = 50.dp, end = 50.dp)
                        .padding(bottom = 78.dp)
                ) {
                    itemsIndexed(entries) { index, entry ->
                        BacklogItem(
                            entry = entry,
                            isFirst = index == 0
                        )
                    }
                    item {
                        Spacer(modifier = Modifier.height(40.dp))
                    }
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
    val goldColor = Color(0xFFD7BE86)
    val textColor = Color(0xFFF6F3EE)
    val textShadow = Shadow(
        color = Color(0x57000000),
        offset = Offset(0f, 3f),
        blurRadius = 12f
    )
    val speakerShadow = Shadow(
        color = Color(0x47000000),
        offset = Offset(0f, 2f),
        blurRadius = 10f
    )

    Column(modifier = Modifier.fillMaxWidth()) {
        if (entry.speaker.isNotEmpty()) {
            if (!isFirst) {
                Spacer(modifier = Modifier.height(26.dp))
            }
            Text(
                text = entry.speaker,
                style = TextStyle(
                    fontFamily = FontFamily.Default,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 13.sp,
                    letterSpacing = 0.02.sp,
                    shadow = speakerShadow
                ),
                color = goldColor
            )
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
