package com.antnagi.nagisheart.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.antnagi.nagisheart.BuildConfig
import com.antnagi.nagisheart.data.*
import com.antnagi.nagisheart.engine.NodeResolution
import com.antnagi.nagisheart.engine.StoryEngine
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

enum class GamePhase {
    Loading, Dialogue, Choice, Response, Ending, Error, ChapterTransition, ChapterEnding, SectionTransition
}

data class ChapterTransitionInfo(
    val chapterName: String,
    val chapterTitle: String,
    val timeRange: String?
)

data class SectionTransitionInfo(
    val chapterName: String,
    val sectionTitle: String
)

data class DebugInfo(
    val nodeId: String,
    val cursor: String,
    val route: String,
    val mj: String,
    val variables: Map<String, Any>
)

data class BacklogEntry(
    val speaker: String,
    val text: String
)

data class GameUiState(
    val phase: GamePhase = GamePhase.Loading,
    val currentNodeId: String = "",
    val sceneTitle: String = "",
    val bgAssetPath: String? = null,
    val uiTheme: String = "Light",
    val mood: String? = null,
    val mode: String = "vn",
    val speaker: String = "",
    val text: String = "",
    val displayType: String = "bottom",
    val longNarrationTexts: List<String> = emptyList(),
    val choices: List<Choice> = emptyList(),
    val ending: EndingDefinition? = null,
    val errorMessage: String? = null,
    val debugInfo: DebugInfo? = null,
    val isAutoPlaying: Boolean = false,
    val isSkipping: Boolean = false,
    val chapterTransition: ChapterTransitionInfo? = null,
    val sectionTransition: SectionTransitionInfo? = null,
    val showSaveToast: Boolean = false
)

class GameViewModel(application: Application) : AndroidViewModel(application) {

    private val repo = StoryRepository(application)
    private val saveManager = SaveManager(application)
    private val settingsManager = SettingsManager(application)
    private val bgmManager = BgmManager(application)

    private var userSettings = UserSettings()

    private lateinit var engine: StoryEngine
    private lateinit var variablesData: VariablesData
    private lateinit var gameState: GameState
    private lateinit var prologueData: PrologueData

    private var playerName: String = ""
    private var nagiCall: String = "Nagi"

    private var currentNode: StoryNode? = null
    private var currentDialogue: List<DialogueLine> = emptyList()
    private var dialogueIndex: Int = 0
    private var currentChoices: List<Choice> = emptyList()
    private var responseQueue: List<DialogueLine> = emptyList()
    private var responseIndex: Int = 0
    private var pendingNextId: String? = null
    private val backlog = mutableListOf<BacklogEntry>()
    private var autoJob: Job? = null
    private var skipJob: Job? = null
    private val progressManager = ProgressManager(application)

    private var currentChapterId: String = ""
    private var currentSectionIndex: Int = 0
    private var chapters: List<Chapter> = emptyList()
    private var nodeToChapter: Map<String, Chapter> = emptyMap()
    private var nodeToSectionIndex: Map<String, Int> = emptyMap()
    private var pendingNodeAfterTransition: NodeResolution.Found? = null
    private var pendingNextChapter: Chapter? = null
    private var isReplayMode: Boolean = false
    private var replayBoundaryNodes: Set<String> = emptySet()

    private val _uiState = MutableStateFlow(GameUiState())
    val uiState: StateFlow<GameUiState> = _uiState.asStateFlow()

    private val _hasAutoSave = MutableStateFlow(saveManager.hasAutoSave())
    val hasAutoSave: StateFlow<Boolean> = _hasAutoSave.asStateFlow()

    private val _hasCompletedEnding = MutableStateFlow(progressManager.getUnlockedEndings().isNotEmpty())
    val hasCompletedEndingFlow: StateFlow<Boolean> = _hasCompletedEnding.asStateFlow()

    private val _dataLoaded = MutableStateFlow(false)
    val dataLoaded: StateFlow<Boolean> = _dataLoaded.asStateFlow()

    init {
        viewModelScope.launch(Dispatchers.IO) {
            loadData()
        }
    }

    private fun loadData() {
        try {
            val nodes = repo.loadNodes()
            val flow = repo.loadFlow()
            val routers = repo.loadRouters()
            val sceneVisuals = repo.loadSceneVisuals()
            val endings = repo.loadEndings()
            variablesData = repo.loadVariables()

            prologueData = repo.loadPrologueShort()
            userSettings = settingsManager.load()
            bgmManager.setVolume(userSettings.bgmVolume)
            engine = StoryEngine(nodes, flow, routers, sceneVisuals, endings)

            chapters = repo.loadChapters()
            val mapping = mutableMapOf<String, Chapter>()
            val sectionMapping = mutableMapOf<String, Int>()
            for (chapter in chapters) {
                for ((idx, section) in chapter.sections.withIndex()) {
                    mapping[section.startNode] = chapter
                    sectionMapping[section.startNode] = idx
                    section.altStartNode?.let {
                        mapping[it] = chapter
                        sectionMapping[it] = idx
                    }
                }
            }
            nodeToChapter = mapping
            nodeToSectionIndex = sectionMapping

            _dataLoaded.value = true
        } catch (e: Exception) {
            _uiState.update {
                it.copy(phase = GamePhase.Error, errorMessage = "Data load failed: ${e.message}")
            }
        }
    }

    // --- Public actions ---

    fun startNewGame(name: String, call: String = "Nagi") {
        playerName = name.ifBlank { "Ant" }
        nagiCall = call
        gameState = GameState(variablesData)
        backlog.clear()
        currentChapterId = nodeToChapter["p1"]?.id ?: ""
        navigateToNode("p1")
    }

    fun loadGame(slotId: Int): Boolean {
        val slot = saveManager.load(slotId) ?: return false
        playerName = slot.playerName.ifBlank { "Ant" }
        nagiCall = slot.nagiCall.ifBlank { "Nagi" }
        gameState = GameState(variablesData)
        gameState.restoreFrom(slot.variables)
        nodeToChapter[slot.nodeId]?.let { currentChapterId = it.id }
        navigateToNode(slot.nodeId)
        return true
    }

    fun saveGame(slotId: Int) {
        val state = _uiState.value
        saveManager.save(
            SaveSlot(
                id = slotId,
                nodeId = state.currentNodeId,
                playerName = playerName,
                nagiCall = nagiCall,
                variables = gameState.toSerializable(),
                timestamp = System.currentTimeMillis(),
                sceneTitle = state.sceneTitle
            )
        )
        _uiState.update { it.copy(showSaveToast = true) }
    }

    fun dismissSaveToast() {
        _uiState.update { it.copy(showSaveToast = false) }
    }

    fun getSaveSlots(): List<SaveSlot?> = saveManager.listSlots()

    fun hasAnySave(): Boolean = saveManager.hasAnySave()

    fun hasPlayed(): Boolean = saveManager.hasAutoSave()

    fun hasCompletedEnding(): Boolean = progressManager.getUnlockedEndings().isNotEmpty()

    fun saveAutoProgress() {
        if (isReplayMode) return
        if (_uiState.value.phase == GamePhase.Ending) return
        val state = _uiState.value
        saveManager.save(
            SaveSlot(
                id = 0,
                nodeId = state.currentNodeId,
                playerName = playerName,
                nagiCall = nagiCall,
                variables = gameState.toSerializable(),
                timestamp = System.currentTimeMillis(),
                sceneTitle = state.sceneTitle
            )
        )
        _hasAutoSave.value = true
    }

    fun continueGame(): Boolean {
        val slot = saveManager.loadAutoSave() ?: return false
        playerName = slot.playerName.ifBlank { "Ant" }
        nagiCall = slot.nagiCall.ifBlank { "Nagi" }
        gameState = GameState(variablesData)
        gameState.restoreFrom(slot.variables)
        nodeToChapter[slot.nodeId]?.let { currentChapterId = it.id }
        navigateToNode(slot.nodeId)
        return true
    }

    fun resetAndStartNew() {
        saveManager.deleteAutoSave()
        _hasAutoSave.value = false
        startNewGame("", "Nagi")
    }

    fun getPrologueLines() = prologueData.lines

    fun getSettings(): UserSettings = userSettings

    fun updateSettings(settings: UserSettings) {
        userSettings = settings
        bgmManager.setVolume(settings.bgmVolume)
        settingsManager.save(settings)
    }

    fun getBacklog(): List<BacklogEntry> = backlog.toList()

    fun getChapters(): List<Chapter> = if (::engine.isInitialized) repo.loadChapters() else emptyList()

    fun getUnlockedNodes(): Set<String> = progressManager.getVisitedNodes()

    fun getUnlockedEndings(): Set<String> = progressManager.getUnlockedEndings()

    fun getEndingBgPath(endingId: String): String? = getEndingFallbackBg(endingId)

    fun getEndingFallbackBg(endingId: String): String? {
        if (!::engine.isInitialized) return null
        val def = engine.getEndingDefinitions()[endingId] ?: return null
        return engine.getNodeBg(def.endingNode)
    }

    fun getSectionState(chapterId: String, sectionIndex: Int, startNode: String): SectionState {
        val isUnlocked = startNode in progressManager.getVisitedNodes()
        val isCurrentSection = chapterId == currentChapterId && sectionIndex == currentSectionIndex
        return progressManager.getSectionState(chapterId, sectionIndex, isCurrentSection, isUnlocked)
    }

    fun startReplay(startNodeId: String, chapterId: String, sectionIndex: Int) {
        if (!::engine.isInitialized) return
        val chapter = chapters.find { it.id == chapterId } ?: return
        val nextBoundaryNodes = mutableSetOf<String>()
        val nextIdx = sectionIndex + 1
        if (nextIdx < chapter.sections.size) {
            nextBoundaryNodes.add(chapter.sections[nextIdx].startNode)
        }
        val chapterIdx = chapters.indexOf(chapter)
        if (chapterIdx >= 0 && chapterIdx + 1 < chapters.size) {
            chapters[chapterIdx + 1].sections.firstOrNull()?.let {
                nextBoundaryNodes.add(it.startNode)
            }
        }

        isReplayMode = true
        replayBoundaryNodes = nextBoundaryNodes
        playerName = playerName.ifEmpty { "Ant" }
        if (!::gameState.isInitialized) {
            gameState = GameState(variablesData)
        }
        backlog.clear()
        navigateToNode(startNodeId)
    }

    fun stopReplay() {
        isReplayMode = false
        replayBoundaryNodes = emptySet()
    }

    fun isInReplayMode(): Boolean = isReplayMode

    fun getEndingDefinitions(): Map<String, EndingDefinition> =
        if (::engine.isInitialized) engine.getEndingDefinitions() else emptyMap()

    fun toggleAuto() {
        val current = _uiState.value.isAutoPlaying
        if (current) {
            stopAuto()
        } else {
            stopSkip()
            _uiState.update { it.copy(isAutoPlaying = true) }
            startAutoTimer()
        }
    }

    fun toggleSkip() {
        val current = _uiState.value.isSkipping
        if (current) {
            stopSkip()
        } else {
            stopAuto()
            _uiState.update { it.copy(isSkipping = true) }
            startSkipLoop()
        }
    }

    fun skipSection() {
        stopAuto()
        stopSkip()
        val chapter = chapters.find { it.id == currentChapterId } ?: return
        val section = chapter.sections.getOrNull(currentSectionIndex) ?: return
        progressManager.markSectionSkipped(currentChapterId, currentSectionIndex)

        val nextSectionIndex = currentSectionIndex + 1
        val nextStartNode: String? = if (nextSectionIndex < chapter.sections.size) {
            chapter.sections[nextSectionIndex].startNode
        } else {
            val chapterIndex = chapters.indexOfFirst { it.id == currentChapterId }
            if (chapterIndex >= 0 && chapterIndex + 1 < chapters.size) {
                val nextChapter = chapters[chapterIndex + 1]
                nextChapter.sections.firstOrNull()?.startNode
            } else null
        }

        if (nextStartNode == null) {
            _uiState.update { it.copy(phase = GamePhase.Error, errorMessage = "No next content after skip") }
            return
        }

        when (val resolution = engine.resolve(nextStartNode, gameState)) {
            is NodeResolution.Found -> enterNode(resolution)
            is NodeResolution.EndingReached -> showEnding(resolution)
            is NodeResolution.NotFound -> _uiState.update {
                it.copy(phase = GamePhase.Error, errorMessage = "Skip resolve failed: ${resolution.reason}")
            }
        }
    }

    fun getCurrentSectionTitle(): String {
        val chapter = chapters.find { it.id == currentChapterId } ?: return ""
        return chapter.sections.getOrNull(currentSectionIndex)?.title ?: ""
    }

    private fun stopAuto() {
        autoJob?.cancel()
        autoJob = null
        _uiState.update { it.copy(isAutoPlaying = false) }
    }

    private fun stopSkip() {
        skipJob?.cancel()
        skipJob = null
        _uiState.update { it.copy(isSkipping = false) }
    }

    private fun startAutoTimer() {
        autoJob?.cancel()
        autoJob = viewModelScope.launch {
            val delayMs = when (userSettings.autoSpeed) {
                1 -> 4000L
                2 -> 3000L
                3 -> 2000L
                4 -> 1500L
                5 -> 1000L
                else -> 2000L
            }
            delay(delayMs)
            val phase = _uiState.value.phase
            if (phase == GamePhase.Dialogue || phase == GamePhase.Response) {
                onTap()
            }
        }
    }

    private fun startSkipLoop() {
        skipJob?.cancel()
        skipJob = viewModelScope.launch {
            while (_uiState.value.isSkipping) {
                val phase = _uiState.value.phase
                if (phase == GamePhase.Dialogue || phase == GamePhase.Response) {
                    onTap()
                    delay(50)
                } else {
                    break
                }
            }
            stopSkip()
        }
    }

    fun jumpToChapter(startNodeId: String) {
        playerName = playerName.ifEmpty { "Ant" }
        if (!::gameState.isInitialized) {
            gameState = GameState(variablesData)
        }
        backlog.clear()
        stopAuto()
        stopSkip()
        nodeToChapter[startNodeId]?.let { currentChapterId = it.id }
        currentSectionIndex = -1
        navigateToNode(startNodeId)
    }

    fun onTap() {
        when (_uiState.value.phase) {
            GamePhase.Dialogue -> {
                if (_uiState.value.displayType == "long_narration") {
                    // After long narration, dialogueIndex already points to the next line
                    showDialogueLine()
                } else {
                    advanceDialogue()
                }
            }
            GamePhase.Response -> advanceResponse()
            GamePhase.ChapterEnding -> {
                val nextChapter = pendingNextChapter
                pendingNextChapter = null
                if (nextChapter != null) {
                    _uiState.update {
                        it.copy(
                            phase = GamePhase.ChapterTransition,
                            chapterTransition = ChapterTransitionInfo(
                                chapterName = nextChapter.name,
                                chapterTitle = nextChapter.title,
                                timeRange = nextChapter.timeRange
                            )
                        )
                    }
                } else {
                    val pending = pendingNodeAfterTransition
                    pendingNodeAfterTransition = null
                    if (pending != null) enterNode(pending)
                }
            }
            GamePhase.ChapterTransition, GamePhase.SectionTransition -> {
                val pending = pendingNodeAfterTransition
                pendingNodeAfterTransition = null
                if (pending != null) {
                    enterNode(pending)
                }
            }
            else -> {}
        }
    }

    fun onChoiceSelected(choiceIndex: Int) {
        if (_uiState.value.phase != GamePhase.Choice) return
        val choices = _uiState.value.choices
        if (choiceIndex !in choices.indices) return
        val choice = choices[choiceIndex]

        gameState.applyEffects(choice.effects)
        pendingNextId = engine.processChoiceTransition(choice)

        if (choice.responses.isNotEmpty()) {
            responseQueue = choice.responses
            responseIndex = 0
            showResponseLine()
        } else {
            advanceAfterChoice()
        }
    }

    // --- Node navigation ---

    private fun navigateToNode(targetId: String) {
        if (isReplayMode && targetId in replayBoundaryNodes) {
            _uiState.update {
                it.copy(
                    phase = GamePhase.Ending,
                    ending = null,
                    errorMessage = "REPLAY_COMPLETE"
                )
            }
            return
        }
        val resolution = engine.resolve(targetId, gameState)
        when (resolution) {
            is NodeResolution.Found -> enterNode(resolution)
            is NodeResolution.EndingReached -> {
                if (isReplayMode) {
                    _uiState.update {
                        it.copy(phase = GamePhase.Ending, ending = null, errorMessage = "REPLAY_COMPLETE")
                    }
                } else {
                    showEnding(resolution)
                }
            }
            is NodeResolution.NotFound -> {
                _uiState.update {
                    it.copy(
                        phase = GamePhase.Error,
                        errorMessage = "${resolution.id}: ${resolution.reason}"
                    )
                }
            }
        }
    }

    private fun enterNode(found: NodeResolution.Found) {
        val node = found.node
        val visual = found.visual

        if (!isReplayMode) {
            progressManager.markNodeVisited(found.nodeId)
        }

        if (!isReplayMode) {
            val newChapter = nodeToChapter[found.nodeId]
            if (newChapter != null && newChapter.id != currentChapterId && currentChapterId.isNotEmpty()) {
                progressManager.markSectionCompleted(currentChapterId, currentSectionIndex)
                val oldChapter = chapters.find { it.id == currentChapterId }
                currentChapterId = newChapter.id
                currentSectionIndex = -1
                backlog.clear()
                pendingNodeAfterTransition = found
                pendingNextChapter = newChapter
                val pendingBgPath = found.visual?.bg?.removePrefix("assets/")
                _uiState.update {
                    it.copy(
                        phase = GamePhase.ChapterEnding,
                        bgAssetPath = pendingBgPath ?: it.bgAssetPath,
                        chapterTransition = ChapterTransitionInfo(
                            chapterName = oldChapter?.name ?: "",
                            chapterTitle = oldChapter?.title ?: "",
                            timeRange = oldChapter?.timeRange
                        )
                    )
                }
                return
            }
            if (newChapter != null) {
                currentChapterId = newChapter.id
            }
            nodeToSectionIndex[found.nodeId]?.let { newSectionIndex ->
                if (newSectionIndex != currentSectionIndex && currentChapterId.isNotEmpty() && currentSectionIndex >= 0) {
                    progressManager.markSectionCompleted(currentChapterId, currentSectionIndex)
                    backlog.clear()
                    val chapter = chapters.find { it.id == currentChapterId }
                    val sectionTitle = chapter?.sections?.getOrNull(newSectionIndex)?.title
                    if (sectionTitle != null) {
                        currentSectionIndex = newSectionIndex
                        pendingNodeAfterTransition = found
                        val pendingBgPath = found.visual?.bg?.removePrefix("assets/")
                        _uiState.update {
                            it.copy(
                                phase = GamePhase.SectionTransition,
                                bgAssetPath = pendingBgPath ?: it.bgAssetPath,
                                sectionTransition = SectionTransitionInfo(
                                    chapterName = chapter.name,
                                    sectionTitle = sectionTitle
                                )
                            )
                        }
                        return
                    }
                }
                currentSectionIndex = newSectionIndex
            }
        }

        currentNode = node
        currentDialogue = node.dialogue
        dialogueIndex = 0
        currentChoices = engine.getVisibleChoices(node.choices, gameState)
        responseQueue = emptyList()
        responseIndex = 0
        pendingNextId = null

        val bgPath = visual?.bg?.removePrefix("assets/")

        val bgmPath = visual?.bgm?.removePrefix("assets/")
        if (bgmPath != null) {
            bgmManager.play(bgmPath)
        }

        _uiState.update {
            it.copy(
                currentNodeId = found.nodeId,
                sceneTitle = node.sceneTitle,
                bgAssetPath = bgPath,
                uiTheme = visual?.uiTheme ?: "Dark",
                mood = visual?.mood,
                mode = node.mode,
                speaker = "",
                text = "",
                choices = emptyList(),
                ending = null,
                errorMessage = null
            )
        }

        if (node.dialogue.isEmpty() && currentChoices.size == 1 && currentChoices[0].autoAdvance) {
            val choice = currentChoices[0]
            gameState.applyEffects(choice.effects)
            val nextId = engine.processChoiceTransition(choice)
                ?: engine.getNextNodeId(found.nodeId, gameState)
            if (nextId != null) {
                navigateToNode(nextId)
            }
            return
        }

        if (node.dialogue.isNotEmpty()) {
            showDialogueLine()
        } else if (currentChoices.isNotEmpty()) {
            presentChoices()
        } else {
            val nextId = engine.getNextNodeId(found.nodeId, gameState)
            if (nextId != null) {
                navigateToNode(nextId)
            } else {
                finishEndingNodeIfNeeded(found.nodeId)
            }
        }
    }

    // --- Dialogue ---

    private fun showDialogueLine() {
        if (dialogueIndex >= currentDialogue.size) {
            onDialogueComplete()
            return
        }
        val line = currentDialogue[dialogueIndex]

        // Detect long narration: 3+ consecutive empty-speaker lines
        if (line.speaker.isBlank() && line.display != "fullscreen") {
            val block = mutableListOf<String>()
            var lookahead = dialogueIndex
            while (lookahead < currentDialogue.size) {
                val next = currentDialogue[lookahead]
                if (next.speaker.isNotBlank() || next.display == "fullscreen") break
                block.add(next.text.replace("{{playerName}}", playerName).replace("{{nagiCall}}", nagiCall))
                lookahead++
            }
            if (block.size >= 3) {
                block.forEach { t ->
                    backlog.add(BacklogEntry(speaker = "", text = t))
                }
                dialogueIndex = lookahead
                _uiState.update {
                    it.copy(
                        phase = GamePhase.Dialogue,
                        speaker = "",
                        text = "",
                        displayType = "long_narration",
                        longNarrationTexts = block,
                        choices = emptyList(),
                        debugInfo = buildDebugInfo("long_narration[${block.size} paragraphs]")
                    )
                }
                return
            }
        }

        val resolvedText = line.text.replace("{{playerName}}", playerName).replace("{{nagiCall}}", nagiCall)
        val resolvedSpeaker = line.speaker.replace("{{playerName}}", playerName).replace("{{nagiCall}}", nagiCall)
        backlog.add(BacklogEntry(speaker = resolvedSpeaker, text = resolvedText))
        _uiState.update {
            it.copy(
                phase = GamePhase.Dialogue,
                speaker = resolvedSpeaker,
                text = resolvedText,
                displayType = line.display,
                longNarrationTexts = emptyList(),
                choices = emptyList(),
                debugInfo = buildDebugInfo("dialogue[$dialogueIndex/${currentDialogue.size}]")
            )
        }
        if (_uiState.value.isAutoPlaying) startAutoTimer()
    }

    private fun advanceDialogue() {
        dialogueIndex++
        showDialogueLine()
    }

    private fun onDialogueComplete() {
        when {
            currentChoices.isEmpty() -> {
                val nextId = engine.getNextNodeId(_uiState.value.currentNodeId, gameState)
                if (nextId != null) {
                    navigateToNode(nextId)
                } else {
                    finishEndingNodeIfNeeded(_uiState.value.currentNodeId)
                }
            }
            currentChoices.size == 1 && currentChoices[0].autoAdvance -> {
                val choice = currentChoices[0]
                gameState.applyEffects(choice.effects)
                pendingNextId = engine.processChoiceTransition(choice)
                if (choice.responses.isNotEmpty()) {
                    responseQueue = choice.responses
                    responseIndex = 0
                    showResponseLine()
                } else {
                    advanceAfterChoice()
                }
            }
            else -> presentChoices()
        }
    }

    // --- Choice ---

    private fun presentChoices() {
        stopAuto()
        stopSkip()
        val playerChoices = engine.getPlayerVisibleChoices(currentChoices, gameState)
        val resolved = playerChoices.map { c ->
            c.copy(label = c.label.replace("{{playerName}}", playerName).replace("{{nagiCall}}", nagiCall))
        }
        _uiState.update {
            it.copy(
                phase = GamePhase.Choice,
                choices = resolved,
                debugInfo = buildDebugInfo("choice[${resolved.size}]")
            )
        }
    }

    // --- Response ---

    private fun showResponseLine() {
        if (responseIndex >= responseQueue.size) {
            advanceAfterChoice()
            return
        }
        val line = responseQueue[responseIndex]
        val resolvedText = line.text.replace("{{playerName}}", playerName).replace("{{nagiCall}}", nagiCall)
        val resolvedSpeaker = line.speaker.replace("{{playerName}}", playerName).replace("{{nagiCall}}", nagiCall)
        backlog.add(BacklogEntry(speaker = resolvedSpeaker, text = resolvedText))
        _uiState.update {
            it.copy(
                phase = GamePhase.Response,
                speaker = resolvedSpeaker,
                text = resolvedText,
                displayType = line.display,
                choices = emptyList(),
                debugInfo = buildDebugInfo("response[$responseIndex/${responseQueue.size}]")
            )
        }
        if (_uiState.value.isAutoPlaying) startAutoTimer()
    }

    private fun advanceResponse() {
        responseIndex++
        showResponseLine()
    }

    private fun advanceAfterChoice() {
        val currentNodeId = _uiState.value.currentNodeId
        if (pendingNextId == "ending_resolver" && engine.getEndingForNode(currentNodeId) != null) {
            pendingNextId = null
            finishEndingNodeIfNeeded(currentNodeId)
            return
        }

        val nextId = pendingNextId
            ?: engine.getNextNodeId(currentNodeId, gameState)
        pendingNextId = null
        if (nextId != null) {
            navigateToNode(nextId)
        } else {
            finishEndingNodeIfNeeded(currentNodeId)
        }
    }

    // --- Ending ---

    private fun finishEndingNodeIfNeeded(nodeId: String) {
        val ending = engine.getEndingForNode(nodeId) ?: return
        if (isReplayMode) {
            _uiState.update {
                it.copy(phase = GamePhase.Ending, ending = null, errorMessage = "REPLAY_COMPLETE")
            }
        } else {
            showEnding(ending)
        }
    }

    private fun showEnding(ending: NodeResolution.EndingReached) {
        stopAuto()
        stopSkip()
        val endingId = ending.endingId.removePrefix("end_")
        val endingBgPath = engine.getNodeBg(ending.definition.endingNode)
        progressManager.unlockEnding(endingId, endingBgPath)
        saveManager.deleteAutoSave()
        _hasAutoSave.value = false
        _hasCompletedEnding.value = true
        _uiState.update {
            it.copy(
                phase = GamePhase.Ending,
                ending = ending.definition,
                debugInfo = buildDebugInfo("ending:${ending.endingId}")
            )
        }
    }

    // --- Debug ---

    fun getChapterTransition(): ChapterTransitionInfo? = _uiState.value.chapterTransition

    fun getSectionTransition(): SectionTransitionInfo? = _uiState.value.sectionTransition

    fun pauseBgm() = bgmManager.pause()
    fun resumeBgm() = bgmManager.resume()

    override fun onCleared() {
        super.onCleared()
        bgmManager.release()
    }

    private fun buildDebugInfo(cursor: String): DebugInfo? {
        if (!BuildConfig.DEBUG_MODE) return null
        if (!::gameState.isInitialized) return null
        return DebugInfo(
            nodeId = _uiState.value.currentNodeId,
            cursor = cursor,
            route = gameState.getString("path"),
            mj = gameState.getString("mj"),
            variables = gameState.snapshot()
        )
    }
}
