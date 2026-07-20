package com.antnagi.nagisheart.ui.component

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
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

    // §20.1: soft-screen container
    Box(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 18.dp)
            .padding(top = 84.dp, bottom = 34.dp)
            .navigationBarsPadding()
            .clip(NagiShapes.cutMedium)
            .background(
                Brush.verticalGradient(
                    listOf(
                        Color(0x57101827), // §20.1: rgba(16,24,39,0.34)
                        Color(0x85101827)  // §20.1: rgba(16,24,39,0.52)
                    )
                )
            )
            .border(
                width = 1.dp,
                color = Color(0x14FFFFFF),
                shape = NagiShapes.cutMedium
            )
            .padding(18.dp)
    ) {
        LazyColumn(
            state = listState,
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(NagiTheme.spacing.s)
        ) {
            items(messages) { msg ->
                ChatBubble(message = msg)
            }
        }
    }
}

@Composable
private fun ChatBubble(message: ChatMessage) {
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
                    color = Color(0xEBF7F9FC).copy(alpha = 0.6f), // §20.2 secondary
                    modifier = Modifier.padding(
                        start = NagiTheme.spacing.s,
                        bottom = 2.dp
                    )
                )
            }

            // §20.2/20.3: bubble colors
            val bgColor = if (message.isPlayer)
                Color(0x2ED7BE86) // §20.3: rgba(215,190,134,0.18)
            else
                Color(0x14FFFFFF) // §20.2: rgba(255,255,255,0.08)

            Box(
                modifier = Modifier
                    .clip(NagiShapes.cutSmall) // §20.2: cut-sm
                    .background(bgColor)
                    .padding(horizontal = 14.dp, vertical = 12.dp) // §20.2: 12/14
            ) {
                Text(
                    text = message.text,
                    fontSize = 14.sp, // §20.2: 14sp
                    lineHeight = (14 * 1.7).sp, // §20.2: line-height 1.7
                    color = Color(0xEBF7F9FC) // §20.2: rgba(247,249,252,0.92)
                )
            }

            if (message.isPlayer) {
                Text(
                    text = "read",
                    style = NagiTheme.typography.micro,
                    color = Color(0xEBF7F9FC).copy(alpha = 0.4f),
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
