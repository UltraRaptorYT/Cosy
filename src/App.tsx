import { Route, Routes } from "react-router-dom";
import "./App.css";
import Error from "./pages/404";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          {/* 404 ERROR */}
          <Route path="/*" element={<Error />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}

export default App;
