package com.antnagi.nagisheart.ui.screen

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.BiasAlignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.rememberAsyncImagePainter
import com.antnagi.nagisheart.data.EndingDefinition
import com.antnagi.nagisheart.ui.component.SystemPageBackground
import com.antnagi.nagisheart.ui.icon.NagiIcon
import com.antnagi.nagisheart.ui.icon.NagiIconButton
import com.antnagi.nagisheart.ui.theme.NagiShapes
import com.antnagi.nagisheart.ui.theme.NagiTheme
import com.antnagi.nagisheart.ui.theme.NagiTokens
import com.antnagi.nagisheart.ui.theme.NagiUiTheme
import com.antnagi.nagisheart.ui.viewmodel.GameViewModel

private data class GalleryItem(
    val endingId: String,
    val definition: EndingDefinition,
    val unlocked: Boolean,
    val bgPath: String?
)

@Composable
fun GalleryScreen(
    viewModel: GameViewModel,
    onBack: () -> Unit
) {
    val definitions = remember { viewModel.getEndingDefinitions() }
    val unlockedEndings = viewModel.getUnlockedEndings()
    var selectedItem by remember { mutableStateOf<GalleryItem?>(null) }

    val galleryItems = remember(definitions, unlockedEndings) {
        listOf("true", "good", "normal", "bad").mapNotNull { key ->
            definitions[key]?.let { def ->
                GalleryItem(
                    endingId = key,
                    definition = def,
                    unlocked = key in unlockedEndings,
                    bgPath = viewModel.getEndingBgPath(key) ?: viewModel.getEndingFallbackBg(key)
                )
            }
        }
    }

    NagiTheme(uiTheme = NagiUiTheme.Dark) {
        SystemPageBackground {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .statusBarsPadding()
                    .navigationBarsPadding()
            ) {
                NagiIconButton(
                    icon = NagiIcon.Back,
                    onClick = onBack,
                    modifier = Modifier
                        .align(Alignment.TopStart)
                        .padding(start = 17.dp)
                )

                GallerySoftScreen(
                    unlockedCount = unlockedEndings.size,
                    totalCount = definitions.size,
                    items = galleryItems,
                    onItemClick = { selectedItem = it }
                )
            }

            selectedItem?.let { item ->
                EndingDetailOverlay(
                    item = item,
                    onDismiss = { selectedItem = null }
                )
            }
        }
    }
}

@Composable
private fun GallerySoftScreen(
    unlockedCount: Int,
    totalCount: Int,
    items: List<GalleryItem>,
    onItemClick: (GalleryItem) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(top = 58.dp, start = 16.dp, end = 16.dp, bottom = 20.dp)
            .clip(NagiShapes.cutMedium)
            .drawBehind {
                drawRect(
                    brush = Brush.radialGradient(
                        0f to NagiTokens.snow.copy(alpha = 0.08f),
                        0.42f to Color.Transparent,
                        center = Offset(size.width * 0.5f, size.height * 0.18f),
                        radius = size.maxDimension * 0.45f
                    )
                )
            }
            .background(
                Brush.verticalGradient(
                    0f to NagiTokens.deepBlue.copy(alpha = 0.18f),
                    0.44f to NagiTokens.deepBlue.copy(alpha = 0.30f),
                    1f to NagiTokens.deepBlue.copy(alpha = 0.50f)
                )
            )
            .padding(start = 12.dp, end = 12.dp, top = 12.dp, bottom = 12.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.Bottom
        ) {
            Text(
                text = "回忆画廊",
                modifier = Modifier.weight(1f),
                fontFamily = FontFamily.Serif,
                fontSize = 34.sp,
                lineHeight = (34 * 1.2).sp,
                color = NagiTokens.textSnow94,
                maxLines = 1
            )
            Text(
                text = "已解锁 $unlockedCount / $totalCount",
                fontSize = 14.sp,
                letterSpacing = (0.08 * 14).sp,
                color = NagiTokens.parchment.copy(alpha = 0.66f),
                maxLines = 1
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        Row(
            modifier = Modifier.fillMaxSize(),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.Top
        ) {
            EndingWallColumn(
                items = items.filter { it.endingId == "true" || it.endingId == "normal" },
                onItemClick = onItemClick
            )
            EndingWallColumn(
                items = items.filter { it.endingId == "good" || it.endingId == "bad" },
                onItemClick = onItemClick,
                topOffset = 14.dp
            )
        }
    }
}

@Composable
private fun RowScope.EndingWallColumn(
    items: List<GalleryItem>,
    onItemClick: (GalleryItem) -> Unit,
    topOffset: Dp = 0.dp
) {
    Column(
        modifier = Modifier
            .weight(1f)
            .padding(top = topOffset),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        items.forEach { item ->
            EndingWallCard(
                item = item,
                onClick = { if (item.unlocked) onItemClick(item) }
            )
        }
    }
}

@Composable
private fun EndingWallCard(
    item: GalleryItem,
    onClick: () -> Unit
) {
    val imageAlignment = when (item.endingId) {
        "true" -> BiasAlignment(0f, -0.32f)
        "good" -> BiasAlignment(0f, -0.40f)
        "normal" -> BiasAlignment(0f, -0.64f)
        "bad" -> BiasAlignment(0f, 0.28f)
        else -> Alignment.Center
    }
    val isLongTitle = item.endingId == "good"

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .aspectRatio(9f / 16f)
            .clip(NagiShapes.cutSmall)
            .background(NagiTheme.colors.glassBgSoft)
            .clickable(onClick = onClick),
        contentAlignment = Alignment.BottomStart
    ) {
        if (item.unlocked && item.bgPath != null) {
            Image(
                painter = rememberAsyncImagePainter("file:///android_asset/${item.bgPath}"),
                contentDescription = null,
                contentScale = ContentScale.Crop,
                alignment = imageAlignment,
                modifier = Modifier.matchParentSize()
            )
        }

        Box(
            modifier = Modifier
                .matchParentSize()
                .background(
                    Brush.verticalGradient(
                        0f to NagiTokens.authorityVoid.copy(alpha = 0.02f),
                        0.46f to NagiTokens.authorityVoid.copy(alpha = 0.04f),
                        1f to NagiTokens.authorityVoid.copy(alpha = 0.72f)
                    )
                )
        )

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(13.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            if (item.unlocked) {
                Text(
                    text = item.definition.tag,
                    fontSize = 10.sp,
                    letterSpacing = (0.14 * 10).sp,
                    color = NagiTokens.gold,
                    maxLines = 1,
                    style = TextStyle(
                        shadow = Shadow(
                            color = Color.Black.copy(alpha = 0.55f),
                            offset = Offset(0f, 1f),
                            blurRadius = 8f
                        )
                    )
                )
                Text(
                    text = item.definition.title,
                    fontFamily = FontFamily.Serif,
                    fontSize = if (isLongTitle) 13.sp else 16.sp,
                    lineHeight = if (isLongTitle) (13 * 1.32).sp else (16 * 1.32).sp,
                    letterSpacing = if (isLongTitle) (-0.02 * 13).sp else 0.sp,
                    color = NagiTokens.snow,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    style = TextStyle(
                        shadow = Shadow(
                            color = Color.Black.copy(alpha = 0.62f),
                            offset = Offset(0f, 2f),
                            blurRadius = 12f
                        )
                    )
                )
            } else {
                Text(
                    text = "未解锁",
                    style = NagiTheme.typography.micro,
                    color = NagiTheme.colors.textSecondary.copy(alpha = 0.5f)
                )
            }
        }
    }
}

@Composable
private fun EndingDetailOverlay(
    item: GalleryItem,
    onDismiss: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(NagiTokens.authorityVoid)
            .clickable(onClick = onDismiss)
    ) {
        if (item.bgPath != null) {
            Image(
                painter = rememberAsyncImagePainter("file:///android_asset/${item.bgPath}"),
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )
        }

        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        0f to NagiTokens.scrimDark.copy(alpha = 0.34f),
                        0.42f to NagiTokens.scrimDark.copy(alpha = 0.52f),
                        1f to NagiTokens.scrimDark.copy(alpha = 0.72f)
                    )
                )
        )
        Box(
            modifier = Modifier
                .fillMaxSize()
                .drawBehind {
                    drawRect(
                        brush = Brush.radialGradient(
                            0f to NagiTokens.deepBlue.copy(alpha = 0.12f),
                            0.48f to Color.Transparent,
                            center = Offset(size.width * 0.5f, size.height * 0.5f),
                            radius = size.maxDimension * 0.58f
                        )
                    )
                    drawRect(
                        brush = Brush.verticalGradient(
                            0f to NagiTokens.authorityVoid.copy(alpha = 0.36f),
                            0.38f to NagiTokens.authorityVoid.copy(alpha = 0.22f),
                            1f to NagiTokens.authorityVoid.copy(alpha = 0.64f)
                        )
                    )
                }
        )

        Column(
            modifier = Modifier
                .align(Alignment.Center)
                .padding(top = 96.dp, start = 42.dp, end = 42.dp, bottom = 120.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(18.dp)
        ) {
            Box(contentAlignment = Alignment.TopCenter) {
                Text(
                    text = item.definition.tag,
                    modifier = Modifier.padding(top = 18.dp),
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Medium,
                    letterSpacing = (0.16 * 18).sp,
                    color = NagiTokens.gold.copy(alpha = 0.82f),
                    style = galleryEndingAuthorityShadowStyle()
                )
                Box(
                    modifier = Modifier
                        .padding(top = 54.dp)
                        .width(178.dp)
                        .height(1.dp)
                        .background(NagiTokens.gold.copy(alpha = 0.48f))
                )
            }
            Text(
                text = item.definition.title,
                modifier = Modifier.padding(top = 2.dp),
                fontFamily = FontFamily.Serif,
                fontSize = 33.sp,
                lineHeight = (33 * 1.34).sp,
                color = NagiTokens.textSnow94,
                style = galleryEndingAuthorityShadowStyle()
            )
            Text(
                text = item.definition.description,
                modifier = Modifier.widthIn(max = 330.dp),
                fontFamily = FontFamily.Serif,
                fontSize = 16.sp,
                lineHeight = (16 * 1.92).sp,
                color = NagiTokens.snow.copy(alpha = 0.82f),
                style = galleryEndingAuthorityShadowStyle()
            )
            Row(
                modifier = Modifier.padding(top = 4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(5.dp)
                        .background(NagiTokens.gold.copy(alpha = 0.72f))
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "已解锁：${item.definition.tag} / 回忆画廊",
                    fontSize = 11.sp,
                    letterSpacing = (0.02 * 11).sp,
                    color = NagiTokens.parchment.copy(alpha = 0.56f),
                    style = galleryEndingAuthorityShadowStyle()
                )
            }
        }

        Text(
            text = "返回画廊",
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .navigationBarsPadding()
                .padding(bottom = 58.dp)
                .clickable(onClick = onDismiss),
            fontSize = 14.sp,
            letterSpacing = (0.12 * 14).sp,
            color = NagiTokens.snow.copy(alpha = 0.82f),
            style = galleryEndingAuthorityShadowStyle()
        )
    }
}

private fun galleryEndingAuthorityShadowStyle(): TextStyle {
    return TextStyle(
        shadow = Shadow(
            color = Color.Black.copy(alpha = 0.48f),
            offset = Offset(0f, 2f),
            blurRadius = 14f
        )
    )
}
