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
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.res.painterResource
import com.antnagi.nagisheart.R
import com.antnagi.nagisheart.data.PrologueLine
import com.antnagi.nagisheart.ui.theme.*

private val GoldColor = NagiTokens.gold
private val TextPrimary = Color(0xFFF7F3EC) // token-exempt
private val HeaderTextColor = NagiTokens.parchment.copy(alpha = 0.92f)
private val GoldLineColor = NagiTokens.gold.copy(alpha = 0.60f)
private val DividerColor = NagiTokens.parchment.copy(alpha = 0.40f)
private val HintColor = NagiTokens.parchment.copy(alpha = 0.84f)

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
                painter = painterResource(R.drawable.splash_bg),
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )
            // §1: story dark layer 1 — vertical gradient
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.verticalGradient(
                            0f to NagiTokens.deepBlue.copy(alpha = 0.04f),
                            0.38f to NagiTokens.deepBlue.copy(alpha = 0.12f),
                            1f to NagiTokens.deepBlue.copy(alpha = 0.86f)
                        )
                    )
            )
            // §1: story dark layer 2 — radial vignette
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .drawBehind {
                        drawRect(
                            brush = Brush.radialGradient(
                                0.22f to Color.Transparent,
                                0.72f to NagiTokens.deepBlue.copy(alpha = 0.34f),
                                1f to NagiTokens.deepBlue.copy(alpha = 0.70f),
                                center = Offset(size.width * 0.46f, size.height * 0.34f),
                                radius = maxOf(size.width, size.height) * 0.7f
                            )
                        )
                    }
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
                            fontSize = 28.sp,
                            lineHeight = (28 * 1.68).sp,
                            color = TextPrimary,
                            textAlign = TextAlign.Center,
                            style = LocalTextStyle.current.copy(
                                shadow = Shadow(
                                    color = Color.Black.copy(alpha = 0.68f),
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
                            color = Color.Black.copy(alpha = 0.44f),
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
                    color = Color.Black.copy(alpha = 0.42f),
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
