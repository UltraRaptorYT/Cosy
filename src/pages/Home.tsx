import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@/context/UserContext";
import Game from "@/components/Game";
// import Peer from "simple-peer";

export default function Home() {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const [_, setStream] = useState<MediaStream>();
  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      userContext?.setUser(JSON.parse(user));
      console.log(JSON.parse(user));
      return;
    }
    if (!userContext || !userContext?.user) {
      navigate(`/login`);
    }
    console.log(userContext?.user);
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
      });
  }, []);

  return (
    <div className="h-full flex items-center justify-center">
      <Game user={userContext?.user}></Game>
    </div>
  );
}
