import { Box } from "@mui/material";
import Sidebar from "./HodLayouts/Sidebar";
import Header from "./HodLayouts/Header";

type Props = {
  children: React.ReactNode;
};

const AdminLayout = ({ children }: Props)  => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Sidebar />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: "#f8f8f8",
          }}
        >
          <Header />
        </Box>
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            marginTop: "30px",
            marginBottom: 3,
            marginLeft: { sm: 2, xs: 2, md: "264px", lg: "264px" },
            marginRight: 2,
          }}
        >
          {children}
        </Box>
      </Box>
    </div>
  );
};

export default AdminLayout;
