import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import logoImage from "./assets/Images/logo2.svg";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const drawerWidth = 240;

function Sidebar(props) {
  const navigate = useNavigate();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

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
  const [selectedItem, SetSelectedItem] = useState();

  const handleItemClick = (index, route) => {
    console.log(index);
    SetSelectedItem(index);
    navigate(route);
  };

  const drawer = (
    <div className="sidebar-main-div">
      {/* <Toolbar /> */}
      <div className="logo-div">
        <img src={logoImage} alt="logo" />
      </div>

      <Box sx={{ display: "flex", flexDirection: "column", height: "90vh" }}>
        {/* First list at the top */}
        <List>
          <ListItem
            className={
              selectedItem === 0 ? "list-items selected" : "list-items"
            }
            disablePadding
            onClick={() => handleItemClick(0, "/home")}
          >
            <ListItemButton className="list-items-btn">
              <DashboardIcon />
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
          <ListItem
            className={
              selectedItem === 1 ? "list-items selected" : "list-items"
            }
            disablePadding
            onClick={() => handleItemClick(1, "/students")}
          >
            <ListItemButton className="list-items-btn">
              <SchoolIcon />
              <ListItemText primary="Students" />
            </ListItemButton>
          </ListItem>
          <ListItem
            className={
              selectedItem === 2 ? "list-items selected" : "list-items"
            }
            disablePadding
            onClick={() => handleItemClick(2, "/professors")}
          >
            <ListItemButton className="list-items-btn">
              <Diversity3Icon />
              <ListItemText primary="Professors" />
            </ListItemButton>
          </ListItem>
        </List>

        {/* Second list at the bottom */}
        <List sx={{ marginTop: "auto" }}>
          <ListItem
            className={
              selectedItem === 3 ? "list-items selected" : "list-items"
            }
            disablePadding
            onClick={() => handleItemClick(3)}
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

  // Remove this const when copying and pasting into your project.
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* <AppBar
        position="fixed"
        sx={{
          width: { sm: `0px` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar> */}
       <IconButton
            color="black"
            aria-label="open drawer"
            edge="start"
            className="menu-icon"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
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
            display: { xs: "block", sm: "none" },
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
            display: { xs: "none", sm: "block" },
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
}

Sidebar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default Sidebar;
