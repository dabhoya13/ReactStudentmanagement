import { Avatar, Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import profilePicture from "../../assets/Images/profile-image.jfif";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { EditHodAddressInfoModel, EditHodModel, EditHodPersonalInfoModel, EditProfilePictureModel } from "../AllModals/Modals";
import { GetHodDetailsById } from "./MyProfile's";
import LoadingGif from "../../assets/Images/Animation.gif";

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

interface HodProfilePictureProps {
  imageName: string;
  imageUrl: string;
  firstName: string;
  lastName: string;
}

interface HodPersonalInformationProps {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  userName: string;
  birthDate: Date;
}

interface HodAddressInfoProps {
  countryId: number;
  cityId: number;
  stateId: number;
  postalCode: string;
}

export const MyProfile: React.FC = () => {
  const [isAllEditOpen, setIsAllEditOpen] = useState<boolean>(false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState<boolean>(false);
  const [isPersonalInfoEditOpen, setIsPersonalInfoEditOpen] = useState<boolean>(false);
  const [isAddressInfoEditOpen, setIsAddressInfoEditOpen] = useState<boolean>(false);



  const [hodData, setHodData] = useState<HodProps | null>();
  const [hodProfilePictureData, setHodProfilePictureData] = useState<HodProfilePictureProps>();
  const [hodPersonalInfoData, setHodPersonalInfoData] = useState<HodPersonalInformationProps>();
  const [hodAddressInfoData, setHodAddressInfoData] = useState<HodAddressInfoProps>();

  const [hodId, setHodId] = useState<number>(0);
  const [loading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    const FetchHodDetails = async () => {
      setLoading(true);
      const hodId = Number(sessionStorage.getItem("HodId"));
      if (hodId != null && hodId != 0) {
        setHodId(hodId);
        const hodDetails = await GetHodDetailsById(hodId);
        if (hodDetails != null) {
          setHodData(hodDetails);
          const hodProfilePicutredata : HodProfilePictureProps = {
            firstName : hodDetails.firstName,
            imageName : hodDetails.imageName,
            imageUrl : hodDetails.imageUrl,
            lastName : hodDetails.lastName,
          }
          setHodProfilePictureData(hodProfilePicutredata);

          const hodPersonaInfoData : HodPersonalInformationProps = {
            firstName : hodDetails.firstName,
            lastName : hodDetails.lastName,
            birthDate : hodDetails.birthDate,
            email : hodDetails.email,
            mobileNumber : hodDetails.mobileNumber,
            userName : hodDetails.userName
          }

          setHodPersonalInfoData(hodPersonaInfoData);

          const hodAddressInfoData : HodAddressInfoProps = {
            cityId : hodDetails.cityId,
            countryId : hodDetails.countryId,
            stateId : hodDetails.stateId,
            postalCode : hodDetails.postalCode,
          }

          setHodAddressInfoData(hodAddressInfoData);
        };
      }
      setLoading(false);
    };

    FetchHodDetails();
  }, []);

  const openAllEditModal = () => {
    setIsAllEditOpen(true);
  };

  const closeAllEditModal = () => {
    setIsAllEditOpen(false);
  };

  const openProfileEditModal = () => {
    setIsProfileEditOpen(true);
  };

  const closeProfileEditModal = () => {
    setIsProfileEditOpen(false);
  };

  const openPersonalInfoEditModal = () => {
    setIsPersonalInfoEditOpen(true);
  };

  const closePersonalInfoEditModal = () => {
    setIsPersonalInfoEditOpen(false);
  };

  const openAddressInfoEditModal = () => {
    setIsAddressInfoEditOpen(true);
  };

  const closeAddressInfoEditModal = () => {
    setIsAddressInfoEditOpen(false);
  };


  return (
    <Box sx={{ paddingBottom: 2 }}>
      {loading && (
        <Box
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            height: "100vh",
            zIndex: "9000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="loading-spinner"
        >
          <img src={LoadingGif} alt="loading-gif" />
        </Box>
      )}
      <Typography sx={{ fontWeight: "bold", fontSize: "25px" }}>
        My Profile
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 3,
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          backgroundColor: "white",
          padding: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Box
            sx={{
              width: "100px",
              backgroundColor: "black",
              height: "100px",
              borderRadius: "50%",
            }}
          >
            <Avatar
              alt="Travis Howard"
              className="myprofile-picture"
              src={hodData?.imageUrl}
            />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>
              {hodData?.firstName + " " + hodData?.lastName}
            </Typography>
            <Typography sx={{ fontWeight: "bold", color: "grey" }}>
              Hod
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
          onClick={openProfileEditModal}
            sx={{
              color: "grey",
              border: "0.5px solid grey",
              borderRadius: "20px",
              padding: 1,
              fontWeight: "bold",
            }}
          >
            Edit <DriveFileRenameOutlineIcon />
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          marginTop: 3,
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          backgroundColor: "white",
          padding: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>
            Personal Information
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
            onClick={openPersonalInfoEditModal}
              sx={{
                color: "grey",
                border: "0.5px solid grey",
                borderRadius: "20px",
                padding: 1,
                fontWeight: "bold",
              }}
            >
              Edit <DriveFileRenameOutlineIcon />
            </Button>
          </Box>
        </Box>
        <Box
          sx={{ marginTop: 2, display: "flex", justifyContent: "space-evenly" }}
        >
          <Box sx={{ width: "100%" }}>
            <Box sx={{ paddingBottom: 2 }}>
              <Typography sx={{ fontWeight: "bold", color: "grey" }}>
                First Name
              </Typography>
              <Typography sx={{ fontWeight: "600" }}>
                {hodData?.firstName ? hodData?.firstName : "-"}
              </Typography>
            </Box>
            <Box sx={{ paddingBottom: 2 }}>
              <Typography sx={{ fontWeight: "bold", color: "grey" }}>
                Email Address
              </Typography>
              <Typography sx={{ fontWeight: "600" }}>
                {hodData?.email ? hodData?.email : "-"}
              </Typography>
            </Box>
            <Box sx={{ paddingBottom: 2 }}>
              <Typography sx={{ fontWeight: "bold", color: "grey" }}>
                UserName
              </Typography>
              <Typography sx={{ fontWeight: "600" }}>
                {hodData?.userName ? hodData?.userName : "-"}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ paddingBottom: 2 }}>
              <Typography sx={{ fontWeight: "bold", color: "grey" }}>
                Last Name
              </Typography>
              <Typography sx={{ fontWeight: "600" }}>
                {hodData?.lastName ? hodData?.lastName : "-"}
              </Typography>
            </Box>
            <Box sx={{ paddingBottom: 2 }}>
              <Typography sx={{ fontWeight: "bold", color: "grey" }}>
                Mobile Number
              </Typography>
              <Typography sx={{ fontWeight: "600" }}>
                {hodData?.mobileNumber ? hodData?.mobileNumber : "-"}
              </Typography>
            </Box>
            <Box sx={{ paddingBottom: 2 }}>
              <Typography sx={{ fontWeight: "bold", color: "grey" }}>
                BirthDate
              </Typography>
              {hodData?.birthDate ? (
                <Typography sx={{ fontWeight: "600" }}>
                  {new Date(hodData?.birthDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </Typography>
              ) : (
                <Typography>-</Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          marginTop: 3,
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          backgroundColor: "white",
          padding: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>
            Address Details
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
            onClick={openAddressInfoEditModal}
              sx={{
                color: "grey",
                border: "0.5px solid grey",
                borderRadius: "20px",
                padding: 1,
                fontWeight: "bold",
              }}
            >
              Edit <DriveFileRenameOutlineIcon />
            </Button>
          </Box>
        </Box>
        <Box
          sx={{ marginTop: 2, display: "flex", justifyContent: "space-evenly" }}
        >
          <Box sx={{ width: "100%" }}>
            <Box sx={{ paddingBottom: 2 }}>
              <Typography sx={{ fontWeight: "bold", color: "grey" }}>
                Country
              </Typography>
              <Typography sx={{ fontWeight: "600" }}>
              {hodData?.countryName ? hodData?.countryName : "-"}
              </Typography>
            </Box>
            <Box sx={{ paddingBottom: 2 }}>
              <Typography sx={{ fontWeight: "bold", color: "grey" }}>
                Postal Code
              </Typography>
              <Typography sx={{ fontWeight: "600" }}>
              {hodData?.postalCode ? hodData?.postalCode : "-"}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ paddingBottom: 2 }}>
              <Typography sx={{ fontWeight: "bold", color: "grey" }}>
                City
              </Typography>
              <Typography sx={{ fontWeight: "600" }}>
              {hodData?.cityName? hodData?.cityName: "-"}
              </Typography>
            </Box>
            <Box sx={{ paddingBottom: 2 }}>
              <Typography sx={{ fontWeight: "bold", color: "grey" }}>
                State
              </Typography>
              <Typography sx={{ fontWeight: "600" }}>
              {hodData?.stateName ? hodData?.stateName: "-"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          marginTop: 1,
          display: "flex",
          alignItems: "end",
          justifyContent: "end",
        }}
      >
        <Button
          onClick={openAllEditModal}
          sx={{
            backgroundColor: "green",
            color: "white",
            border: "0.5px solid grey",
            borderRadius: "20px",
            padding: 1,
            fontWeight: "bold",
          }}
        >
          Edit All <DriveFileRenameOutlineIcon />
        </Button>
      </Box>
      <EditHodModel
        isOpen={isAllEditOpen}
        onClose={closeAllEditModal}
        initialData={hodData}
        hodId={hodId}
      />

      <EditProfilePictureModel 
      isOpen={isProfileEditOpen}
      onClose={closeProfileEditModal}
      hodId={hodId}
      initialData={hodProfilePictureData}/>

      <EditHodPersonalInfoModel 
      hodId={hodId}
      isOpen={isPersonalInfoEditOpen}
      onClose={closePersonalInfoEditModal}
      initialData={hodPersonalInfoData}/>

      <EditHodAddressInfoModel 
      hodId={hodId}
      isOpen={isAddressInfoEditOpen}
      onClose={closeAddressInfoEditModal}
      initialData={hodAddressInfoData}/>
    </Box>
  );
};
