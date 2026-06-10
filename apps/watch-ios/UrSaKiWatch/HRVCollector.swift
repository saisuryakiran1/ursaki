//
//  HRVCollector.swift
//  watch-ios — HealthKit HRV streaming + WatchConnectivity
//

import Foundation
import HealthKit
import WatchConnectivity

final class HRVCollector: NSObject, ObservableObject, WCSessionDelegate {
    private let healthStore = HKHealthStore()
    private var session: WCSession?

    func requestAuthorization() async throws {
        guard HKHealthStore.isHealthDataAvailable() else {
            throw HRVCollectorError.healthDataUnavailable
        }
        let types: Set<HKObjectType> = [
            HKObjectType.quantityType(forIdentifier: .heartRate)!,
            HKObjectType.quantityType(forIdentifier: .heartRateVariabilitySDNN)!,
        ]
        try await healthStore.requestAuthorization(toShare: [], read: types)
    }

    func startStreaming(intervalSeconds: TimeInterval = 30) {
        if WCSession.isSupported() {
            session = WCSession.default
            session?.delegate = self
            session?.activate()
        }
        // HKObserverQuery on heartRateVariabilitySDNN → send RR intervals every 30s
    }

    func triggerBreathingHaptic() {
        // WKHapticType: inhale 4s, hold 4s, exhale 6s sequence
        WKInterfaceDevice.current().play(.notification)
    }

    func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {}
}

enum HRVCollectorError: Error {
    case healthDataUnavailable
}
