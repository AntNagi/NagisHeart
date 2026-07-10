package com.antnagi.nagisheart.data

import kotlinx.serialization.Serializable

@Serializable
data class StoryNode(
    val mode: String = "vn",
    val sceneTitle: String = "",
    val dialogue: List<DialogueLine> = emptyList(),
    val choices: List<Choice> = emptyList()
)

@Serializable
data class DialogueLine(
    val id: String,
    val speaker: String = "",
    val text: String,
    val display: String = "bottom"
)

@Serializable
data class Choice(
    val id: String,
    val label: String = "",
    val autoAdvance: Boolean = false,
    val effects: List<Effect> = emptyList(),
    val responses: List<DialogueLine> = emptyList(),
    val transition: Transition? = null,
    val condition: String? = null
)

@Serializable
data class Effect(
    val `var`: String,
    val op: String,
    val `val`: kotlinx.serialization.json.JsonElement
)

@Serializable
data class Transition(
    val type: String,
    val target: String? = null,
    val tier: String? = null
)

@Serializable
data class FlowData(
    val default: Map<String, String> = emptyMap(),
    val byRoute: Map<String, Map<String, String>> = emptyMap()
)

@Serializable
data class RouterRule(
    val condition: String,
    val target: String,
    val label: String = "",
    val sideEffects: List<Effect> = emptyList()
)

@Serializable
data class Router(
    val description: String = "",
    val rules: List<RouterRule> = emptyList(),
    val fallback: String = "",
    val fallbackSideEffects: List<Effect> = emptyList(),
    val note: String? = null
)

@Serializable
data class SceneVisual(
    val bg: String? = null,
    val bgm: String? = null,
    val cg: String? = null,
    val uiTheme: String? = null,
    val autoSave: Boolean? = null,
    val focusPoint: FocusPoint? = null,
    val cropRule: String? = null,
    val characterPosition: String? = null,
    val uiSafeZone: UiSafeZone? = null
)

@Serializable
data class FocusPoint(val x: Float, val y: Float)

@Serializable
data class UiSafeZone(val top: Int = 0, val bottom: Int = 0)

@Serializable
data class PrologueLine(val id: String, val text: String)

@Serializable
data class PrologueData(
    val version: String = "short",
    val note: String = "",
    val lines: List<PrologueLine> = emptyList()
)

@Serializable
data class ChapterSection(
    val title: String,
    val startNode: String,
    val note: String? = null,
    val altStartNode: String? = null,
    val scope: String? = null
)

@Serializable
data class Chapter(
    val id: String,
    val name: String,
    val title: String,
    val timeRange: String? = null,
    val sections: List<ChapterSection> = emptyList()
)

@Serializable
data class EndingDefinition(
    val tag: String,
    val emoji: String,
    val title: String,
    val description: String,
    val subtitle: String,
    val endingNode: String
)

@Serializable
data class EndingJudgement(
    val tier: String,
    val condition: String,
    val node: String
)

@Serializable
data class EndingsData(
    val definitions: Map<String, EndingDefinition> = emptyMap(),
    val judgement: List<EndingJudgement> = emptyList()
)
