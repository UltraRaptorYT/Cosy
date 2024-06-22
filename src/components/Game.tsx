import { useEffect, useState, useRef, useContext } from "react";
import TileMap from "./TileMap";
import tilesheet from "@/assets/global.png";
import playerImage from "@/assets/character/body/char1.png";
import { map, playerFrames } from "@/constants";
import { PlayerDirection } from "@/types";
import { UserContext } from "@/context/UserContext";

const tileSize = 16;
const playerSize = 32;
const scale = 2;
const speed = 0.35; // Pixels per frame
const changeSpeed = 0.03;

export default function Game({}: {}) {
  const userContext = useContext(UserContext);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [playerFramesCount, setPlayerFramesCount] = useState(0);
  const [playerDirection, setPlayerDirection] =
    useState<PlayerDirection>("down");
  const [playerFrameCoords, setPlayerFrameCoords] = useState({ x: 0, y: 0 });
  const keysPressed = useRef<{ [key: string]: boolean }>({});

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
  const updatePlayerPosition = () => {
    setPlayerPosition((prev) => {
      let newPos = { ...prev };
      let tempPos = { ...prev };
      if (keysPressed.current["w"] || keysPressed.current["arrowup"]) {
        // Up
        tempPos.y -= speed;
        setPlayerDirection("up");
        setPlayerFramesCount((prev) => prev + changeSpeed);
      }
      if (keysPressed.current["s"] || keysPressed.current["arrowdown"]) {
        // Down
        tempPos.y += speed;
        setPlayerDirection("down");
        setPlayerFramesCount((prev) => prev + changeSpeed);
      }
      if (keysPressed.current["a"] || keysPressed.current["arrowleft"]) {
        // Left
        tempPos.x -= speed;
        setPlayerDirection("left");
        setPlayerFramesCount((prev) => prev + changeSpeed);
      }
      if (keysPressed.current["d"] || keysPressed.current["arrowright"]) {
        // Right
        tempPos.x += speed;
        setPlayerDirection("right");
        setPlayerFramesCount((prev) => prev + changeSpeed);
      }

      if (isWalkable(tempPos.x, tempPos.y)) {
        newPos = tempPos;
      }

      return newPos;
    });
    // setPlayerFramesCount(0);

    requestAnimationFrame(updatePlayerPosition);
  };

  useEffect(() => {
    console.log("hi", playerDirection, playerFramesCount);
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
    setPlayerFramesCount(0);
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
        playerSize={playerSize}
        map={map}
        tileSheetSrc={tilesheet}
        playerPosition={playerPosition}
        playerImageSrc={playerImage}
        playerFrameCoords={playerFrameCoords}
        scale={scale}
        user={userContext?.user}
      />
    </div>
  );
}
