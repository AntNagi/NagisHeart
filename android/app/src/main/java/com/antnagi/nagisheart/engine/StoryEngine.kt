package com.antnagi.nagisheart.engine

import com.antnagi.nagisheart.data.*

sealed class NodeResolution {
    data class Found(
        val nodeId: String,
        val node: StoryNode,
        val visual: SceneVisual?
    ) : NodeResolution()

    data class EndingReached(
        val endingId: String,
        val definition: EndingDefinition
    ) : NodeResolution()

    data class NotFound(val id: String, val reason: String) : NodeResolution()
}

class StoryEngine(
    private val nodes: Map<String, StoryNode>,
    private val flow: FlowData,
    private val routers: Map<String, Router>,
    private val sceneVisuals: Map<String, SceneVisual>,
    private val endings: EndingsData,
    private val conditionParser: ConditionParser = ConditionParser()
) {

    private val routerIds: Set<String> = routers.keys
    private val nodeIds: Set<String> = nodes.keys

    fun isRouter(id: String): Boolean = id in routerIds
    fun isNode(id: String): Boolean = id in nodeIds

    /**
     * Resolve an ID to a presentable node.
     * If the ID is a router, evaluates rules and follows the chain
     * until a story node or ending is reached.
     * Routers and nodes are explicitly distinguished — no null fallback.
     */
    fun resolve(id: String, state: GameState): NodeResolution {
        var currentId = id
        val visited = mutableSetOf<String>()

        while (currentId !in visited) {
            visited.add(currentId)

            when {
                isRouter(currentId) -> {
                    val router = routers[currentId]!!
                    val result = resolveRouter(router, state)
                    state.applyEffects(result.sideEffects)
                    currentId = result.targetId
                }

                isNode(currentId) -> {
                    return NodeResolution.Found(
                        nodeId = currentId,
                        node = nodes[currentId]!!,
                        visual = sceneVisuals[currentId]
                    )
                }

                isEndingNode(currentId) -> {
                    val key = currentId.removePrefix("end_")
                    val def = endings.definitions[key]
                        ?: return NodeResolution.NotFound(currentId, "Ending definition not found")
                    return NodeResolution.EndingReached(currentId, def)
                }

                else -> {
                    return NodeResolution.NotFound(currentId, "ID is neither a node nor a router")
                }
            }
        }

        return NodeResolution.NotFound(id, "Router loop detected")
    }

    /**
     * Get the next node ID from flow after the current node.
     * Checks byRoute overrides first (matching current path/mj), then default.
     */
    fun getNextNodeId(currentId: String, state: GameState): String? {
        for ((routeName, overrides) in flow.byRoute) {
            if (currentId in overrides) {
                val match = when (routeName) {
                    "M" -> state.getString("mj") == "M"
                    "J" -> state.getString("mj") == "J"
                    "dream" -> state.getString("path") == "dream"
                    "stay" -> state.getString("path") == "stay"
                    "bad" -> state.getString("path") == "bad"
                    else -> false
                }
                if (match) return overrides[currentId]
            }
        }
        return flow.default[currentId]
    }

    /**
     * Filter choices to only those whose condition (if any) is satisfied.
     */
    fun getVisibleChoices(choices: List<Choice>, state: GameState): List<Choice> {
        return choices.filter { choice ->
            choice.condition?.let { conditionParser.evaluate(it, state) } ?: true
        }
    }

    /**
     * Determine the next destination after a choice is made.
     * Returns the target ID from transition, or null if flow should be used.
     */
    fun getEndingDefinitions(): Map<String, EndingDefinition> = endings.definitions

    fun processChoiceTransition(choice: Choice): String? {
        return when (choice.transition?.type) {
            "goto" -> choice.transition.target
            "ending" -> choice.transition.target ?: "ending_resolver"
            else -> null
        }
    }

    // --- Private helpers ---

    private data class RouterResult(
        val targetId: String,
        val sideEffects: List<Effect>
    )

    private fun resolveRouter(router: Router, state: GameState): RouterResult {
        for (rule in router.rules) {
            if (conditionParser.evaluate(rule.condition, state)) {
                return RouterResult(rule.target, rule.sideEffects)
            }
        }
        return RouterResult(router.fallback, router.fallbackSideEffects)
    }

    private fun isEndingNode(id: String): Boolean {
        if (!id.startsWith("end_")) return false
        val key = id.removePrefix("end_")
        return key in endings.definitions
    }
}
