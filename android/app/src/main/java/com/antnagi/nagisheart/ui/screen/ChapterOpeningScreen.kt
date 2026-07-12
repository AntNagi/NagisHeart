package com.antnagi.nagisheart.ui.screen

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.material3.LocalTextStyle
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
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
    val titleColor = Color(0xF5F7F9FC)
    val hintColor = Color(0xF0F7F9FC)
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
            // Gradient overlay
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

            // Content: left-aligned, bottom-anchored
            Column(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .fillMaxWidth()
                    .navigationBarsPadding()
                    .padding(start = 30.dp, end = 30.dp, bottom = 72.dp)
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
                Spacer(modifier = Modifier.height(14.dp))
                // Bottom hint
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
}

@Composable
private fun KickerLabel(text: String) {
    val goldColor = Color(0xFFD7BE86)
    androidx.compose.foundation.layout.Row(
        verticalAlignment = Alignment.CenterVertically
    ) {
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
