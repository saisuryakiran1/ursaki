import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import './styles.css';

interface TypingState {
  wpm: number;
  backspaceRatio: number;
  isRageTyping: boolean;
}

interface ComputeStatus {
  ollamaRunning: boolean;
  modelLoaded: string | null;
  connectedDevices: number;
}

export default function HUDOverlay(): React.JSX.Element {
  const [typing, setTyping] = useState<TypingState>({ wpm: 0, backspaceRatio: 0, isRageTyping: false });
  const [hrvDot] = useState<'green' | 'yellow' | 'red'>('green');
  const [showBreathing, setShowBreathing] = useState(false);
  const [compute, setCompute] = useState<ComputeStatus | null>(null);

  useEffect(() => {
    const unlistenTyping = listen<TypingState>('typing-state-update', (e) => {
      setTyping(e.payload);
      if (e.payload.isRageTyping) {
        setShowBreathing(true);
        setTimeout(() => setShowBreathing(false), 30_000);
      }
    });

    void invoke<ComputeStatus>('get_compute_status').then(setCompute);

    return () => {
      void unlistenTyping.then((fn) => fn());
    };
  }, []);

  return (
    <>
      <div className="hud-corner">
        <span className={`hrv-dot hrv-${hrvDot}`} title="HRV status" />
        <span className="hud-icon" title="Avatar state">🧬</span>
        <span className="hud-screen" title="Screen time">⏱ {typing.wpm} WPM</span>
      </div>

      {showBreathing && (
        <div className="breathing-overlay">
          <p>You&apos;ve been typing intensely. Take a breath.</p>
          <div className="breath-circle" />
        </div>
      )}

      <aside className="compute-panel">
        <h3>Compute Node</h3>
        <p>Ollama: {compute?.ollamaRunning ? '✓' : '✗'}</p>
        <p>Model: {compute?.modelLoaded ?? 'none'}</p>
        <p>Devices: {compute?.connectedDevices ?? 0}</p>
      </aside>
    </>
  );
}
