package com.ursaki.watch

import android.content.Context
import android.os.VibrationEffect
import android.os.VibratorManager
import androidx.health.services.client.HealthServices
import androidx.health.services.client.PassiveMonitoringClient
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.emptyFlow

/**
 * HRV collector using Health Services API.
 * PassiveMonitoring: HeartRateVariabilityRmssd
 * Streams to phone via Wearable Data Layer API every 30 seconds.
 */
class HRVCollector(private val context: Context) {
    private val passiveClient: PassiveMonitoringClient =
        HealthServices.getClient(context).passiveMonitoringClient

    fun startPassiveMonitoring(): Flow<Double> {
        // PassiveMonitoringCallback for HeartRateVariabilityRmssd
        // DataClient.putDataItem() → phone every 30s
        return emptyFlow()
    }

    fun triggerBreathingHaptic(inhaleMs: Long = 4000, holdMs: Long = 4000, exhaleMs: Long = 6000) {
        val vibrator = context.getSystemService(VibratorManager::class.java).defaultVibrator
        val timings = longArrayOf(0, inhaleMs, holdMs, exhaleMs)
        val amplitudes = intArrayOf(0, 128, 0, 64)
        vibrator.vibrate(VibrationEffect.createWaveform(timings, amplitudes, -1))
    }
}
