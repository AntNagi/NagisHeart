package com.antnagi.nagisheart.ui.theme

import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.ReadOnlyComposable

enum class NagiUiTheme { Light, Dark, Auto }

@Composable
fun NagiTheme(
    uiTheme: NagiUiTheme = NagiUiTheme.Light,
    backgroundBrightness: Float = 0.5f,
    content: @Composable () -> Unit
) {
    val colors = when (uiTheme) {
        NagiUiTheme.Light -> LightNagiColors
        NagiUiTheme.Dark -> DarkNagiColors
        NagiUiTheme.Auto -> if (backgroundBrightness > 0.5f) LightNagiColors else DarkNagiColors
    }

    CompositionLocalProvider(
        LocalNagiColors provides colors,
        LocalNagiTypography provides DefaultNagiTypography,
        LocalNagiSpacing provides NagiSpacing(),
        LocalNagiRadius provides NagiRadius(),
        LocalNagiSizes provides NagiSizes(),
        LocalNagiStroke provides NagiStroke(),
        content = content
    )
}

object NagiTheme {
    val colors: NagiColors
        @Composable @ReadOnlyComposable
        get() = LocalNagiColors.current

    val typography: NagiTypography
        @Composable @ReadOnlyComposable
        get() = LocalNagiTypography.current

    val spacing: NagiSpacing
        @Composable @ReadOnlyComposable
        get() = LocalNagiSpacing.current

    val radius: NagiRadius
        @Composable @ReadOnlyComposable
        get() = LocalNagiRadius.current

    val sizes: NagiSizes
        @Composable @ReadOnlyComposable
        get() = LocalNagiSizes.current

    val stroke: NagiStroke
        @Composable @ReadOnlyComposable
        get() = LocalNagiStroke.current
}
