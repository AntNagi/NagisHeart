package com.antnagi.nagisheart.ui.component

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.antnagi.nagisheart.ui.theme.NagiMotion
import com.antnagi.nagisheart.ui.theme.NagiTheme
import com.antnagi.nagisheart.ui.theme.NagiTokens

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
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .drawBehind {
                            drawRect(
                                brush = Brush.verticalGradient(
                                    0f to NagiTokens.deepBlue.copy(alpha = 0.06f),
                                    0.44f to NagiTokens.deepBlue.copy(alpha = 0.12f),
                                    1f to NagiTokens.deepBlue.copy(alpha = 0.24f)
                                )
                            )
                        }
                )

                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 18.dp)
                        .padding(top = 148.dp, bottom = 152.dp)
                        .drawBehind {
                            drawRect(
                                brush = Brush.radialGradient(
                                    colorStops = arrayOf(
                                        0f to NagiTokens.deepBlue.copy(alpha = 0.44f),
                                        0.58f to NagiTokens.deepBlue.copy(alpha = 0.32f),
                                        1f to Color.Transparent
                                    ),
                                    center = Offset(size.width / 2f, size.height / 2f),
                                    radius = maxOf(size.width * 0.64f, size.height * 0.62f)
                                )
                            )
                        }
                )

                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(start = 18.dp, end = 18.dp, top = 88.dp, bottom = 126.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .heightIn(min = 280.dp, max = 760.dp)
                            .padding(horizontal = 20.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(
                            verticalArrangement = Arrangement.spacedBy(24.dp)
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
                                            color = NagiTokens.deepBlue.copy(alpha = 0.18f),
                                            offset = Offset(0f, 1f),
                                            blurRadius = 8f
                                        )
                                    ),
                                    color = NagiTokens.parchment.copy(alpha = 0.92f)
                                )
                            }
                        }
                    }
                }
            }
        }

        Box(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .navigationBarsPadding()
                .padding(bottom = 120.dp)
        ) {
            val indicatorColor = NagiTokens.parchment.copy(alpha = 0.78f)
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
