import { useEffect, useState, useRef } from "react";
import TileMap from "./TileMap";
import tilesheet from "@/assets/global.png";
import playerImage from "@/assets/character/body/char1.png";
import { map, playerFrames } from "@/constants";
import { PlayerDirection, UserType } from "@/types";
import { RealtimeChannel } from "@supabase/supabase-js";

const tileSize = 16;
const playerSize = 32;
const scale = 2;
const speed = 1; // Pixels per frame
const changeSpeed = 0.05;

export default function Game({
  user,
  // channel,
}: {
  user: UserType | undefined;
  channel: RealtimeChannel | undefined;
}) {
  const [playerPosition, setPlayerPosition] = useState({
    x: 3 * tileSize * scale,
    y: 3 * tileSize * scale,
  });
  const [playerFramesCount, setPlayerFramesCount] = useState(0);
  const [playerDirection, setPlayerDirection] =
    useState<PlayerDirection>("down");
  const [playerFrameCoords, setPlayerFrameCoords] = useState({ x: 0, y: 0 });
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const lastUpdateRef = useRef<number>(0);

  const isWalkable = (x: number, y: number) => {
    const scaledTileSize = tileSize * scale * 0.85;
    const tileX1 = Math.floor(x / scaledTileSize);
    const tileY1 = Math.floor(y / scaledTileSize);
    const tileX2 = Math.floor((x + scaledTileSize - 1) / scaledTileSize);
    const tileY2 = Math.floor((y + scaledTileSize - 1) / scaledTileSize);
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

  const updatePlayerPosition = (timestamp: number) => {
    if (lastUpdateRef.current === 0) lastUpdateRef.current = timestamp;
    const deltaTime = (timestamp - lastUpdateRef.current) / 1000; // convert to seconds

    setPlayerPosition((prev) => {
      let newPos = { ...prev };
      let tempPos = { ...prev };
      let moved = false;

      if (keysPressed.current["w"] || keysPressed.current["arrowup"]) {
        tempPos.y -= speed * deltaTime * 60;
        setPlayerDirection("up");
        moved = true;
      }
      if (keysPressed.current["s"] || keysPressed.current["arrowdown"]) {
        tempPos.y += speed * deltaTime * 60;
        setPlayerDirection("down");
        moved = true;
      }
      if (keysPressed.current["a"] || keysPressed.current["arrowleft"]) {
        tempPos.x -= speed * deltaTime * 60;
        setPlayerDirection("left");
        moved = true;
      }
      if (keysPressed.current["d"] || keysPressed.current["arrowright"]) {
        tempPos.x += speed * deltaTime * 60;
        setPlayerDirection("right");
        moved = true;
      }

      if (isWalkable(tempPos.x, tempPos.y)) {
        newPos = tempPos;
      }

      // Update the frame if the player moved
      if (moved) {
        setPlayerFramesCount((prev) => prev + changeSpeed);
      } else {
        setPlayerFramesCount(0);
      }

      return newPos;
    });

    lastUpdateRef.current = timestamp;
    requestAnimationFrame(updatePlayerPosition);
  };

  useEffect(() => {
    setPlayerFrameCoords(
      playerFrames[playerDirection][
        Math.floor(playerFramesCount % playerFrames[playerDirection].length)
      ]
    );
  }, [playerDirection, playerFramesCount]);

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

  return (
    <TileMap
      tileSize={tileSize}
      playerSize={playerSize}
      map={map}
      tileSheetSrc={tilesheet}
      playerPosition={playerPosition}
      playerImageSrc={playerImage}
      playerFrameCoords={playerFrameCoords}
      scale={scale}
      user={user}
    />
  );
}
