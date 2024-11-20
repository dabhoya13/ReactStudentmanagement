import { Box } from "@mui/material";
import Sidebar from "./StudentSidebar";
import Header from "./StudentHeader";
import { Outlet } from "react-router-dom";

const StudentLayout:React.FC = () => {
    return(
        <div style={{display:"block"}}>
            <Sidebar />
            <Box sx={{flex:1}}>
                <Header />
                <Box sx={{marginTop:"64px",marginBottom:3, marginLeft:{sm:2, xs:2,md:"264px" , lg:"264px"}, marginRight:2}}>
                    <Outlet />
                </Box>
            </Box>
        </div>
    );
}

export default StudentLayout;