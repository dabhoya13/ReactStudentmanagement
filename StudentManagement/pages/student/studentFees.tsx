import StudentDetailsLayout from "@/components/layouts/StudentDetailsLayout/StudentDetailsLayout";
import { Box, InputAdornment, TextField } from "@mui/material";
import { CalendarIcon } from "@mui/x-date-pickers";
import DatePicker from "react-datepicker";
import SearchIcon from "@mui/icons-material/Search";
import { CustomTablePagination } from "../admin/allStudents";
import FirstPageRoundedIcon from "@mui/icons-material/FirstPageRounded";
import LastPageRoundedIcon from "@mui/icons-material/LastPageRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useState } from "react";

const StudentFees: React.FC = () => {
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(2);

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

  return (
    <StudentDetailsLayout>
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
          <h4 className="mb-4">Fees</h4>
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
        <div className="card-body p-0 py-3">
          <Box className="mb-3 pe-3 w-100 d-flex align-items-center justify-content-end">
            <TextField
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
          </Box>
          <div className="table-responsive">
            <table className="table student-fees-table">
              <thead>
                <tr>
                  <th>Fees Group</th>
                  <th>Fees Code</th>
                  <th>Due Date</th>
                  <th>Amount $</th>
                  <th>Status</th>
                  <th>Ref Id</th>
                  <th>Model</th>
                  <th>Date Paid</th>
                  <th>Fine ($)</th>
                </tr>
              </thead>
              <tbody></tbody>
              <tfoot>
                <tr>
                  <CustomTablePagination
                    rowsPerPageOptions={[
                      2,
                      10,
                      25,
                      { label: "All", value: 10 },
                    ]}
                    // colSpan={3}
                    count={10}
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
    </StudentDetailsLayout>
  );
};

export default StudentFees;
