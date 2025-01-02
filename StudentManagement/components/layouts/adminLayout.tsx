import { Box } from "@mui/material";
import Sidebar from "./HodLayouts/Sidebar";
import Header from "./HodLayouts/Header";
import Head from "next/head";

type Props = {
  children: React.ReactNode;
};

const AdminLayout = ({ children }: Props) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Head>
        <title>Admin Panel</title>
        <meta property="og:title" content="My page title" key="title" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        ></link>
        <link
          href="https://cdn.jsdelivr.net/npm/@tabler/icons@1.0.0/font/css/tabler-icons.min.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </Head>
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
            marginTop: "13px",
            marginBottom: 3,
            padding: 3,
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
