package com.antnagi.nagisheart.ui.screen

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.TextMeasurer
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.rememberTextMeasurer
import androidx.compose.ui.unit.Constraints
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import coil.compose.rememberAsyncImagePainter
import com.antnagi.nagisheart.ui.icon.NagiIcon
import com.antnagi.nagisheart.ui.icon.NagiIconButton
import com.antnagi.nagisheart.ui.theme.*
import com.antnagi.nagisheart.ui.viewmodel.BacklogEntry
import com.antnagi.nagisheart.ui.viewmodel.GameViewModel

// MinSpec §24.2 container
private val ContentSideInset = 38.dp
private val ContentTopInset = 40.dp   // + 44dp header = 84 from screen top
private val ContentBottomInset = 34.dp
private val PageIndicatorHeight = 40.dp
private val PageBottomSafety = 18.dp
private val DialogueInset = 15.dp     // §24.4 symmetric quote block, one character width

// §24.5 five-tier spacing — must stay 4 < 8 < 12 < 16 < 28
private val GapSpeakerToBody = 4.dp
private val GapSameSpeaker = 8.dp
private val GapNarrToNarr = 12.dp
private val GapSpeakerChange = 16.dp
private val GapModeSwitch = 28.dp

// §24.2 text-shadow follows §10 — one uniform subtle shadow for the whole recap body
private val RecapTextShadow = Shadow(
    color = Color(0x2E0A0F19), // token-exempt: authority text-shadow rgba(10,15,25,0.18)
    offset = Offset(0f, 1f),
    blurRadius = 8f
)

private enum class RecapKind { NARRATION, DIALOGUE }

private data class RecapItem(
    val text: String,
    val speaker: String,
    val kind: RecapKind,
    val showSpeaker: Boolean,
    val topGap: Dp
)

/**
 * §24.5 / §24.6 — an item's leading gap depends on what came before it, so this
 * cannot be expressed with a uniform `verticalArrangement.spacedBy()`.
 */
private fun buildRecapItems(entries: List<BacklogEntry>): List<RecapItem> {
    var prevKind: RecapKind? = null
    var prevSpeaker = ""
    return entries.map { entry ->
        val kind = if (entry.speaker.isNotBlank()) RecapKind.DIALOGUE else RecapKind.NARRATION
        val sameSpeaker = kind == RecapKind.DIALOGUE &&
            prevKind == RecapKind.DIALOGUE &&
            entry.speaker == prevSpeaker
        val gap = when {
            prevKind == null -> 0.dp
            prevKind != kind -> GapModeSwitch
            kind == RecapKind.NARRATION -> GapNarrToNarr
            sameSpeaker -> GapSameSpeaker
            else -> GapSpeakerChange
        }
        prevKind = kind
        prevSpeaker = entry.speaker
        RecapItem(
            text = entry.text,
            speaker = entry.speaker,
            kind = kind,
            showSpeaker = kind == RecapKind.DIALOGUE && !sameSpeaker,
            topGap = gap
        )
    }
}

@Composable
private fun narrationStyle() = TextStyle(
    fontFamily = FontFamily.Serif,
    fontWeight = FontWeight.Normal,
    fontSize = 15.sp,
    lineHeight = 28.2.sp, // 15 * 1.88
    shadow = RecapTextShadow
)

@Composable
private fun dialogueStyle() = TextStyle(
    fontFamily = FontFamily.Default,
    fontWeight = FontWeight.Normal,
    fontSize = 15.sp,
    lineHeight = 25.2.sp, // 15 * 1.68
    shadow = RecapTextShadow
)

@Composable
private fun speakerStyle() = TextStyle(
    fontFamily = FontFamily.Default,
    fontWeight = FontWeight.Medium,
    fontSize = 12.sp,
    letterSpacing = 0.04.em,
    shadow = RecapTextShadow
)

/**
 * §24.7 / interaction §31.1 — bin-pack by real laid-out height.
 * Item heights now differ per item and depend on the preceding item, so
 * "count x estimated row height" no longer works.
 */
private fun paginate(
    items: List<RecapItem>,
    measurer: TextMeasurer,
    availableHeightPx: Int,
    contentWidthPx: Int,
    dialogueInsetPx: Int,
    narrStyle: TextStyle,
    diaStyle: TextStyle,
    spkStyle: TextStyle,
    speakerGapPx: Int,
    gapToPx: (Dp) -> Int
): List<List<RecapItem>> {
    if (items.isEmpty() || availableHeightPx <= 0 || contentWidthPx <= 0) {
        return listOf(items)
    }

    fun bodyHeight(item: RecapItem): Int {
        val width = if (item.kind == RecapKind.DIALOGUE) {
            (contentWidthPx - dialogueInsetPx * 2).coerceAtLeast(1)
        } else {
            contentWidthPx
        }
        val style = if (item.kind == RecapKind.DIALOGUE) diaStyle else narrStyle
        var h = measurer.measure(
            text = AnnotatedString(item.text),
            style = style,
            constraints = Constraints(maxWidth = width)
        ).size.height
        if (item.showSpeaker) {
            h += measurer.measure(
                text = AnnotatedString(item.speaker),
                style = spkStyle,
                constraints = Constraints(maxWidth = width)
            ).size.height + speakerGapPx
        }
        return h
    }

    val pages = mutableListOf<List<RecapItem>>()
    var current = mutableListOf<RecapItem>()
    var used = 0

    for (item in items) {
        // The leading gap is dropped when an item lands at the top of a page.
        val gap = if (current.isEmpty()) 0 else gapToPx(item.topGap)
        val height = bodyHeight(item)
        if (current.isNotEmpty() && used + gap + height > availableHeightPx) {
            pages.add(current)
            current = mutableListOf(item)
            used = height
        } else {
            current.add(item)
            used += gap + height
        }
    }
    if (current.isNotEmpty()) pages.add(current)
    return pages
}

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun BacklogScreen(
    viewModel: GameViewModel,
    onBack: () -> Unit
) {
    val entries = remember { viewModel.getBacklog() }
    val bgAssetPath = viewModel.uiState.collectAsState().value.bgAssetPath
    val items = remember(entries) { buildRecapItems(entries) }

    val measurer = rememberTextMeasurer()
    val density = LocalDensity.current
    val narrStyle = narrationStyle()
    val diaStyle = dialogueStyle()
    val spkStyle = speakerStyle()

    NagiTheme(uiTheme = NagiUiTheme.Dark) {
        Box(modifier = Modifier.fillMaxSize()) {
            if (bgAssetPath != null) {
                Image(
                    painter = rememberAsyncImagePainter("file:///android_asset/$bgAssetPath"),
                    contentDescription = null,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
            }

            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(NagiTokens.systemDim.copy(alpha = 0.58f))
            )

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .statusBarsPadding()
                    .navigationBarsPadding()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 17.dp)
                        .height(44.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    NagiIconButton(icon = NagiIcon.Back, onClick = onBack)
                    Spacer(modifier = Modifier.weight(1f))
                    Text(
                        text = "剧情回顾",
                        style = TextStyle(
                            fontFamily = FontFamily.Serif,
                            fontSize = 14.sp,
                            shadow = RecapTextShadow
                        ),
                        color = NagiTheme.colors.textPrimary
                    )
                    Spacer(modifier = Modifier.weight(1f))
                    Spacer(modifier = Modifier.width(36.dp))
                }

                BoxWithConstraints(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth()
                        .padding(
                            start = ContentSideInset,
                            end = ContentSideInset,
                            top = ContentTopInset,
                            bottom = ContentBottomInset
                        )
                ) {
                    val availableHeightPx = with(density) {
                        (maxHeight - PageIndicatorHeight - PageBottomSafety)
                            .coerceAtLeast(1.dp)
                            .roundToPx()
                    }
                    val contentWidthPx = with(density) { maxWidth.roundToPx() }
                    val dialogueInsetPx = with(density) { DialogueInset.roundToPx() }
                    val speakerGapPx = with(density) { GapSpeakerToBody.roundToPx() }

                    val pages = remember(
                        items, availableHeightPx, contentWidthPx
                    ) {
                        paginate(
                            items = items,
                            measurer = measurer,
                            availableHeightPx = availableHeightPx,
                            contentWidthPx = contentWidthPx,
                            dialogueInsetPx = dialogueInsetPx,
                            narrStyle = narrStyle,
                            diaStyle = diaStyle,
                            spkStyle = spkStyle,
                            speakerGapPx = speakerGapPx,
                            gapToPx = { with(density) { it.roundToPx() } }
                        )
                    }

                    // interaction §31.1 — open on the first page, not the latest
                    val pagerState = rememberPagerState(
                        initialPage = 0,
                        pageCount = { pages.size.coerceAtLeast(1) }
                    )

                    Column(modifier = Modifier.fillMaxSize()) {
                        HorizontalPager(
                            state = pagerState,
                            modifier = Modifier
                                .weight(1f)
                                .fillMaxWidth()
                        ) { page ->
                            val pageItems = pages.getOrElse(page) { emptyList() }
                            // §24.7 / interaction §29.8 — paged, never vertically scrolled
                            LazyColumn(
                                modifier = Modifier.fillMaxSize(),
                                userScrollEnabled = false
                            ) {
                                items(pageItems) { item ->
                                    RecapRow(
                                        item = item,
                                        isFirstOnPage = pageItems.firstOrNull() === item,
                                        narrStyle = narrStyle,
                                        diaStyle = diaStyle,
                                        spkStyle = spkStyle
                                    )
                                }
                            }
                        }

                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(PageIndicatorHeight),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "${pagerState.currentPage + 1} / ${pages.size.coerceAtLeast(1)}",
                                fontSize = 12.sp,
                                color = NagiTokens.parchment.copy(alpha = 0.60f)
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun RecapRow(
    item: RecapItem,
    isFirstOnPage: Boolean,
    narrStyle: TextStyle,
    diaStyle: TextStyle,
    spkStyle: TextStyle
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = if (isFirstOnPage) 0.dp else item.topGap)
    ) {
        when (item.kind) {
            // §24.3 narration — serif, airy, full bleed, no indent
            RecapKind.NARRATION -> Text(
                text = item.text,
                style = narrStyle,
                color = NagiTokens.parchment.copy(alpha = 0.92f)
            )

            // §24.4 dialogue — sans, dense, symmetric one-character inset on BOTH sides
            RecapKind.DIALOGUE -> Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = DialogueInset)
            ) {
                if (item.showSpeaker) {
                    // §24.4 / §24.8 — plain text only: no fill, no border, no blur, no halo
                    Text(
                        text = item.speaker,
                        style = spkStyle,
                        color = NagiTokens.gold
                    )
                    Spacer(modifier = Modifier.height(GapSpeakerToBody))
                }
                Text(
                    text = item.text,
                    style = diaStyle,
                    color = NagiTokens.snow.copy(alpha = 0.94f)
                )
            }
        }
    }
}
