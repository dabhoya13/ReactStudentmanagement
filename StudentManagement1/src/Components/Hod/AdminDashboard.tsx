import { Navigate, useNavigate } from "react-router-dom";
import { getUserFromToken } from "../../Utils/Auth/Auth";

const AdminDashboard: React.FC = () => {
  const user = getUserFromToken();
  if (!user || user.Role != "1") {
    return <Navigate to="/login" />;
  }

  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };
  return (
    <>
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout}>LogOut</button>
    </>
  );
};

export default AdminDashboard;
