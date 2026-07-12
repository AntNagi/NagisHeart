package com.antnagi.nagisheart.ui.component

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.antnagi.nagisheart.ui.theme.*

@Composable
fun LongNarrationLayer(
    paragraphs: List<String>,
    onFinished: () -> Unit,
    modifier: Modifier = Modifier
) {
    val pages = remember(paragraphs) { paginateParagraphs(paragraphs) }
    var currentPage by remember { mutableStateOf(0) }
    val totalPages = pages.size

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFF101827).copy(alpha = 0.42f))
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null
            ) {
                if (currentPage < totalPages - 1) {
                    currentPage++
                } else {
                    onFinished()
                }
            }
    ) {
        AnimatedContent(
            targetState = currentPage,
            transitionSpec = {
                fadeIn(NagiMotion.scene()) togetherWith fadeOut(NagiMotion.scene())
            },
            label = "longNarration",
            modifier = Modifier.fillMaxSize()
        ) { pageIndex ->
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .statusBarsPadding()
                    .navigationBarsPadding(),
                contentAlignment = Alignment.Center
            ) {
                // Reading area with frameless faded backdrop
                Box(
                    modifier = Modifier
                        .fillMaxWidth(0.78f)
                        .heightIn(min = 280.dp, max = 760.dp)
                        .drawBehind {
                            // Soft radial backdrop — fades to transparent at edges
                            val w = size.width
                            val h = size.height
                            val cx = w / 2f
                            val cy = h / 2f
                            val rx = w * 0.62f
                            val ry = h * 0.58f

                            val backdropColor = Color(0xFF101827).copy(alpha = 0.28f)

                            // Draw radial gradient backdrop
                            drawRect(
                                brush = Brush.radialGradient(
                                    colorStops = arrayOf(
                                        0f to backdropColor,
                                        0.55f to backdropColor,
                                        0.75f to backdropColor.copy(alpha = 0.14f),
                                        1f to Color.Transparent
                                    ),
                                    center = Offset(cx, cy),
                                    radius = maxOf(rx, ry)
                                ),
                                size = Size(w, h)
                            )

                            // Top fade-out edge (60dp)
                            val fadeEdge = 60.dp.toPx()
                            drawRect(
                                brush = Brush.verticalGradient(
                                    0f to Color.Transparent,
                                    1f to Color.Transparent.copy(alpha = 0f),
                                    startY = 0f,
                                    endY = fadeEdge
                                ),
                                size = Size(w, fadeEdge)
                            )

                            // Bottom fade-out edge (60dp)
                            drawRect(
                                brush = Brush.verticalGradient(
                                    0f to Color.Transparent.copy(alpha = 0f),
                                    1f to Color.Transparent,
                                    startY = h - fadeEdge,
                                    endY = h
                                ),
                                size = Size(w, fadeEdge),
                                topLeft = Offset(0f, h - fadeEdge)
                            )
                        }
                        .padding(horizontal = 40.dp, vertical = 36.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        verticalArrangement = Arrangement.spacedBy(18.dp)
                    ) {
                        val pageTexts = pages.getOrElse(pageIndex) { emptyList() }
                        pageTexts.forEach { text ->
                            Text(
                                text = text,
                                style = TextStyle(
                                    fontFamily = FontFamily.Serif,
                                    fontWeight = FontWeight.Normal,
                                    fontSize = 16.sp,
                                    lineHeight = 30.sp,
                                    shadow = Shadow(
                                        color = Color(0xFF0A0F19).copy(alpha = 0.18f),
                                        offset = Offset(0f, 1f),
                                        blurRadius = 8f
                                    )
                                ),
                                color = Color(0xFFF4F1EA)
                            )
                        }
                    }
                }
            }
        }

        // Page indicator — outside reading area
        Box(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .navigationBarsPadding()
                .padding(bottom = 42.dp)
        ) {
            val indicatorColor = Color(0xFFF4F1EA).copy(alpha = 0.78f)
            if (currentPage < totalPages - 1) {
                Text(
                    text = "%02d / %02d".format(currentPage + 1, totalPages),
                    style = TextStyle(
                        fontFamily = FontFamily.Default,
                        fontSize = 13.sp
                    ),
                    color = indicatorColor
                )
            } else {
                Text(
                    text = "轻触继续",
                    style = NagiTheme.typography.micro,
                    color = indicatorColor.copy(alpha = 0.44f)
                )
            }
        }
    }
}

private fun paginateParagraphs(paragraphs: List<String>): List<List<String>> {
    val pages = mutableListOf<List<String>>()
    var currentPageTexts = mutableListOf<String>()
    var currentCharCount = 0
    val targetCharsPerPage = 180

    for (para in paragraphs) {
        if (currentCharCount + para.length > targetCharsPerPage && currentPageTexts.isNotEmpty()) {
            pages.add(currentPageTexts.toList())
            currentPageTexts = mutableListOf()
            currentCharCount = 0
        }
        currentPageTexts.add(para)
        currentCharCount += para.length
    }
    if (currentPageTexts.isNotEmpty()) {
        pages.add(currentPageTexts)
    }
    return pages
}
