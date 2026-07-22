package com.antnagi.nagisheart.ui.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.material3.LocalTextStyle
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.antnagi.nagisheart.ui.theme.NagiTheme
import com.antnagi.nagisheart.ui.theme.NagiTokens
import com.antnagi.nagisheart.ui.theme.NagiUiTheme

@Composable
fun ChapterOpeningScreen(
    chapterName: String,
    chapterTitle: String,
    chapterSubtitle: String? = null,
    bgAssetPath: String? = null,
    onContinue: () -> Unit
) {
    NagiTheme(uiTheme = NagiUiTheme.Dark) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    onClick = onContinue
                )
        ) {
            ChapterOpeningAuthorityBackground()

            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(top = 96.dp, start = 42.dp, end = 42.dp, bottom = 90.dp),
                contentAlignment = Alignment.Center
            ) {
                Box(
                    modifier = Modifier
                        .align(Alignment.Center)
                        .fillMaxWidth()
                        .offset(y = (-104).dp)
                        .height(1.dp)
                        .background(
                            Brush.horizontalGradient(
                                0f to Color.Transparent,
                                0.5f to NagiTokens.gold.copy(alpha = 0.44f),
                                1f to Color.Transparent
                            )
                        )
                )

                Column(
                    modifier = Modifier.widthIn(max = 330.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(18.dp)
                ) {
                    Text(
                        text = chapterEyebrow(chapterName),
                        fontSize = 12.sp,
                        letterSpacing = (0.22 * 12).sp,
                        color = NagiTokens.gold.copy(alpha = 0.82f),
                        style = authorityTextShadow()
                    )
                    Text(
                        text = chapterName,
                        fontFamily = FontFamily.Serif,
                        fontSize = 18.sp,
                        letterSpacing = (0.18 * 18).sp,
                        color = NagiTokens.snow.copy(alpha = 0.72f),
                        style = authorityTextShadow()
                    )
                    Text(
                        text = chapterTitle,
                        fontFamily = FontFamily.Serif,
                        fontSize = 34.sp,
                        lineHeight = (34 * 1.34).sp,
                        letterSpacing = (0.02 * 34).sp,
                        color = NagiTokens.textSnow94,
                        style = authorityTextShadow()
                    )
                    if (!chapterSubtitle.isNullOrBlank()) {
                        Text(
                            text = chapterSubtitle,
                            modifier = Modifier.widthIn(max = 310.dp),
                            fontFamily = FontFamily.Serif,
                            fontSize = 16.sp,
                            lineHeight = (16 * 1.92).sp,
                            color = NagiTokens.parchment.copy(alpha = 0.78f),
                            style = authorityTextShadow()
                        )
                    }
                }
            }

            Text(
                text = "轻触继续",
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .navigationBarsPadding()
                    .padding(bottom = 58.dp),
                fontSize = 13.sp,
                letterSpacing = (0.08 * 13).sp,
                color = NagiTokens.snow.copy(alpha = 0.56f),
                style = authorityTextShadow()
            )
        }
    }
}

@Composable
private fun ChapterOpeningAuthorityBackground() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .drawBehind {
                drawRect(
                    brush = Brush.linearGradient(
                        0f to NagiTokens.authorityVoid,
                        0.42f to NagiTokens.authorityDeep,
                        0.72f to NagiTokens.deepBlue,
                        1f to NagiTokens.authorityVoidEnd,
                        start = Offset.Zero,
                        end = Offset(size.width, size.height)
                    )
                )
                drawRect(
                    brush = Brush.radialGradient(
                        0f to NagiTokens.deepBlue.copy(alpha = 0.18f),
                        0.46f to Color.Transparent,
                        center = Offset(size.width * 0.5f, size.height * 0.5f),
                        radius = size.maxDimension * 0.58f
                    )
                )
                drawRect(
                    brush = Brush.verticalGradient(
                        0f to NagiTokens.scrimDark.copy(alpha = 0.22f),
                        0.35f to NagiTokens.scrimDark.copy(alpha = 0.02f),
                        1f to NagiTokens.scrimDark.copy(alpha = 0.48f)
                    )
                )
            }
    )
}

@Composable
private fun authorityTextShadow() = LocalTextStyle.current.copy(
    shadow = Shadow(
        color = Color.Black.copy(alpha = 0.64f),
        offset = Offset(0f, 4f),
        blurRadius = 24f
    )
)

private fun chapterEyebrow(chapterName: String): String {
    val number = when {
        chapterName.contains("一") -> "01"
        chapterName.contains("二") -> "02"
        chapterName.contains("三") -> "03"
        chapterName.contains("四") -> "04"
        chapterName.contains("五") -> "05"
        chapterName.contains("六") -> "06"
        chapterName.contains("七") -> "07"
        chapterName.contains("八") -> "08"
        chapterName.contains("九") -> "09"
        else -> null
    }
    return if (number != null) "Chapter $number" else "Chapter"
}
