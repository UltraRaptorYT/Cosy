import { useContext } from "react";
import supabase from "@/lib/supabase";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@/context/UserContext";
import { UserType, CharacterJSONType } from "@/types";

export const useAuth = () => {
  const navigation = useNavigate();
  const userContext = useContext(UserContext);

  const signUp = async (
    username: string,
    password: string,
    playerAttributes: CharacterJSONType
  ) => {
    const hashed = CryptoJS.SHA256(password);
    const { data, error } = await supabase
      .from("cosy_user")
      .insert([
        {
          username,
          password: hashed.toString(CryptoJS.enc.Hex),
          character_json: playerAttributes,
        },
      ])
      .select();
    if (error) {
      return { error };
    }

    setUserLogin(data[0]);
    // Here you can implement your signup logic, e.g. create a new user in a database
    return { error: null };
  };

  const setUserLogin = (user: any) => {
    delete user.password;
    userContext?.setUser(user as UserType);
    sessionStorage.setItem("user", JSON.stringify(user));
    navigation("/");
  };

  const login = async (username: string, password: string) => {
    const hashed = CryptoJS.SHA256(password);
    const { data, error } = await supabase
      .from("cosy_user")
      .select()
      .eq("username", username)
      .eq("password", hashed.toString(CryptoJS.enc.Hex));

    if (error) {
      return { error };
    }
    if (data.length > 0) {
      setUserLogin(data[0]);
      return { error: null };
    }

    return { error: { message: "Invalid username or password" } };
  };

  const logout = () => {
    userContext?.setUser(null);
  };

  return { login, logout, signUp };
};
