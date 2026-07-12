package com.antnagi.nagisheart.data

import android.content.Context
import android.content.SharedPreferences

data class UserSettings(
    val textSpeed: TextSpeed = TextSpeed.Normal,
    val autoSpeed: Int = 3,
    val bgmVolume: Int = 80,
    val displayTheme: DisplayTheme = DisplayTheme.Auto
)

enum class TextSpeed(val label: String, val charDelayMs: Long) {
    Slow("慢", 60),
    Normal("正常", 30),
    Fast("快", 10),
    Instant("立即显示", 0)
}

enum class DisplayTheme(val label: String) {
    Light("浅色"),
    Dark("深色"),
    Auto("自动")
}

class SettingsManager(context: Context) {

    private val prefs: SharedPreferences =
        context.getSharedPreferences("nagi_settings", Context.MODE_PRIVATE)

    fun load(): UserSettings = UserSettings(
        textSpeed = TextSpeed.entries.find { it.name == prefs.getString("textSpeed", "Normal") }
            ?: TextSpeed.Normal,
        autoSpeed = prefs.getInt("autoSpeed", 3),
        bgmVolume = prefs.getInt("bgmVolume", 80),
        displayTheme = DisplayTheme.entries.find { it.name == prefs.getString("displayTheme", "Auto") }
            ?: DisplayTheme.Auto
    )

    fun save(settings: UserSettings) {
        prefs.edit()
            .putString("textSpeed", settings.textSpeed.name)
            .putInt("autoSpeed", settings.autoSpeed)
            .putInt("bgmVolume", settings.bgmVolume)
            .putString("displayTheme", settings.displayTheme.name)
            .apply()
    }
}
