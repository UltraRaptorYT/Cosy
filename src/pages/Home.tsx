import {
  useEffect,
  useContext,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@/context/UserContext";
import Game from "@/components/Game";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function Home() {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const [_, setStream] = useState<MediaStream | null>(null);
  const lastProcessedTranscript = useRef<string>("");
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

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
        SpeechRecognition.startListening({
          continuous: true,
          language: "en-GB",
        });
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  }, []);

  const memoizedTranscript = useMemo(
    () => transcript.toLowerCase(),
    [transcript]
  );

  const handleTranscript = useCallback(() => {
    if (
      memoizedTranscript.includes("open cosy") &&
      lastProcessedTranscript.current !== memoizedTranscript
    ) {
      alert("Command recognized: Open Cosy");
      lastProcessedTranscript.current = memoizedTranscript;
      resetTranscript();
    }
  }, [memoizedTranscript, resetTranscript]);

  useEffect(() => {
    const handler = setTimeout(() => {
      handleTranscript();
    }, 1000); // Debounce time in milliseconds

    return () => clearTimeout(handler);
  }, [memoizedTranscript, handleTranscript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="h-full flex items-center justify-center">
      <Game user={userContext?.user} />
      <p>Recognized Word: {transcript}</p>
    </div>
  );
}
