import {
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import logoImage from "../../../public/Images/logo2.svg";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddTaskIcon from '@mui/icons-material/AddTask';
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/router";
import Image from "next/image";

const drawerWidth = 240;
interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window?: () => Window;
}
const StudentSidebar: React.FC = (props: Props) => {
  const { window } = props;
  const router  = useRouter();
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };
  const handleItemClick = (route: null | string) => {
    if (route !== null) {
      router.push(route);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    router.replace("/");
  };

  const drawer = (
    <div className="sidebar-main-div">
      {/* <Toolbar /> */}
      <div className="logo-div">
        <Image width={100} height={35} src={logoImage}  alt="logo" />
      </div>

      <Box sx={{ display: "flex", flexDirection: "column", height: "90vh" }}>
        {/* First list at the top */}
        <List>
          <ListItem
            className={
              router.pathname === "/student/studentDashboard"
                ? "list-items selected"
                : "list-items"
            }
            disablePadding
            onClick={() => handleItemClick("/student/studentDashboard")}
          >
            <ListItemButton className="list-items-btn">
              <DashboardIcon />
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>

          <ListItem
            className={
              router.pathname === "/student/attendance"
                ? "list-items selected"
                : "list-items"
            }
            disablePadding
            onClick={() => handleItemClick("/student/attendance")}
          >
            <ListItemButton className="list-items-btn">
              <AddTaskIcon />
              <ListItemText primary="Attendance" />
            </ListItemButton>
          </ListItem>
        </List>

        {/* Second list at the bottom */}
        <List sx={{ marginTop: "auto" }}>
          <ListItem
            className="list-items"
            disablePadding
            onClick={() => handleLogout()}
          >
            <ListItemButton className="list-items-btn">
              <LogoutIcon />
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <IconButton
        aria-label="open drawer"
        edge="start"
        className="menu-icon"
        onClick={handleDrawerToggle}
        sx={{ mr: 2, display: { md: "none", zIndex: 999 } }}
      >
        <MenuIcon />
      </IconButton>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};

export default StudentSidebar;
