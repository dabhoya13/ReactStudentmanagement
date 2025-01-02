import StudentDetailsLayout from "@/components/layouts/StudentDetailsLayout/StudentDetailsLayout";
import { Box } from "@mui/material";
import Image from "next/image";
import demoImage from "../../public/Images/signin-image.jpg";
import style from "../../styles/studentDetails.module.css";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CottageOutlinedIcon from "@mui/icons-material/CottageOutlined";
const StudentDetails = () => {
  return (
    <StudentDetailsLayout>
      <Box className="card">
        <div className={`card-header ${style.card_header}`}>
          <h5>Parents Information</h5>
        </div>
        <div className={`card-body ${style.card_body}`}>
          <div className="border rounded p-3 pb-0 mb-3">
            <div className="row">
              <div className="col-sm-6 col-lg-4">
                <div className="d-flex align-items-center mb-3">
                  <Image
                    src={demoImage.src}
                    alt="profile-pic"
                    width={45}
                    height={45}
                    style={{ height: "auto", width: "auto" }}
                  />
                  <div className="ms-2 overflow-hidden">
                    <h6 className={style.text_truncate}>Mansukhbhai Dabhoya</h6>
                    <p className="text-primary mb-0">Father</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-4">
                <div className="mb-3">
                  <p className="text-dark mb-1">Phone</p>
                  <p>+1 45545 46464</p>
                </div>
              </div>
              <div className="col-sm-6 col-lg-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="mb-3 overflow-hidden me-3">
                    <p className="text-dark fw-medium mb-1">Email</p>
                    <p className="text-truncate">jera@example.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>
      <Box className="row mt-4">
        <div className="col-xxl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header">
              <h5>Documents</h5>
            </div>
            <div className="card-body">
              <div className="bg-light-300 border rounded d-flex align-items-center justify-content-between mb-3 p-2">
                <div className="d-flex overflow-hidden align-items-center">
                  <span className="avatar avatar-md bg-white rounded flex-shrink-0 text-default">
                    <PictureAsPdfOutlinedIcon sx={{ fontSize: "18px" }} />
                  </span>
                  <div className="ms-2">
                    <p className="text-truncate fw-medium text-dark mb-0">
                      BirthCertificate.pdf
                    </p>
                  </div>
                </div>
                <a href="#" className="btn btn-dark btn-icon btn-sm">
                  <CloudDownloadOutlinedIcon sx={{ fontSize: "0.8rem" }} />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xxl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header">
              <h5>Address</h5>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                  <LocationOnOutlinedIcon />
                </span>
                <div>
                  <p className="text-dark fw-medium mb-1">Current Address</p>
                  <p>3495 Red Hawk Road, Buffalo Lake, MN 55314</p>
                </div>
              </div>
              <div className="d-flex align-items-center mb-3">
                <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                  <CottageOutlinedIcon />
                </span>
                <div>
                  <p className="text-dark fw-medium mb-1">Permanent Address</p>
                  <p>3495 Red Hawk Road, Buffalo Lake, MN 55314</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xxl-12 d-flex mt-4">
          <div className="card flex-fill">
            <div className="card-header">
              <h5>Previous School Details</h5>
            </div>
            <div className="card-body pb-1">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <p className="text-dark fw-medium mb-1">
                      Previous School Name
                    </p>
                    <p>Oxford Matriculation, USA</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <p className="text-dark fw-medium mb-1">School Address</p>
                    <p>1852 Barnes Avenue, Cincinnati, OH 45202</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </StudentDetailsLayout>
  );
};

export default StudentDetails;
