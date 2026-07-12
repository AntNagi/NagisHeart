package com.antnagi.nagisheart.data

import android.content.Context
import kotlinx.serialization.json.Json

class StoryRepository(private val context: Context) {

    private val json = Json { ignoreUnknownKeys = true }

    private fun readAsset(path: String): String =
        context.assets.open(path).bufferedReader().use { it.readText() }

    fun loadNodes(): Map<String, StoryNode> =
        json.decodeFromString(readAsset("story-data/nodes.json"))

    fun loadFlow(): FlowData =
        json.decodeFromString(readAsset("story-data/flow.json"))

    fun loadRouters(): Map<String, Router> =
        json.decodeFromString(readAsset("story-data/routers.json"))

    fun loadVariables(): VariablesData =
        json.decodeFromString(readAsset("story-data/variables.json"))

    fun loadEndings(): EndingsData =
        json.decodeFromString(readAsset("story-data/endings.json"))

    fun loadSceneVisuals(): Map<String, SceneVisual> =
        json.decodeFromString(readAsset("story-data/scene_visuals.json"))

    fun loadPrologueShort(): PrologueData =
        json.decodeFromString(readAsset("story-data/prologue_short.json"))

    fun loadChapters(): List<Chapter> =
        json.decodeFromString(readAsset("story-data/chapters.json"))
}
