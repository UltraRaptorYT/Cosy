import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@/context/UserContext";
import Game from "@/components/Game";

export default function Home() {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const [_, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      userContext?.setUser(JSON.parse(user));
    } else if (!userContext?.user) {
      navigate(`/login`);
    }
  }, [userContext, navigate]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  }, []);

  return (
    <div className="h-full flex items-center justify-center">
      <Game user={userContext?.user} />
    </div>
  );
}
