package com.antnagi.nagisheart.ui.component

import android.graphics.BlurMaskFilter
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Paint
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.graphics.drawscope.drawIntoCanvas
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties

private val DialogShape = RoundedCornerShape(24.dp)
private val ScrimColor = Color(0x61090E18)       // authority §16.5: 38%
private val ContainerBg = Color(0x8F1B2436)      // authority §16.5: 56%
private val ContainerBorder = Color(0x24FFFFFF)   // authority §16.5: 14%
private val TextShadowColor = Color(0x59000000)   // authority §16.5: 35%
private val TitleColor = Color(0xFFF4F1EA)
private val BodyColor = Color(0xD1F4F1EA)
private val DismissColor = Color(0xFFD6D2CB)
private val ConfirmColor = Color(0xFFF4F1EA)

@Composable
fun NagiDialog(
    onDismissRequest: () -> Unit,
    title: String,
    text: String,
    confirmText: String = "确定",
    dismissText: String = "取消",
    onConfirm: () -> Unit,
    onDismiss: () -> Unit = onDismissRequest
) {
    Dialog(
        onDismissRequest = onDismissRequest,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(ScrimColor)
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    onClick = onDismissRequest
                ),
            contentAlignment = Alignment.Center
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth(0.80f)
                    .defaultMinSize(minHeight = 135.dp)
                    .clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                        onClick = {}
                    )
                    // Authority §16.5: shadow "0 18dp 42dp rgba(0,0,0,0.36)" — soft diffuse
                    .drawBehind {
                        drawIntoCanvas { canvas ->
                            val paint = Paint().asFrameworkPaint().apply {
                                isAntiAlias = true
                                color = Color(0x5C000000).toArgb()
                                maskFilter = BlurMaskFilter(42.dp.toPx(), BlurMaskFilter.Blur.NORMAL)
                            }
                            canvas.nativeCanvas.drawRoundRect(
                                0f, 18.dp.toPx(),
                                size.width, size.height + 8.dp.toPx(),
                                24.dp.toPx(), 24.dp.toPx(),
                                paint
                            )
                        }
                    }
                    .clip(DialogShape)
                    .background(ContainerBg)
                    .background(
                        Brush.verticalGradient(
                            0f to Color(0x0FFFFFFF),
                            0.18f to Color.Transparent,
                            1f to Color.Transparent
                        ),
                        DialogShape
                    )
                    .border(1.dp, ContainerBorder, DialogShape)
                    .padding(start = 40.dp, end = 40.dp, top = 32.dp, bottom = 28.dp)
            ) {
                Column {
                    Text(
                        text = title,
                        style = TextStyle(
                            fontFamily = FontFamily.Serif,
                            fontSize = 28.sp,
                            shadow = Shadow(
                                color = TextShadowColor,
                                offset = Offset(0f, 1f),
                                blurRadius = 2f
                            )
                        ),
                        color = TitleColor
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = text,
                        style = TextStyle(
                            fontSize = 16.sp,
                            lineHeight = 28.sp,
                            shadow = Shadow(
                                color = TextShadowColor,
                                offset = Offset(0f, 1f),
                                blurRadius = 2f
                            )
                        ),
                        color = BodyColor
                    )
                    Spacer(modifier = Modifier.height(24.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.End
                    ) {
                        Text(
                            text = dismissText,
                            style = TextStyle(
                                fontSize = 16.sp,
                                shadow = Shadow(
                                    color = TextShadowColor,
                                    offset = Offset(0f, 1f),
                                    blurRadius = 2f
                                )
                            ),
                            color = DismissColor,
                            modifier = Modifier
                                .clickable(
                                    interactionSource = remember { MutableInteractionSource() },
                                    indication = null,
                                    onClick = onDismiss
                                )
                                .padding(8.dp)
                        )
                        Spacer(modifier = Modifier.width(26.dp))
                        Text(
                            text = confirmText,
                            style = TextStyle(
                                fontSize = 16.sp,
                                shadow = Shadow(
                                    color = TextShadowColor,
                                    offset = Offset(0f, 1f),
                                    blurRadius = 2f
                                )
                            ),
                            color = ConfirmColor,
                            modifier = Modifier
                                .clickable(
                                    interactionSource = remember { MutableInteractionSource() },
                                    indication = null,
                                    onClick = onConfirm
                                )
                                .padding(8.dp)
                        )
                    }
                }
            }
        }
    }
}
