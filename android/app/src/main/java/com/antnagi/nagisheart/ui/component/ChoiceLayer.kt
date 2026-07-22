package com.antnagi.nagisheart.ui.component

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.unit.dp
import com.antnagi.nagisheart.data.Choice
import com.antnagi.nagisheart.ui.theme.NagiMotion
import com.antnagi.nagisheart.ui.theme.NagiPalette
import com.antnagi.nagisheart.ui.theme.NagiShapes
import com.antnagi.nagisheart.ui.theme.NagiTheme
import com.antnagi.nagisheart.ui.theme.NagiTokens

@Composable
fun ChoiceLayer(
    choices: List<Choice>,
    onChoiceSelected: (Int) -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 18.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
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
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(NagiShapes.cutSmall)
            .background(
                Brush.horizontalGradient(
                    0f to NagiTokens.deepBlue.copy(alpha = 0.48f),
                    0.50f to NagiTokens.deepBlue.copy(alpha = 0.44f),
                    1f to NagiTokens.deepBlue.copy(alpha = 0f)
                )
            )
            .border(1.dp, NagiTokens.borderGlass, NagiShapes.cutSmall)
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 14.dp),
        contentAlignment = Alignment.CenterStart
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(9.dp)
                    .clip(NagiShapes.pentagon)
                    .background(NagiPalette.roseGold.copy(alpha = 0.76f))
            )
            Text(
                text = text,
                style = NagiTheme.typography.choiceText,
                color = NagiTokens.snow.copy(alpha = 0.98f)
            )
        }
    }
}
