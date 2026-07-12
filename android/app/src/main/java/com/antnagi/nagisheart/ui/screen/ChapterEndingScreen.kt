package com.antnagi.nagisheart.ui.screen

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.antnagi.nagisheart.ui.theme.*

@Composable
fun ChapterEndingScreen(
    chapterName: String,
    chapterTitle: String,
    onContinue: () -> Unit
) {
    NagiTheme(uiTheme = NagiUiTheme.Dark) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        0f to NagiPalette.deepBlueNight,
                        0.5f to NagiPalette.deepBlueNight,
                        1f to NagiPalette.deepBlueNight.copy(alpha = 0.95f)
                    )
                )
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    onClick = onContinue
                )
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .align(Alignment.Center)
                    .padding(horizontal = 36.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                GoldDividerWithText(text = "$chapterName · 完")
                Spacer(modifier = Modifier.height(24.dp))

                Text(
                    text = chapterTitle,
                    style = NagiTheme.typography.titlePage,
                    color = NagiPalette.snowWhite.copy(alpha = 0.85f),
                    textAlign = TextAlign.Center
                )
                Spacer(modifier = Modifier.height(16.dp))

                Canvas(modifier = Modifier.width(120.dp).height(1.dp)) {
                    drawLine(
                        color = NagiPalette.paleGold.copy(alpha = 0.3f),
                        start = Offset(0f, size.height / 2),
                        end = Offset(size.width, size.height / 2),
                        strokeWidth = 1f
                    )
                }
                Spacer(modifier = Modifier.height(16.dp))

                GoldDiamond(size = 8.dp)
            }

            Column(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .navigationBarsPadding()
                    .padding(bottom = 36.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "前往下一章",
                    style = NagiTheme.typography.titleSection,
                    color = NagiPalette.paleGold.copy(alpha = 0.75f)
                )
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "轻触继续",
                    style = NagiTheme.typography.micro,
                    color = NagiPalette.silverBlue.copy(alpha = 0.45f)
                )
            }
        }
    }
}
