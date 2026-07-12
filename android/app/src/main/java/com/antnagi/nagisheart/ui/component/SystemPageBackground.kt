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
import coil.compose.rememberAsyncImagePainter

private const val SYSTEM_BACKGROUND = "file:///android_asset/bg/poster_start_nagis_heart_bg_clean.png"
private val SystemDimColor = Color(0xFF132033)

@Composable
fun SystemPageBackground(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    Box(modifier = modifier.fillMaxSize()) {
        Image(
            painter = rememberAsyncImagePainter(model = SYSTEM_BACKGROUND),
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize()
        )
        // Global dim layer
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(SystemDimColor.copy(alpha = 0.32f))
        )
        // Bottom gradient
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            SystemDimColor.copy(alpha = 0f),
                            SystemDimColor.copy(alpha = 0.80f)
                        )
                    )
                )
        )
        content()
    }
}
