package com.antnagi.nagisheart.ui.component

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import android.graphics.BlurMaskFilter
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Paint
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.graphics.drawscope.drawIntoCanvas
import androidx.compose.ui.graphics.nativeCanvas
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.antnagi.nagisheart.ui.icon.NagiIcon
import com.antnagi.nagisheart.ui.icon.NagiIconButton
import com.antnagi.nagisheart.ui.icon.NagiIconState
import com.antnagi.nagisheart.ui.theme.*

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun NagiHud(
    chapterTitle: String = "",
    onBack: () -> Unit = {},
    onSave: () -> Unit,
    onBacklog: () -> Unit = {},
    onAuto: (() -> Unit)? = null,
    isAutoActive: Boolean = false,
    onTitleLongPress: (() -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    val colors = NagiTheme.colors

    Row(
        modifier = modifier
            .fillMaxWidth()
            .statusBarsPadding()
            .height(44.dp)
            .padding(horizontal = 17.dp)
            .padding(top = 14.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        NagiIconButton(icon = NagiIcon.Back, onClick = onBack)

        if (chapterTitle.isNotEmpty()) {
            Spacer(modifier = Modifier.width(8.dp))
            Box(
                modifier = Modifier
                    .widthIn(max = 210.dp)
                    .height(34.dp)
                    .combinedClickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                        onClick = {},
                        onLongClick = { onTitleLongPress?.invoke() }
                    )
                    .drawBehind {
                        drawIntoCanvas { canvas ->
                            val paint = Paint().asFrameworkPaint().apply {
                                isAntiAlias = true
                                color = Color(0x57000000).toArgb()
                                maskFilter = BlurMaskFilter(12.dp.toPx(), BlurMaskFilter.Blur.NORMAL)
                            }
                            val cut = 8.dp.toPx()
                            canvas.nativeCanvas.drawRoundRect(
                                0f, 3.dp.toPx(),
                                size.width, size.height,
                                cut, cut,
                                paint
                            )
                        }
                    }
                    .clip(NagiShapes.cutSmall)
                    .background(
                        Brush.verticalGradient(
                            listOf(
                                Color(0x4D0F1827), // §7: 0.30
                                Color(0x1F0F1827)  // §7: 0.12
                            )
                        )
                    )
                    .drawBehind {
                        val lineY = size.height * 0.5f
                        val lineH = 2f
                        drawRect(
                            color = Color(0x1FF7F9FC), // §7: rgba(247,249,252,0.12)
                            topLeft = Offset(0f, lineY - lineH / 2),
                            size = Size(size.width, lineH)
                        )
                    }
                    .border(
                        width = 1.dp,
                        color = Color(0x1FFFFFFF), // §17.2: 0.12
                        shape = NagiShapes.cutSmall
                    )
                    .padding(horizontal = 16.dp),
                contentAlignment = Alignment.CenterStart
            ) {
                Text(
                    text = chapterTitle,
                    style = TextStyle(
                        fontFamily = FontFamily.Default,
                        fontWeight = FontWeight.Medium,
                        fontSize = 13.sp,
                        letterSpacing = 0.02.sp,
                        shadow = Shadow(
                            color = Color(0x73000000), // §17.2: 0.45
                            offset = Offset(0f, 1f),
                            blurRadius = 2f
                        )
                    ),
                    color = Color(0xE0F4F1EA),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }
            Spacer(modifier = Modifier.weight(1f))
        } else {
            Spacer(modifier = Modifier.weight(1f))
        }

        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            if (onAuto != null) {
                NagiIconButton(
                    icon = NagiIcon.Auto,
                    state = if (isAutoActive) NagiIconState.Active else NagiIconState.Default,
                    onClick = onAuto
                )
            }
            NagiIconButton(icon = NagiIcon.Save, onClick = onSave)
            NagiIconButton(icon = NagiIcon.Backlog, onClick = onBacklog)
        }
    }
}
