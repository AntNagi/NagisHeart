package com.antnagi.nagisheart.ui.theme

import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.tween

object NagiMotion {
    const val FAST = 120
    const val NORMAL = 180
    const val CHOICE_IN = 220
    const val SCENE = 360
    const val CHAPTER = 520
    const val ENDING = 700

    val standard = CubicBezierEasing(0.2f, 0f, 0f, 1f)
    val decelerate = CubicBezierEasing(0f, 0f, 0.2f, 1f)
    val easeInOut = CubicBezierEasing(0.42f, 0f, 0.58f, 1f)

    fun <T> fast() = tween<T>(FAST, easing = standard)
    fun <T> normal() = tween<T>(NORMAL, easing = standard)
    fun <T> choiceIn() = tween<T>(CHOICE_IN, easing = decelerate)
    fun <T> scene() = tween<T>(SCENE, easing = easeInOut)
    fun <T> chapter() = tween<T>(CHAPTER, easing = easeInOut)
    fun <T> ending() = tween<T>(ENDING, easing = easeInOut)
}
