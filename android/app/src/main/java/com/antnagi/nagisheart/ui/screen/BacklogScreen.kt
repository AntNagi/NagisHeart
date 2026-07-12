package com.antnagi.nagisheart.ui.screen

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.unit.dp
import com.antnagi.nagisheart.ui.icon.NagiIcon
import com.antnagi.nagisheart.ui.icon.NagiIconButton
import com.antnagi.nagisheart.ui.component.SystemPageBackground
import com.antnagi.nagisheart.ui.theme.*
import com.antnagi.nagisheart.ui.viewmodel.BacklogEntry
import com.antnagi.nagisheart.ui.viewmodel.GameViewModel

@Composable
fun BacklogScreen(
    viewModel: GameViewModel,
    onBack: () -> Unit
) {
    val entries = remember { viewModel.getBacklog() }
    val listState = rememberLazyListState(
        initialFirstVisibleItemIndex = (entries.size - 1).coerceAtLeast(0)
    )

    NagiTheme(uiTheme = NagiUiTheme.Dark) {
        SystemPageBackground {
        Column(
            modifier = Modifier.fillMaxSize().statusBarsPadding().navigationBarsPadding()
        ) {
            // Header
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = NagiTheme.spacing.xs),
                verticalAlignment = Alignment.CenterVertically
            ) {
                NagiIconButton(
                    icon = NagiIcon.Back,
                    onClick = onBack
                )
                Spacer(modifier = Modifier.weight(1f))
                Text(
                    text = "剧情回顾",
                    style = NagiTheme.typography.titleSection,
                    color = NagiTheme.colors.textPrimary
                )
                Spacer(modifier = Modifier.weight(1f))
                Spacer(modifier = Modifier.width(NagiTheme.sizes.hudButton))
            }

            // Timeline list
            LazyColumn(
                state = listState,
                modifier = Modifier.fillMaxSize()
            ) {
                itemsIndexed(entries) { index, entry ->
                    TimelineItem(
                        entry = entry,
                        isFirst = index == 0,
                        isLast = index == entries.size - 1
                    )
                }
                item {
                    Spacer(modifier = Modifier.height(NagiTheme.spacing.xxl))
                }
            }
        }
        }
    }
}

@Composable
private fun TimelineItem(
    entry: BacklogEntry,
    isFirst: Boolean,
    isLast: Boolean
) {
    val lineColor = NagiPalette.nagiGrayBlue.copy(alpha = 0.2f)
    val dotColor = if (entry.speaker.isNotEmpty())
        NagiPalette.roseGold.copy(alpha = 0.5f)
    else
        NagiPalette.silverBlue.copy(alpha = 0.3f)
    val dotRadius = if (entry.speaker.isNotEmpty()) 4f else 3f

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(IntrinsicSize.Min)
            .padding(end = NagiTheme.spacing.l)
    ) {
        // Timeline column: vertical line + dot
        Box(
            modifier = Modifier
                .width(40.dp)
                .fillMaxHeight()
                .defaultMinSize(minHeight = 48.dp),
            contentAlignment = Alignment.TopCenter
        ) {
            Canvas(
                modifier = Modifier
                    .fillMaxHeight()
                    .width(40.dp)
            ) {
                val centerX = size.width / 2
                val dotY = 20f

                // Line above dot
                if (!isFirst) {
                    drawLine(
                        color = lineColor,
                        start = Offset(centerX, 0f),
                        end = Offset(centerX, dotY - dotRadius * 2),
                        strokeWidth = 1f
                    )
                }

                // Dot
                drawCircle(
                    color = dotColor,
                    radius = dotRadius,
                    center = Offset(centerX, dotY)
                )

                // Line below dot
                if (!isLast) {
                    drawLine(
                        color = lineColor,
                        start = Offset(centerX, dotY + dotRadius * 2),
                        end = Offset(centerX, size.height),
                        strokeWidth = 1f
                    )
                }
            }
        }

        // Content column
        Column(
            modifier = Modifier
                .weight(1f)
                .padding(
                    top = NagiTheme.spacing.xs,
                    bottom = NagiTheme.spacing.s
                )
        ) {
            if (entry.speaker.isNotEmpty()) {
                Text(
                    text = entry.speaker,
                    style = NagiTheme.typography.speakerName,
                    color = NagiPalette.roseGold.copy(alpha = 0.7f)
                )
                Spacer(modifier = Modifier.height(2.dp))
            }
            Text(
                text = entry.text,
                style = NagiTheme.typography.caption,
                color = NagiPalette.silverBlue.copy(alpha = 0.7f)
            )
        }
    }
}
