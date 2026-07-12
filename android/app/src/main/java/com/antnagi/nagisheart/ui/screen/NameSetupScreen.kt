package com.antnagi.nagisheart.ui.screen

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.LocalTextStyle
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.rememberAsyncImagePainter
import com.antnagi.nagisheart.ui.theme.*

private val GoldColor = Color(0xFFD7BE86)
private val TitleColor = Color(0xFFF4F1EA)
private val SubtitleColor = Color(0xFFD6D2CB)
private val LabelColor = Color(0xD1F4F1EA)
private val PlaceholderColor = Color(0x94F4F1EA)
private val InputLineColor = Color(0xBDD7BE86)
private val ConfirmActiveColor = Color(0xFFF7F3EC)

@Composable
fun NameSetupScreen(onConfirm: (name: String) -> Unit) {
    var name by remember { mutableStateOf("") }
    val canConfirm = name.isNotBlank()
    val keyboardController = LocalSoftwareKeyboardController.current

    NagiTheme(uiTheme = NagiUiTheme.Dark) {
        Box(modifier = Modifier.fillMaxSize()) {
            // Background
            Image(
                painter = rememberAsyncImagePainter("file:///android_asset/bg/poster_start_nagis_heart_bg_clean.png"),
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )
            // Dark overlay
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color(0x52132033))
            )

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .imePadding()
                    .statusBarsPadding()
                    .navigationBarsPadding(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Header: 开始之前
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(start = 48.dp, top = 34.dp, end = 48.dp, bottom = 0.dp),
                    contentAlignment = Alignment.Center
                ) {
                    HeaderWithDecoration(text = "开始之前")
                }

                Spacer(modifier = Modifier.height(140.dp))

                // Main title
                Text(
                    text = "写下你的名字",
                    fontFamily = FontFamily.Serif,
                    fontSize = 34.sp,
                    color = TitleColor,
                    style = LocalTextStyle.current.copy(
                        shadow = Shadow(
                            color = Color(0xAD000000),
                            offset = Offset(0f, 4f),
                            blurRadius = 24f
                        )
                    )
                )
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = "故事会从这里开始。",
                    fontSize = 15.sp,
                    color = SubtitleColor
                )

                Spacer(modifier = Modifier.height(100.dp))

                // Input label
                Text(
                    text = "你的名字",
                    fontSize = 13.sp,
                    color = LabelColor
                )
                Spacer(modifier = Modifier.height(8.dp))

                // Input field — transparent, underline only
                Box(modifier = Modifier.fillMaxWidth(0.72f)) {
                    BasicTextField(
                        value = name,
                        onValueChange = { if (it.length <= 10) name = it },
                        singleLine = true,
                        textStyle = LocalTextStyle.current.copy(
                            color = TitleColor,
                            fontSize = 16.sp,
                            textAlign = TextAlign.Center
                        ),
                        cursorBrush = SolidColor(GoldColor),
                        keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
                        keyboardActions = KeyboardActions(onDone = {
                            keyboardController?.hide()
                            if (canConfirm) onConfirm(name)
                        }),
                        decorationBox = { innerTextField ->
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Box(
                                    contentAlignment = Alignment.Center,
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(46.dp)
                                        .background(
                                            Brush.horizontalGradient(
                                                listOf(
                                                    Color.Transparent,
                                                    Color(0x14132033),
                                                    Color.Transparent
                                                )
                                            )
                                        )
                                ) {
                                    if (name.isEmpty()) {
                                        Text(
                                            text = "在故事里的称呼",
                                            fontSize = 16.sp,
                                            color = PlaceholderColor,
                                            textAlign = TextAlign.Center
                                        )
                                    }
                                    innerTextField()
                                }
                                // Underline + center diamond
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(8.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Canvas(modifier = Modifier.fillMaxWidth().height(1.dp)) {
                                        drawLine(
                                            color = InputLineColor,
                                            start = Offset(0f, size.height / 2),
                                            end = Offset(size.width, size.height / 2),
                                            strokeWidth = 1f
                                        )
                                    }
                                    GoldDiamond(size = 6.dp)
                                }
                            }
                        },
                        modifier = Modifier.fillMaxWidth()
                    )
                }

                Spacer(modifier = Modifier.weight(1f))

                // Confirm area: 进入故事 + decoration + 轻触确认
                val confirmAlpha = if (canConfirm) 1f else 0.4f

                Text(
                    text = "进入故事",
                    fontFamily = FontFamily.Serif,
                    fontSize = 19.sp,
                    color = ConfirmActiveColor.copy(alpha = confirmAlpha),
                    style = LocalTextStyle.current.copy(
                        shadow = Shadow(
                            color = Color(0x9E000000),
                            offset = Offset(0f, 4f),
                            blurRadius = 22f
                        )
                    ),
                    modifier = Modifier
                        .clickable(
                            enabled = canConfirm,
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null
                        ) {
                            keyboardController?.hide()
                            onConfirm(name)
                        }
                        .padding(horizontal = 32.dp, vertical = 12.dp)
                )

                // Gold lines with diamonds on both sides
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center
                ) {
                    Canvas(modifier = Modifier.width(80.dp).height(1.dp)) {
                        drawLine(
                            color = GoldColor.copy(alpha = confirmAlpha * 0.6f),
                            start = Offset(0f, size.height / 2),
                            end = Offset(size.width, size.height / 2),
                            strokeWidth = 1f
                        )
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    GoldDiamond(size = 6.dp)
                    Spacer(modifier = Modifier.width(8.dp))
                    Canvas(modifier = Modifier.width(80.dp).height(1.dp)) {
                        drawLine(
                            color = GoldColor.copy(alpha = confirmAlpha * 0.6f),
                            start = Offset(0f, size.height / 2),
                            end = Offset(size.width, size.height / 2),
                            strokeWidth = 1f
                        )
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = "轻触确认",
                    fontSize = 14.sp,
                    color = LabelColor.copy(alpha = confirmAlpha)
                )
                Spacer(modifier = Modifier.height(58.dp))
            }
        }
    }
}
