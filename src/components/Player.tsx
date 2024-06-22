import React from "react";
import { Group, Image as KonvaImage } from "react-konva";
import clothesImageSrc from "@/assets/character/clothes/basic.png";
import pantsImageSrc from "@/assets/character/clothes/pants.png";
import hairImageSrc from "@/assets/character/hair/gentleman.png";
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
  const [clothesImage] = useImage(clothesImageSrc);
  const [hairImage] = useImage(hairImageSrc);
  const [pantsImage] = useImage(pantsImageSrc);

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
      <KonvaImage
        x={0}
        y={0}
        width={tileSize}
        height={tileSize}
        image={clothesImage}
        crop={{
          x: playerFrameCoords.x * tileSize,
          y: playerFrameCoords.y * tileSize,
          width: tileSize,
          height: tileSize,
        }}
      />
      <KonvaImage
        x={0}
        y={0}
        width={tileSize}
        height={tileSize}
        image={hairImage}
        crop={{
          x: playerFrameCoords.x * tileSize,
          y: playerFrameCoords.y * tileSize,
          width: tileSize,
          height: tileSize,
        }}
      />
      <KonvaImage
        x={0}
        y={0}
        width={tileSize}
        height={tileSize}
        image={pantsImage}
        crop={{
          x: playerFrameCoords.x * tileSize + 6 * tileSize * 8,
          y: playerFrameCoords.y * tileSize,
          width: tileSize,
          height: tileSize,
        }}
      />
    </Group>
  );
};

export default Player;
