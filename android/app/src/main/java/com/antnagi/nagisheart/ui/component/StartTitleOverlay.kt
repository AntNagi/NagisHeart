package com.antnagi.nagisheart.ui.component

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.systemBars
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import coil.request.ImageRequest

/**
 * The v23 wordmark, positioned identically wherever it appears.
 *
 * The asset is a full-canvas 1080x1920 SVG with the wordmark placed inside it, so
 * it cannot be dropped in as a plain top-aligned image — the 9:16 safe layer has to
 * be reconstructed first, then anchored. Both the splash and the home screen call
 * this so the two can never drift apart.
 */
@Composable
fun StartTitleOverlay(modifier: Modifier = Modifier) {
    BoxWithConstraints(modifier = modifier.fillMaxSize()) {
        val screenW = maxWidth
        val screenH = maxHeight

        val uiHeight = screenW * (1920f / 1080f)
        val extraV = screenH - uiHeight

        val density = LocalDensity.current
        val topInset = with(density) { WindowInsets.systemBars.getTop(this).toDp() }

        // Matches SplashScreen: anchor to the top safe area on long screens so the
        // extra height opens up over the artwork instead of padding the edges. On a
        // 9:16 screen extraV is 0 and this collapses to the v23 position.
        val edgeMargin = uiHeight * 0.006f
        val offsetY = if (extraV > 0.dp) topInset + edgeMargin else 0.dp

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(uiHeight)
                .offset(y = offsetY)
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
    }
}
