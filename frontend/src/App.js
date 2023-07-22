import { useContext } from "react";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthContext } from "./State/AuthContext";
import EditProfile from "./pages/editProfile/EditProfile";
import MyMessage from "./pages/message/MyMessage";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Register />} />
        <Route path="/Login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/Register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/Profile/:username" element={<Profile />} />
        <Route path="/Profile/:username/edit" element={<EditProfile />} />
        <Route path="/mymessage/:username/" element={<MyMessage />} />
      </Routes>
    </Router>
  );
};

export default App;
