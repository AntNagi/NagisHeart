package com.antnagi.nagisheart.ui.component

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.res.painterResource
import com.antnagi.nagisheart.R

private val SystemDimColor = Color(0xFF132033)

@Composable
fun SystemPageBackground(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    BoxWithConstraints(modifier = modifier.fillMaxSize()) {
        val density = LocalDensity.current
        val widthPx = with(density) { maxWidth.toPx() }
        val heightPx = with(density) { maxHeight.toPx() }

        Image(
            painter = painterResource(R.drawable.splash_bg),
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize()
        )
        // §1 layer 1: vertical gradient dim
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        0f to SystemDimColor.copy(alpha = 0.52f),
                        0.42f to SystemDimColor.copy(alpha = 0.34f),
                        1f to SystemDimColor.copy(alpha = 0.78f)
                    )
                )
        )
        // §1 layer 2: radial vignette
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.radialGradient(
                        colorStops = arrayOf(
                            0f to Color.Transparent,
                            0.18f to Color.Transparent,
                            0.62f to SystemDimColor.copy(alpha = 0.38f),
                            1f to SystemDimColor.copy(alpha = 0.72f)
                        ),
                        center = Offset(widthPx * 0.5f, heightPx * 0.38f),
                        radius = maxOf(widthPx, heightPx) * 0.72f
                    )
                )
        )
        // §1 layer 3: white breath highlight
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        0f to Color.White.copy(alpha = 0.04f),
                        0.18f to Color.Transparent,
                        0.70f to Color.Transparent,
                        1f to Color.White.copy(alpha = 0.02f)
                    )
                )
        )
        content()
    }
}
