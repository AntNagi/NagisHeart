package com.antnagi.nagisheart.data

import android.content.Context
import android.content.SharedPreferences

class ProgressManager(context: Context) {

    private val prefs: SharedPreferences =
        context.getSharedPreferences("nagi_progress", Context.MODE_PRIVATE)

    fun markNodeVisited(nodeId: String) {
        val visited = getVisitedNodes().toMutableSet()
        visited.add(nodeId)
        prefs.edit().putStringSet("visited_nodes", visited).apply()
    }

    fun getVisitedNodes(): Set<String> =
        prefs.getStringSet("visited_nodes", emptySet()) ?: emptySet()

    fun unlockEnding(endingId: String) {
        val endings = getUnlockedEndings().toMutableSet()
        endings.add(endingId)
        prefs.edit().putStringSet("unlocked_endings", endings).apply()
    }

    fun getUnlockedEndings(): Set<String> =
        prefs.getStringSet("unlocked_endings", emptySet()) ?: emptySet()

    fun markSectionSkipped(chapterId: String, sectionIndex: Int) {
        val skipped = getSkippedSections().toMutableSet()
        skipped.add("$chapterId:$sectionIndex")
        prefs.edit().putStringSet("skipped_sections", skipped).apply()
        val completed = getCompletedSections().toMutableSet()
        completed.add("$chapterId:$sectionIndex")
        prefs.edit().putStringSet("completed_sections", completed).apply()
    }

    fun getSkippedSections(): Set<String> =
        prefs.getStringSet("skipped_sections", emptySet()) ?: emptySet()

    fun markSectionCompleted(chapterId: String, sectionIndex: Int) {
        val completed = getCompletedSections().toMutableSet()
        completed.add("$chapterId:$sectionIndex")
        prefs.edit().putStringSet("completed_sections", completed).apply()
    }

    fun getCompletedSections(): Set<String> =
        prefs.getStringSet("completed_sections", emptySet()) ?: emptySet()

    fun getSectionState(chapterId: String, sectionIndex: Int, isCurrentSection: Boolean, isUnlocked: Boolean): SectionState {
        val key = "$chapterId:$sectionIndex"
        val completed = getCompletedSections()
        val skipped = getSkippedSections()
        return when {
            key in completed && key in skipped -> SectionState.SKIPPED_COMPLETED
            key in completed -> SectionState.COMPLETED
            isCurrentSection -> SectionState.IN_PROGRESS
            isUnlocked -> SectionState.IN_PROGRESS
            else -> SectionState.LOCKED
        }
    }
}

enum class SectionState {
    LOCKED,
    IN_PROGRESS,
    COMPLETED,
    SKIPPED_COMPLETED
}
