import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@/context/UserContext";

export default function Home() {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!userContext || !userContext?.user) {
      navigate(`/login`);
    }
    console.log(userContext?.user);
  }, []);
  return <h1>Home</h1>;
}
