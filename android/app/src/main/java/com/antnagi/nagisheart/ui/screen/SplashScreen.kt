package com.antnagi.nagisheart.ui.screen

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import com.antnagi.nagisheart.R

@Composable
fun SplashScreen(onFinished: () -> Unit) {
    val pulse = rememberInfiniteTransition(label = "startPulse")
    val startAlpha = pulse.animateFloat(
        initialValue = 0.72f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 1800, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "startAlpha"
    )
    val startScale = pulse.animateFloat(
        initialValue = 0.992f,
        targetValue = 1.012f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 1800, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "startScale"
    )

    BoxWithConstraints(
        modifier = Modifier
            .fillMaxSize()
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onFinished
            )
    ) {
        val w = maxWidth
        val h = maxHeight

        // Layer 1: Background — full bleed, no dark overlay
        Image(
            painter = painterResource(R.drawable.splash_bg),
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize()
        )

        // Layer 2: Title overlay (tight, transparent PNG)
        // 1080×1920 spec: x=81, y=86, w=898, h=290
        // Percentages: left 7.5%, top 4.5%, width 83.1%, height 15.1%
        Image(
            painter = painterResource(R.drawable.splash_title),
            contentDescription = "Nagi's Heart",
            contentScale = ContentScale.FillBounds,
            modifier = Modifier
                .offset(x = w * 0.075f, y = h * 0.045f)
                .size(width = w * 0.831f, height = h * 0.151f)
        )

        // Layer 3: START overlay (tight, transparent PNG)
        // 1080×1920 spec: x=388, y=1730, w=305, h=86
        // Percentages: left 35.9%, top 90.1%, width 28.2%, height 4.5%
        Image(
            painter = painterResource(R.drawable.splash_start),
            contentDescription = "START",
            contentScale = ContentScale.FillBounds,
            modifier = Modifier
                .offset(x = w * 0.359f, y = h * 0.901f)
                .size(width = w * 0.282f, height = h * 0.045f)
                .graphicsLayer {
                    alpha = startAlpha.value
                    scaleX = startScale.value
                    scaleY = startScale.value
                }
        )
    }
}
