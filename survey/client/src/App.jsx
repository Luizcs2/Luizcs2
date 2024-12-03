import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { UserContextProvider } from "../context/userContext";
import Dashboard from "./Pages/Dashboard";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import LoadingScreen from "./Pages/LoadingScreen";
import QuestionTab from "./Pages/QuestionTab";
import Home from "./Pages/Home";
import CreateQuestionnaire from "./Pages/CreateQuestionnnaire";
import UserView from "./Pages/UserView";

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

function App() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return loading ? (
    <LoadingScreen />
  ) : (
    <UserContextProvider>
      {/* <Navbar /> */}
      <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
        <Route
          path="/questionnaire/:formID"
          element={<CreateQuestionnaire />}
        />
        <Route path="/view/:formID" element={<UserView />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;
