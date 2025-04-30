import React from "react";
import { Routes, Route} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import FacultyDashboard from "./pages/FacultyDashboard";
import ExamDivDashboard from "./pages/ExamDivDashboard";
import UploadPaper from "./pages/UploadPaper";
import HomePage from "./pages/HomePage";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Layout from "./Layout"; 
import Notification from "./Notification";

function App() {
  return (
    <div>
      <ToastContainer/>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/faculty" element={<FacultyDashboard />} />
          <Route path="/exam-div" element={<ExamDivDashboard />} />
          <Route path="/upload" element={<UploadPaper />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/notification" element={<Notification/>} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
