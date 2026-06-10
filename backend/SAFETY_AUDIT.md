# UrSaKi Safety Audit Checklist

Use this checklist before every release. All items must pass.

## Shadow Mode

- [ ] Shadow Mode double opt-in implemented and tested (settings toggle + session confirmation)
- [ ] Session time limits enforced server-side (15 min), not just client-side
- [ ] Grounding sequence cannot be dismissed prematurely (5-4-3-2-1 steps)
- [ ] Session auto-terminates on SafetyFlag `red`
- [ ] Minor age-gate blocks Shadow Mode

## Safety Guard

- [ ] `safety_guard.py` runs on 100% of LLM outputs (verified by test coverage)
- [ ] Crisis resources hardcoded in crisis response templates:
  - iCall: **9152987821**
  - Vandrevala: **1860-2662-345**
- [ ] Multilingual crisis detection (Hindi, Telugu) tested

## Privacy

- [ ] No emotional data transmitted without explicit opt-in
- [ ] Consent screen: no pre-checked boxes, scroll-to-enable
- [ ] Solid Protocol Data Pods configured as ground truth

## Biometrics

- [ ] HRV false positives suppressed during motion/exercise
- [ ] Intervention cooldown (10 min) prevents alert fatigue

## Social Bridge

- [ ] Bridge Mode off by default; requires explicit enable
- [ ] Minors (<18) cannot use Bridge Mode
- [ ] No user identity transmitted over BLE — anonymous tokens only
- [ ] All BLE data encrypted (ECDH key exchange verified)
- [ ] Only comfort_level + interest_tags broadcast (no raw VAD scores)

## Marketplace

- [ ] Mods reviewed for safety guidelines before going live
- [ ] Rating requires completed session

## CI/CD

- [ ] Safety audit job blocks merge on any safety test failure
- [ ] Backend test coverage ≥ 80%
