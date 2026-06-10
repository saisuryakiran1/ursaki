import React from 'react';
import HUDOverlay from './HUDOverlay';
import LiveWallpaper from './LiveWallpaper';
import ComputeStatusPanel from './ComputeStatusPanel';

export default function App(): React.JSX.Element {
  return (
    <main className="sanctuary">
      <LiveWallpaper />
      <HUDOverlay />
      <ComputeStatusPanel />
    </main>
  );
}
