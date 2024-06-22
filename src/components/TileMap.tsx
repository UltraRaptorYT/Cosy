import React from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import Player from "./Player";

interface Tile {
  tile: number;
  walkable: boolean;
}

interface TileMapProps {
  tileSize: number;
  map: Tile[][];
  tileSheetSrc: string;
  playerPosition: { x: number; y: number };
  playerImageSrc: string;
  scale: number;
}

const TileMap: React.FC<TileMapProps> = ({
  tileSize,
  map,
  tileSheetSrc,
  playerPosition,
  playerImageSrc,
  scale,
}) => {
  const [image] = useImage(tileSheetSrc);

  const renderTile = (tile: Tile, x: number, y: number) => {
    if (!image) return null;

    const sX = (tile.tile % (image.width / tileSize)) * tileSize;
    const sY = Math.floor(tile.tile / (image.width / tileSize)) * tileSize;

    return (
      <KonvaImage
        key={`${x}-${y}`}
        x={x * tileSize * scale}
        y={y * tileSize * scale}
        width={tileSize * scale}
        height={tileSize * scale}
        image={image}
        crop={{ x: sX, y: sY, width: tileSize, height: tileSize }}
      />
    );
  };

  return (
    <Stage
      width={map[0].length * tileSize * scale}
      height={map.length * tileSize * scale}
    >
      <Layer>
        {map.flatMap((row, y) => row.map((tile, x) => renderTile(tile, x, y)))}
        <Player
          x={playerPosition.x}
          y={playerPosition.y}
          tileSize={tileSize * scale}
          playerImageSrc={playerImageSrc}
        />
      </Layer>
    </Stage>
  );
};

export default TileMap;
