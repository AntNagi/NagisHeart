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
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import coil.compose.AsyncImage
import coil.request.ImageRequest
import androidx.compose.ui.unit.dp
import com.antnagi.nagisheart.R
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.BoxWithConstraints

@Composable
fun SplashScreen(onFinished: () -> Unit) {
    val transition = rememberInfiniteTransition(label = "startBreath")
    val startAlpha by transition.animateFloat(
        initialValue = 0.68f,
        targetValue = 1.0f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 800, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "startAlpha"
    )

    // Strategy A: cover-height background + protected 9:16 UI safe layer.
    // Tunable: uiVerticalBias 0.0=top, 0.5=center, 1.0=bottom
    val uiVerticalBias = 0.5f

    BoxWithConstraints(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black)
    ) {
        val screenW = maxWidth
        val screenH = maxHeight

        // Layer 1: Background — scale 1080x1920 to fill screen height, center-crop horizontal overflow
        Image(
            painter = painterResource(R.drawable.start_bg_v23),
            contentDescription = null,
            contentScale = ContentScale.Crop,
            alignment = Alignment.Center,
            modifier = Modifier.fillMaxSize()
        )

        // UI safe layer: 9:16 proportioned box for SVG overlays
        val uiHeight = screenW * (1920f / 1080f)
        val extraV = screenH - uiHeight
        val uiOffsetY = if (extraV > 0.dp) extraV * uiVerticalBias else 0.dp

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(uiHeight)
                .offset(y = uiOffsetY)
        ) {
            val designW = screenW
            val designH = uiHeight

            // Layer 2: Title overlay (full-canvas SVG, inside safe layer)
            AsyncImage(
                model = ImageRequest.Builder(LocalContext.current)
                    .data("file:///android_asset/start/start_title_overlay_v23.svg")
                    .build(),
                contentDescription = null,
                contentScale = ContentScale.FillBounds,
                modifier = Modifier.matchParentSize()
            )

            // Layer 3: START breathing layer (full-canvas SVG, inside safe layer)
            AsyncImage(
                model = ImageRequest.Builder(LocalContext.current)
                    .data("file:///android_asset/start/start_button_static_v23.svg")
                    .build(),
                contentDescription = null,
                contentScale = ContentScale.FillBounds,
                modifier = Modifier
                    .matchParentSize()
                    .graphicsLayer { alpha = startAlpha }
            )

            // Layer 4: Transparent click hit area (relative to UI safe layer)
            // 1080x1920 base: x=330 y=1640 w=420 h=210
            Box(
                modifier = Modifier
                    .offset(x = designW * 0.3056f, y = designH * 0.8542f)
                    .size(width = designW * 0.3889f, height = designH * 0.1094f)
                    .clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                        onClick = onFinished
                    )
            )
        }
    }
}
