import Image from "next/image";
import { Avatar, Box } from "@mui/material";
import demoImage from "../../../public/Images/profile-image.jpg";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import PhoneIcon from "@mui/icons-material/Phone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import SchoolIcon from "@mui/icons-material/SchoolOutlined";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
type Props = {
  children: React.ReactNode;
};
const StudentDetailsLayout = ({ children }: Props) => {
  const router = useRouter();
  const { pathname } = router;

  const tabs = [
    {
      name: "Student Details",
      path: "/student/studentDetails",
      icon: <SchoolIcon className="me-2" sx={{ fontSize: "18px" }} />,
    },
    {
      name: "Time Table",
      path: "/student/timeTable",
      icon: (
        <ViewKanbanOutlinedIcon className="me-2" sx={{ fontSize: "18px" }} />
      ),
    },
    {
      name: "Leave & Attendance",
      path: "/student/leaveAndAttendance",
      icon: <EventOutlinedIcon className="me-2" sx={{ fontSize: "18px" }} />,
    },
    {
      name: "Fees",
      path: "/student/studentFees",
      icon: (
        <PriceChangeOutlinedIcon className="me-2" sx={{ fontSize: "18px" }} />
      ),
    },
    {
      name: "Exam & Results",
      path: "/student/examAndResult",
      icon: (
        <EventAvailableOutlinedIcon
          className="me-2"
          sx={{ fontSize: "18px" }}
        />
      ),
    },
    {
      name: "Library",
      path: "/student/library",
      icon: (
        <LibraryBooksOutlinedIcon className="me-2" sx={{ fontSize: "18px" }} />
      ),
    },
  ];

  return (
    <>
      <Head>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
      </Head>
      <Box sx={{ backgroundColor: "#f8f8f8" }}>
        <h1>Student Details</h1>
        <Box className="row" sx={{ marginTop: 2, transform: "none" }}>
          <Box
            className="col-xxl-3 col-xl-4"
            sx={{ position: "relative", overflow: "visible" }}
          >
            <Box sx={{paddingBottom: 1 }}>
              <div className="card border-white ">
                <Box
                  sx={{
                    padding: "1rem 1.25rem 1rem",
                    border: "1px solid #E9EDF4",
                  }}
                >
                  <div className="d-flex align-items-center flex-wrap row-gap-3">
                    <Box className="me-3">
                      <Image
                        src={demoImage.src}
                        alt="profile-pic"
                        width={80}
                        height={80}
                      />
                    </Box>
                    <Box>
                      <span className="badge badge-soft-success d-inline-flex align-items-center mb-1">
                        • Active
                      </span>
                      <h5>Kishan Dabhoya</h5>
                      <p className="text-primary">456789</p>
                    </Box>
                  </div>
                </Box>
                <Box sx={{ padding: "1.25rem" }} className="card-body">
                  <h5 className="mb-3">Basic Information</h5>
                  <dl className="row mb-0">
                    <dt className="col-6 text-dark mb-3">Roll No</dt>
                    <dd className="col-6 mb-3">350123</dd>
                    <dt className="col-6 text-dark mb-3">Gender</dt>
                    <dd className="col-6 mb-3">Male</dd>
                    <dt className="col-6 className text-dark mb-3">
                      Date Of Birth
                    </dt>
                    <dd className="col-6 mb-3">15 Jan 2008</dd>
                    <dt className="col-6 className text-dark mb-3">
                      Blood Group
                    </dt>
                    <dd className="col-6 mb-3">O +ve</dd>
                    <dt className="col-6 className text-dark mb-3">Reigion</dt>
                    <dd className="col-6 mb-3">Hindu</dd>
                    <dt className="col-6 className text-dark mb-3">Cast</dt>
                    <dd className="col-6 mb-3">Patel</dd>
                    <dt className="col-6 className text-dark mb-3">Category</dt>
                    <dd className="col-6 mb-3">General</dd>
                    <dt className="col-6 className text-dark mb-3">
                      Mother Tongue
                    </dt>
                    <dd className="col-6 mb-3">English</dd>
                  </dl>
                  <a
                    href="#"
                    data-bs-toggle="modal"
                    data-bs-target="#add_fees_collect"
                    className="btn btn-primary btn-sm w-100"
                  >
                    Add Fees
                  </a>
                </Box>
              </div>
              <div className="card border-white mt-3">
                <div className="card-body">
                  <h5 className="mb-3">Primary Contact Info</h5>
                  <div className="d-flex align-items-center mb-3">
                    <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                      <PhoneIcon sx={{ fontSize: "18px" }} />
                    </span>
                    <div>
                      <span className="text-dark className mb-1">
                        Phone Number
                      </span>
                      <p className="mb-0">+1 46548 84498</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                      <MailOutlineIcon sx={{ fontSize: "18px" }} />
                    </span>
                    <div>
                      <span className="text-dark className mb-1">
                        Email Address
                      </span>
                      <p className="mb-0">jan@example.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </Box>
          </Box>
          <Box className="col-xxl-9 col-xl-8">
            <div className="row">
              <div className="col-md-12">
                <ul className="nav nav-tabs nav-tabs-bottom mb-4">
                  {tabs.map((tab) => (
                    <li key={tab.name}>
                      <Link
                        className={`nav-link ${
                          pathname === tab.path ? "active" : ""
                        }`}
                        href={tab.path}
                      >
                        {tab.icon}
                        {tab.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                {children}
              </div>
            </div>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default StudentDetailsLayout;
