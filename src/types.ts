export type CharacterJSONType = {};

export type UserType = {
  id: number;
  username: string;
  password: string;
  character_json: CharacterJSONType;
  created_at: string;
};
