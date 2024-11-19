import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import { useEffect, useState } from "react";
import { CheckAuthenticated } from "./Utils/Auth/Auth";
import AdminDashboard from "./Components/Hod/AdminDashboard";
import Dashboard from "./Components/Students/Dashboard";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import Layout from "./Components/Layout";
import AllStudents from "./Components/Hod/AllStudents";
import AllProfessors from "./Components/Hod/AllProfessors";
const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState<boolean>(
    CheckAuthenticated()
  );

  useEffect(() => {
    setAuthenticated(CheckAuthenticated());
  }, []);
  return (
    // <>
    // <Login />
    // </>

    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Login setAuthenticated={setAuthenticated} />}
        />
        <Route
          path="/login"
          element={<Login setAuthenticated={setAuthenticated} />}
        />

        <Route element={<Layout />}>
          <Route path="/student/dashboard" element={authenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/admin/adminDashboard" element={authenticated ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/admin/allstudents" element={<AllStudents />}/>
          <Route path="/admin/allProfessors" element={<AllProfessors />}/>
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
