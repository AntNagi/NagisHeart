package com.antnagi.nagisheart.ui.component

import android.graphics.BlurMaskFilter
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import com.antnagi.nagisheart.ui.theme.NagiShapes
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
import androidx.compose.ui.graphics.nativeCanvas
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties

private val DialogShape = NagiShapes.cutMedium
private val ScrimColor = Color(0x66090E18)       // §17.3: 40%
private val ContainerBgTop = Color(0x8F1B2436)   // §17.3: 56%
private val ContainerBgBottom = Color(0x85142131) // §17.3: 52%
private val ContainerBorder = Color(0x14FFFFFF)   // §17.3: 8%
private val TextShadowColor = Color(0x59000000)   // §17.3: 35%
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
                    .drawBehind {
                        drawIntoCanvas { canvas ->
                            val paint = Paint().asFrameworkPaint().apply {
                                isAntiAlias = true
                                color = Color(0x5C000000).toArgb()
                                maskFilter = BlurMaskFilter(42.dp.toPx(), BlurMaskFilter.Blur.NORMAL)
                            }
                            val cut = 14.dp.toPx()
                            val path = android.graphics.Path().apply {
                                moveTo(cut, 18.dp.toPx())
                                lineTo(size.width - cut, 18.dp.toPx())
                                lineTo(size.width, 18.dp.toPx() + cut)
                                lineTo(size.width, size.height + 8.dp.toPx() - cut)
                                lineTo(size.width - cut, size.height + 8.dp.toPx())
                                lineTo(cut, size.height + 8.dp.toPx())
                                lineTo(0f, size.height + 8.dp.toPx() - cut)
                                lineTo(0f, 18.dp.toPx() + cut)
                                close()
                            }
                            canvas.nativeCanvas.drawPath(path, paint)
                        }
                    }
                    .clip(DialogShape)
                    .background(
                        Brush.verticalGradient(
                            listOf(ContainerBgTop, ContainerBgBottom)
                        )
                    )
                    .background(
                        Brush.verticalGradient(
                            0f to Color(0x0DFFFFFF),
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
