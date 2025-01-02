import { Box, Button, InputAdornment, styled, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import {
  TablePagination,
  tablePaginationClasses as classes,
} from "@mui/base/TablePagination";

import FirstPageRoundedIcon from "@mui/icons-material/FirstPageRounded";
import LastPageRoundedIcon from "@mui/icons-material/LastPageRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import {
  DeleteStudent,
  ExcelExportReport,
  getAllStudentsData,
  GetStudentDetailsById,
  PDFExportReport,
} from "../../Utils/adminUtils/allStudent's";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import LoadingGif from "../../assets/Images/Animation.gif";
import {
  AddEditStudentModal,
  DeleteModal,
  ExportReportModal,
  ViewStudentProfileModal,
} from "../../Utils/allModals/modals";
import Image from "next/image";

interface StudentDataProps {
  studentId: number;
  firstName: string;
  lastName: string;
  birthDate: Date;
  userName: string;
  courseName: string;
  courseId: number;
  email: string;
  status: boolean;
  gender: number | null;
  imageName: string;
  imageUrl: string;
}

interface PaginationProps {
  SearchQuery: string | null;
  StartIndex: number;
  PageSize: number;
}

interface PaginationResponseProps {
  students: StudentDataProps[];
  totalItems: number;
  totalPages: number;
  startIndex: number;
}

const AllStudents: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(2);
  const [studentData, setStudentData] = useState<PaginationResponseProps>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [deleteStudentId, setDeleteStudentId] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [isOpenAddEditModelOpen, setIsOpenAddEditModelOpen] =
    useState<boolean>(false);
  const [isOpenExportModal, setIsOpenExportModal] = useState<boolean>(false);
  const [editStudentId, setEditStudentId] = useState<number>(0);

  const [formData, setFormData] = useState<StudentDataProps | null>();
  const [viewStudentData, setViewStudentData] =
    useState<StudentDataProps | null>();
  const [loading, setLoading] = useState<boolean>(true);
  //  This Method is use for close delete menu
  const closeModal = () => {
    setIsModalOpen(false);
    setDeleteStudentId(0);
  };

  const openModal = (id: number) => {
    setIsModalOpen(true);
    setDeleteStudentId(id);
  };

  // This method is use for delete notice
  const handleDelete = (id: number) => {
    DeleteStudent(id);
    closeModal();
  };

  // This Method is use for Open AddStudent Model
  const openAddStudentModel = () => {
    setFormData(null);
    setIsOpenAddEditModelOpen(true);
  };

  // This method is use for Open Edit exising Student modal
  const openEditModel = async (studentId: number) => {
    setEditStudentId(studentId);
    if (studentId != 0) {
      try {
        const response = await GetStudentDetailsById(studentId);
        if (response != null) {
          setFormData(response);
        }
      } catch (error) {
        console.error("Failed to load notice data", error);
      } finally {
      }
    }

    setIsOpenAddEditModelOpen(true);
  };

  //  This Method is use for close delete menu
  const closeStudentAddEditModal = () => {
    setIsOpenAddEditModelOpen(false);
    setEditStudentId(0);
  };

  // This Method is use for Open View Profile Model
  const openViewProfileModel = async (studentId: number) => {
    if (studentId != 0) {
      try {
        const response = await GetStudentDetailsById(studentId);
        if (response != null) {
          setViewStudentData(response);
        }
      } catch (error) {
        console.error("Failed to load notice data", error);
      } finally {
      }
    }
    setIsProfileModalOpen(true);
  };

  //  This Method is use for close delete menu
  const closeViewProfileModel = () => {
    setIsProfileModalOpen(false);
  };

  //  This Method is use for close Export Modal
  const closeExportModal = () => {
    setIsOpenExportModal(false);
  };

  //  This Method is use for Open Export Modal
  const openExportModal = () => {
    setIsOpenExportModal(true);
  };

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

  const handleExcelExport = async () => {
    setLoading(true);
    try {
      await ExcelExportReport(searchQuery);
    } catch (error) {
      console.error("Error exporting report:", error);
    } finally {
      setLoading(false);
      setIsOpenExportModal(false);
    }
  };

  const handlePDFExport = async () => {
    setLoading(true);
    try {
      await PDFExportReport(searchQuery);
    } catch (error) {
      console.error("Error exporting report:", error);
    } finally {
      setLoading(false);
      setIsOpenExportModal(false);
    }
  };

  useEffect(() => {
    const getStudentsData = async () => {
      const pagination: PaginationProps = {
        PageSize: rowsPerPage,
        SearchQuery: searchQuery,
        StartIndex: page * rowsPerPage,
      };

      try {
        const result = await getAllStudentsData(pagination);
        if (result != null) {
          setStudentData(result);
        }
      } catch (error) {
        console.error("Error fetching students data:", error);
      } finally {
        setLoading(false);
      }
    };

    getStudentsData();
  }, [rowsPerPage, page, searchQuery]);

  return (
    <>
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
          <Image src={LoadingGif} alt="loading-gif" />
        </Box>
      )}
      <h1>All Students</h1>
      <Box sx={{ marginTop: 1 }}>
        <Box
        className="allstudents-search-main-box"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <TextField
              sx={{ backgroundColor: "white" }}
              size="small"
              onKeyUp={handleSearch}
              fullWidth
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
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              sx={{
                backgroundColor: "#dedede",
                fontWeight: "600",
                color: "#6d6d6d",
                borderRadius: "10px",
                border: "none",
                padding: 1,
              }}
            >
              Submit Attendance
            </Button>
            <Button
              onClick={openExportModal}
              sx={{
                backgroundColor: "#dedede",
                fontWeight: "600",
                color: "#6d6d6d",
                borderRadius: "10px",
                border: "none",
              }}
            >
              Download Report
            </Button>
            <Button
              onClick={() => openAddStudentModel()}
              sx={{
                background: "linear-gradient(45deg, #FFEB3B, #FF9800)",
                fontWeight: "600",
                color: "black",
                borderRadius: "10px",
                border: "none",
              }}
            >
              + Add Student
            </Button>
          </Box>
        </Box>
        <Box className="table-responsive" sx={{ marginTop: 3 }}>
          <table
            aria-label="custom pagination table table-responsive"
            className="student-table"
          >
            <thead>
              <tr>
                <th>StudentId</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>BirthDate</th>
                <th>Course Name</th>
                <th>UserName</th>
                <th>Email</th>
                <th>Attendance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {studentData?.students.map((row) => (
                <tr key={row.studentId}>
                  <td>{row.studentId}</td>
                  <td>{row.firstName}</td>
                  <td>{row.lastName}</td>
                  <td>
                    {new Date(row.birthDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td>{row.courseName}</td>
                  <td>{row.userName}</td>
                  <td>{row.email}</td>
                  {row.status == true ? (
                    <td className="present-td">Present</td>
                  ) : (
                    <td className="absent-td">Absent</td>
                  )}
                  <td>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        color: "grey",
                      }}
                    >
                      <RemoveRedEyeIcon
                        onClick={() => openViewProfileModel(row.studentId)}
                      />
                      <DeleteOutlineIcon
                        onClick={() => openModal(row.studentId)}
                      />
                      <ModeEditIcon
                        onClick={() => openEditModel(row.studentId)}
                      />
                      {/* <Button sx={{width:"10px"}}>
                      </Button>
                      <Button>
                      </Button>
                      <Button>
                      </Button> */}
                    </Box>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <CustomTablePagination
                  rowsPerPageOptions={[2, 10, 25, { label: "All", value: studentData?.totalItems ?? 0 }]}
                  // colSpan={3}
                  count={studentData?.totalItems ?? 0}
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
        </Box>
      </Box>
      <DeleteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onDelete={() => handleDelete(deleteStudentId)}
        text="Student"
      />

      <AddEditStudentModal
        isOpen={isOpenAddEditModelOpen}
        onClose={closeStudentAddEditModal}
        studentId={editStudentId}
        initialData={formData}
      />

      <ViewStudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeViewProfileModel}
        initialData={viewStudentData}
      />

      <ExportReportModal
        isOpen={isOpenExportModal}
        onClose={closeExportModal}
        onExcelHandle={handleExcelExport}
        onPdfHandle={handlePDFExport}
      />
    </>
  );
};

export default AllStudents;

const blue = {
  50: "#F0F7FF",
  200: "#A5D8FF",
  400: "#3399FF",
  900: "#003A75",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const CustomTablePagination = styled(TablePagination)(
  ({ theme }) => `
    & .${classes.spacer} {
      display: none;
    }
  
    & .${classes.toolbar}  {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
      padding: 4px 0;
      margin-top:25px;
      margin-bottom:25px;

      @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
      }
    }
  
    & .${classes.selectLabel} {
      margin: 0;
    }
  
    & .${classes.select}{
      font-family: 'IBM Plex Sans', sans-serif;
      padding: 2px 0 2px 4px;
      border: 1px solid ${
        theme.palette.mode === "dark" ? grey[800] : grey[200]
      };
      border-radius: 6px; 
      background-color: transparent;
      color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
      transition: all 100ms ease;
  
      &:hover {
        background-color: ${
          theme.palette.mode === "dark" ? grey[800] : grey[50]
        };
        border-color: ${theme.palette.mode === "dark" ? grey[600] : grey[300]};
      }
  
      &:focus {
        outline: 3px solid ${
          theme.palette.mode === "dark" ? blue[400] : blue[200]
        };
        border-color: ${blue[400]};
      }
    }
  
    & .${classes.displayedRows} {
      margin: 0;
  
      @media (min-width: 768px) {
        margin-left: auto;
      }
    }
  
    & .${classes.actions} {
      display: flex;
      gap: 6px;
      border: transparent;
      text-align: center;
    }
  
    & .${classes.actions} > button {
      display: flex;
      align-items: center;
      padding: 0;
      border-radius: 50%;
      background-color: transparent;
      border: 1px solid ${
        theme.palette.mode === "dark" ? grey[800] : grey[200]
      };
      color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
      transition: all 120ms ease;
  
      > svg {
        font-size: 22px;
      }
  
      &:hover {
        background-color: ${
          theme.palette.mode === "dark" ? grey[800] : grey[50]
        };
        border-color: ${theme.palette.mode === "dark" ? grey[600] : grey[300]};
      }
  
      &:focus {
        outline: 3px solid ${
          theme.palette.mode === "dark" ? blue[400] : blue[200]
        };
        border-color: ${blue[400]};
      }
  
      &:disabled {
        opacity: 0.3;
  
        &:hover {
          border: 1px solid ${
            theme.palette.mode === "dark" ? grey[800] : grey[200]
          };
          background-color: transparent;
        }
      }
    }
    `
);
