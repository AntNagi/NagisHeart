package com.antnagi.nagisheart.ui.screen

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
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
    val titleColor = Color(0xF0F7F9FC)
    val descColor = Color(0xC7F7F9FC)
    val dismissColor = Color(0xDBF4F1EA)
    val confirmColor = Color(0xFFF7F9FC)
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
                    .padding(start = 28.dp, end = 28.dp, bottom = 82.dp)
                    .clip(NagiShapes.cutMedium)
                    .background(
                        Brush.verticalGradient(
                            0f to Color(0x331B2436),
                            0.5f to Color(0x241B2436),
                            1f to Color(0x3D1B2436)
                        )
                    )
                    .border(
                        width = 1.dp,
                        color = Color(0x14FFFFFF),
                        shape = NagiShapes.cutMedium
                    )
                    .padding(start = 24.dp, end = 24.dp, top = 28.dp, bottom = 22.dp)
            ) {
                Text(
                    text = "SECTION CLEAR",
                    fontFamily = FontFamily.Default,
                    fontWeight = FontWeight.Normal,
                    fontSize = 11.sp,
                    letterSpacing = (0.14 * 11).sp,
                    color = goldColor
                )
                Spacer(modifier = Modifier.height(14.dp))
                Text(
                    text = sectionTitle,
                    fontFamily = FontFamily.Serif,
                    fontSize = 28.sp,
                    lineHeight = (28 * 1.25).sp,
                    maxLines = 2,
                    color = titleColor
                )
                Spacer(modifier = Modifier.height(14.dp))
                Text(
                    text = if (isSkipped) "本节已跳过完成。你可以返回目录，或继续下一节内容。"
                           else "本节完成。你可以返回目录，或继续下一节内容。",
                    fontSize = 13.sp,
                    lineHeight = (13 * 1.8).sp,
                    color = descColor
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
