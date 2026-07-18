package com.antnagi.nagisheart.ui.component

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.antnagi.nagisheart.ui.icon.NagiIcon
import com.antnagi.nagisheart.ui.icon.NagiIconButton
import com.antnagi.nagisheart.ui.icon.NagiIconState
import com.antnagi.nagisheart.ui.theme.*

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun NagiHud(
    chapterTitle: String = "",
    onBack: () -> Unit = {},
    onSave: () -> Unit,
    onBacklog: () -> Unit = {},
    onAuto: (() -> Unit)? = null,
    isAutoActive: Boolean = false,
    onTitleLongPress: (() -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    val colors = NagiTheme.colors

    Row(
        modifier = modifier
            .fillMaxWidth()
            .statusBarsPadding()
            .height(44.dp)
            .padding(horizontal = 17.dp)
            .padding(top = 14.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        NagiIconButton(icon = NagiIcon.Back, onClick = onBack)

        if (chapterTitle.isNotEmpty()) {
            Spacer(modifier = Modifier.width(8.dp))
            Box(
                modifier = Modifier
                    .widthIn(max = 210.dp)
                    .height(34.dp)
                    .combinedClickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                        onClick = {},
                        onLongClick = { onTitleLongPress?.invoke() }
                    )
                    .clip(NagiShapes.cutSmall)
                    .background(
                        Brush.verticalGradient(
                            listOf(
                                Color(0x380F1827),
                                Color(0x140F1827)
                            )
                        )
                    )
                    .border(
                        width = 1.dp,
                        color = Color(0x1AFFFFFF),
                        shape = NagiShapes.cutSmall
                    )
                    .padding(horizontal = 16.dp),
                contentAlignment = Alignment.CenterStart
            ) {
                Text(
                    text = chapterTitle,
                    style = TextStyle(
                        fontFamily = FontFamily.Default,
                        fontWeight = FontWeight.Medium,
                        fontSize = 13.sp,
                        letterSpacing = 0.02.sp,
                        shadow = Shadow(
                            color = colors.textShadowColor,
                            offset = Offset(0f, 2f),
                            blurRadius = 14f
                        )
                    ),
                    color = Color(0xE0F4F1EA),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }
            Spacer(modifier = Modifier.weight(1f))
        } else {
            Spacer(modifier = Modifier.weight(1f))
        }

        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            if (onAuto != null) {
                NagiIconButton(
                    icon = NagiIcon.Auto,
                    state = if (isAutoActive) NagiIconState.Active else NagiIconState.Default,
                    onClick = onAuto
                )
            }
            NagiIconButton(icon = NagiIcon.Save, onClick = onSave)
            NagiIconButton(icon = NagiIcon.Backlog, onClick = onBacklog)
        }
    }
}
