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
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.res.painterResource
import coil.compose.AsyncImage
import coil.request.ImageRequest
import androidx.compose.ui.unit.dp
import com.antnagi.nagisheart.R
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.BoxWithConstraints
import com.antnagi.nagisheart.ui.theme.NagiTokens
import kotlin.math.sqrt

@Suppress("UnusedBoxWithConstraintsScope")
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

        // Shared geometry so the title layer and the START layer stay pixel-aligned
        // while the vignette can sit between them at full-screen size.
        val safeLayer = Modifier
            .fillMaxWidth()
            .height(uiHeight)
            .offset(y = uiOffsetY)

        // Layer 2: Static vignette overlay (C spec).
        // Full-screen so taller-than-9:16 devices get no un-dimmed bands above/below
        // the safe layer, but the radial center is anchored to the safe layer so the
        // bright area keeps following the artwork focal point on every aspect ratio.
        val density = LocalDensity.current
        val widthPx = with(density) { screenW.toPx() }
        val heightPx = with(density) { screenH.toPx() }
        val centerYPx = with(density) { (uiOffsetY + uiHeight * 0.39f).toPx() }
        // Reach the farthest corner from the (off-center) radial origin.
        val farVert = maxOf(centerYPx, heightPx - centerYPx)
        val vignetteRadius = sqrt((widthPx * 0.5f) * (widthPx * 0.5f) + farVert * farVert)
        val vignette = NagiTokens.authorityVoid

        Box(
            modifier = Modifier
                .fillMaxSize()
                // radial: clear until 31%, ramping to max 0.56 by 72%
                .background(
                    Brush.radialGradient(
                        colorStops = arrayOf(
                            0f to Color.Transparent,
                            0.31f to Color.Transparent,
                            0.72f to vignette.copy(alpha = 0.56f),
                            1f to vignette.copy(alpha = 0.56f)
                        ),
                        center = Offset(widthPx * 0.5f, centerYPx),
                        radius = vignetteRadius
                    )
                )
                // top 0.12 / bottom 0.71
                .background(
                    Brush.verticalGradient(
                        0f to vignette.copy(alpha = 0.12f),
                        0.18f to Color.Transparent,
                        0.55f to Color.Transparent,
                        1f to vignette.copy(alpha = 0.71f)
                    )
                )
                // side edges 0.30
                .background(
                    Brush.horizontalGradient(
                        0f to vignette.copy(alpha = 0.30f),
                        0.22f to Color.Transparent,
                        0.78f to Color.Transparent,
                        1f to vignette.copy(alpha = 0.30f)
                    )
                )
        )

        // Layer 3: Title overlay (full-canvas SVG, inside safe layer).
        // Sits ABOVE the vignette so the wordmark keeps its full brightness.
        // Lifted independently of START — ratio of safe-layer height so it scales
        // identically on every screen size. Tunable: 0f = v23 original position.
        val titleLift = 0.07f
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(uiHeight)
                .offset(y = uiOffsetY - uiHeight * titleLift)
        ) {
            AsyncImage(
                model = ImageRequest.Builder(LocalContext.current)
                    .data("file:///android_asset/start/start_title_overlay_v23.svg")
                    .build(),
                contentDescription = null,
                contentScale = ContentScale.FillBounds,
                modifier = Modifier.matchParentSize()
            )
        }

        // Layer 4: START breathing layer — stays topmost, same safe-layer geometry
        Box(modifier = safeLayer) {
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

            // Layer 5: Transparent click hit area (relative to UI safe layer)
            // 1080x1920 base: x=330 y=1640 w=420 h=210
            Box(
                modifier = Modifier
                    .offset(x = screenW * 0.3056f, y = uiHeight * 0.8542f)
                    .size(width = screenW * 0.3889f, height = uiHeight * 0.1094f)
                    .clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                        onClick = onFinished
                    )
            )
        }
    }
}
