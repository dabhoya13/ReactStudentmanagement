import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import { useEffect, useState } from "react";
import { CheckAuthenticated } from "./Utils/Auth/Auth";
import Dashboard from "./Components/Students/Dashboard";
import Layout from "./Components/Layouts/HodLayouts/Layout";
import AllProfessors from "./Components/Hod/AllProfessors";
import AllStudents from "./Components/Hod/AllStudents";
import StudentLayout from "./Components/Layouts/StudentLayout/StudentLayout";
import AdminDashboard from "./Components/Hod/AdminDashboard";
import { MyProfile } from "./Components/Hod/MyProfile";
import { Attendance } from "./Components/Students/Attendance";
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
          <Route
            path="/admin/adminDashboard"
            element={
              authenticated ? <AdminDashboard /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin/allstudents"
            element={authenticated ? <AllStudents /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/allProfessors"
            element={
              authenticated ? <AllProfessors /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin/myProfile"
            element={
              authenticated ? <MyProfile /> : <Navigate to="/login" />
            }
          />
        </Route>

        <Route element={<StudentLayout />}>
          <Route
            path="/student/dashboard"
            element={authenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/student/attendance"
            element={authenticated ? <Attendance /> : <Navigate to="/student/attendance" />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
