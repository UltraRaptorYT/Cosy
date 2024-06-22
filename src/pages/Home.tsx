import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@/context/UserContext";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Game from "@/components/Game";
import supabase from "@/lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

export default function Home() {
  const [_, setChannel] = useState<RealtimeChannel>();
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
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
      });

    channel.subscribe();
    setChannel(channel);

    return () => {
      channel.unsubscribe();
      setChannel(undefined);
    };
  }, []);

  return (
    <>
      <Game></Game>
      <Drawer direction="right">
        <DrawerTrigger asChild>
          <Button>Open</Button>
        </DrawerTrigger>
        <DrawerContent className="fullHeight top-0 right-0 left-auto mt-0 w-[500px] rounded-none">
          <ScrollArea className="fullHeight">
            <DrawerHeader>
              <DrawerTitle>Are you absolutely sure?</DrawerTitle>
              <DrawerDescription>
                This action cannot be undone.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose>
                <Button>Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </>
  );
}
