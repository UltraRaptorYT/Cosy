import React from "react";
import { Group, Image as KonvaImage } from "react-konva";
import clothesImageSrc from "@/assets/character/clothes/basic.png";
import pantsImageSrc from "@/assets/character/clothes/pants.png";
import useImage from "use-image";
import { CharacterJSONType } from "@/types";

import gentlemanImageSrc from "@/assets/character/hair/gentleman.png";
import bobImageSrc from "@/assets/character/hair/bob.png";
import braidsImageSrc from "@/assets/character/hair/braids.png";
import wavyImageSrc from "@/assets/character/hair/wavy.png";
import long_straightImageSrc from "@/assets/character/hair/long_straight.png";
import emoImageSrc from "@/assets/character/hair/emo.png";
import curlyImageSrc from "@/assets/character/hair/curly.png";
import spacebunsImageSrc from "@/assets/character/hair/spacebuns.png";
import extra_longImageSrc from "@/assets/character/hair/extra_long.png";
import ponytailImageSrc from "@/assets/character/hair/ponytail.png";

interface PlayerProps {
  x: number;
  y: number;
  tileSize: number;
  playerImageSrc: string;
  scale: number;
  playerFrameCoords: { x: number; y: number };
  playerAttributes: CharacterJSONType | undefined;
}

const hairType = [
  gentlemanImageSrc,
  bobImageSrc,
  braidsImageSrc,
  wavyImageSrc,
  long_straightImageSrc,
  emoImageSrc,
  curlyImageSrc,
  spacebunsImageSrc,
  extra_longImageSrc,
  ponytailImageSrc,
];

const Player: React.FC<PlayerProps> = ({
  x,
  y,
  tileSize,
  playerImageSrc,
  scale,
  playerFrameCoords,
  playerAttributes = {
    hair: 0,
    pants: 0,
    clothes: 0,
    hairColor: 0,
  },
}) => {
  const [image] = useImage(playerImageSrc);
  const [clothesImage] = useImage(clothesImageSrc);
  const [hairImage] = useImage(hairType[playerAttributes["hair"]]);
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
          x:
            playerFrameCoords.x * tileSize +
            playerAttributes["clothes"] * tileSize * 8,
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
          x:
            playerFrameCoords.x * tileSize +
            playerAttributes["hairColor"] * tileSize * 8,
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
          x:
            playerFrameCoords.x * tileSize +
            playerAttributes["pants"] * tileSize * 8,
          y: playerFrameCoords.y * tileSize,
          width: tileSize,
          height: tileSize,
        }}
      />
    </Group>
  );
};

export default Player;
