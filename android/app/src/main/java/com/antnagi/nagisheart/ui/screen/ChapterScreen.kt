package com.antnagi.nagisheart.ui.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.antnagi.nagisheart.data.Chapter
import com.antnagi.nagisheart.data.ChapterSection
import com.antnagi.nagisheart.data.SectionState
import com.antnagi.nagisheart.ui.component.SystemPageBackground
import com.antnagi.nagisheart.ui.icon.NagiIcon
import com.antnagi.nagisheart.ui.icon.NagiIconButton
import com.antnagi.nagisheart.ui.theme.*
import com.antnagi.nagisheart.ui.viewmodel.GameViewModel

@Composable
fun ChapterScreen(
    viewModel: GameViewModel,
    onBack: () -> Unit,
    onJumpToNode: (String) -> Unit,
    onReplaySection: (startNode: String, chapterId: String, sectionIndex: Int) -> Unit = { _, _, _ -> }
) {
    val allChapters = remember { viewModel.getChapters() }
    val unlockedNodes = remember { viewModel.getUnlockedNodes() }
    val chapters = remember(allChapters, unlockedNodes) {
        allChapters.filter { chapter ->
            chapter.id != "prologue" &&
                chapter.sections.any { it.startNode in unlockedNodes }
        }
    }
    val sectionStates = remember(chapters, unlockedNodes) {
        chapters.flatMap { chapter ->
            chapter.sections.mapIndexed { index, section ->
                val key = "${chapter.id}:$index"
                key to viewModel.getSectionState(chapter.id, index, section.startNode)
            }
        }.toMap()
    }
    val lineColor = NagiPalette.roseGold.copy(alpha = 0.72f)

    NagiTheme(uiTheme = NagiUiTheme.Dark) {
        SystemPageBackground {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .statusBarsPadding()
                    .navigationBarsPadding()
            ) {
                // Header
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(44.dp)
                        .padding(horizontal = 17.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    NagiIconButton(icon = NagiIcon.Back, onClick = onBack)
                    Spacer(modifier = Modifier.weight(1f))
                    Text(
                        text = "章节目录",
                        fontFamily = FontFamily.Serif,
                        fontSize = 14.sp,
                        color = NagiTheme.colors.textPrimary
                    )
                    Spacer(modifier = Modifier.weight(1f))
                    Spacer(modifier = Modifier.width(36.dp))
                }

                // Soft screen area
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 20.dp)
                        .padding(top = 26.dp, bottom = 32.dp)
                ) {
                    Text(
                        text = "章节目录",
                        fontFamily = FontFamily.Serif,
                        fontSize = 27.sp,
                        color = NagiTheme.colors.textPrimary,
                        modifier = Modifier.padding(bottom = 22.dp)
                    )

                    // Timeline with vertical line
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(start = 26.dp)
                            .drawBehind {
                                drawLine(
                                    brush = Brush.verticalGradient(
                                        listOf(Color.Transparent, lineColor, Color.Transparent)
                                    ),
                                    start = Offset(8.dp.toPx(), 10.dp.toPx()),
                                    end = Offset(8.dp.toPx(), size.height - 10.dp.toPx()),
                                    strokeWidth = 1.dp.toPx()
                                )
                            },
                        verticalArrangement = Arrangement.spacedBy(18.dp),
                        contentPadding = PaddingValues(vertical = 10.dp)
                    ) {
                        chapters.forEach { chapter ->
                            items(chapter.sections.mapIndexed { i, s -> i to s }) { (index, section) ->
                                val state = sectionStates["${chapter.id}:$index"] ?: SectionState.LOCKED
                                TimelineNode(
                                    title = section.title,
                                    subtitle = chapter.name,
                                    state = state,
                                    onClick = {
                                        when (state) {
                                            SectionState.COMPLETED, SectionState.SKIPPED_COMPLETED ->
                                                onReplaySection(section.startNode, chapter.id, index)
                                            SectionState.IN_PROGRESS ->
                                                onJumpToNode(section.startNode)
                                            SectionState.LOCKED -> {}
                                        }
                                    }
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun TimelineNode(
    title: String,
    subtitle: String,
    state: SectionState,
    onClick: () -> Unit
) {
    val colors = NagiTheme.colors
    val diamondColor = when (state) {
        SectionState.COMPLETED -> NagiPalette.paleGold
        SectionState.SKIPPED_COMPLETED -> NagiPalette.paleGold.copy(alpha = 0.6f)
        SectionState.IN_PROGRESS -> NagiPalette.roseGold
        SectionState.LOCKED -> colors.glassBgSoft.copy(alpha = 0.3f)
    }
    val textColor = when (state) {
        SectionState.COMPLETED -> colors.textPrimary
        SectionState.IN_PROGRESS -> colors.textPrimary
        SectionState.SKIPPED_COMPLETED -> colors.textSecondary
        SectionState.LOCKED -> colors.textSecondary.copy(alpha = 0.52f)
    }
    val stateLabel = when (state) {
        SectionState.IN_PROGRESS -> "进行中"
        SectionState.COMPLETED -> "已完成"
        SectionState.SKIPPED_COMPLETED -> "已跳过"
        SectionState.LOCKED -> null
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .then(if (state != SectionState.LOCKED) Modifier.clickable(onClick = onClick) else Modifier),
        verticalAlignment = Alignment.Top
    ) {
        Box(
            modifier = Modifier
                .size(12.dp)
                .offset(x = (-23).dp, y = 5.dp)
                .clip(DiamondShape)
                .background(diamondColor)
        )

        Column(verticalArrangement = Arrangement.spacedBy(3.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    text = title,
                    style = NagiTheme.typography.buttonText.copy(fontSize = 14.sp),
                    color = textColor
                )
                if (stateLabel != null) {
                    Text(
                        text = stateLabel,
                        style = NagiTheme.typography.micro,
                        color = diamondColor.copy(alpha = 0.72f)
                    )
                }
            }
            Text(
                text = subtitle,
                style = NagiTheme.typography.micro,
                color = colors.textSecondary.copy(alpha = 0.5f)
            )
        }
    }
}

private val DiamondShape = object : androidx.compose.ui.graphics.Shape {
    override fun createOutline(
        size: androidx.compose.ui.geometry.Size,
        layoutDirection: androidx.compose.ui.unit.LayoutDirection,
        density: androidx.compose.ui.unit.Density
    ): androidx.compose.ui.graphics.Outline {
        val path = androidx.compose.ui.graphics.Path().apply {
            val cx = size.width / 2
            val cy = size.height / 2
            moveTo(cx, 0f)
            lineTo(size.width, cy)
            lineTo(cx, size.height)
            lineTo(0f, cy)
            close()
        }
        return androidx.compose.ui.graphics.Outline.Generic(path)
    }
}
