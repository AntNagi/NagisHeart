package com.antnagi.nagisheart.ui.component

import android.graphics.RenderEffect
import android.graphics.Shader
import android.os.Build
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asComposeRenderEffect
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties

private val DialogShape = RoundedCornerShape(24.dp)
private val ScrimColor = Color(0x52090E18)
private val ContainerBg = Color(0x521B2436)
private val ContainerBorder = Color(0x1FFFFFFF)
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
                    .then(
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                            Modifier.graphicsLayer {
                                renderEffect = RenderEffect.createBlurEffect(
                                    20f, 20f, Shader.TileMode.CLAMP
                                ).asComposeRenderEffect()
                            }
                        } else Modifier
                    )
                    .clip(DialogShape)
                    .background(ContainerBg)
                    .border(1.dp, ContainerBorder, DialogShape)
                    .padding(start = 40.dp, end = 40.dp, top = 32.dp, bottom = 28.dp)
            ) {
                Column {
                    Text(
                        text = title,
                        fontFamily = FontFamily.Serif,
                        fontSize = 28.sp,
                        color = TitleColor
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = text,
                        fontSize = 16.sp,
                        lineHeight = 28.sp,
                        color = BodyColor
                    )
                    Spacer(modifier = Modifier.height(24.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.End
                    ) {
                        Text(
                            text = dismissText,
                            fontSize = 16.sp,
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
                            fontSize = 16.sp,
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
