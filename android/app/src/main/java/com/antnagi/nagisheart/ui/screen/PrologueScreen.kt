package com.antnagi.nagisheart.ui.screen

import androidx.compose.animation.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.material3.LocalTextStyle
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.rememberAsyncImagePainter
import com.antnagi.nagisheart.data.PrologueLine
import com.antnagi.nagisheart.ui.theme.*

private val GoldColor = Color(0xFFD7BE86)
private val TextPrimary = Color(0xFFF7F3EC)
private val HeaderTextColor = Color(0xEBF4F1EA)
private val GoldLineColor = Color(0x99D7BE86)
private val DividerColor = Color(0x66F4F1EA)
private val HintColor = Color(0xD6F4F1EA)

@Composable
fun PrologueScreen(
    lines: List<PrologueLine>,
    onFinished: () -> Unit
) {
    var index by remember { mutableStateOf(0) }
    val total = lines.size

    NagiTheme(uiTheme = NagiUiTheme.Dark) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null
                ) {
                    if (index < lines.size - 1) index++ else onFinished()
                }
        ) {
            // Background
            Image(
                painter = rememberAsyncImagePainter("file:///android_asset/bg/poster_start_nagis_heart_bg_clean.png"),
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )
            // Dark overlay
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color(0x52132033))
            )

            // Header: 开场白 · 01 / 08
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .statusBarsPadding()
                    .padding(start = 48.dp, top = 34.dp, end = 48.dp, bottom = 0.dp),
                contentAlignment = Alignment.Center
            ) {
                HeaderWithDecoration(
                    text = "开场白 · %02d / %02d".format(index + 1, total)
                )
            }

            // Center content: animated quote
            AnimatedContent(
                targetState = index,
                transitionSpec = {
                    fadeIn(NagiMotion.scene()) togetherWith fadeOut(NagiMotion.scene())
                },
                label = "prologue",
                modifier = Modifier
                    .fillMaxWidth()
                    .align(Alignment.Center)
            ) { i ->
                if (i in lines.indices) {
                    val line = lines[i]
                    val isQuote = line.text.startsWith("「")
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 120.dp / (1080f / 360f)),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = line.text,
                            fontFamily = FontFamily.Serif,
                            fontSize = 31.sp,
                            lineHeight = (31 * 1.6).sp,
                            color = TextPrimary,
                            textAlign = TextAlign.Center,
                            style = LocalTextStyle.current.copy(
                                shadow = Shadow(
                                    color = Color(0xAD000000),
                                    offset = Offset(0f, 4f),
                                    blurRadius = 24f
                                )
                            ),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 40.dp)
                        )
                        if (isQuote) {
                            Spacer(modifier = Modifier.height(20.dp))
                            Canvas(modifier = Modifier.width(120.dp).height(1.dp)) {
                                drawLine(
                                    color = DividerColor,
                                    start = Offset(0f, size.height / 2),
                                    end = Offset(size.width, size.height / 2),
                                    strokeWidth = 1f
                                )
                            }
                            Spacer(modifier = Modifier.height(16.dp))
                            Text(
                                text = "Nagi",
                                fontFamily = FontFamily.Serif,
                                fontStyle = FontStyle.Italic,
                                fontSize = 16.sp,
                                color = GoldColor,
                                textAlign = TextAlign.Center
                            )
                        }
                    }
                }
            }

            // Bottom: 轻触继续 + diamond
            Column(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .navigationBarsPadding()
                    .padding(bottom = 30.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "轻触继续",
                    fontSize = 14.sp,
                    color = HintColor,
                    style = LocalTextStyle.current.copy(
                        shadow = Shadow(
                            color = Color(0x70000000),
                            offset = Offset(0f, 2f),
                            blurRadius = 12f
                        )
                    )
                )
                Spacer(modifier = Modifier.height(12.dp))
                GoldDiamond(size = 8.dp)
            }
        }
    }
}

@Composable
internal fun HeaderWithDecoration(text: String) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.Center,
        modifier = Modifier.fillMaxWidth()
    ) {
        // Left fade line
        Canvas(modifier = Modifier.width(48.dp).height(1.dp)) {
            drawLine(
                color = GoldLineColor,
                start = Offset(0f, size.height / 2),
                end = Offset(size.width, size.height / 2),
                strokeWidth = 1f
            )
        }
        Spacer(modifier = Modifier.width(8.dp))
        GoldDiamond(size = 6.dp)
        Spacer(modifier = Modifier.width(12.dp))
        Text(
            text = text,
            fontSize = 12.sp,
            letterSpacing = 1.5.sp,
            color = HeaderTextColor,
            style = LocalTextStyle.current.copy(
                shadow = Shadow(
                    color = Color(0x6B000000),
                    offset = Offset(0f, 2f),
                    blurRadius = 14f
                )
            )
        )
        Spacer(modifier = Modifier.width(12.dp))
        GoldDiamond(size = 6.dp)
        Spacer(modifier = Modifier.width(8.dp))
        // Right fade line
        Canvas(modifier = Modifier.width(48.dp).height(1.dp)) {
            drawLine(
                color = GoldLineColor,
                start = Offset(0f, size.height / 2),
                end = Offset(size.width, size.height / 2),
                strokeWidth = 1f
            )
        }
    }
}

@Composable
internal fun GoldDividerWithText(text: String) {
    HeaderWithDecoration(text = text)
}

@Composable
internal fun GoldDiamond(size: androidx.compose.ui.unit.Dp) {
    Canvas(modifier = Modifier.size(size)) {
        val cx = this.size.width / 2
        val cy = this.size.height / 2
        val r = this.size.minDimension / 2
        val path = androidx.compose.ui.graphics.Path().apply {
            moveTo(cx, cy - r)
            lineTo(cx + r, cy)
            lineTo(cx, cy + r)
            lineTo(cx - r, cy)
            close()
        }
        drawPath(path, color = GoldColor)
    }
}
