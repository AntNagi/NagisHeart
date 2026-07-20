package com.antnagi.nagisheart.ui.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
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

    data class CatalogItem(
        val chapterName: String,
        val sectionTitle: String,
        val sectionIndex: Int,
        val chapterId: String,
        val startNode: String,
        val state: SectionState
    )

    val catalogItems = remember(chapters, sectionStates) {
        chapters.flatMap { chapter ->
            chapter.sections.mapIndexed { index, section ->
                CatalogItem(
                    chapterName = chapter.name,
                    sectionTitle = section.title,
                    sectionIndex = index,
                    chapterId = chapter.id,
                    startNode = section.startNode,
                    state = sectionStates["${chapter.id}:$index"] ?: SectionState.LOCKED
                )
            }
        }
    }

    val currentItem = catalogItems.firstOrNull { it.state == SectionState.IN_PROGRESS }
    val goldColor = Color(0xFFD7BE86)

    NagiTheme(uiTheme = NagiUiTheme.Dark) {
        SystemPageBackground {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .statusBarsPadding()
                    .navigationBarsPadding()
            ) {
                // Header with back button
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(44.dp)
                        .padding(horizontal = 17.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    NagiIconButton(icon = NagiIcon.Back, onClick = onBack)
                    Spacer(modifier = Modifier.weight(1f))
                    Spacer(modifier = Modifier.width(36.dp))
                }

                // Authority §16.2: catalog-panel, left/right=18, top=84(from screen top, already have header), bottom=34
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 18.dp)
                        .padding(bottom = 34.dp)
                        .clip(NagiShapes.cutMedium)
                        .background(
                            Brush.verticalGradient(
                                listOf(
                                    Color(0x57101827), // 34%
                                    Color(0x85101827)  // 52%
                                )
                            )
                        )
                        .border(1.dp, Color(0x1AFFFFFF), NagiShapes.cutMedium)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(18.dp)
                    ) {
                        // Title area: authority §16.2
                        Text(
                            text = "章节目录",
                            fontFamily = FontFamily.Serif,
                            fontSize = 28.sp,
                            fontWeight = FontWeight.Normal,
                            color = NagiTheme.colors.textPrimary
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "选择章节重新阅读，或继续当前进度。",
                            fontSize = 12.sp,
                            lineHeight = (12 * 1.7).sp,
                            color = Color(0xB3F4F1EA) // 70%
                        )
                        Spacer(modifier = Modifier.height(16.dp))

                        // List area
                        LazyColumn(
                            modifier = Modifier
                                .weight(1f)
                                .fillMaxWidth(),
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            items(catalogItems) { item ->
                                val isCurrent = item.state == SectionState.IN_PROGRESS
                                val isLocked = item.state == SectionState.LOCKED
                                val stateText = when (item.state) {
                                    SectionState.IN_PROGRESS -> "进行中"
                                    SectionState.COMPLETED -> "已完成"
                                    SectionState.SKIPPED_COMPLETED -> "已跳过"
                                    SectionState.LOCKED -> "未解锁"
                                }

                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .defaultMinSize(minHeight = 68.dp)
                                        .then(if (isLocked) Modifier.alpha(0.52f) else Modifier)
                                        .clip(NagiShapes.cutSmall)
                                        .background(
                                            if (isCurrent) Brush.horizontalGradient( // §P2-4: gradient
                                                listOf(
                                                    Color(0x2ED7BE86), // rgba(215,190,134,0.18)
                                                    Color(0x0AFFFFFF)  // rgba(255,255,255,0.04)
                                                )
                                            ) else Brush.horizontalGradient(
                                                listOf(
                                                    Color(0x0BFFFFFF),
                                                    Color(0x0BFFFFFF)
                                                )
                                            )
                                        )
                                        .border(
                                            1.dp,
                                            if (isCurrent) Color(0x47D7BE86) // gold border 28%
                                            else Color(0x12FFFFFF),          // 7%
                                            NagiShapes.cutSmall
                                        )
                                        .then(
                                            if (!isLocked) Modifier.clickable(
                                                interactionSource = remember { MutableInteractionSource() },
                                                indication = null,
                                                onClick = {
                                                    when (item.state) {
                                                        SectionState.COMPLETED, SectionState.SKIPPED_COMPLETED ->
                                                            onReplaySection(item.startNode, item.chapterId, item.sectionIndex)
                                                        SectionState.IN_PROGRESS ->
                                                            onJumpToNode(item.startNode)
                                                        else -> {}
                                                    }
                                                }
                                            ) else Modifier
                                        )
                                        .padding(horizontal = 14.dp, vertical = 13.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(
                                            text = item.sectionTitle,
                                            fontFamily = FontFamily.Default,
                                            fontWeight = FontWeight.Medium,
                                            fontSize = 15.sp,
                                            color = Color(0xF0F7F9FC), // 94%
                                            maxLines = 1,
                                            overflow = TextOverflow.Ellipsis
                                        )
                                        Spacer(modifier = Modifier.height(3.dp))
                                        Text(
                                            text = item.chapterName,
                                            fontSize = 12.sp,
                                            color = Color(0xA3F4F1EA), // 64%
                                            maxLines = 1,
                                            overflow = TextOverflow.Ellipsis
                                        )
                                    }
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = stateText,
                                        fontSize = 12.sp,
                                        color = if (isCurrent) goldColor else Color(0xB3F4F1EA) // gold or 70%
                                    )
                                }
                            }
                        }

                        // Bottom actions: authority §16.4
                        Spacer(modifier = Modifier.height(12.dp))
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .drawBehind {
                                    drawLine(
                                        color = Color(0x14FFFFFF),
                                        start = Offset(0f, 0f),
                                        end = Offset(size.width, 0f),
                                        strokeWidth = 1f
                                    )
                                }
                                .padding(top = 10.dp) // §P2-4: 10dp
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(
                                    text = "返回主页",
                                    fontSize = 14.sp,
                                    color = Color(0xD1F4F1EA), // §P2-4: rgba(244,241,234,0.82)
                                    modifier = Modifier.clickable(
                                        interactionSource = remember { MutableInteractionSource() },
                                        indication = null,
                                        onClick = onBack
                                    )
                                )
                                if (currentItem != null) {
                                    Text(
                                        text = "继续当前章节",
                                        fontSize = 14.sp,
                                        fontWeight = FontWeight.Medium,
                                        color = Color(0xF5F7F9FC), // §P2-4: rgba(247,249,252,0.96)
                                        modifier = Modifier.clickable(
                                            interactionSource = remember { MutableInteractionSource() },
                                            indication = null,
                                            onClick = { onJumpToNode(currentItem.startNode) }
                                        )
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
