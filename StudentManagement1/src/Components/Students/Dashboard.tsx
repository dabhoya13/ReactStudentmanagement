import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/login");
    }
  return (
    <>
      <h1>Student Dashboard</h1>
      <button onClick={handleLogout}>LogOut</button>
    </>
  );
};

export default Dashboard;
