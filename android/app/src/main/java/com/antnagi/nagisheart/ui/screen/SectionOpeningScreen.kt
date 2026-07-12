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
fun SectionOpeningScreen(
    sectionTitle: String,
    chapterName: String,
    onContinue: () -> Unit
) {
    NagiTheme(uiTheme = NagiUiTheme.Dark) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        0f to NagiPalette.deepBlueNight.copy(alpha = 0.92f),
                        0.5f to NagiPalette.deepBlueNight.copy(alpha = 0.96f),
                        1f to NagiPalette.deepBlueNight
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
                Text(
                    text = chapterName,
                    style = NagiTheme.typography.micro.copy(letterSpacing = 1.sp),
                    color = NagiPalette.silverBlue.copy(alpha = 0.5f),
                    textAlign = TextAlign.Center
                )
                Spacer(modifier = Modifier.height(12.dp))

                // Gold line above title
                Canvas(modifier = Modifier.width(60.dp).height(1.dp)) {
                    drawLine(
                        color = NagiPalette.paleGold.copy(alpha = 0.4f),
                        start = Offset(0f, size.height / 2),
                        end = Offset(size.width, size.height / 2),
                        strokeWidth = 1f
                    )
                }
                Spacer(modifier = Modifier.height(16.dp))

                Text(
                    text = sectionTitle,
                    style = NagiTheme.typography.titlePage,
                    color = NagiPalette.snowWhite.copy(alpha = 0.88f),
                    textAlign = TextAlign.Center
                )
                Spacer(modifier = Modifier.height(16.dp))

                // Gold line below title
                Canvas(modifier = Modifier.width(60.dp).height(1.dp)) {
                    drawLine(
                        color = NagiPalette.paleGold.copy(alpha = 0.4f),
                        start = Offset(0f, size.height / 2),
                        end = Offset(size.width, size.height / 2),
                        strokeWidth = 1f
                    )
                }
            }

            // Bottom hint
            Text(
                text = "轻触继续",
                style = NagiTheme.typography.micro,
                color = NagiPalette.silverBlue.copy(alpha = 0.45f),
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .navigationBarsPadding()
                    .padding(bottom = 36.dp)
            )
        }
    }
}
