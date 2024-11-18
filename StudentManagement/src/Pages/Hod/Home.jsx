import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import Sidebar from "../../Sidebar";
import MenuIcon from "@mui/icons-material/Menu";
import Header from "./Header";

const Dashboard = () => {
  return (
    <>
        <Sidebar />
        <div>
          <Header />
          <h1 className="bg-dark">Home</h1>
        </div>
    </>
  );
};

export default Dashboard;
