import { Box } from "@mui/material";
import Sidebar from "../../Sidebar";

const Students = () => {
    return (
        <>
          <Box sx={{ display: "flex" }}>
            <Sidebar />
            <h1>Students</h1>
          </Box>
        </>
      );
}

export default Students;