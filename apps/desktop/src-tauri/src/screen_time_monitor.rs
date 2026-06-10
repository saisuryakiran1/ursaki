//! Screen time monitor — detects doom-scrolling patterns.

use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ScreenTimeAlert {
    pub app_name: String,
    pub duration_minutes: u32,
    pub alert_type: String,
}

const DOOM_SCROLL_DOMAINS: &[&str] = &[
    "twitter.com",
    "x.com",
    "instagram.com",
    "tiktok.com",
    "reddit.com",
    "youtube.com",
];

const DOOM_SCROLL_THRESHOLD_MINUTES: u32 = 45;

pub struct ScreenTimeMonitor {
    current_app: String,
    current_duration_minutes: u32,
}

impl ScreenTimeMonitor {
    pub fn new() -> Self {
        Self {
            current_app: String::new(),
            current_duration_minutes: 0,
        }
    }

    pub fn update_active_window(&mut self, window_title: &str) -> Option<ScreenTimeAlert> {
        let app_name = extract_app_name(window_title);
        if app_name != self.current_app {
            self.current_app = app_name.clone();
            self.current_duration_minutes = 0;
        } else {
            self.current_duration_minutes += 1;
        }

        if self.current_duration_minutes >= DOOM_SCROLL_THRESHOLD_MINUTES
            && is_doom_scroll_domain(&self.current_app)
        {
            return Some(ScreenTimeAlert {
                app_name: self.current_app.clone(),
                duration_minutes: self.current_duration_minutes,
                alert_type: "doom_scroll".to_string(),
            });
        }

        None
    }
}

fn extract_app_name(title: &str) -> String {
    title.split(" - ").last().unwrap_or(title).to_string()
}

fn is_doom_scroll_domain(app: &str) -> bool {
    DOOM_SCROLL_DOMAINS
        .iter()
        .any(|d| app.to_lowercase().contains(d))
}

impl Default for ScreenTimeMonitor {
    fn default() -> Self {
        Self::new()
    }
}
