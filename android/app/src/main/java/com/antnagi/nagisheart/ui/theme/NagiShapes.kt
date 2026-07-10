package com.antnagi.nagisheart.ui.theme

import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Outline
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.unit.Density
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp

class CutCornerGlassShape(private val cut: Dp = 8.dp) : Shape {
    override fun createOutline(size: Size, layoutDirection: LayoutDirection, density: Density): Outline {
        val c = with(density) { cut.toPx() }
        val w = size.width
        val h = size.height
        val path = Path().apply {
            moveTo(0f, c)
            lineTo(c, 0f)
            lineTo(w - c, 0f)
            lineTo(w, c)
            lineTo(w, h - c)
            lineTo(w - c, h)
            lineTo(c, h)
            lineTo(0f, h - c)
            close()
        }
        return Outline.Generic(path)
    }
}

class PentagonShape : Shape {
    override fun createOutline(size: Size, layoutDirection: LayoutDirection, density: Density): Outline {
        val w = size.width
        val h = size.height
        val path = Path().apply {
            moveTo(w * 0.50f, h * 0.04f)
            lineTo(w * 0.94f, h * 0.36f)
            lineTo(w * 0.78f, h * 0.90f)
            lineTo(w * 0.22f, h * 0.90f)
            lineTo(w * 0.06f, h * 0.36f)
            close()
        }
        return Outline.Generic(path)
    }
}

object NagiShapes {
    val cutSmall = CutCornerGlassShape(cut = 8.dp)
    val cutMedium = CutCornerGlassShape(cut = 14.dp)
    val pentagon = PentagonShape()
}
