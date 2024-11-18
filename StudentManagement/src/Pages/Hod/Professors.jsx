import { Box } from "@mui/material";
import Sidebar from "../../Sidebar";

const Professors = () => {
    return (
        <>
          <Box sx={{ display: "flex" }}>
            <Sidebar />
            <h1>Professors</h1>
          </Box>
        </>
      );
}

export default Professors;