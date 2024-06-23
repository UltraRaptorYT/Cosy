import { useEffect, useState, useRef } from "react";
import TileMap from "./TileMap";
import tilesheet from "@/assets/global.png";
import playerImage from "@/assets/character/body/char1.png";
import { map, playerFrames } from "@/constants";
import { PlayerDirection, UserType } from "@/types";
import { RealtimeChannel } from "@supabase/supabase-js";
import supabase from "@/lib/supabase";

const tileSize = 16;
const playerSize = 32;
const scale = 2;
const speed = 1; // Pixels per frame
const changeSpeed = 0.05;

export default function Game({ user }: { user: UserType | undefined }) {
  const channelRef = useRef<RealtimeChannel | undefined>(undefined);
  const updateChannelRef = () => {
    channelRef.current = channel;
  };
  const [channel, setChannel] = useState<RealtimeChannel>();
  const [party, setParty] = useState<{ [key: string]: UserType }>({});
  const [playerPosition, setPlayerPosition] = useState({
    x: 0,
    y: 0,
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
    updateChannelRef();
  }, [channel]);

  useEffect(() => {
    const initChannel = async () => {
      const newChannel = supabase.channel("cosy", {
        config: {
          broadcast: {
            self: true,
          },
          presence: {
            key: String(user?.id),
          },
        },
      });

      newChannel
        .on("presence", { event: "sync" }, () => {
          const newState = newChannel.presenceState();
          console.log("sync", newState);
        })
        .on("presence", { event: "join" }, async ({ key, newPresences }) => {
          console.log("join", key, newPresences);
          setParty((prev) => {
            const newState = { ...prev };
            const user = newPresences[0].user;
            user.playerCoords = { x: 0, y: 0 };
            user.playerFrameCoords = { x: 0, y: 0 };
            newState[key] = user;
            return newState;
          });
        })
        .on("presence", { event: "leave" }, async ({ key, leftPresences }) => {
          console.log("leave", key, leftPresences);
          setParty((prev) => {
            const newState = { ...prev };
            delete newState[key];
            return newState;
          });
        });

      newChannel.on("broadcast", { event: "player-move" }, (data) => {
        setParty((prev) => {
          const newState = { ...prev };
          if (prev[data.payload.user_id]) {
            newState[data.payload.user_id].playerCoords =
              data.payload.playerCoords;
            newState[data.payload.user_id].playerFrameCoords =
              data.payload.playerFrameCoords;
            return newState;
          }
          return newState;
        });
      });

      await newChannel.subscribe(async (status) => {
        if (status !== "SUBSCRIBED") {
          console.error("Failed to subscribe to the channel");
          return;
        }

        const presenceTrackStatus = await newChannel.track({
          user_id: String(user?.id),
          user: user,
        });
        console.log(presenceTrackStatus);
      });

      setChannel(newChannel);
    };

    if (user?.id) {
      initChannel();
    }

    return () => {
      if (channel) {
        channel.unsubscribe();
        setChannel(undefined);
      }
    };
  }, [user?.id]);

  useEffect(() => {
    setPlayerFrameCoords(
      playerFrames[playerDirection][
        Math.floor(playerFramesCount % playerFrames[playerDirection].length)
      ]
    );
    if (channelRef.current) {
      channelRef.current.send({
        type: "broadcast",
        event: "player-move",
        payload: {
          user_id: user?.id,
          playerFrameCoords:
            playerFrames[playerDirection][
              Math.floor(
                playerFramesCount % playerFrames[playerDirection].length
              )
            ],
          playerCoords: { x: playerPosition.x, y: playerPosition.y },
        },
      });
    }
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
      party={party}
    />
  );
}
