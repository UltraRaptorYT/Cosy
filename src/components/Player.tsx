import React from "react";
import { Group, Image as KonvaImage } from "react-konva";
import useImage from "use-image";

interface PlayerProps {
  x: number;
  y: number;
  tileSize: number;
  playerImageSrc: string;
  scale: number;
  playerFrameCoords: { x: number; y: number };
}

const Player: React.FC<PlayerProps> = ({
  x,
  y,
  tileSize,
  playerImageSrc,
  scale,
  playerFrameCoords,
}) => {
  const [image] = useImage(playerImageSrc);

  return (
    <Group x={x} y={y} scaleX={scale} scaleY={scale}>
      <KonvaImage
        x={0}
        y={0}
        width={tileSize}
        height={tileSize}
        image={image}
        crop={{
          x: playerFrameCoords.x * tileSize,
          y: playerFrameCoords.y * tileSize,
          width: tileSize,
          height: tileSize,
        }}
      />
    </Group>
  );
};

export default Player;
