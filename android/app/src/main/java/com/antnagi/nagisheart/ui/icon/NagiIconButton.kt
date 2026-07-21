package com.antnagi.nagisheart.ui.icon

import android.graphics.BlurMaskFilter
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Paint
import androidx.compose.ui.graphics.drawscope.drawIntoCanvas
import androidx.compose.ui.graphics.nativeCanvas
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import com.antnagi.nagisheart.ui.theme.NagiShapes
import com.antnagi.nagisheart.ui.theme.NagiTheme
import com.antnagi.nagisheart.ui.theme.NagiTokens

enum class NagiIconState { Default, Active, Disabled }

@Composable
fun NagiIconButton(
    icon: NagiIcon,
    state: NagiIconState = NagiIconState.Default,
    modifier: Modifier = Modifier,
    onClick: () -> Unit = {}
) {
    val colors = NagiTheme.colors
    // Authority §15.1: icon color rgba(247,249,252,0.94) — use full white * 0.94, not hudColor(82%) * 0.94
    val tint = when (state) {
        NagiIconState.Default -> NagiTokens.textSnow94
        NagiIconState.Active -> colors.accentPrimary
        NagiIconState.Disabled -> NagiTokens.snow.copy(alpha = 0.28f)
    }

    val context = LocalContext.current
    val resId = context.resources.getIdentifier(icon.resName, "drawable", context.packageName)

    Box(
        modifier = modifier
            .size(36.dp)
            // Soft drop shadow: authority §15.1 "dropShadow 0 3dp 12dp rgba(0,0,0,0.42)"
            .drawBehind {
                drawIntoCanvas { canvas ->
                    val paint = Paint().asFrameworkPaint().apply {
                        isAntiAlias = true
                        color = Color.Black.copy(alpha = 0.42f).toArgb()
                        maskFilter = BlurMaskFilter(12.dp.toPx(), BlurMaskFilter.Blur.NORMAL)
                    }
                    val inset = 2.dp.toPx()
                    canvas.nativeCanvas.drawRoundRect(
                        inset, 3.dp.toPx(),
                        size.width - inset, size.height,
                        8.dp.toPx(), 8.dp.toPx(),
                        paint
                    )
                }
            }
            .clip(NagiShapes.cutSmall)
            .background(
                Brush.verticalGradient(
                    listOf(
                        NagiTokens.hudBlue.copy(alpha = 0.34f),
                        NagiTokens.hudBlue.copy(alpha = 0.22f)
                    )
                )
            )
            // Center radial highlight: authority §15.1 "rgba(247,249,252,0.08) radial"
            .drawBehind {
                drawCircle(
                    brush = Brush.radialGradient(
                        colors = listOf(NagiTokens.snow.copy(alpha = 0.08f), Color.Transparent),
                        center = Offset(size.width / 2, size.height / 2),
                        radius = size.width * 0.6f
                    ),
                    radius = size.width * 0.6f,
                    center = Offset(size.width / 2, size.height / 2)
                )
            }
            .border(1.dp, NagiTokens.borderGlass12, NagiShapes.cutSmall)
            .clickable(
                enabled = state != NagiIconState.Disabled,
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onClick
            ),
        contentAlignment = Alignment.Center
    ) {
        if (resId != 0) {
            Icon(
                painter = painterResource(resId),
                contentDescription = icon.resName,
                tint = tint,
                modifier = Modifier
                    .size(18.dp)
                    // Icon halo + shadow: authority §15.1
                    // dark shadow: 0 1dp 2dp rgba(0,0,0,0.64)
                    // soft light halo: 0 0 8dp rgba(247,249,252,0.20)
                    .drawWithContent {
                        drawIntoCanvas { canvas ->
                            val haloPaint = Paint().asFrameworkPaint().apply {
                                isAntiAlias = true
                                color = NagiTokens.snow.copy(alpha = 0.20f).toArgb()
                                maskFilter = BlurMaskFilter(8.dp.toPx(), BlurMaskFilter.Blur.NORMAL)
                            }
                            canvas.nativeCanvas.drawCircle(
                                size.width / 2, size.height / 2,
                                size.width * 0.45f, haloPaint
                            )
                        }
                        drawContent()
                    }
            )
        }
    }
}
