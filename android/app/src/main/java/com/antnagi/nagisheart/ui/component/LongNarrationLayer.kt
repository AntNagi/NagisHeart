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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.geometry.Offset
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
            .background(Color(0xFF101826).copy(alpha = 0.42f))
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
                Column(
                    modifier = Modifier.fillMaxWidth(0.78f),
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
                            color = Color(0xFFF4F1EA).copy(alpha = 0.92f)
                        )
                    }
                }
            }
        }

        // Bottom indicator
        Box(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .navigationBarsPadding()
                .padding(bottom = 32.dp)
        ) {
            val indicatorColor = Color(0xFFF4F1EA).copy(alpha = 0.44f)
            if (currentPage < totalPages - 1) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "▽",
                        style = NagiTheme.typography.micro,
                        color = indicatorColor
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "${currentPage + 1} / $totalPages",
                        style = NagiTheme.typography.micro.copy(letterSpacing = 1.sp),
                        color = indicatorColor.copy(alpha = 0.36f)
                    )
                }
            } else {
                Text(
                    text = "轻触继续",
                    style = NagiTheme.typography.micro,
                    color = indicatorColor
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
