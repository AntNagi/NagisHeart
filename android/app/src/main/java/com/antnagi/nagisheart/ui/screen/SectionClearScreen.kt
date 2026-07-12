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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.rememberAsyncImagePainter
import com.antnagi.nagisheart.ui.theme.*

@Composable
fun SectionClearScreen(
    sectionTitle: String,
    bgAssetPath: String? = null,
    isSkipped: Boolean = false,
    onReturnToMenu: () -> Unit = {},
    onContinue: () -> Unit
) {
    val goldColor = Color(0xFFD7BE86)
    val titleColor = Color(0xF5F7F9FC)
    val descColor = Color(0xC7F7F9FC)
    val dismissColor = Color(0xB8F4F1EA)
    val confirmColor = Color(0xFFF4F1EA)
    val bgPath = bgAssetPath ?: "bg/pillow.jpg"

    NagiTheme(uiTheme = NagiUiTheme.Dark) {
        Box(modifier = Modifier.fillMaxSize()) {
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

            Column(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .fillMaxWidth()
                    .navigationBarsPadding()
                    .padding(start = 30.dp, end = 30.dp, bottom = 72.dp)
            ) {
                // Kicker
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
                        text = "SECTION CLEAR",
                        fontSize = 12.sp,
                        color = goldColor
                    )
                }
                Spacer(modifier = Modifier.height(14.dp))
                // Title
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
                // Description
                Text(
                    text = if (isSkipped) "本节已跳过。你可以返回目录，或继续下一节内容。"
                           else "本节完成。你可以返回目录，或继续下一节内容。",
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
                // Action buttons
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
                        text = "进入下一节",
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
}
