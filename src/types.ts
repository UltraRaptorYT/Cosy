export type CharacterJSONType = {};

export type UserType = {
  id: number;
  username: string;
  character_json: CharacterJSONType;
  created_at: string;
};

export type PlayerDirection = "up" | "down" | "left" | "right";
