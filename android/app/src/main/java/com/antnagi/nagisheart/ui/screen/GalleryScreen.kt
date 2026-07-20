package com.antnagi.nagisheart.ui.screen

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.rememberAsyncImagePainter
import com.antnagi.nagisheart.data.EndingDefinition
import com.antnagi.nagisheart.ui.component.SystemPageBackground
import com.antnagi.nagisheart.ui.icon.NagiIcon
import com.antnagi.nagisheart.ui.icon.NagiIconButton
import com.antnagi.nagisheart.ui.theme.*
import com.antnagi.nagisheart.ui.viewmodel.GameViewModel

private data class GalleryItem(
    val endingId: String,
    val definition: EndingDefinition,
    val unlocked: Boolean,
    val bgPath: String?
)

private val endingBgFallback = mapOf(
    "true" to "bg/ending_true_nagi_soft_gaze.jpg",
    "good" to "bg/ending_candidate_crystal_king.jpg",
    "normal" to "bg/bg_stay_final_tv_glow_living_room.png",
    "bad" to "bg/bg_bad_far_award_broadcast.png"
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
                    bgPath = viewModel.getEndingBgPath(key) ?: endingBgFallback[key]
                )
            }
        }
    }

    NagiTheme(uiTheme = NagiUiTheme.Dark) {
        SystemPageBackground {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .statusBarsPadding()
                    .navigationBarsPadding()
            ) {
                // Header
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(44.dp)
                        .padding(horizontal = 17.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    NagiIconButton(icon = NagiIcon.Back, onClick = onBack)
                    Spacer(modifier = Modifier.weight(1f))
                    Text(
                        text = "回忆画廊",
                        fontFamily = FontFamily.Serif,
                        fontSize = 14.sp,
                        color = NagiTheme.colors.textPrimary
                    )
                    Spacer(modifier = Modifier.weight(1f))
                    Spacer(modifier = Modifier.width(36.dp))
                }

                // Soft screen area
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 20.dp)
                        .padding(top = 26.dp, bottom = 32.dp)
                ) {
                    Text(
                        text = "回忆画廊",
                        fontFamily = FontFamily.Serif,
                        fontSize = 27.sp,
                        color = NagiTheme.colors.textPrimary
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    Text(
                        text = "已解锁  ${unlockedEndings.size} / ${definitions.size}",
                        style = NagiTheme.typography.micro,
                        color = NagiTheme.colors.textSecondary
                    )

                    Spacer(modifier = Modifier.height(18.dp))

                    LazyVerticalGrid(
                        columns = GridCells.Fixed(2),
                        modifier = Modifier.fillMaxSize(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp),
                        contentPadding = PaddingValues(bottom = 24.dp)
                    ) {
                        items(galleryItems) { item ->
                            MemoryCard(
                                item = item,
                                onClick = { if (item.unlocked) selectedItem = item }
                            )
                        }
                    }
                }
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
private fun MemoryCard(
    item: GalleryItem,
    onClick: () -> Unit
) {
    val colors = NagiTheme.colors

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .heightIn(min = 128.dp)
            .clip(NagiShapes.cutSmall)
            .background(colors.glassBgSoft)
            .clickable(onClick = onClick),
        contentAlignment = Alignment.BottomStart
    ) {
        if (item.unlocked && item.bgPath != null) {
            Image(
                painter = rememberAsyncImagePainter(
                    model = "file:///android_asset/${item.bgPath}"
                ),
                contentDescription = null,
                contentScale = ContentScale.Crop,
                alignment = Alignment.TopCenter,
                modifier = Modifier.fillMaxSize()
            )
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.verticalGradient(
                            listOf(Color.Transparent, colors.glassBgStrong)
                        )
                    )
            )
        }

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.Bottom
        ) {
            if (item.unlocked) {
                Text(
                    text = item.definition.title,
                    style = NagiTheme.typography.speakerName,
                    color = NagiPalette.snowWhite
                )
                Text(
                    text = item.definition.tag,
                    style = NagiTheme.typography.micro,
                    color = colors.textSecondary
                )
            } else {
                Text(
                    text = "未解锁",
                    style = NagiTheme.typography.micro,
                    color = colors.textSecondary.copy(alpha = 0.5f)
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
            .background(NagiPalette.deepBlueNight.copy(alpha = 0.85f))
            .clickable(onClick = onDismiss),
        contentAlignment = Alignment.Center
    ) {
        if (item.bgPath != null) {
            Image(
                painter = rememberAsyncImagePainter(
                    model = "file:///android_asset/${item.bgPath}"
                ),
                contentDescription = null,
                contentScale = ContentScale.Crop,
                alignment = Alignment.TopCenter,
                modifier = Modifier.fillMaxSize()
            )
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(NagiPalette.deepBlueNight.copy(alpha = 0.5f))
            )
        }

        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(horizontal = 26.dp)
        ) {
            Text(
                text = item.definition.tag,
                style = NagiTheme.typography.caption,
                color = NagiPalette.paleGold
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = item.definition.title,
                fontFamily = FontFamily.Serif,
                fontSize = 30.sp,
                color = NagiPalette.snowWhite
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = item.definition.description,
                style = NagiTheme.typography.narration,
                color = NagiPalette.snowWhite.copy(alpha = 0.78f)
            )
        }
    }
}
