import { Box } from "@mui/material";
import Sidebar from "./StudentLayout/StudentSidebar";
import Header from "./StudentLayout/StudentHeader";

type Props = {
  children: React.ReactNode;
};

export const StudentLayout = ({ children }: Props) => {
  return (
    <div style={{ display: "block" }}>
      <Sidebar />
      <Box sx={{ flex: 1 }}>
        <Header />
        <Box
          sx={{
            marginTop: "64px",
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