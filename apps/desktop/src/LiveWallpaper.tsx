import React, { useEffect, useState } from 'react';

interface TerrainNode {
  id: string;
  emotionType: string;
  spatialCoords: [number, number, number];
  biomeType: string;
}

export default function LiveWallpaper(): React.JSX.Element {
  const [nodes, setNodes] = useState<TerrainNode[]>([]);
  const [fps, setFps] = useState(30);

  useEffect(() => {
    const fetchTerrain = async (): Promise<void> => {
      try {
        const resp = await fetch('http://localhost:8000/memory-palace/default');
        const data = await resp.json();
        setNodes(data.nodes ?? []);
      } catch {
        setNodes([]);
      }
    };
    void fetchTerrain();
    const interval = setInterval(fetchTerrain, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="live-wallpaper"
      onMouseEnter={() => setFps(60)}
      onMouseLeave={() => setFps(30)}
    >
      <div className="wallpaper-fog" />
      {nodes.map((node) => (
        <div
          key={node.id}
          className="wallpaper-orb"
          style={{
            left: `${50 + node.spatialCoords[0] * 5}%`,
            top: `${50 + node.spatialCoords[2] * 5}%`,
            backgroundColor: node.biomeType === 'meadow' ? '#86EFAC' : '#67E8F9',
          }}
        />
      ))}
      <span className="fps-badge">{fps} fps</span>
    </div>
  );
}
