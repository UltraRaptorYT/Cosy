import React from "react";
import { Image as KonvaImage } from "react-konva";
import useImage from "use-image";

interface PlayerProps {
  x: number;
  y: number;
  tileSize: number;
  playerImageSrc: string;
}

const Player: React.FC<PlayerProps> = ({ x, y, tileSize, playerImageSrc }) => {
  const [image] = useImage(playerImageSrc);

  return (
    <KonvaImage x={x} y={y} width={tileSize} height={tileSize} image={image} />
  );
};

export default Player;
