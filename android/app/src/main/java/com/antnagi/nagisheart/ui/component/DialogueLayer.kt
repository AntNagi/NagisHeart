package com.antnagi.nagisheart.ui.component

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
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shadow
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

@Composable
private fun BottomDialogue(speaker: String, text: String, modifier: Modifier = Modifier) {
    val colors = NagiTheme.colors

    Box(modifier = modifier.fillMaxWidth()) {
        // Gradient fog background — matches design's radial gradient + linear gradient
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(230.dp)
                .align(Alignment.BottomCenter)
                .background(
                    Brush.verticalGradient(
                        0f to Color.Transparent,
                        0.28f to Color.Transparent,
                        0.76f to colors.glassBgStrong,
                        1f to colors.glassBgSoft
                    )
                )
        )

        // Content
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .align(Alignment.BottomCenter)
                .padding(horizontal = 16.dp)
                .padding(bottom = 20.dp)
        ) {
            // Speaker tag — gold with light glass backing for readability
            val speakerGold = Color(0xFFE4CA8F)
            Box(
                modifier = Modifier
                    .clip(NagiShapes.cutSmall)
                    .background(
                        Brush.horizontalGradient(
                            listOf(
                                Color(0x4D101827),
                                Color(0x1A101827)
                            )
                        )
                    )
                    .border(1.dp, Color(0x2ED7BE86), NagiShapes.cutSmall)
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
                                color = Color(0x33D7BE86),
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
                                color = Color(0xB8000000),
                                offset = Offset(0f, 1f),
                                blurRadius = 2f
                            )
                        ),
                        color = speakerGold
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Dialogue text
            Text(
                text = text,
                style = NagiTheme.typography.dialogue.copy(
                    shadow = Shadow(
                        color = colors.textShadowColor,
                        offset = Offset(0f, 2f),
                        blurRadius = 14f
                    )
                ),
                color = colors.textPrimary,
                modifier = Modifier.padding(horizontal = 16.dp)
            )

            Spacer(modifier = Modifier.height(14.dp))

            // Continue indicator — breathing animation
            BreathingIndicator(
                modifier = Modifier.align(Alignment.End).padding(end = 22.dp, bottom = 14.dp)
            )
        }
    }
}

@Composable
private fun BottomNarration(text: String, modifier: Modifier = Modifier) {
    val colors = NagiTheme.colors

    Box(modifier = modifier.fillMaxWidth()) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(230.dp)
                .align(Alignment.BottomCenter)
                .background(
                    Brush.verticalGradient(
                        0f to Color.Transparent,
                        0.28f to Color.Transparent,
                        0.76f to colors.glassBgStrong,
                        1f to colors.glassBgSoft
                    )
                )
        )

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .align(Alignment.BottomCenter)
                .padding(horizontal = 16.dp)
                .padding(bottom = 20.dp)
        ) {
            Text(
                text = text,
                style = NagiTheme.typography.narration.copy(
                    shadow = Shadow(
                        color = colors.textShadowColor,
                        offset = Offset(0f, 2f),
                        blurRadius = 14f
                    )
                ),
                color = colors.textPrimary.copy(alpha = 0.94f),
                modifier = Modifier.padding(horizontal = 16.dp)
            )

            Spacer(modifier = Modifier.height(14.dp))

            BreathingIndicator(
                modifier = Modifier.align(Alignment.End).padding(end = 22.dp, bottom = 14.dp)
            )
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
