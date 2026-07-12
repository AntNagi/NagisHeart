package com.antnagi.nagisheart.data

import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonNull
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.boolean
import kotlinx.serialization.json.booleanOrNull
import kotlinx.serialization.json.int
import kotlinx.serialization.json.intOrNull
import kotlinx.serialization.json.jsonPrimitive

class GameState(variablesData: VariablesData) {

    private val values = mutableMapOf<String, Any>()

    init {
        for ((name, def) in variablesData.numeric) {
            values[name] = def.initial ?: def.default ?: 0
        }
        for ((name, def) in variablesData.flags) {
            values[name] = resolveInitial(def)
        }
    }

    private fun resolveInitial(def: FlagVarDef): Any {
        val init = def.initial ?: return when (def.type) {
            "boolean" -> false
            else -> ""
        }
        if (init is JsonNull) return when (def.type) {
            "boolean" -> false
            else -> ""
        }
        val prim = init.jsonPrimitive
        return when {
            prim.booleanOrNull != null -> prim.boolean
            prim.intOrNull != null -> prim.int
            else -> prim.content
        }
    }

    fun get(name: String): Any? = values[name]

    fun getInt(name: String): Int = (values[name] as? Number)?.toInt() ?: 0

    fun getString(name: String): String = values[name]?.toString() ?: ""

    fun getBoolean(name: String): Boolean = values[name] as? Boolean ?: false

    fun set(name: String, value: Any) {
        values[name] = value
    }

    fun applyEffect(effect: Effect) {
        val prim = effect.`val`.jsonPrimitive
        when (effect.op) {
            "add" -> {
                val current = getInt(effect.`var`)
                values[effect.`var`] = current + prim.int
            }
            "set" -> {
                values[effect.`var`] = when {
                    prim.booleanOrNull != null -> prim.boolean
                    prim.intOrNull != null -> prim.int
                    else -> prim.content
                }
            }
        }
    }

    fun applyEffects(effects: List<Effect>) {
        effects.forEach { applyEffect(it) }
    }

    fun snapshot(): Map<String, Any> = values.toMap()

    fun toSerializable(): Map<String, JsonElement> {
        return values.mapValues { (_, v) ->
            when (v) {
                is Boolean -> JsonPrimitive(v)
                is Int -> JsonPrimitive(v)
                is Long -> JsonPrimitive(v)
                is Float -> JsonPrimitive(v)
                is Double -> JsonPrimitive(v)
                is String -> JsonPrimitive(v)
                else -> JsonPrimitive(v.toString())
            }
        }
    }

    fun restoreFrom(saved: Map<String, JsonElement>) {
        values.clear()
        for ((k, v) in saved) {
            val prim = v.jsonPrimitive
            values[k] = when {
                prim.booleanOrNull != null -> prim.boolean
                prim.intOrNull != null -> prim.int
                else -> prim.content
            }
        }
    }
}
