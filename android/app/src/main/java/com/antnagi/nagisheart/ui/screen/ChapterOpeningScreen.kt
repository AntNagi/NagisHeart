package com.antnagi.nagisheart.ui.screen

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.material3.LocalTextStyle
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.rememberAsyncImagePainter
import com.antnagi.nagisheart.ui.theme.*

@Composable
fun ChapterOpeningScreen(
    chapterName: String,
    chapterTitle: String,
    chapterSubtitle: String? = null,
    bgAssetPath: String? = null,
    onContinue: () -> Unit
) {
    val goldColor = Color(0xFFD7BE86)
    val titleColor = Color(0xF0F7F9FC)  // 94%
    val hintColor = Color(0xD1F7F9FC)   // 82%
    val bgPath = bgAssetPath ?: "bg/pillow.jpg"

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
            // Background: current chapter bg
            Image(
                painter = rememberAsyncImagePainter("file:///android_asset/$bgPath"),
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )
            // Dark readability overlay
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

            // Authority §14.1: light glass backing wrapping the entire text group
            // position: bottom=72, left/right=30, padding 24/24/22/20
            // bg: horizontal gradient rgba(16,24,39,0.30)→0.14@62%→transparent + center highlight rgba(247,249,252,0.09)
            // border: rgba(255,255,255,0.08), 1dp
            // shape: cut-md
            Column(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .fillMaxWidth()
                    .navigationBarsPadding()
                    .padding(start = 30.dp, end = 30.dp, bottom = 72.dp)
                    .clip(NagiShapes.cutMedium)
                    .background(
                        Brush.horizontalGradient(
                            0f to Color(0x4D101827),    // 30%
                            0.62f to Color(0x24101827), // 14%
                            1f to Color.Transparent
                        )
                    )
                    // Center highlight
                    .drawBehind {
                        drawCircle(
                            brush = Brush.radialGradient(
                                colors = listOf(Color(0x17F7F9FC), Color.Transparent),
                                center = Offset(size.width / 2, size.height / 2),
                                radius = size.width * 0.5f
                            ),
                            radius = size.width * 0.5f,
                            center = Offset(size.width / 2, size.height / 2)
                        )
                    }
                    .border(1.dp, Color(0x14FFFFFF), NagiShapes.cutMedium)
                    .padding(start = 24.dp, end = 24.dp, top = 22.dp, bottom = 20.dp)
            ) {
                // Kicker
                KickerLabel("Chapter Opening")
                Spacer(modifier = Modifier.height(14.dp))
                // Chapter label
                Text(
                    text = chapterName,
                    fontFamily = FontFamily.Serif,
                    fontSize = 14.sp,
                    color = goldColor
                )
                Spacer(modifier = Modifier.height(14.dp))
                // Title
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
                if (chapterSubtitle != null) {
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = chapterSubtitle,
                        fontSize = 14.sp,
                        lineHeight = (14 * 1.6).sp,
                        color = Color(0xB3F7F9FC)
                    )
                }
                Spacer(modifier = Modifier.height(14.dp))
                // Bottom hint
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
