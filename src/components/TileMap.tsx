import React from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import Player from "@/components/Player";
import { UserType, Tile } from "@/types";

interface TileMapProps {
  tileSize: number;
  playerSize: number;
  map: Tile[][];
  tileSheetSrc: string;
  playerPosition: { x: number; y: number };
  playerImageSrc: string;
  scale: number;
  playerFrameCoords: { x: number; y: number };
  user: UserType | undefined;
  party: { [key: string]: UserType };
}

const TileMap: React.FC<TileMapProps> = ({
  tileSize,
  playerSize,
  map,
  tileSheetSrc,
  playerPosition,
  playerImageSrc,
  scale,
  playerFrameCoords,
  user,
  party,
}) => {
  const [image] = useImage(tileSheetSrc);

  const renderTile = (tile: Tile, x: number, y: number) => {
    if (!image) return null;

    // const sX = (tile.tile % (image.width / tileSize)) * tileSize;
    // const sY = Math.floor(tile.tile / (image.width / tileSize)) * tileSize;

    return (
      <KonvaImage
        key={`${x}-${y}`}
        x={x * tileSize * scale}
        y={y * tileSize * scale}
        width={tileSize * scale}
        height={tileSize * scale}
        image={image}
        crop={{
          x: tile.tileX,
          y: tile.tileY,
          width: tileSize,
          height: tileSize,
        }}
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
          tileSize={playerSize}
          playerImageSrc={playerImageSrc}
          scale={scale}
          playerFrameCoords={playerFrameCoords}
          playerAttributes={user?.character_json}
        />
        {Object.values(party).map((e) => {
          if (e.id === user?.id) {
            return;
          }
          return (
            <Player
              key={e.id}
              x={e.playerCoords?.x || 0}
              y={e.playerCoords?.y || 0}
              tileSize={playerSize}
              playerImageSrc={playerImageSrc}
              scale={scale}
              playerFrameCoords={e.playerFrameCoords || { x: 0, y: 0 }}
              playerAttributes={e.character_json}
            />
          );
        })}
      </Layer>
    </Stage>
  );
};

export default TileMap;
