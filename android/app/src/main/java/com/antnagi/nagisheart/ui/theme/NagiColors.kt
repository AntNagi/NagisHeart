package com.antnagi.nagisheart.ui.theme

import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

// ── Base Palette (shared across light/dark) ──

object NagiPalette {
    val snowWhite = Color(0xFFF7F9FC)
    val mistBlue = Color(0xFFE8EEF6)
    val softGlassWhite = Color(0xFFFFFFFF)
    val nagiGrayBlue = Color(0xFFAEBAC8)
    val deepBlueNight = Color(0xFF101827)
    val inkNavy = Color(0xFF1B2430)
    val coldGray = Color(0xFF6E7A89)
    val silverBlue = Color(0xFFC9D1DC)
    val silver = Color(0xFFC9D1DC)
    val weakText = Color(0xFFB7B3AD)
    val mutedRose = Color(0xFFC98A96)
    val roseGold = Color(0xFFBFA08A)
    val driedWine = Color(0xFF7A3F4A)
    val paleGold = Color(0xFFD8C38A)
}

// ── Semantic Colors ──

@Immutable
data class NagiColors(
    val backgroundPrimary: Color,
    val backgroundSecondary: Color,
    val textPrimary: Color,
    val textSecondary: Color,
    val textWeak: Color,
    val textInverse: Color,
    val borderSubtle: Color,
    val iconDefault: Color,
    val accentPrimary: Color,
    val accentHeart: Color,
    val danger: Color,
    val successSpecial: Color,

    // Glass / soft backgrounds
    val glassBg: Color,
    val glassBgStrong: Color,
    val glassBgSoft: Color,

    // Overlay
    val overlayBottomStart: Color,
    val overlayBottomEnd: Color,
    val overlayFullDim: Color,

    // HUD
    val hudColor: Color,
    val hudSoft: Color,

    // Text shadow
    val textShadowColor: Color,

    val isLight: Boolean
)

val LightNagiColors = NagiColors(
    backgroundPrimary = NagiPalette.snowWhite,
    backgroundSecondary = NagiPalette.mistBlue,
    textPrimary = NagiPalette.inkNavy,
    textSecondary = NagiPalette.coldGray,
    textWeak = NagiPalette.weakText,
    textInverse = NagiPalette.snowWhite,
    borderSubtle = NagiPalette.nagiGrayBlue.copy(alpha = 0.45f),
    iconDefault = NagiPalette.nagiGrayBlue.copy(alpha = 0.82f),
    accentPrimary = NagiPalette.roseGold,
    accentHeart = NagiPalette.mutedRose,
    danger = NagiPalette.driedWine,
    successSpecial = NagiPalette.paleGold,
    glassBg = Color(0x61F7F9FC),
    glassBgStrong = Color(0x9EF7F9FC),
    glassBgSoft = Color(0x61F7F9FC),
    overlayBottomStart = NagiPalette.snowWhite.copy(alpha = 0f),
    overlayBottomEnd = NagiPalette.snowWhite.copy(alpha = 0.82f),
    overlayFullDim = NagiPalette.deepBlueNight.copy(alpha = 0.28f),
    hudColor = NagiPalette.inkNavy.copy(alpha = 0.76f),
    hudSoft = NagiPalette.inkNavy.copy(alpha = 0.16f),
    textShadowColor = Color(0x7AFFFFFF),
    isLight = true
)

val DarkNagiColors = NagiColors(
    backgroundPrimary = NagiPalette.deepBlueNight,
    backgroundSecondary = NagiPalette.deepBlueNight,
    textPrimary = NagiPalette.snowWhite,
    textSecondary = NagiPalette.silverBlue,
    textWeak = NagiPalette.weakText,
    textInverse = NagiPalette.inkNavy,
    borderSubtle = NagiPalette.nagiGrayBlue.copy(alpha = 0.28f),
    iconDefault = NagiPalette.silverBlue.copy(alpha = 0.78f),
    accentPrimary = NagiPalette.roseGold,
    accentHeart = NagiPalette.mutedRose.copy(alpha = 0.78f),
    danger = NagiPalette.driedWine,
    successSpecial = NagiPalette.paleGold,
    glassBg = Color(0x421B2436),
    glassBgStrong = Color(0x521B2436),
    glassBgSoft = Color(0x331B2436),
    overlayBottomStart = NagiPalette.deepBlueNight.copy(alpha = 0f),
    overlayBottomEnd = NagiPalette.deepBlueNight.copy(alpha = 0.90f),
    overlayFullDim = NagiPalette.deepBlueNight.copy(alpha = 0.28f),
    hudColor = NagiPalette.snowWhite.copy(alpha = 0.82f),
    hudSoft = NagiPalette.snowWhite.copy(alpha = 0.16f),
    textShadowColor = Color(0xB8000000),
    isLight = false
)

val LocalNagiColors = staticCompositionLocalOf { LightNagiColors }
