import StudentDetailsLayout from "@/components/layouts/StudentDetailsLayout/StudentDetailsLayout";
import { CalendarMonthOutlined } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { Box, InputAdornment, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { CustomTablePagination } from "../admin/allStudents";
import FirstPageRoundedIcon from "@mui/icons-material/FirstPageRounded";
import LastPageRoundedIcon from "@mui/icons-material/LastPageRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useEffect, useState } from "react";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import FileOpenOutlinedIcon from "@mui/icons-material/FileOpenOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { StudentsLeave } from "@/utils/studentUtils/studentDashboard's";
import LoadingGif from "../../public/Images/Animation.gif";
import {
  GetAllStudentsLeave,
  GetStudentUsedLeaveCounts,
  PaginationProps,
  PaginationResponseProps,
} from "@/utils/studentUtils/leaveAndAttendance's";
import { format } from "date-fns";
import { AddLeaveModal } from "@/utils/allModals/studentModals";
const LeaveAttendanceDetails: React.FC = () => {
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState<boolean>(true);
  const [studentLeaveData, setStudentLeaveData] =
    useState<PaginationResponseProps>();
  const [isOpenAddLeaveModal, setIsOpenAddLeaveModal] =
    useState<boolean>(false);
  const [totalLeaves, setTotalLeaves] = useState({
    totalMedicalLeave: 0,
    totalCasualLeave: 0,
    totalMaternityLeave: 0,
    totalPaternityLeave: 0,
  });
  const [leaveBalances, setLeaveBalances] = useState({
    usedMedicalLeave: 0,
    usedCasualLeave: 0,
    usedMaternityLeave: 0,
    usedPaternityLeave: 0,
  });
  const [isClientSide, setIsClientSide] = useState<boolean>(false);
  const [studentId, setStudentId] = useState<number>(0);
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    setSearchQuery(value);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const fetchCounts = async () => {
      const studentId = parseInt(sessionStorage.getItem("UserId") ?? "0", 10);
      const leaveCounts: StudentsLeave | null = await GetStudentUsedLeaveCounts(
        studentId
      );
      if (leaveCounts != null) {
        console.log(leaveCounts);
        setLeaveBalances({
          usedMedicalLeave: leaveCounts.medicalLeaveCount,
          usedCasualLeave: leaveCounts.casualLeaveCount,
          usedMaternityLeave: leaveCounts.maternityLeaveCount,
          usedPaternityLeave: leaveCounts.paternityLeaveCount,
        });

        setTotalLeaves({
          totalMedicalLeave: leaveCounts.totalMedicalLeave,
          totalCasualLeave: leaveCounts.totalCasualLeave,
          totalMaternityLeave: leaveCounts.totalMaternityLeave,
          totalPaternityLeave: leaveCounts.totalPaternityLeave,
        });
      }
    };
    fetchCounts();
  }, []);

  useEffect(() => {
    const getStudentsData = async () => {
      const studentId = parseInt(sessionStorage.getItem("UserId") ?? "0", 10);
      setLoading(true);
      const pagination: PaginationProps = {
        PageSize: rowsPerPage,
        SearchQuery: searchQuery,
        StartIndex: page * rowsPerPage,
        StudentId: studentId,
      };

      try {
        const result = await GetAllStudentsLeave(pagination);
        if (result != null) {
          setStudentLeaveData(result);
        }
      } catch (error) {
        console.error("Error fetching students data:", error);
      } finally {
        setLoading(false);
      }
    };

    getStudentsData();
  }, [rowsPerPage, page, searchQuery]);

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  useEffect(() => {
    if (isClientSide) {
      const storedStudentId = sessionStorage.getItem("UserId");
      // Parse the studentId and set it in state
      setStudentId(parseInt(storedStudentId ?? "0", 10));
    }
  }, [isClientSide]);

  return (
    <StudentDetailsLayout>
      {loading && (
        <Box className="loading-spinner">
          <img src={LoadingGif.src} alt="loading-gif" />
        </Box>
      )}
      <div className="card mb-3">
        <div className="card-body ">
          <ul
            className=" d-flex align-items-center gap-3 nav nav-tabs nav-tabs-solid b-0 nav-tabs-rounded-fill"
            role="tablist"
            style={{ border: 0 }}
          >
            <li className="">
              <a
                href="#"
                className="nav-link active rounded fs-12 fw-semibold"
                data-bs-toggle="tab"
                data-bs-target="#leave"
                aria-selected="true"
                role="tab"
              >
                Leaves
              </a>
            </li>
            <li className="">
              <a
                href="#"
                className="nav-link rounded fs-12 fw-semibold"
                data-bs-toggle="tab"
                data-bs-target="#attendance"
                aria-selected="true"
                role="tab"
              >
                Attendance
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="tab-content">
        <div className="tab-pane fade active show" id="leave" role="tabpanel">
          <div className="row gx-3">
            <div className="col-lg-6 col-xxl-3 d-flex">
              <div className="card flex-fill">
                <div className="card-body">
                  <h5 className="mb-2">
                    Medical Leave ({totalLeaves.totalMedicalLeave}){" "}
                  </h5>
                  <div className="d-flex align-items-center flex-wrap">
                    <p className="border-end pe-2 me-2 mb-0">
                      Used : {leaveBalances.usedMedicalLeave}
                    </p>
                    <p className="mb-0">
                      Available :{" "}
                      {totalLeaves.totalMedicalLeave -
                        leaveBalances.usedMedicalLeave}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-xxl-3 d-flex">
              <div className="card flex-fill">
                <div className="card-body">
                  <h5 className="mb-2">
                    Casual Leave ({totalLeaves.totalCasualLeave}){" "}
                  </h5>
                  <div className="d-flex align-items-center flex-wrap">
                    <p className="border-end pe-2 me-2 mb-0">
                      Used : {leaveBalances.usedCasualLeave}
                    </p>
                    <p className="mb-0">
                      Available :{" "}
                      {totalLeaves.totalCasualLeave -
                        leaveBalances.usedCasualLeave}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-xxl-3 d-flex">
              <div className="card flex-fill">
                <div className="card-body">
                  <h5 className="mb-2">
                    Maternity Leave ({totalLeaves.totalMaternityLeave}){" "}
                  </h5>
                  <div className="d-flex align-items-center flex-wrap">
                    <p className="border-end pe-2 me-2 mb-0">
                      Used : {leaveBalances.usedMaternityLeave}
                    </p>
                    <p className="mb-0">
                      Available :{" "}
                      {totalLeaves.totalMaternityLeave -
                        leaveBalances.usedMaternityLeave}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-xxl-3 d-flex">
              <div className="card flex-fill">
                <div className="card-body">
                  <h5 className="mb-2">
                    Paternity Leave ({totalLeaves.totalPaternityLeave}){" "}
                  </h5>
                  <div className="d-flex align-items-center flex-wrap">
                    <p className="border-end pe-2 me-2 mb-0">
                      Used : {leaveBalances.usedPaternityLeave}{" "}
                    </p>
                    <p className="mb-0">
                      Available :{" "}
                      {totalLeaves.totalPaternityLeave -
                        leaveBalances.usedPaternityLeave}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card mt-3">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap pb-0">
              <h4 className="mb-3">Leaves</h4>
            </div>
            <div className="card-body p-0 py-3">
              <Box className="d-flex align-items-center justify-content-between mb-3 ms-2 me-2">
                <TextField
                  onKeyUp={handleSearch}
                  sx={{ backgroundColor: "white" }}
                  size="small"
                  variant="outlined"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <a
                  onClick={() => setIsOpenAddLeaveModal(true)}
                  data-bs-target="#apply_leave"
                  data-bs-toggle="modal"
                  className="btn btn-primary d-inline-flex align-items-center gap-2 mt-1"
                >
                  <CalendarMonthOutlined sx={{ fontSize: "15px" }} />
                  Apply Leave
                </a>
              </Box>
              <div className="table-responsive">
                <table
                  aria-label="custom pagination"
                  className="leave-table table table-responsive"
                >
                  <thead>
                    <tr>
                      <th>Leave Type</th>
                      <th>Leave Date</th>
                      <th>No Of Days</th>
                      <th>Applied On</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentLeaveData?.studentsLeave.map((row) => (
                      <tr>
                        <td>{row.leaveTypeName}</td>
                        <td>{format(row.leaveDate, "dd MMM yyyy")}</td>
                        <td>{row.numberOfDays}</td>
                        <td>{format(row.createdDate, "dd MMM yyyy")}</td>
                        <td>
                          {row.leaveStatus === 1 ? (
                            <span className="badge badge-soft-pending d-inline-flex align-items-center">
                              • Pending
                            </span>
                          ) : row.leaveStatus === 2 ? (
                            <span className="badge badge-soft-success d-inline-flex align-items-center">
                              • Approved
                            </span>
                          ) : (
                            <span className="badge badge-soft-success d-inline-flex align-items-center">
                              • Rejected
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <CustomTablePagination
                        rowsPerPageOptions={[
                          5,
                          10,
                          25,
                          {
                            label: "All",
                            value: studentLeaveData?.totalItems ?? 0,
                          },
                        ]}
                        // colSpan={3}
                        count={studentLeaveData?.totalItems ?? 0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        slotProps={{
                          select: {
                            "aria-label": "rows per page",
                          },
                          actions: {
                            showFirstButton: true,
                            showLastButton: true,
                            slots: {
                              firstPageIcon: FirstPageRoundedIcon,
                              lastPageIcon: LastPageRoundedIcon,
                              nextPageIcon: ChevronRightRoundedIcon,
                              backPageIcon: ChevronLeftRoundedIcon,
                            },
                          },
                        }}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="tab-pane fade" id="attendance" role="tabpanel">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4>Attendance</h4>
              <select className="attendance_select_Attendance shadow-md">
                <option>2024/2025</option>
              </select>
            </div>
            <div className="card-body pb-1">
              <div className="row">
                <div className="col-md-6 col-xxl-6 d-flex">
                  <div className="d-flex align-items-center rounded border p-3 mb-3  flex-fill">
                    <span className="avatar avatar-lg bg-primary-transparent rounded me-2 flex-shrink-0 text-primary">
                      <PersonOutlineOutlinedIcon
                        sx={{ fontSize: "1.5rem  " }}
                      />
                    </span>
                    <div className="ms-2">
                      <p className="mb-0">Present</p>
                      <h5>265</h5>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-xxl-6 d-flex">
                  <div className="d-flex align-items-center rounded border p-3 mb-3  flex-fill">
                    <span className="avatar avatar-lg bg-danger-transparent rounded me-2 flex-shrink-0 text-danger">
                      <PersonOutlineOutlinedIcon
                        sx={{ fontSize: "1.5rem  " }}
                      />
                    </span>
                    <div className="ms-2">
                      <p className="mb-0">Absent</p>
                      <h5>05</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-2">
              <h4>Leave & Attendance</h4>
              <div className="d-flex gap-3 align-items-center flex-wrap">
                <select className="attendance_select_Attendance shadow-md">
                  <option>This Year</option>
                  <option>Perevious Year</option>
                </select>
                <a
                  href="javascript:void(0);"
                  className="dropdown-toggle btn btn-light fw-medium d-inline-flex align-items-center gap-2"
                  data-bs-toggle="dropdown"
                >
                  <FileOpenOutlinedIcon sx={{ fontSize: "14px" }} />
                  Export
                </a>

                <ul
                  className="attendance_export_menu dropdown-menu dropdown-menu-end p-3"
                  data-popper-placement="bottom-end"
                >
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      <i className="ti ti-file-type-pdf me-2"></i>Export as PDF
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      <i className="ti ti-file-type-xls me-2"></i>Export as
                      Excel{" "}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="card-body p-0 py-3">
              <div className="px-3">
                <div className="d-flex align-items-center flex-wrap">
                  <div className="d-flex align-items-center bg-white border rounded p-2 me-3 mb-3">
                    <span className="avatar avatar-sm bg-successs rounded me-2 flex-shrink-0 ">
                      <CheckOutlinedIcon
                        sx={{ fontSize: "0.85rem", fontWeight: "bolder" }}
                      />
                    </span>
                    <p className="text-dark mb-0">Present</p>
                  </div>
                  <div className="d-flex align-items-center bg-white border rounded p-2 me-3 mb-3">
                    <span className="avatar avatar-sm bg-danger rounded me-2 flex-shrink-0 ">
                      <CloseOutlinedIcon
                        sx={{ fontSize: "0.85rem", fontWeight: "bolder" }}
                      />
                    </span>
                    <p className="text-dark mb-0">Absent</p>
                  </div>
                  <div className="d-flex align-items-center bg-white border rounded p-2 me-3 mb-3">
                    <span className="avatar avatar-sm bg-info rounded me-2 flex-shrink-0 ">
                      <CalendarMonthOutlined
                        sx={{ fontSize: "0.85rem", fontWeight: "bolder" }}
                      />
                    </span>
                    <p className="text-dark mb-0">Holiday</p>
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date | Month</th>
                      {[
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ].map((month, index) => (
                        <th key={index}>{month}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td></td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <CustomTablePagination
                        rowsPerPageOptions={[10]}
                        // colSpan={3}
                        count={10}
                        rowsPerPage={10}
                        page={page}
                        slotProps={{
                          select: {
                            "aria-label": "rows per page",
                          },
                          actions: {
                            showFirstButton: true,
                            showLastButton: true,
                            slots: {
                              firstPageIcon: FirstPageRoundedIcon,
                              lastPageIcon: LastPageRoundedIcon,
                              nextPageIcon: ChevronRightRoundedIcon,
                              backPageIcon: ChevronLeftRoundedIcon,
                            },
                          },
                        }}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddLeaveModal
        isOpen={isOpenAddLeaveModal}
        onClose={() => setIsOpenAddLeaveModal(false)}
        studentId={studentId}
      />
    </StudentDetailsLayout>
  );
};

export default LeaveAttendanceDetails;
