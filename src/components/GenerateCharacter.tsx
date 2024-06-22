import { Stage, Layer } from "react-konva";
import Player from "@/components/Player";
import playerImage from "@/assets/character/body/char1.png";
import { Button } from "@/components/ui/button";
import { CharacterJSONType } from "@/types";

const tileSize = 32;
const scale = 3;
export default function GenerateCharacter({
  playerAttributes,
  setPlayerAttributes,
}: {
  playerAttributes: CharacterJSONType;
  setPlayerAttributes: React.Dispatch<React.SetStateAction<CharacterJSONType>>;
}) {
  function generate() {
    setPlayerAttributes({
      hair: Math.floor(Math.random() * 10),
      pants: Math.floor(Math.random() * 10),
      clothes: Math.floor(Math.random() * 10),
      hairColor: Math.floor(Math.random() * 10),
    });
  }

  return (
    <div className="flex items-center justify-around">
      <Stage width={tileSize * scale} height={tileSize * scale}>
        <Layer>
          <Player
            x={0}
            y={0}
            tileSize={tileSize}
            playerImageSrc={playerImage}
            scale={scale}
            playerFrameCoords={{ x: 0, y: 0 }}
            playerAttributes={playerAttributes}
          />
        </Layer>
      </Stage>
      <Button
        onClick={() => {
          generate();
        }}
      >
        Generate
      </Button>
    </div>
  );
}
