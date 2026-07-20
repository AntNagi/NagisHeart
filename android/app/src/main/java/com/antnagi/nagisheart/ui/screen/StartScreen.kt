package com.antnagi.nagisheart.ui.screen

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.rememberAsyncImagePainter
import com.antnagi.nagisheart.ui.component.SystemPageBackground
import com.antnagi.nagisheart.ui.theme.*

@Composable
fun StartScreen(
    onStartNew: () -> Unit,
    onContinue: () -> Unit,
    onSave: () -> Unit = {},
    onSettings: () -> Unit = {},
    onChapter: () -> Unit = {},
    onGallery: () -> Unit = {},
    hasSave: Boolean = false,
    hasCompletedEnding: Boolean = false
) {
    NagiTheme(uiTheme = NagiUiTheme.Dark) {
        SystemPageBackground {
            Box(modifier = Modifier.fillMaxSize()) {
                // Start menu — bottom
                Column(
                    modifier = Modifier
                        .align(Alignment.BottomCenter)
                        .fillMaxWidth()
                        .padding(horizontal = 28.dp)
                        .padding(bottom = 22.dp)
                        .navigationBarsPadding(),
                    verticalArrangement = Arrangement.spacedBy(18.dp) // §P2-2: gap 18dp
                ) {
                    if (hasSave && !hasCompletedEnding) {
                        PrimaryStartButton(
                            text = "继续故事",
                            subtitle = "从上次继续",
                            onClick = onContinue
                        )
                    }

                    PrimaryStartButton(
                        text = when {
                            hasSave -> "新的故事"
                            hasCompletedEnding -> "新的故事"
                            else -> "开始故事"
                        },
                        subtitle = if (hasSave) "重新开始" else null,
                        onClick = onStartNew
                    )

                    // §P2-2: divider between primary and secondary actions
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .drawBehind {
                                drawLine(
                                    color = Color(0x14FFFFFF), // rgba(255,255,255,0.08)
                                    start = Offset(0f, 0f),
                                    end = Offset(size.width, 0f),
                                    strokeWidth = 1f
                                )
                            }
                            .padding(top = 16.dp) // §P2-2: padding-top 16dp
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            MinorAction("存档进度", onSave, Modifier.weight(1f))
                            MinorAction("章节目录", onChapter, Modifier.weight(1f))
                            MinorAction("回忆画廊", onGallery, Modifier.weight(1f))
                            MinorAction("系统设置", onSettings, Modifier.weight(1f))
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun PrimaryStartButton(
    text: String,
    subtitle: String?,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .heightIn(min = 44.dp)
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onClick
            )
            .padding(start = 30.dp, end = 8.dp, top = 8.dp, bottom = 8.dp)
    ) {
        Box(
            modifier = Modifier
                .size(9.dp)
                .align(Alignment.CenterStart)
                .offset(x = (-26).dp)
                .clip(NagiShapes.pentagon)
                .background(NagiPalette.roseGold.copy(alpha = 0.76f))
        )
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = text,
                fontSize = 17.sp, // §P2-2: 17sp
                fontWeight = FontWeight.Medium,
                color = NagiPalette.snowWhite
            )
            if (subtitle != null) {
                Text(
                    text = subtitle,
                    fontSize = 13.sp, // §P2-2: 13sp
                    color = NagiPalette.silver.copy(alpha = 0.82f)
                )
            }
        }
    }
}

@Composable
private fun MinorAction(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .heightIn(min = 30.dp)
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onClick
            ),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = text,
            fontSize = 12.sp, // §P2-2: 12sp
            color = Color(0xE6F4F1EA) // §P2-2: rgba(244,241,234,0.90)
        )
    }
}
