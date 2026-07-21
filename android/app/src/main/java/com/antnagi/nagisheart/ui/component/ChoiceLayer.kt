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
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
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
        contentAlignment = Alignment.BottomCenter
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 18.dp)
                .padding(bottom = 34.dp)
                .navigationBarsPadding(),
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
            .background(NagiTokens.deepBlue.copy(alpha = 0.48f)) // §19
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 14.dp),
        contentAlignment = Alignment.CenterStart
    ) {
        Text(
            text = text,
            style = NagiTheme.typography.choiceText,
            color = NagiTokens.textSnow92 // §19.5
        )
    }
}
