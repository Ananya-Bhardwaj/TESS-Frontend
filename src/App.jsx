import React from "react";
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
import { Route, Routes } from "react-router-dom";
import PrivateRoute from '../src/routes/PrivateRoute'
import Unauthorized from "./pages/Unauthorized";
// import { AuthProvider } from "./providers/AuthProvider";
// import Routes from "./routes";

function App() {
  return (
    <>
      <ToastContainer/>
      <Layout>
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<HomePage/>}/>
      {/* <Route path="/admin" 
        element={
          <PrivateRoute role="Admin">
            <Admin />
          </PrivateRoute>
        }
      /> */}
      <Route path="/admin" 
      element={
        <Admin />
      }/>
      <Route path="/exam-dashboard" 
        element={
          <PrivateRoute role="Authority">
            <ExamDivDashboard />
          </PrivateRoute>
        }
      />
      <Route path="/upload-paper"
      element={
        <PrivateRoute role="Faculty">
          <UploadPaper />
        </PrivateRoute>
      }
      />
      <Route path="/faculty-dashboard"
      element={
        <PrivateRoute role="Faculty">
          <FacultyDashboard />
        </PrivateRoute>
      }
      />
      <Route path="/unauthorized"
      element={<Unauthorized />}
      />
    </Routes>
    </Layout>
    </>
  );
}

export default App;
