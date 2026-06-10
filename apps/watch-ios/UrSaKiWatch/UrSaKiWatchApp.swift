//
//  UrSaKiWatchApp.swift
//  watch-ios — Pulse Guardian stub
//
//  Placeholder WatchKit app structure for HRV collection via HealthKit.
//

import SwiftUI

@main
struct UrSaKiWatchApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

struct ContentView: View {
    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: "heart.fill")
                .foregroundStyle(.pink)
            Text("Pulse Guardian")
                .font(.caption)
            Text("HRV stub")
                .font(.caption2)
                .foregroundStyle(.secondary)
        }
    }
}

#Preview {
    ContentView()
}
