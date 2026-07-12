package com.antnagi.nagisheart.ui.component

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import com.antnagi.nagisheart.data.DialogueLine
import com.antnagi.nagisheart.ui.theme.*

data class ChatMessage(
    val speaker: String,
    val text: String,
    val isPlayer: Boolean
)

@Composable
fun LineChatLayer(
    messages: List<ChatMessage>,
    modifier: Modifier = Modifier
) {
    val listState = rememberLazyListState()

    LaunchedEffect(messages.size) {
        if (messages.isNotEmpty()) {
            listState.animateScrollToItem(messages.size - 1)
        }
    }

    LazyColumn(
        state = listState,
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = NagiTheme.spacing.m),
        verticalArrangement = Arrangement.spacedBy(NagiTheme.spacing.s),
        contentPadding = PaddingValues(
            top = NagiTheme.spacing.hero,
            bottom = NagiTheme.spacing.xxl
        )
    ) {
        items(messages) { msg ->
            ChatBubble(message = msg)
        }
    }
}

@Composable
private fun ChatBubble(message: ChatMessage) {
    val colors = NagiTheme.colors

    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = if (message.isPlayer) Arrangement.End else Arrangement.Start
    ) {
        if (message.isPlayer) Spacer(modifier = Modifier.weight(0.2f))

        Column(
            modifier = Modifier.weight(0.8f, fill = false),
            horizontalAlignment = if (message.isPlayer) Alignment.End else Alignment.Start
        ) {
            if (!message.isPlayer && message.speaker.isNotEmpty()) {
                Text(
                    text = message.speaker,
                    style = NagiTheme.typography.micro,
                    color = colors.textSecondary.copy(alpha = 0.6f),
                    modifier = Modifier.padding(
                        start = NagiTheme.spacing.s,
                        bottom = 2.dp
                    )
                )
            }

            val bgColor = if (message.isPlayer)
                NagiPalette.roseGold.copy(alpha = 0.15f)
            else
                colors.glassBgSoft

            val bubbleShape = if (message.isPlayer)
                RoundedCornerShape(16.dp, 4.dp, 16.dp, 16.dp)
            else
                RoundedCornerShape(4.dp, 16.dp, 16.dp, 16.dp)

            Box(
                modifier = Modifier
                    .clip(bubbleShape)
                    .background(bgColor)
                    .padding(
                        horizontal = NagiTheme.spacing.m,
                        vertical = NagiTheme.spacing.s
                    )
            ) {
                Text(
                    text = message.text,
                    style = NagiTheme.typography.dialogue,
                    color = colors.textPrimary
                )
            }

            if (message.isPlayer) {
                Text(
                    text = "read",
                    style = NagiTheme.typography.micro,
                    color = colors.textSecondary.copy(alpha = 0.4f),
                    modifier = Modifier.padding(
                        end = NagiTheme.spacing.xs,
                        top = 2.dp
                    )
                )
            }
        }

        if (!message.isPlayer) Spacer(modifier = Modifier.weight(0.2f))
    }
}
