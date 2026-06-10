import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface ComputeStatus {
  ollamaRunning: boolean;
  modelLoaded: string | null;
  connectedDevices: number;
}

export default function ComputeStatusPanel(): React.JSX.Element {
  const [status, setStatus] = useState<ComputeStatus | null>(null);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    void invoke<ComputeStatus>('get_compute_status').then(setStatus);
  }, []);

  return (
    <div className="compute-status-panel">
      <h2>Hybrid Compute</h2>
      <label className="toggle-row">
        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
        Enable as compute node
      </label>
      <dl>
        <dt>Local model loaded</dt>
        <dd>{status?.ollamaRunning ? 'Yes' : 'No'}</dd>
        <dt>Active model</dt>
        <dd>{status?.modelLoaded ?? '—'}</dd>
        <dt>Connected mobile devices</dt>
        <dd>{status?.connectedDevices ?? 0}</dd>
        <dt>GPU memory</dt>
        <dd>—</dd>
      </dl>
    </div>
  );
}
