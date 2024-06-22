import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GenerateCharacter from "@/components/GenerateCharacter";
import { useNavigate } from "react-router-dom";
export default function SignUp() {
  const navigation = useNavigate();
  const { signUp } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="fullHeight flex flex-col justify-center items-center gap-3">
      <h1 className="text-4xl font-semibold">Sign Up to Cosy</h1>
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
        <GenerateCharacter></GenerateCharacter>
        <Button onClick={() => signUp(username, password)}>Sign Up</Button>
        <div className="flex items-center gap-2 justify-center text-sm mt-[10px]">
          <span>Already have an account?</span>
          <Button
            variant={"ghost"}
            size={"sm"}
            onClick={() => navigation("/login")}
          >
            <span className="text-sm">Login</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
