import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GenerateCharacter from "@/components/GenerateCharacter";
import { useNavigate } from "react-router-dom";
import { CharacterJSONType } from "@/types";
export default function SignUp() {
  const navigation = useNavigate();
  const { signUp } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [playerAttributes, setPlayerAttributes] = useState<CharacterJSONType>({
    hair: 0,
    pants: 0,
    clothes: 0,
    hairColor: 0,
  });
  const [error, setError] = useState("");

  return (
    <div className="fullHeight flex flex-col justify-center items-center gap-3 max-w-[300px] mx-auto">
      <h1 className="text-4xl font-semibold">Join to Cosy</h1>
      <img src="./Cosy.png" className="h-32" />{" "}
      <div className="flex flex-col gap-5">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="username">Username</Label>
          <Input
            type="username"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <GenerateCharacter
          playerAttributes={playerAttributes}
          setPlayerAttributes={setPlayerAttributes}
        ></GenerateCharacter>
        <Button
          onClick={async () => {
            const { error } = await signUp(
              username,
              password,
              playerAttributes
            );
            if (error) {
              if (
                error.message ==
                `duplicate key value violates unique constraint "cosy_user_name_key"`
              ) {
                return setError("Username already exists");
              }
              setError(error.message);
            }
          }}
        >
          Sign Up
        </Button>
        <span className="text-red-500 text-xs">{error}</span>
        <div className="flex items-center gap-2 justify-center text-xs mt-[10px]">
          <span>Already have an account?</span>
          <Button
            variant={"ghost"}
            size={"sm"}
            onClick={() => navigation("/login")}
          >
            <span className="text-xs">Login</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
