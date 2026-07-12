package com.antnagi.nagisheart.data

import android.content.Context
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.io.File

class SaveManager(private val context: Context) {

    private val json = Json { prettyPrint = true }

    private fun saveDir(): File {
        val dir = File(context.filesDir, "saves")
        if (!dir.exists()) dir.mkdirs()
        return dir
    }

    private fun slotFile(slotId: Int): File = File(saveDir(), "slot_$slotId.json")

    fun save(slot: SaveSlot) {
        slotFile(slot.id).writeText(json.encodeToString(slot))
    }

    fun load(slotId: Int): SaveSlot? {
        val file = slotFile(slotId)
        if (!file.exists()) return null
        return try {
            json.decodeFromString<SaveSlot>(file.readText())
        } catch (_: Exception) {
            null
        }
    }

    fun delete(slotId: Int) {
        slotFile(slotId).delete()
    }

    fun listSlots(): List<SaveSlot?> {
        return (1..10).map { load(it) }
    }

    fun hasAnySave(): Boolean {
        return (1..10).any { slotFile(it).exists() }
    }

    fun latestSlotId(): Int? {
        return (1..10).mapNotNull { id -> load(id)?.let { id to it.timestamp } }
            .maxByOrNull { it.second }?.first
    }

    fun hasAutoSave(): Boolean = slotFile(0).exists()

    fun loadAutoSave(): SaveSlot? = load(0)

    fun deleteAutoSave() = delete(0)
}
