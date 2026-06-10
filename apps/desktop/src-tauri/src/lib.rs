mod hybrid_compute;
mod screen_time_monitor;
mod typing_monitor;

use hybrid_compute::HybridCompute;
use typing_monitor::TypingMonitor;

#[tauri::command]
fn get_compute_status() -> serde_json::Value {
    serde_json::json!({
        "ollamaRunning": false,
        "modelLoaded": null,
        "connectedDevices": 0
    })
}

#[tauri::command]
fn get_typing_state(monitor: tauri::State<'_, TypingMonitor>) -> typing_monitor::TypingState {
    monitor.compute_typing_pattern()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let typing_monitor = TypingMonitor::new();
    let _compute = HybridCompute::new("http://localhost:11434");

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(typing_monitor)
        .invoke_handler(tauri::generate_handler![get_compute_status, get_typing_state])
        .run(tauri::generate_context!())
        .expect("error while running UrSaKi desktop app");
}
