import { useEffect, useState } from "react";
import { getUserFromToken } from "../../Utils/Auth/Auth";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";

interface DateInfo {
  date: Date;
  dateStr: string;
}

interface AttendanceState {
  [dateStr: string]: string;
}

export const Attendance: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const user = getUserFromToken();
    if (!user || user.Role != "3") {
      navigate("/login");
    }
  }, [navigate]);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [dates, setDates] = useState<DateInfo[]>([]);
  const [attendance, setAttendance] = useState<AttendanceState>({});

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const generatedDate = (month: number, year: number) => {
    const dateArray = [];
    const dayInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= dayInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dateStr = date.toISOString().split("T")[0];
      dateArray.push({ date, dateStr });
    }

    setDates(dateArray);
    setAttendance({});
  };

  const handleAttendanceChange = (dateStr: string, value: string) => {
    setAttendance((prev) => ({
      ...prev,
      [dateStr]: value,
    }));
  };

  const isToday = (date: Date): boolean => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    return normalizedDate.getTime() === today.getTime();
  };
  useEffect(() => {
    generatedDate(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  const holidays = ["2024-12-25", "2024-12-31"];
  function isWeekend(date: Date) {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  return (
    <div>
      <h4>Attendance</h4>
      <hr style={{ width: "100%", border: "3px solid black" }} />

      <Box>
        <Box sx={{display:"flex",flexDirection:{xs:"column",sm:"row",md:"row",lg:"row",xl:"row"},gap:2,alignItems:"center",justifyContent:"space-around", padding:3,border:"1px solid #cacaca"}}>
          <Box className="select-month-dropdown-div" sx={{ display: "flex",width:"100%",gap:3,alignItems:"center" }}>
            <Typography>Select Month</Typography>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {new Date(2024, i).toLocaleString("default", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>
          </Box>
          <Box  className="select-year-dropdown-div"  sx={{ display: "flex",width:"100%",gap:3,alignItems:"center" }}>
            <Typography>Select Year</Typography>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <option key={i} value={2022 + i}>
                  {2022 + i}
                </option>
              ))}
            </select>
          </Box>
        </Box>
        <Box sx={{display:"flex",alignItems:"center",justifyContent:"end", padding:3,border:"1px solid #cacaca",backgroundColor:"#e6e6e6"}}></Box>
      </Box>

      {/* Attendance Table */}
      <div className="table table-responsive">
        <table
          className="table attendance-table"
          border={1}
          style={{
            width: "100%",
            textAlign: "center",
            borderCollapse: "collapse",
            tableLayout: "fixed", // Ensure the column widths respect your styles
          }}
        >
          <thead>
            {/* Header Row: Dates */}
            <tr>
              {dates.map((dateInfo, index) => (
                <th
                  key={index}
                  style={{
                    padding: "5px",
                    width: "50px", // Set consistent width for each header cell
                    height: "50px", // Set consistent height
                  }}
                >
                  {dateInfo.date.getDate()}
                  <br />
                  {
                    dateInfo.date.toLocaleDateString("en-US", {
                      weekday: "short",
                    })[0]
                  }
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Second Row: Attendance Dropdowns */}
            <tr>
              {dates.map((dateInfo, index) => (
                <td
                  key={index}
                  className={`${
                    isToday(dateInfo.date) ? "fill-attendance-td" : ""
                  } ${isWeekend(dateInfo.date) ? "weekend-td" : ""}`}
                  style={{
                    width: "50px", // Same width as headers to align properly
                    height: "50px",
                  }}
                >
                  <select
                    className={`fill-attendance-dropdown ${
                      !isToday(dateInfo.date) ? "fill-attendance-disabled" : ""
                    }`}
                    disabled={
                      isWeekend(dateInfo.date) ||
                      holidays.includes(dateInfo.dateStr) ||
                      !isToday(dateInfo.date)
                    }
                    value={attendance[dateInfo.dateStr] || ""}
                    onChange={(e) =>
                      handleAttendanceChange(dateInfo.dateStr, e.target.value)
                    }
                    style={{
                      width: "100%", // Scale the dropdown
                      height: "100%",
                    }}
                  >
                    <option value=""></option>
                    <option value="Present" style={{ color: "green" }}>
                      P
                    </option>
                    <option value="Absent" style={{ color: "red" }}>
                      A
                    </option>
                  </select>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
