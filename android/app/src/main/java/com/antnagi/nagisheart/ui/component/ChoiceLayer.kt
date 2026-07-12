package com.antnagi.nagisheart.ui.component

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.BiasAlignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.antnagi.nagisheart.data.Choice
import com.antnagi.nagisheart.ui.theme.*

@Composable
fun ChoiceLayer(
    choices: List<Choice>,
    onChoiceSelected: (Int) -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier.fillMaxSize(),
        contentAlignment = BiasAlignment(0f, -0.14f)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 34.dp),
            verticalArrangement = Arrangement.spacedBy(NagiTheme.spacing.m)
        ) {
            choices.forEachIndexed { index, choice ->
                AnimatedVisibility(
                    visible = true,
                    enter = fadeIn(NagiMotion.choiceIn()) +
                            slideInVertically(NagiMotion.choiceIn()) { it / 3 }
                ) {
                    ChoiceItem(
                        text = choice.label,
                        onClick = { onChoiceSelected(index) }
                    )
                }
            }
        }
    }
}

@Composable
private fun ChoiceItem(
    text: String,
    onClick: () -> Unit
) {
    val colors = NagiTheme.colors

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .heightIn(min = 54.dp)
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
            .clickable(onClick = onClick)
            .padding(start = 34.dp, end = 14.dp, top = 8.dp, bottom = 8.dp)
    ) {
        // Pentagon marker
        Box(
            modifier = Modifier
                .size(10.dp)
                .align(Alignment.CenterStart)
                .offset(x = (-25).dp)
                .clip(NagiShapes.pentagon)
                .background(NagiPalette.roseGold.copy(alpha = 0.36f))
        )
        Text(
            text = text,
            style = NagiTheme.typography.choiceText,
            color = colors.textPrimary,
            modifier = Modifier.align(Alignment.CenterStart)
        )
    }
}
