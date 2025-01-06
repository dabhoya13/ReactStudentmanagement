import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import StudentDetailsLayout from "@/components/layouts/StudentDetailsLayout/StudentDetailsLayout";
import { Box } from "@mui/material";
import { CalendarIcon } from "@mui/x-date-pickers";
import DatePicker from "react-datepicker";

const ExamAndResult: React.FC = () => {
  return (
    <StudentDetailsLayout>
      <div className="card mt-3">
        <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
          <h4 className="mb-4">Exams & Results</h4>
          <Box
            className="leave_status_calendar_div"
            sx={{
              display: "flex",
              gap: 1,
              paddingBottom: 1.5,
              width: "100px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DatePicker
              selected={new Date()}
              //   onChange={(date: Date | null) => setLeaveStatusStartDate(date)}
              dateFormat="yyyy" // Display only month and year
              showMonthYearPicker // Show only month and year picker
              dropdownMode="select"
            />
            <CalendarIcon />
          </Box>
        </div>
        <div className="card-body">
          <div className="accordions-items-seperate" id="accordionExample">
            <div className="accordion-item mb-3">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="false"
                  aria-controls="collapseOne"
                >
                  <span className="avatar avatar-sm bg-successs me-2">
                    <CheckOutlinedIcon />
                  </span>
                  Monthly Test (May)
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <div className="table-responsive">
                    <table className="table">
                      <thead className="thead-light">
                        <tr>
                          <th>Subject</th>
                          <th>Max Marks</th>
                          <th>Min Marks</th>
                          <th>Marks Obtained</th>
                          <th className="text-end">Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>English (150)</td>
                          <td>100</td>
                          <td>35</td>
                          <td>65</td>
                          <td className="text-end">
                            <span className="badge badge-soft-success d-inline-flex align-items-center">
                             •
                              Pass
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>Mathematics (214)</td>
                          <td>100</td>
                          <td>35</td>
                          <td>73</td>
                          <td className="text-end">
                            <span className="badge badge-soft-success d-inline-flex align-items-center">
                             •
                              Pass
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>Physics (120)</td>
                          <td>100</td>
                          <td>35</td>
                          <td>55</td>
                          <td className="text-end">
                            <span className="badge badge-soft-success d-inline-flex align-items-center">
                             •
                              Pass
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>Chemistry (110)</td>
                          <td>100</td>
                          <td>35</td>
                          <td>90</td>
                          <td className="text-end">
                            <span className="badge badge-soft-success d-inline-flex align-items-center">
                             •
                              Pass
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>Spanish (140)</td>
                          <td>100</td>
                          <td>35</td>
                          <td>88</td>
                          <td className="text-end">
                            <span className="badge badge-soft-success d-inline-flex align-items-center">
                             •
                              Pass
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="bg-darks text-white">Rank : 30</td>
                          <td className="bg-darks text-white">Total : 500</td>
                          <td className="bg-darks text-white" colSpan={2}>
                            Marks Obtained : 395
                          </td>
                          <td className="bg-darks text-white text-end">
                            <div className="d-flex align-items-center justify-content-end">
                              <span className="me-2">Percentage : 79.50</span>
                              <h6 className="fw-normal text-white mb-0">
                                Result :{" "}
                                <span className="text-successs"> Pass</span>
                              </h6>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="false"
                  aria-controls="collapseOne"
                >
                  <span className="avatar avatar-sm bg-successs me-2">
                    <CheckOutlinedIcon />
                  </span>
                  Monthly Test (May)
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <div className="table-responsive">
                    <table className="table">
                      <thead className="thead-light">
                        <tr>
                          <th>Subject</th>
                          <th>Max Marks</th>
                          <th>Min Marks</th>
                          <th>Marks Obtained</th>
                          <th className="text-end">Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>English (150)</td>
                          <td>100</td>
                          <td>35</td>
                          <td>65</td>
                          <td className="text-end">
                            <span className="badge badge-soft-success d-inline-flex align-items-center">
                             •
                              Pass
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>Mathematics (214)</td>
                          <td>100</td>
                          <td>35</td>
                          <td>73</td>
                          <td className="text-end">
                            <span className="badge badge-soft-success d-inline-flex align-items-center">
                             •
                              Pass
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>Physics (120)</td>
                          <td>100</td>
                          <td>35</td>
                          <td>55</td>
                          <td className="text-end">
                            <span className="badge badge-soft-success d-inline-flex align-items-center">
                             •
                              Pass
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>Chemistry (110)</td>
                          <td>100</td>
                          <td>35</td>
                          <td>90</td>
                          <td className="text-end">
                            <span className="badge badge-soft-success d-inline-flex align-items-center">
                             •
                              Pass
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>Spanish (140)</td>
                          <td>100</td>
                          <td>35</td>
                          <td>88</td>
                          <td className="text-end">
                            <span className="badge badge-soft-success d-inline-flex align-items-center">
                             •
                              Pass
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="bg-darks text-white">Rank : 30</td>
                          <td className="bg-darks text-white">Total : 500</td>
                          <td className="bg-darks text-white" colSpan={2}>
                            Marks Obtained : 395
                          </td>
                          <td className="bg-darks text-white text-end">
                            <div className="d-flex align-items-center justify-content-end">
                              <span className="me-2">Percentage : 79.50</span>
                              <h6 className="fw-normal text-white mb-0">
                                Result :{" "}
                                <span className="text-successs"> Pass</span>
                              </h6>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
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

export default ExamAndResult;
