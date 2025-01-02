import { Box } from "@mui/material";
import Sidebar from "./StudentLayout/StudentSidebar";
import Header from "./StudentLayout/StudentHeader";
import Head from "next/head";

type Props = {
  children: React.ReactNode;
};

export const StudentLayout = ({ children }: Props) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Head>
        <title>Student Panel</title>
        <meta property="og:title" content="My page title" key="title" />
      </Head>
      <Sidebar />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f9f9fb",
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: "#f9f9fb",
          }}
        >
          <Header />
        </Box>
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            marginTop: "13px",
            marginBottom: 3,
            padding: 2.5,
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
