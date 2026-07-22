package com.antnagi.nagisheart.ui.component

import android.graphics.BlurMaskFilter
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Paint
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.graphics.drawscope.drawIntoCanvas
import androidx.compose.ui.graphics.nativeCanvas
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.antnagi.nagisheart.R
import com.antnagi.nagisheart.ui.theme.*

@Composable
fun DialogueLayer(
    speaker: String,
    text: String,
    displayType: String,
    modifier: Modifier = Modifier
) {
    when (displayType) {
        "center", "fullscreen" -> FullscreenNarration(text = text, modifier = modifier)
        else -> if (speaker.isBlank()) {
            BottomNarration(text = text, modifier = modifier)
        } else {
            BottomDialogue(speaker = speaker, text = text, modifier = modifier)
        }
    }
}

// §17.1 dialogue-box tokens
private val DialogueCardBgTop = NagiTokens.deepBlue.copy(alpha = 0.18f)
private val DialogueCardBgMid = NagiTokens.deepBlue.copy(alpha = 0.52f)
private val DialogueCardBgBottom = NagiTokens.deepBlue.copy(alpha = 0.70f)
private val DialogueCardBorder = NagiTokens.borderGlass
private val DialogueCardShadowColor = Color.Black.copy(alpha = 0.26f)

@Composable
private fun BottomDialogue(speaker: String, text: String, modifier: Modifier = Modifier) {
    val colors = NagiTheme.colors

    Box(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 18.dp)
            .padding(bottom = 34.dp)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                // §17.1: card shadow 0 18dp 40dp rgba(0,0,0,0.26)
                .drawBehind {
                    drawIntoCanvas { canvas ->
                        val paint = Paint().asFrameworkPaint().apply {
                            isAntiAlias = true
                            color = DialogueCardShadowColor.toArgb()
                            maskFilter = BlurMaskFilter(40.dp.toPx(), BlurMaskFilter.Blur.NORMAL)
                        }
                        val cut = 14.dp.toPx()
                        val path = android.graphics.Path().apply {
                            moveTo(cut, 18.dp.toPx())
                            lineTo(size.width - cut, 18.dp.toPx())
                            lineTo(size.width, 18.dp.toPx() + cut)
                            lineTo(size.width, size.height + 8.dp.toPx() - cut)
                            lineTo(size.width - cut, size.height + 8.dp.toPx())
                            lineTo(cut, size.height + 8.dp.toPx())
                            lineTo(0f, size.height + 8.dp.toPx() - cut)
                            lineTo(0f, 18.dp.toPx() + cut)
                            close()
                        }
                        canvas.nativeCanvas.drawPath(path, paint)
                    }
                }
                // §17.1: cut-md
                .clip(NagiShapes.cutMedium)
                // §17.1: bg linear-gradient 0.54 -> 0.70
                .background(
                    Brush.verticalGradient(
                        0f to DialogueCardBgTop,
                        0.46f to DialogueCardBgMid,
                        1f to DialogueCardBgBottom
                    )
                )
                // §17.1: border rgba(255,255,255,0.08) 1dp
                .border(1.dp, DialogueCardBorder, NagiShapes.cutMedium)
                .padding(start = 20.dp, end = 20.dp, top = 18.dp, bottom = 22.dp)
        ) {
            Column {
                // §17.1: speaker cut-sm, gold border, gold halo + dark shadow
                val speakerGold = NagiTokens.speakerGold
                Box(
                    modifier = Modifier
                        .clip(NagiShapes.cutSmall)
                        .background(
                            Brush.horizontalGradient(
                                listOf(
                                    NagiTokens.deepBlue.copy(alpha = 0.30f),
                                    NagiTokens.deepBlue.copy(alpha = 0.10f)
                                )
                            )
                        )
                        .border(1.dp, NagiTokens.goldPlayer, NagiShapes.cutSmall)
                        .padding(start = 9.dp, end = 9.dp, top = 3.dp, bottom = 4.dp)
                ) {
                    Box {
                        Text(
                            text = speaker,
                            style = TextStyle(
                                fontFamily = FontFamily.Default,
                                fontWeight = FontWeight.SemiBold,
                                fontSize = 13.sp,
                                letterSpacing = 0.04.sp,
                                shadow = Shadow(
                                    color = NagiTokens.goldGlow,
                                    offset = Offset(0f, 0f),
                                    blurRadius = 10f
                                )
                            ),
                            color = speakerGold
                        )
                        Text(
                            text = speaker,
                            style = TextStyle(
                                fontFamily = FontFamily.Default,
                                fontWeight = FontWeight.SemiBold,
                                fontSize = 13.sp,
                                letterSpacing = 0.04.sp,
                                shadow = Shadow(
                                    color = Color.Black.copy(alpha = 0.72f),
                                    offset = Offset(0f, 1f),
                                    blurRadius = 2f
                                )
                            ),
                            color = speakerGold
                        )
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // §17.1: dialogue text with light shadow
                Text(
                    text = text,
                    style = TextStyle(
                        fontFamily = FontFamily.Default,
                        fontSize = 17.sp,
                        lineHeight = (17 * 1.9).sp,
                        shadow = Shadow(
                            color = colors.textShadowColor,
                            offset = Offset(0f, 2f),
                            blurRadius = 14f
                        )
                    ),
                    color = NagiTokens.textSnow94
                )

                Spacer(modifier = Modifier.height(14.dp))

                BreathingIndicator(
                    modifier = Modifier.align(Alignment.End)
                )
            }
        }
    }
}

@Composable
private fun BottomNarration(text: String, modifier: Modifier = Modifier) {
    val colors = NagiTheme.colors

    Box(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 18.dp)
            .padding(bottom = 34.dp)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .drawBehind {
                    drawIntoCanvas { canvas ->
                        val paint = Paint().asFrameworkPaint().apply {
                            isAntiAlias = true
                            color = DialogueCardShadowColor.toArgb()
                            maskFilter = BlurMaskFilter(40.dp.toPx(), BlurMaskFilter.Blur.NORMAL)
                        }
                        val cut = 14.dp.toPx()
                        val path = android.graphics.Path().apply {
                            moveTo(cut, 18.dp.toPx())
                            lineTo(size.width - cut, 18.dp.toPx())
                            lineTo(size.width, 18.dp.toPx() + cut)
                            lineTo(size.width, size.height + 8.dp.toPx() - cut)
                            lineTo(size.width - cut, size.height + 8.dp.toPx())
                            lineTo(cut, size.height + 8.dp.toPx())
                            lineTo(0f, size.height + 8.dp.toPx() - cut)
                            lineTo(0f, 18.dp.toPx() + cut)
                            close()
                        }
                        canvas.nativeCanvas.drawPath(path, paint)
                    }
                }
                .clip(NagiShapes.cutMedium)
                .background(
                    Brush.verticalGradient(
                        0f to DialogueCardBgTop,
                        0.46f to DialogueCardBgMid,
                        1f to DialogueCardBgBottom
                    )
                )
                .border(1.dp, DialogueCardBorder, NagiShapes.cutMedium)
                .padding(start = 20.dp, end = 20.dp, top = 18.dp, bottom = 22.dp)
        ) {
            Column {
                Text(
                    text = text,
                    style = TextStyle(
                        fontFamily = FontFamily.Serif,
                        fontSize = 17.sp,
                        lineHeight = (17 * 1.9).sp,
                        shadow = Shadow(
                            color = colors.textShadowColor,
                            offset = Offset(0f, 2f),
                            blurRadius = 14f
                        )
                    ),
                    color = NagiTokens.textSnow94
                )

                Spacer(modifier = Modifier.height(14.dp))

                BreathingIndicator(
                    modifier = Modifier.align(Alignment.End)
                )
            }
        }
    }
}

@Composable
private fun BreathingIndicator(modifier: Modifier = Modifier) {
    val infiniteTransition = rememberInfiniteTransition(label = "breathe")
    val alpha by infiniteTransition.animateFloat(
        initialValue = 0.34f,
        targetValue = 0.9f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = EaseInOut),
            repeatMode = RepeatMode.Reverse
        ),
        label = "breatheAlpha"
    )
    val offsetY by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 2f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = EaseInOut),
            repeatMode = RepeatMode.Reverse
        ),
        label = "breatheY"
    )

    Icon(
        painter = painterResource(R.drawable.ic_continue),
        contentDescription = null,
        tint = NagiPalette.roseGold.copy(alpha = alpha),
        modifier = modifier
            .size(width = 17.dp, height = 9.dp)
            .offset(y = offsetY.dp)
    )
}

@Composable
private fun FullscreenNarration(text: String, modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(NagiPalette.deepBlueNight.copy(alpha = 0.74f)),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier.fillMaxWidth().padding(horizontal = NagiTheme.spacing.xl),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = text,
                style = NagiTheme.typography.narration,
                color = NagiPalette.snowWhite,
                textAlign = TextAlign.Center
            )
        }
    }
}
