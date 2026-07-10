package com.antnagi.nagisheart.ui.icon

import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.foundation.Image
import androidx.compose.ui.graphics.ColorFilter
import com.antnagi.nagisheart.ui.theme.NagiTheme

enum class NagiIconState { Default, Active, Disabled }

@Composable
fun NagiIconButton(
    icon: NagiIcon,
    state: NagiIconState = NagiIconState.Default,
    modifier: Modifier = Modifier,
    onClick: () -> Unit = {}
) {
    val color = when (state) {
        NagiIconState.Default -> NagiTheme.colors.iconDefault
        NagiIconState.Active -> NagiTheme.colors.accentPrimary
        NagiIconState.Disabled -> NagiTheme.colors.iconDefault.copy(alpha = 0.38f)
    }

    val context = LocalContext.current
    val resId = remember(icon) {
        context.resources.getIdentifier(icon.resName, "drawable", context.packageName)
    }

    Box(
        modifier = modifier
            .size(NagiTheme.sizes.hudButton)
            .clickable(
                enabled = state != NagiIconState.Disabled,
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onClick
            ),
        contentAlignment = Alignment.Center
    ) {
        if (resId != 0) {
            androidx.compose.foundation.Image(
                painter = painterResource(id = resId),
                contentDescription = icon.name,
                modifier = Modifier.size(NagiTheme.sizes.hudIcon),
                colorFilter = ColorFilter.tint(color)
            )
        }
    }
}
