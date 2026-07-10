package com.antnagi.nagisheart.ui.theme

import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

@Immutable
data class NagiTypography(
    val titleHero: TextStyle,
    val titlePage: TextStyle,
    val titleSection: TextStyle,
    val speakerName: TextStyle,
    val dialogue: TextStyle,
    val narration: TextStyle,
    val choiceText: TextStyle,
    val lineMessage: TextStyle,
    val buttonText: TextStyle,
    val caption: TextStyle,
    val micro: TextStyle
)

private val sansFamily = FontFamily.Default
private val serifFamily = FontFamily.Serif

val DefaultNagiTypography = NagiTypography(
    titleHero = TextStyle(
        fontFamily = serifFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 34.sp,
        lineHeight = 40.sp
    ),
    titlePage = TextStyle(
        fontFamily = serifFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 24.sp,
        lineHeight = 30.sp
    ),
    titleSection = TextStyle(
        fontFamily = sansFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 18.sp,
        lineHeight = 24.sp
    ),
    speakerName = TextStyle(
        fontFamily = sansFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 13.sp,
        lineHeight = 18.sp
    ),
    dialogue = TextStyle(
        fontFamily = sansFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 17.sp,
        lineHeight = 27.sp
    ),
    narration = TextStyle(
        fontFamily = sansFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 17.sp,
        lineHeight = 28.sp
    ),
    choiceText = TextStyle(
        fontFamily = sansFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 23.sp
    ),
    lineMessage = TextStyle(
        fontFamily = sansFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 15.sp,
        lineHeight = 22.sp
    ),
    buttonText = TextStyle(
        fontFamily = sansFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 15.sp,
        lineHeight = 20.sp
    ),
    caption = TextStyle(
        fontFamily = sansFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 12.sp,
        lineHeight = 16.sp
    ),
    micro = TextStyle(
        fontFamily = sansFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 11.sp,
        lineHeight = 14.sp
    )
)

val LocalNagiTypography = staticCompositionLocalOf { DefaultNagiTypography }
