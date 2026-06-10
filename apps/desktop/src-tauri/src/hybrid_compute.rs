//! Hybrid compute — Ollama node manager + WebRTC signaling stub.

use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ComputeStatus {
    pub ollama_running: bool,
    pub model_loaded: Option<String>,
    pub connected_devices: u32,
}

pub struct HybridCompute {
    ollama_url: String,
}

impl HybridCompute {
    pub fn new(ollama_url: &str) -> Self {
        Self {
            ollama_url: ollama_url.to_string(),
        }
    }

    pub async fn health_check(&self) -> ComputeStatus {
        let client = reqwest::Client::new();
        let url = format!("{}/api/tags", self.ollama_url);
        match client.get(&url).send().await {
            Ok(resp) if resp.status().is_success() => ComputeStatus {
                ollama_running: true,
                model_loaded: Some("llama3:8b".to_string()),
                connected_devices: 0,
            },
            _ => ComputeStatus {
                ollama_running: false,
                model_loaded: None,
                connected_devices: 0,
            },
        }
    }
}
