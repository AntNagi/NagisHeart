package com.antnagi.nagisheart.ui.component

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import com.antnagi.nagisheart.R

private val SystemDimColor = Color(0xFF132033)

@Composable
fun SystemPageBackground(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    Box(modifier = modifier.fillMaxSize()) {
        Image(
            painter = painterResource(R.drawable.splash_bg),
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize()
        )
        // §1: multi-layer dim
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        0f to SystemDimColor.copy(alpha = 0.32f),
                        0.42f to SystemDimColor.copy(alpha = 0.12f),
                        1f to SystemDimColor.copy(alpha = 0.66f)
                    )
                )
        )
        // White breath highlight
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
