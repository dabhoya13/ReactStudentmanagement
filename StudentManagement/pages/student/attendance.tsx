import { useEffect, useState } from "react";
import { getUserFromToken } from "../../utils/auth/auth";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import {
  AddTodayAttendance,
  GetAttendanceDetails,
} from "@/utils/studentUtils/attendance's";

import style from "../../styles/attendance.module.css";
interface DateInfo {
  date: Date;
  dateStr: string;
  Status: boolean;
}

interface AttendanceState {
  [dateStr: string]: string;
}

interface SubmittedAttendance {
  [dateStr: string]: boolean;
}

interface AttendanceProps {
  attendanceId: number | null;
  studentId: number;
  status: boolean;
  date: Date;
  isSubmitted: boolean;
}

interface SelectedColorsMap {
  [key: string]: string;
}
interface SelectedBackgroundColorsMap {
  [key: string]: string;
}

const Attendance: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    const user = getUserFromToken();
    if (!user || user.Role != "3") {
      router.replace("/login");
    }
  }, [router]);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [dates, setDates] = useState<DateInfo[]>([]);
  const [attendance, setAttendance] = useState<AttendanceState>({});
  const [submittedAttendance, setSubmittedAttendance] =
    useState<SubmittedAttendance>({});

  const [showButton, setShowButton] = useState(false);
  const [selectedColors, setSelectedColors] = useState<SelectedColorsMap>({});
  const [selectedBackColors, setSelectedBackColors] =
    useState<SelectedBackgroundColorsMap>({});

  const [fillAttendanceText, setFillAttendanceText] = useState<string>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const generatedDate = async (month: number, year: number) => {
    const dateArray = [];
    const dayInMonth = new Date(year, month, 0).getDate();
    for (let day = 1; day <= dayInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dateStr = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      dateArray.push({ date, dateStr });
    }

    var studentId = parseInt(sessionStorage.getItem("UserId") ?? "0", 10);
    const attendanceDetails: AttendanceProps[] = await GetAttendanceDetails(
      month,
      year,
      studentId
    );
    const attendanceMap: AttendanceState = {};
    const submittedAttendance: SubmittedAttendance = {};
    attendanceDetails.forEach((record) => {
      const recordDate = new Date(record.date);
      const dateStr = `${recordDate.getFullYear()}-${String(
        recordDate.getMonth() + 1
      ).padStart(2, "0")}-${String(recordDate.getDate()).padStart(2, "0")}`;
      attendanceMap[dateStr] = record.status ? "1" : "0";
      submittedAttendance[dateStr] = record.isSubmitted;
      const color = record.status
        ? "#8ad282"
        : record.status === false
        ? "red"
        : "black";
      const backColor = record.status
        ? "white"
        : record.status === false
        ? "#dde0f6"
        : "transparant";

      setSelectedColors((prev) => ({
        ...prev,
        [dateStr]: color,
      }));

      setSelectedBackColors((prev) => ({
        ...prev,
        [dateStr]: backColor,
      }));
    });

    const updatedDate = dateArray.map((dateinfo) => ({
      ...dateinfo,
      Status: attendanceMap[dateinfo.dateStr] === "1",
    }));

    setDates(updatedDate);
    setAttendance(attendanceMap);
    setSubmittedAttendance(submittedAttendance);
    var todayDate = new Date();
    const dateStr = `${todayDate.getFullYear()}-${String(
      todayDate.getMonth() + 1
    ).padStart(2, "0")}-${String(todayDate.getDate()).padStart(2, "0")}`;
    if (submittedAttendance[dateStr]) {
      setShowButton(false);
      setFillAttendanceText(
        "Today's attendance has been submitted by your HOD. Please contact him/her now in case of any corrections"
      );
    } else {
      setShowButton(attendanceMap[dateStr] != null);
    }
  };

  const handleAttendanceChange = (dateStr: string, value: string) => {
    const color = value === "0" ? "red" : value === "1" ? "green" : "black";
    setSelectedColors((prev) => ({
      ...prev,
      [dateStr]: color,
    }));
    const updatedAttendance = { ...attendance, [dateStr]: value };
    setAttendance(updatedAttendance);

    const anySelected = Object.values(updatedAttendance).some(
      (val) => val === "1" || val === "0"
    );
    if (value === "") {
      setShowButton(false);
    } else {
      setShowButton(anySelected);
    }
  };

  const submitAttendance = async () => {
    var studentId = parseInt(sessionStorage.getItem("UserId") ?? "0", 10);
    if (studentId != 0) {
      var todayDate = new Date();
      const dateStr = `${todayDate.getFullYear()}-${String(
        todayDate.getMonth() + 1
      ).padStart(2, "0")}-${String(todayDate.getDate()).padStart(2, "0")}`;

      if (submittedAttendance[dateStr]) {
        setFillAttendanceText(
          "Today's attendance has been submitted by your HOD. Please contact him/her now in case of any corrections"
        );
      } else {
        var attendanceProps: AttendanceProps = {
          date: todayDate,
          status: attendance[dateStr] == "1" ? true : false,
          studentId: studentId,
          attendanceId: null,
          isSubmitted: false,
        };

        var response = await AddTodayAttendance(attendanceProps);
        if (response.isSuccess == true) {
          setFillAttendanceText("Attendance Filled Successfully");
        }
      }
    } else {
      router.replace("/");
    }
  };

  const isToday = (date: Date): boolean => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    return normalizedDate.getTime() === today.getTime();
  };
  useEffect(() => {
    generatedDate(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  const holidays = ["2024-12-25"];
  function isWeekend(date: Date) {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  return (
    <div>
      <h2>Attendance</h2>
      <hr style={{ width: "100%", border: "3px solid black" }} />

      <Box>
        <Box
          className={style.Attedance_dropdown_box}
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
              // md: "row",
              // lg: "row",
              // xl: "row",
            },
          }}
        >
          <Box className={style.select_month_dropdown_div}>
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
          <Box className={style.select_year_dropdown_div}>
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
        <Box sx={{ marginTop: 5, color: "green" }}>{fillAttendanceText}</Box>
        <Box className={style.attendance_table_header}
        >
          {new Date(selectedYear,selectedMonth-1).toLocaleDateString('default',{month:"long"})}-{selectedYear}
        </Box>
      </Box>

      {/* Attendance Table */}
      <div className="table-responsive">
        <table className={`table ${style.attendance_table}`} border={1}>
          <thead>
            {/* Header Row: Dates */}
            <tr>
              {dates.map((dateInfo, index) => (
                <th key={index}>
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
                    isToday(dateInfo.date) ? style.fill_attendance_td : ""
                  } ${isWeekend(dateInfo.date) ? style.weekend_td : ""} ${
                    holidays.includes(dateInfo.dateStr) ? style.holiday_td : ""
                  }`}
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: selectedBackColors[dateInfo.dateStr],
                  }}
                >
                  <select
                    className={`${style.fill_attendance_dropdown} ${
                      !isToday(dateInfo.date)
                        ? style.fill_attendance_disabled
                        : ""
                    } ${
                      holidays.includes(dateInfo.date.toDateString())
                        ? style.fill_attendance_disabled
                        : ""
                    }`}
                    disabled={
                      isWeekend(dateInfo.date) ||
                      holidays.includes(dateInfo.dateStr) ||
                      !isToday(dateInfo.date) ||
                      submittedAttendance[dateInfo.dateStr]
                    }
                    value={attendance[dateInfo.dateStr] || ""}
                    onChange={(e) =>
                      handleAttendanceChange(dateInfo.dateStr, e.target.value)
                    }
                    style={{
                      width: "100%", // Scale the dropdown
                      height: "100%",
                      fontWeight: "bold",
                      color: selectedColors[dateInfo.dateStr] || "black",
                    }}
                  >
                    <option value=""></option>
                    <option value="1" style={{ color: "#76be6e" }}>
                      P
                    </option>
                    <option value="0" style={{ color: "red" }}>
                      A
                    </option>
                  </select>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      {showButton && (
        <Box className={style.fill_attendance_btn_div}>
          <Button
            className={style.fill_attendance_btn}
            onClick={submitAttendance}
          >
            Fill Attendance
          </Button>
        </Box>
      )}
    </div>
  );
};

export default Attendance;
