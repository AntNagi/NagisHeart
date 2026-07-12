package com.antnagi.nagisheart.ui.icon

import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import com.antnagi.nagisheart.ui.theme.NagiTheme

enum class NagiIconState { Default, Active, Disabled }

@Composable
fun NagiIconButton(
    icon: NagiIcon,
    state: NagiIconState = NagiIconState.Default,
    modifier: Modifier = Modifier,
    onClick: () -> Unit = {}
) {
    val colors = NagiTheme.colors
    val tint = when (state) {
        NagiIconState.Default -> colors.hudColor.copy(alpha = 0.92f)
        NagiIconState.Active -> colors.accentPrimary
        NagiIconState.Disabled -> colors.hudColor.copy(alpha = 0.28f)
    }

    val context = LocalContext.current
    val resId = context.resources.getIdentifier(icon.resName, "drawable", context.packageName)

    Box(
        modifier = modifier
            .size(36.dp)
            .clickable(
                enabled = state != NagiIconState.Disabled,
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onClick
            ),
        contentAlignment = Alignment.Center
    ) {
        if (resId != 0) {
            Icon(
                painter = painterResource(resId),
                contentDescription = icon.resName,
                tint = tint,
                modifier = Modifier.size(18.dp)
            )
        }
    }
}
