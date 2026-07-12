package com.antnagi.nagisheart.data

import android.content.Context
import android.content.res.AssetFileDescriptor
import android.media.MediaPlayer
import android.util.Log

class BgmManager(private val context: Context) {

    private var mediaPlayer: MediaPlayer? = null
    private var currentTrack: String? = null
    private var volume: Float = 0.8f
    private var isPaused: Boolean = false

    fun play(assetPath: String) {
        if (assetPath == currentTrack && mediaPlayer?.isPlaying == true) return

        stop()
        currentTrack = assetPath

        try {
            val afd: AssetFileDescriptor = context.assets.openFd(assetPath)
            mediaPlayer = MediaPlayer().apply {
                setDataSource(afd.fileDescriptor, afd.startOffset, afd.length)
                afd.close()
                isLooping = true
                setVolume(volume, volume)
                prepare()
                start()
            }
            isPaused = false
        } catch (e: Exception) {
            Log.w("BgmManager", "Failed to play $assetPath: ${e.message}")
            currentTrack = null
        }
    }

    fun stop() {
        mediaPlayer?.run {
            if (isPlaying) stop()
            release()
        }
        mediaPlayer = null
        currentTrack = null
        isPaused = false
    }

    fun pause() {
        mediaPlayer?.let {
            if (it.isPlaying) {
                it.pause()
                isPaused = true
            }
        }
    }

    fun resume() {
        if (isPaused) {
            mediaPlayer?.start()
            isPaused = false
        }
    }

    fun setVolume(percent: Int) {
        volume = (percent.coerceIn(0, 100)) / 100f
        mediaPlayer?.setVolume(volume, volume)
    }

    fun release() {
        stop()
    }
}
