import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import { useEffect, useState } from "react";
import { CheckAuthenticated } from "./Utils/Auth/Auth";
import AdminDashboard from "./Components/Hod/AdminDashboard";
import Dashboard from "./Components/Students/Dashboard";
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
          path="/login"
          element={<Login setAuthenticated={setAuthenticated} />}
        />
        <Route
          path="/student/dashboard"
          element={authenticated ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* Admin Dashboard route */}
        <Route
          path="/admin/adminDashboard"
          element={
            authenticated ? <AdminDashboard /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;