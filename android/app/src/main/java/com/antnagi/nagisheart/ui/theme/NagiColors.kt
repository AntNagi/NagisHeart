package com.antnagi.nagisheart.ui.theme

import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

// ── Base Palette ──

object NagiPalette {
    val snowWhite = Color(0xFFF7F9FC)
    val mistBlue = Color(0xFFE8EEF6)
    val softGlassWhite = Color(0xFFFFFFFF)
    val nagiGrayBlue = Color(0xFFAEBAC8)
    val deepBlueNight = Color(0xFF101827)
    val inkNavy = Color(0xFF1B2430)
    val coldGray = Color(0xFF6E7A89)
    val silverBlue = Color(0xFFC9D1DC)
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
    val textInverse: Color,
    val borderSubtle: Color,
    val iconDefault: Color,
    val accentPrimary: Color,
    val accentHeart: Color,
    val danger: Color,
    val successSpecial: Color,

    // Glass
    val glassBg: Color,
    val glassBgStrong: Color,
    val glassBgSoft: Color,

    // Overlay
    val overlayBottomStart: Color,
    val overlayBottomEnd: Color,
    val overlayFullDim: Color,

    val isLight: Boolean
)

val LightNagiColors = NagiColors(
    backgroundPrimary = NagiPalette.snowWhite,
    backgroundSecondary = NagiPalette.mistBlue,
    textPrimary = NagiPalette.inkNavy,
    textSecondary = NagiPalette.coldGray,
    textInverse = NagiPalette.snowWhite,
    borderSubtle = NagiPalette.nagiGrayBlue.copy(alpha = 0.45f),
    iconDefault = NagiPalette.nagiGrayBlue.copy(alpha = 0.82f),
    accentPrimary = NagiPalette.roseGold,
    accentHeart = NagiPalette.mutedRose,
    danger = NagiPalette.driedWine,
    successSpecial = NagiPalette.paleGold,
    glassBg = Color.White.copy(alpha = 0.78f),
    glassBgStrong = Color.White.copy(alpha = 0.86f),
    glassBgSoft = Color.White.copy(alpha = 0.72f),
    overlayBottomStart = NagiPalette.snowWhite.copy(alpha = 0f),
    overlayBottomEnd = NagiPalette.snowWhite.copy(alpha = 0.82f),
    overlayFullDim = NagiPalette.deepBlueNight.copy(alpha = 0.28f),
    isLight = true
)

val DarkNagiColors = NagiColors(
    backgroundPrimary = NagiPalette.deepBlueNight,
    backgroundSecondary = NagiPalette.deepBlueNight,
    textPrimary = NagiPalette.snowWhite,
    textSecondary = NagiPalette.silverBlue,
    textInverse = NagiPalette.inkNavy,
    borderSubtle = NagiPalette.nagiGrayBlue.copy(alpha = 0.28f),
    iconDefault = NagiPalette.silverBlue.copy(alpha = 0.78f),
    accentPrimary = NagiPalette.roseGold.copy(alpha = 0.88f),
    accentHeart = NagiPalette.mutedRose.copy(alpha = 0.78f),
    danger = NagiPalette.driedWine,
    successSpecial = NagiPalette.paleGold,
    glassBg = NagiPalette.deepBlueNight.copy(alpha = 0.74f),
    glassBgStrong = NagiPalette.deepBlueNight.copy(alpha = 0.82f),
    glassBgSoft = NagiPalette.deepBlueNight.copy(alpha = 0.68f),
    overlayBottomStart = NagiPalette.deepBlueNight.copy(alpha = 0f),
    overlayBottomEnd = NagiPalette.deepBlueNight.copy(alpha = 0.86f),
    overlayFullDim = NagiPalette.deepBlueNight.copy(alpha = 0.28f),
    isLight = false
)

val LocalNagiColors = staticCompositionLocalOf { LightNagiColors }
