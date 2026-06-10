//! Typing pattern monitor — detects rage typing via WPM + backspace ratio.

use serde::Serialize;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

#[derive(Debug, Clone, Serialize)]
pub struct TypingState {
    pub wpm: u32,
    pub backspace_ratio: f64,
    pub is_rage_typing: bool,
}

struct TypingBuffer {
    keypress_count: u32,
    backspace_count: u32,
    window_start: Instant,
    rage_since: Option<Instant>,
}

impl Default for TypingBuffer {
    fn default() -> Self {
        Self {
            keypress_count: 0,
            backspace_count: 0,
            window_start: Instant::now(),
            rage_since: None,
        }
    }
}

pub struct TypingMonitor {
    buffer: Arc<Mutex<TypingBuffer>>,
}

impl TypingMonitor {
    pub fn new() -> Self {
        Self {
            buffer: Arc::new(Mutex::new(TypingBuffer::default())),
        }
    }

    pub fn record_keypress(&self) {
        if let Ok(mut buf) = self.buffer.lock() {
            buf.keypress_count += 1;
        }
    }

    pub fn record_backspace(&self) {
        if let Ok(mut buf) = self.buffer.lock() {
            buf.backspace_count += 1;
            buf.keypress_count += 1;
        }
    }

    pub fn compute_typing_pattern(&self) -> TypingState {
        let mut buf = self.buffer.lock().unwrap();
        let elapsed = buf.window_start.elapsed().as_secs_f64().max(1.0);
        let minutes = elapsed / 60.0;
        let wpm = (buf.keypress_count as f64 / 5.0 / minutes) as u32;
        let backspace_ratio = if buf.keypress_count > 0 {
            buf.backspace_count as f64 / buf.keypress_count as f64
        } else {
            0.0
        };

        let rage_condition = wpm > 120 && backspace_ratio > 0.3;
        if rage_condition {
            if buf.rage_since.is_none() {
                buf.rage_since = Some(Instant::now());
            }
        } else {
            buf.rage_since = None;
        }

        let is_rage_typing = buf
            .rage_since
            .map(|since| since.elapsed() >= Duration::from_secs(30))
            .unwrap_or(false);

        TypingState {
            wpm,
            backspace_ratio,
            is_rage_typing,
        }
    }

    pub fn reset_window(&self) {
        if let Ok(mut buf) = self.buffer.lock() {
            buf.keypress_count = 0;
            buf.backspace_count = 0;
            buf.window_start = Instant::now();
        }
    }
}

impl Default for TypingMonitor {
    fn default() -> Self {
        Self::new()
    }
}
