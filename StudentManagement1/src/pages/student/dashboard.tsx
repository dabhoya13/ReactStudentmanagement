import { useRouter } from "next/router";

const Dashboard: React.FC = () => {
    const router = useRouter();
    const handleLogout = () => {
        sessionStorage.clear();
        router.replace("/login");
    }
  return (
    <>
      <h1>Student Dashboard</h1>
      <button onClick={handleLogout}>LogOut</button>
    </>
  );
};

export default Dashboard;
