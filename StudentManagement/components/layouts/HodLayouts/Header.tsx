import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import React, { useEffect, useState } from "react";
import { ViewHodProfileModal } from "@/utils/allModals/modals";
import { GetHodDetailsById } from "@/utils/adminUtils/myProfile's";
// import { ViewHodProfileModal } from "../../../Utils/allModals/modals";
// import { GetHodDetailsById } from "../../../Utils/adminUtils/myProfile's";

interface HodProps {
  Id: number;
  firstName: string;
  lastName: string;
  birthDate: Date;
  userName: string;
  email: string;
  mobileNumber: string;
  countryId: number;
  cityId: number;
  stateId: number;
  countryCode: string;
  imageName: string;
  imageUrl: string;
  countryName: string;
  cityName: String;
  stateName: String;
  postalCode: string;
}

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);

  const [profilePicture,setProfilePicture] =useState<string>("");
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [hodData, setHodData] = useState<HodProps | null>();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const openViewProfileModal = () => {
    setIsProfileMenuOpen(true);
  };

  const closeViewProfileModal = () => {
    setIsProfileMenuOpen(false);
  };

  useEffect(() => {
    const FetchHodDetails = async () => {
      const hodId = Number(sessionStorage.getItem("HodId"));
      if (hodId != null && hodId != 0) {
        const hodDetails = await GetHodDetailsById(hodId);
        if (hodDetails != null) {
          setHodData(hodDetails);
        }
      }
    };

    FetchHodDetails();

    setProfilePicture(sessionStorage.getItem("ProfilePicture") ?? "");
  }, []);

  const menuId = "primary-search-account-menu";
  // const renderMenu = (
  //   <Menu
  //     anchorEl={anchorEl}
  //     anchorOrigin={{
  //       vertical: "top",
  //       horizontal: "right",
  //     }}
  //     id={menuId}
  //     keepMounted
  //     transformOrigin={{
  //       vertical: "top",
  //       horizontal: "right",
  //     }}
  //     open={isMenuOpen}
  //     onClose={handleMenuClose}
  //   >
  //     <MenuItem onClick={openViewProfileModal}>Profile</MenuItem>
  //   </Menu>
  // );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={openViewProfileModal}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar className="header-box" position="static">
        <Toolbar className="header-toolbar">
          <Box sx={{ flexGrow: 2 }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            WelcomeBack 👋
          </Typography>
          <Box
            className="header-icon-box"
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <Box className="icon-div">
              <IconButton
                size="medium"
                aria-label="show 4 all mails"
                color="inherit"
              >
                <Badge badgeContent={4} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
            </Box>
            <Box className="icon-div">
              <IconButton
                size="medium"
                aria-label="show 17 new notifications"
                color="inherit"
              >
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Box>

            <Box className="profile-icon-div">
              <IconButton
                size="large"
                edge="end"
                className="profile-icon-div-btn"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={openViewProfileModal}
                color="inherit"
              >
                {/* <AccountCircle className="profile-picture" /> */}

                <Avatar
                  alt="Travis Howard"
                  className="profile-picture"
                  src={profilePicture}
                />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}

      <ViewHodProfileModal
        isOpen={isProfileMenuOpen}
        onClose={closeViewProfileModal}
        initialData={hodData}
      />
    </Box>
  );
};

export default Header;
