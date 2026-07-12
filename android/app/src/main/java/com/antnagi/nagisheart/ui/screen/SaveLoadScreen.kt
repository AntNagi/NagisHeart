package com.antnagi.nagisheart.ui.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import com.antnagi.nagisheart.ui.component.NagiDialog
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.antnagi.nagisheart.data.SaveSlot
import com.antnagi.nagisheart.ui.component.SystemPageBackground
import com.antnagi.nagisheart.ui.icon.NagiIcon
import com.antnagi.nagisheart.ui.icon.NagiIconButton
import com.antnagi.nagisheart.ui.theme.*
import com.antnagi.nagisheart.ui.viewmodel.GameViewModel
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@Composable
fun SaveLoadScreen(
    mode: String,
    viewModel: GameViewModel,
    onBack: () -> Unit,
    onLoaded: () -> Unit
) {
    val isSaveMode = mode == "save"
    var slots by remember { mutableStateOf(viewModel.getSaveSlots()) }
    var confirmOverwriteSlot by remember { mutableStateOf<Int?>(null) }

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
                        text = "存档进度",
                        fontFamily = FontFamily.Serif,
                        fontSize = 14.sp,
                        color = NagiTheme.colors.textPrimary
                    )
                    Spacer(modifier = Modifier.weight(1f))
                    Spacer(modifier = Modifier.width(36.dp))
                }

                // Slot list
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 20.dp)
                        .padding(top = 26.dp, bottom = 32.dp)
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Text(
                        text = if (isSaveMode) "选择存档位" else "选择进度",
                        fontFamily = FontFamily.Serif,
                        fontSize = 27.sp,
                        color = NagiTheme.colors.textPrimary,
                        modifier = Modifier.padding(bottom = 12.dp)
                    )

                    for (i in 1..10) {
                        val slot = slots.getOrNull(i - 1)
                        SaveRow(i, slot, isSaveMode) {
                            if (isSaveMode) {
                                if (slot != null) {
                                    confirmOverwriteSlot = i
                                } else {
                                    viewModel.saveGame(i)
                                    slots = viewModel.getSaveSlots()
                                }
                            } else if (viewModel.loadGame(i)) {
                                onLoaded()
                            }
                        }
                    }
                }
            }
        }

        confirmOverwriteSlot?.let { slotId ->
            NagiDialog(
                onDismissRequest = { confirmOverwriteSlot = null },
                title = "覆盖存档",
                text = "存档位 $slotId 已有内容，确定覆盖？",
                onConfirm = {
                    viewModel.saveGame(slotId)
                    slots = viewModel.getSaveSlots()
                    confirmOverwriteSlot = null
                },
                onDismiss = { confirmOverwriteSlot = null }
            )
        }
    }
}

@Composable
private fun SaveRow(slotId: Int, slot: SaveSlot?, isSaveMode: Boolean, onClick: () -> Unit) {
    val colors = NagiTheme.colors

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .heightIn(min = 56.dp)
            .clip(NagiShapes.cutSmall)
            .background(
                Brush.horizontalGradient(
                    listOf(
                        colors.glassBgStrong,
                        colors.glassBgSoft.copy(alpha = 0.38f),
                        Color.Transparent
                    )
                )
            )
            .clickable(enabled = isSaveMode || slot != null, onClick = onClick)
            .padding(start = 18.dp, end = 4.dp, top = 10.dp, bottom = 10.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        if (slot == null) {
            Text(
                text = "存档位 $slotId",
                style = NagiTheme.typography.speakerName,
                color = colors.textSecondary
            )
            Text(
                text = "空白",
                style = NagiTheme.typography.micro,
                color = colors.textSecondary.copy(alpha = 0.5f)
            )
        } else {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = slot.sceneTitle.ifEmpty { "存档位 $slotId" },
                    style = NagiTheme.typography.buttonText,
                    color = colors.textPrimary,
                    maxLines = 1
                )
                Text(
                    text = formatTime(slot.timestamp),
                    style = NagiTheme.typography.micro,
                    color = colors.textSecondary
                )
            }
        }
    }
}

private fun formatTime(timestamp: Long): String =
    SimpleDateFormat("yyyy/MM/dd HH:mm", Locale.getDefault()).format(Date(timestamp))
