import StudentDetailsLayout from "@/components/layouts/StudentDetailsLayout/StudentDetailsLayout";
import { Box } from "@mui/material";
import DemoImage from "@/public/Images/demo.jpg";
import {
  CalendarIcon,
  DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const StudentLibrary: React.FC = () => {
  return (
    <StudentDetailsLayout>
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
          <h4>Library</h4>
          <Box
            className="leave_status_calendar_div "
            sx={{
              display: "flex",
              gap: 1,
              paddingBottom: 1.5,
              width: "100px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                className="shadow-md"
                label={'"year"'}
                openTo="year"
                views={["year"]}
              />
            </LocalizationProvider>
          </Box>
        </div>
        <div className="card-body pb-1">
          <div className="row">
            <div className="col-xxl-4 col-md-6 d-flex">
              <div className="card mb-3 flex-fill">
                <div className="card-body pb-1">
                  <span className="avatar avatar-xl mb-3">
                    <img src={DemoImage.src} alt="book-img" />
                  </span>
                  <h6 className="mb-3">The Small-Town Library</h6>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="mb-3">
                        <span className="fs-12 mb-1">Book Taken on</span>
                        <p className="text-dark">25 Jan 2024</p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="mb-3">
                        <span className="fs-12 mb-1">Last Date</span>
                        <p className="text-dark">25 Jan 2024</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xxl-4 col-md-6 d-flex">
              <div className="card mb-3 flex-fill">
                <div className="card-body pb-1">
                  <span className="avatar avatar-xl mb-3">
                    <img src={DemoImage.src} alt="book-img" />
                  </span>
                  <h6 className="mb-3">The Small-Town Library</h6>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="mb-3">
                        <span className="fs-12 mb-1">Book Taken on</span>
                        <p className="text-dark">25 Jan 2024</p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="mb-3">
                        <span className="fs-12 mb-1">Last Date</span>
                        <p className="text-dark">25 Jan 2024</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xxl-4 col-md-6 d-flex">
              <div className="card mb-3 flex-fill">
                <div className="card-body pb-1">
                  <span className="avatar avatar-xl mb-3">
                    <img src={DemoImage.src} alt="book-img" />
                  </span>
                  <h6 className="mb-3">The Small-Town Library</h6>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="mb-3">
                        <span className="fs-12 mb-1">Book Taken on</span>
                        <p className="text-dark">25 Jan 2024</p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="mb-3">
                        <span className="fs-12 mb-1">Last Date</span>
                        <p className="text-dark">25 Jan 2024</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentDetailsLayout>
  );
};

export default StudentLibrary;
