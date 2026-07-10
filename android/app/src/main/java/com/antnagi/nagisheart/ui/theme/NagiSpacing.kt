package com.antnagi.nagisheart.ui.theme

import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

@Immutable
data class NagiSpacing(
    val xxs: Dp = 4.dp,
    val xs: Dp = 8.dp,
    val s: Dp = 12.dp,
    val m: Dp = 16.dp,
    val l: Dp = 20.dp,
    val xl: Dp = 24.dp,
    val xxl: Dp = 32.dp,
    val hero: Dp = 48.dp
)

@Immutable
data class NagiRadius(
    val none: Dp = 0.dp,
    val tiny: Dp = 4.dp,
    val small: Dp = 6.dp,
    val card: Dp = 8.dp,
    val panel: Dp = 8.dp,
    val bubble: Dp = 14.dp,
    val pill: Dp = 999.dp
)

@Immutable
data class NagiSizes(
    val touchMin: Dp = 48.dp,
    val hudIcon: Dp = 22.dp,
    val hudButton: Dp = 44.dp,
    val dialogueMinHeight: Dp = 132.dp,
    val dialogueMaxHeight: Dp = 236.dp,
    val choiceMinHeight: Dp = 56.dp,
    val choiceGap: Dp = 10.dp,
    val lineBubbleMaxWidth: Dp = 252.dp,
    val thumbnailWidth: Dp = 72.dp,
    val thumbnailHeight: Dp = 104.dp,
    val galleryCardWidth: Dp = 150.dp,
    val galleryCardHeight: Dp = 212.dp
)

@Immutable
data class NagiStroke(
    val hairline: Dp = 0.5.dp,
    val default: Dp = 1.dp,
    val selected: Dp = 1.5.dp,
    val focus: Dp = 2.dp
)

val LocalNagiSpacing = staticCompositionLocalOf { NagiSpacing() }
val LocalNagiRadius = staticCompositionLocalOf { NagiRadius() }
val LocalNagiSizes = staticCompositionLocalOf { NagiSizes() }
val LocalNagiStroke = staticCompositionLocalOf { NagiStroke() }
