package com.antnagi.nagisheart.ui.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.antnagi.nagisheart.data.*
import com.antnagi.nagisheart.ui.component.SystemPageBackground
import com.antnagi.nagisheart.ui.icon.NagiIcon
import com.antnagi.nagisheart.ui.icon.NagiIconButton
import com.antnagi.nagisheart.ui.theme.*
import com.antnagi.nagisheart.ui.viewmodel.GameViewModel

@Composable
fun SettingsScreen(
    viewModel: GameViewModel,
    onBack: () -> Unit
) {
    var settings by remember { mutableStateOf(viewModel.getSettings()) }

    fun update(newSettings: UserSettings) {
        settings = newSettings
        viewModel.updateSettings(newSettings)
    }

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
                        text = "系统设置",
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
                        .padding(top = 26.dp, bottom = 32.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Text(
                        text = "系统设置",
                        fontFamily = FontFamily.Serif,
                        fontSize = 27.sp,
                        color = NagiTheme.colors.textPrimary,
                        modifier = Modifier.padding(bottom = 12.dp)
                    )

                    SettingsRow(
                        label = "文字速度",
                        value = settings.textSpeed.label,
                        onClick = {
                            val next = TextSpeed.entries.let { entries ->
                                val idx = entries.indexOf(settings.textSpeed)
                                entries[(idx + 1) % entries.size]
                            }
                            update(settings.copy(textSpeed = next))
                        }
                    )

                    SettingsRow(
                        label = "自动播放速度",
                        value = "${settings.autoSpeed}",
                        onClick = {
                            val next = if (settings.autoSpeed >= 5) 1 else settings.autoSpeed + 1
                            update(settings.copy(autoSpeed = next))
                        }
                    )

                    SettingsRow(
                        label = "背景音乐",
                        value = "${settings.bgmVolume}%",
                        onClick = {
                            val next = (settings.bgmVolume + 20) % 120
                            update(settings.copy(bgmVolume = next))
                        }
                    )

                    SettingsRow(
                        label = "显示模式",
                        value = settings.displayTheme.label,
                        onClick = {
                            val next = DisplayTheme.entries.let { entries ->
                                val idx = entries.indexOf(settings.displayTheme)
                                entries[(idx + 1) % entries.size]
                            }
                            update(settings.copy(displayTheme = next))
                        }
                    )

                    SettingsRow(
                        label = "数据管理",
                        value = "管理",
                        onClick = {}
                    )
                }
            }
        }
    }
}

@Composable
private fun SettingsRow(
    label: String,
    value: String,
    onClick: () -> Unit
) {
    val colors = NagiTheme.colors

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .heightIn(min = 56.dp)
            .clip(NagiShapes.cutSmall)
            .background(Color.White.copy(alpha = 0.04f))
            .clickable(onClick = onClick)
            .padding(start = 18.dp, end = 4.dp, top = 10.dp, bottom = 10.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = label,
            style = NagiTheme.typography.buttonText,
            color = colors.textPrimary
        )
        Text(
            text = value,
            style = NagiTheme.typography.micro,
            color = colors.textSecondary
        )
    }
}
