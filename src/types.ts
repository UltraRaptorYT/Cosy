export type CharacterJSONType = {
  hair: number;
  pants: number;
  clothes: number;
  hairColor: number;
};

export type UserType = {
  id: number;
  username: string;
  character_json: CharacterJSONType;
  created_at: string;
  playerFrameCoords?: { x: number; y: number };
  playerCoords?: { x: number; y: number };
};

export type PlayerDirection = "up" | "down" | "left" | "right";

export interface Tile {
  tileX: number;
  tileY: number;
  walkable: boolean;
}
