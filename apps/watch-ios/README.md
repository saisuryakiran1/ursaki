# UrSaKi Watch (iOS)

WatchKit stub for Pulse Guardian — HRV collection via HealthKit.

## Structure

- `UrSaKiWatch/` — SwiftUI watch app
- `HRVCollector.swift` — HealthKit authorization + RR interval streaming stub

## Requirements

- Xcode 15+
- watchOS 10+
- HealthKit capability enabled

## Next steps

1. Add WatchConnectivity session for phone bridge
2. Implement WKHapticType breathing patterns for interventions
3. Wire to `apps/mobile/src/services/BiometricBridge.ts`
