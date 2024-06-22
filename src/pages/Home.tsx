import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@/context/UserContext";
import Game from "@/components/Game";
import supabase from "@/lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
// import Peer from "simple-peer";

export default function Home() {
  const [channel, setChannel] = useState<RealtimeChannel>();
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const [_, setStream] = useState<MediaStream>();
  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      userContext?.setUser(JSON.parse(user));
      return;
    }
    if (!userContext || !userContext?.user) {
      navigate(`/login`);
    }
    console.log(userContext?.user);
  }, []);

  useEffect(() => {
    let channel = supabase.channel(`cosy`, {
      config: {
        broadcast: {
          self: true,
        },
        presence: {
          key: String(userContext?.user?.id),
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const newState = channel.presenceState();
        console.log("sync", newState);
      })
      .on("presence", { event: "join" }, async ({ key, newPresences }) => {
        console.log("join", key, newPresences);
      })
      .on("presence", { event: "leave" }, async ({ key, leftPresences }) => {
        console.log("leave", key, leftPresences);
      })
      .subscribe();
    setChannel(channel);

    return () => {
      channel.unsubscribe();
      setChannel(undefined);
    };
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
      <Game user={userContext?.user} channel={channel}></Game>
    </div>
  );
}
