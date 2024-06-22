import { useEffect, useState, useRef } from "react";
import TileMap from "./TileMap";
import tilesheet from "@/assets/global.png";
import playerImage from "@/assets/react.svg";

const map: { tile: number; walkable: boolean }[][] = [
  [
    { tile: 0, walkable: true },
    { tile: 1, walkable: true },
    { tile: 2, walkable: true },
    { tile: 3, walkable: true },
    { tile: 0, walkable: true },
    { tile: 1, walkable: true },
    { tile: 2, walkable: true },
    { tile: 3, walkable: true },
  ],
  [
    { tile: 4, walkable: true },
    { tile: 5, walkable: false },
    { tile: 6, walkable: true },
    { tile: 7, walkable: true },
    { tile: 4, walkable: true },
    { tile: 5, walkable: false },
    { tile: 6, walkable: true },
    { tile: 7, walkable: true },
  ],
  [
    { tile: 8, walkable: true },
    { tile: 9, walkable: true },
    { tile: 10, walkable: true },
    { tile: 11, walkable: true },
    { tile: 8, walkable: true },
    { tile: 9, walkable: true },
    { tile: 10, walkable: true },
    { tile: 11, walkable: true },
  ],
  [
    { tile: 12, walkable: true },
    { tile: 13, walkable: true },
    { tile: 14, walkable: true },
    { tile: 15, walkable: true },
    { tile: 12, walkable: true },
    { tile: 13, walkable: true },
    { tile: 14, walkable: true },
    { tile: 15, walkable: true },
  ],
  [
    { tile: 0, walkable: true },
    { tile: 1, walkable: true },
    { tile: 2, walkable: true },
    { tile: 3, walkable: true },
    { tile: 0, walkable: true },
    { tile: 1, walkable: true },
    { tile: 2, walkable: true },
    { tile: 3, walkable: true },
  ],
  [
    { tile: 4, walkable: true },
    { tile: 5, walkable: false },
    { tile: 6, walkable: true },
    { tile: 7, walkable: true },
    { tile: 4, walkable: true },
    { tile: 5, walkable: false },
    { tile: 6, walkable: true },
    { tile: 7, walkable: true },
  ],
  [
    { tile: 8, walkable: true },
    { tile: 9, walkable: true },
    { tile: 10, walkable: true },
    { tile: 11, walkable: true },
    { tile: 8, walkable: true },
    { tile: 9, walkable: true },
    { tile: 10, walkable: true },
    { tile: 11, walkable: true },
  ],
  [
    { tile: 12, walkable: true },
    { tile: 13, walkable: true },
    { tile: 14, walkable: true },
    { tile: 15, walkable: true },
    { tile: 12, walkable: true },
    { tile: 13, walkable: true },
    { tile: 14, walkable: true },
    { tile: 15, walkable: true },
  ],
];

const tileSize = 16;
const scale = 2;
const speed = 0.5; // Pixels per frame

export default function Game({}: {}) {
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  const isWalkable = (x: number, y: number) => {
    const tileX1 = Math.floor(x / (tileSize * scale));
    const tileY1 = Math.floor(y / (tileSize * scale));
    const tileX2 = Math.floor((x + tileSize * scale - 1) / (tileSize * scale));
    const tileY2 = Math.floor((y + tileSize * scale - 1) / (tileSize * scale));
    return (
      map[tileY1] &&
      map[tileY1][tileX1] &&
      map[tileY1][tileX1].walkable &&
      map[tileY1] &&
      map[tileY1][tileX2] &&
      map[tileY1][tileX2].walkable &&
      map[tileY2] &&
      map[tileY2][tileX1] &&
      map[tileY2][tileX1].walkable &&
      map[tileY2] &&
      map[tileY2][tileX2] &&
      map[tileY2][tileX2].walkable
    );
  };
  const updatePlayerPosition = () => {
    setPlayerPosition((prev) => {
      let newPos = { ...prev };
      let tempPos = { ...prev };
      if (keysPressed.current["w"] || keysPressed.current["arrowup"]) {
        tempPos.y -= speed;
      }
      if (keysPressed.current["s"] || keysPressed.current["arrowdown"]) {
        tempPos.y += speed;
      }
      if (keysPressed.current["a"] || keysPressed.current["arrowleft"]) {
        tempPos.x -= speed;
      }
      if (keysPressed.current["d"] || keysPressed.current["arrowright"]) {
        tempPos.x += speed;
      }

      if (isWalkable(tempPos.x, tempPos.y)) {
        newPos = tempPos;
      }

      return newPos;
    });

    requestAnimationFrame(updatePlayerPosition);
  };
  const handleKeyDown = (e: KeyboardEvent) => {
    keysPressed.current[e.key.toLowerCase()] = true;
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    keysPressed.current[e.key.toLowerCase()] = false;
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    requestAnimationFrame(updatePlayerPosition);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="App">
      <TileMap
        tileSize={tileSize}
        map={map}
        tileSheetSrc={tilesheet}
        playerPosition={playerPosition}
        playerImageSrc={playerImage}
        scale={scale}
      />
    </div>
  );
}
