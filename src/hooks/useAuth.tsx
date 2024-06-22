import { useState, useContext } from "react";
import supabase from "@/lib/supabase";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@/context/UserContext";
import { UserType } from "@/types";

export const useAuth = () => {
  const navigation = useNavigate();
  const userContext = useContext(UserContext);

  const signUp = async (username: string, password: string) => {
    const hashed = CryptoJS.SHA256(password);
    const { data, error } = await supabase
      .from("cosy_user")
      .insert([
        {
          username,
          password: hashed.toString(CryptoJS.enc.Hex),
          character_json: {},
        },
      ])
      .select();
    if (error) {
      return { error };
    }

    userContext?.setUser(data[0] as UserType);
    navigation("/");
    // Here you can implement your signup logic, e.g. create a new user in a database
    return { error: null };
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
    // Here you can implement your login logic, e.g. check if the user exists in a database
    if (data.length > 0) {
      userContext?.setUser(data[0] as UserType);
      navigation("/");
      return { error: null };
    }

    return { error: "Invalid username or password" };
  };

  const logout = () => {
    userContext?.setUser(null);
  };

  return { login, logout, signUp };
};
