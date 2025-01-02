import {
  Box,
  Button,
  Card,
  CardContent,
  Grid2,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LoadingGif from "../../public/Images/Animation.gif";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import { valueFormatter } from "@/utils/PieCharts";
import { BarChart, PieChart } from "@mui/x-charts";
import {
  CalendarIcon,
  DateCalendar,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { format, isToday } from "date-fns";
import ScheduleIcon from "@mui/icons-material/Schedule";
import EventIcon from "@mui/icons-material/Event";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import demoImage from "../../public/Images/profile-image.jpg";
import BlockIcon from "@mui/icons-material/Block";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Image from "next/image";
import style from "../../styles/studentDashboard.module.css";
import { EmailOutlined, MessageOutlined } from "@mui/icons-material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Chart from "chart.js/auto";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  GetAttendanceData,
  GetLast7DaysAttendance,
  GetLeaveStatus,
  GetStudentExams,
  Last7DaysAttendaceProps,
  StudentAttendanceCountProps,
  StudentExamProps,
  StudentsLeave,
} from "@/utils/studentUtils/studentDashboard's";
import { Value } from "react-calendar/dist/esm/shared/types.js";
const settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: true,
  centerMode: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const labels = ["Math", "Phy", "Che", "Eng", "sci"];
const examData = {
  labels: labels,
  datasets: [
    {
      label: "1st Quaters",
      data: [65, 59, 80, 81, 89],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(255, 159, 64, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 25, 64, 0.2)",
      ],
      borderColor: [
        "rgb(255, 99, 132)",
        "rgb(255, 159, 64)",
        "rgb(54, 162, 235)",
        "rgb(153, 102, 255)",
        "rgb(255, 25, 64)",
      ],
      borderWidth: 1,
      barThickness: 35, // Adjust the value to set your desired width
      maxBarThickness: 35,
    },
  ],
};

const attendanceData = {
  labels: ["Absent", "Present"],
  datasets: [
    {
      label: "Attendance",
      data: [12, 10],
      backgroundColor: ["#e82646", "#21c01e"],
      hoverOffset: 4,
    },
  ],
};

const leaveStatusMap: {
  [key: number]: { text: string; backgroundColor: string };
} = {
  1: {
    text: "• Pending",
    backgroundColor: "#06c3fb",
  },
  2: {
    text: "• Accepted",
    backgroundColor: "#1abe17",
  },
  3: {
    text: "• Declineed",
    backgroundColor: "#ea4a6c",
  },
};

const currentDate = dayjs();
const sevenDaysAgo = dayjs().subtract(6, "days");

// Format the dates in "DD MMM YYYY" format
const formattedCurrentDate = currentDate.format("DD MMM YYYY");
const formattedSevenDaysAgo = sevenDaysAgo.format("DD MMM YYYY");

interface LeaveStatusProps {
  status: number;
}

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

// Reusable component for displaying leave status
const LeaveStatus: React.FC<LeaveStatusProps> = ({ status }) => {
  const currentStatus = leaveStatusMap[status] || {};
  return (
    <Box
      className={style.leave_Status}
      sx={{ backgroundColor: currentStatus.backgroundColor }}
    >
      {currentStatus.text}
    </Box>
  );
};

const StudentDashboard: React.FC = () => {
  const router = useRouter();
  const handleLogout = () => {
    sessionStorage.clear();
    router.replace("/login");
  };
  const radius = 50;
  const [isClientSode, setIsClientSide] = useState<boolean>(false);
  const [value, setValue] = React.useState<Dayjs | null>(dayjs("2024-11-20"));
  const [loading, setLoading] = useState<Boolean>(false);
  const [leaveStatusData, setLeaveStatusData] = useState<StudentsLeave[]>();
  const [studentExamData, setStudentExamData] = useState<StudentExamProps[]>();

  const [studentAttendanceCount, setStudentAttendanceCount] =
    useState<StudentAttendanceCountProps>();

  const [leaveStatusstartDate, setLeaveStatusStartDate] = useState<Date | null>(
    new Date()
  );
  const [AttendancestartDate, setAttendanceStartDate] = useState<Date | null>(
    new Date()
  );
  const [Last7DaysAttendance, setLast7DaysAttendance] =
    useState<Last7DaysAttendaceProps[]>();
  const [examDate, setExamDate] = useState<Date | null>();
  const sliderRef = useRef<Slider>(null);
  const [attendanceChartInstance, setAttendanceChartInstance] =
    useState<Chart | null>(null);

  const handlePrev = () => {
    sliderRef.current?.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current?.slickNext(); // Go to next slide
  };

  const getLeaveBackgroundColor = (leaveReason: String) => {
    if (leaveReason === "Emergency Leave" || leaveReason === "Fever") {
      return "#fde9ed";
    }
    return "#e7f1fc";
  };

  const getLeaveIconColor = (leaveReason: String) => {
    if (leaveReason === "Emergency Leave" || leaveReason === "Fever") {
      return "red";
    }
    return "#84a4e1";
  };

  // Handle decreasing the month (left arrow)
  const handleDecreaseMonth = () => {
    const newDate = new Date(AttendancestartDate ?? "");
    const currentMonth = newDate.getMonth();

    if (currentMonth === 0) {
      newDate.setFullYear(newDate.getFullYear() - 1);
      newDate.setMonth(11);
    } else {
      newDate.setMonth(currentMonth - 1);
    }

    setAttendanceStartDate(newDate);
  };

  // Handle increasing the month (right arrow)
  const handleIncreaseMonth = () => {
    const newDate = new Date(AttendancestartDate ?? "");
    const currentMonth = newDate.getMonth();

    if (currentMonth === 11) {
      newDate.setFullYear(newDate.getFullYear() + 1);
      newDate.setMonth(0);
    } else {
      newDate.setMonth(currentMonth + 1);
    }

    setAttendanceStartDate(newDate);
  };

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  useEffect(() => {
    if (isClientSode) {
      if (studentAttendanceCount) {
        const { totalPresent, totalAbsent } = studentAttendanceCount;
        attendanceData.datasets[0].data = [totalAbsent, totalPresent];

        const attendanceChartElement = document.getElementById(
          "attendanceChart"
        ) as HTMLCanvasElement | null;
        if (attendanceChartElement) {
          if (attendanceChartInstance) {
            attendanceChartInstance.destroy();
          }

          const attendanceChart = new Chart(attendanceChartElement, {
            type: "doughnut",
            data: attendanceData,
            options: {
              responsive: false,
              animation: {
                animateRotate: true,
              },
              radius: "80%",
              plugins: {
                legend: {
                  position: "bottom", // You can adjust legend position if needed
                },
              },
            },
          });

          setAttendanceChartInstance(attendanceChart);
        } else {
          console.error("Chart element not found.");
        }
      }
    }
  }, [studentAttendanceCount]);

  useEffect(() => {
    if (isClientSode) {
      var examChartElement = document.getElementById(
        "examResultChart"
      ) as HTMLCanvasElement | null;
      if (examChartElement) {
        var mychart1 = new Chart(examChartElement, {
          type: "bar",
          data: examData,
          options: {
            responsive: true,

            scales: {
              x: {
                stacked: true,
                grid: {
                  display: false, // Hide grid lines for y-axis
                },
              },
              y: {
                grid: {
                  display: false, // Hide grid lines for y-axis
                },
                stacked: true,
              },
            },
          },
        });
      } else {
        console.error("Chart element not found.");
      }

      var performanceChartElement = document.getElementById(
        "performanceChart"
      ) as HTMLCanvasElement | null;
      if (performanceChartElement) {
        const ctx = (
          document.getElementById("performanceChart") as HTMLCanvasElement
        ).getContext("2d");
        let examScoreGradient;
        let attendanceGradient;
        if (ctx != null) {
          examScoreGradient = ctx.createLinearGradient(0, 0, 0, 400);
          examScoreGradient.addColorStop(0, "rgba(61, 94, 225, 1)");
          examScoreGradient.addColorStop(0.5, "rgba(184, 216, 237, 0.5)");
          examScoreGradient.addColorStop(1, "rgba(245, 245, 245, 0.77)");
          attendanceGradient = ctx.createLinearGradient(0, 0, 0, 400);
          attendanceGradient.addColorStop(0, "rgb(185, 223, 228)");
          attendanceGradient.addColorStop(0.5, "rgba(240, 247, 248, 0.73)");
          attendanceGradient.addColorStop(1, "rgba(245, 245, 245, 0.77)");
        }

        var myChart3 = new Chart(performanceChartElement, {
          type: "line",
          data: {
            labels: ["Quarter 1", "Quarter 2", "Half Yearly", "Model", "Final"],
            datasets: [
              {
                label: "Avg Exam Score",
                data: [75, 85, 96, 85, 93],
                borderWidth: 2,
                fill: true,
                borderColor: "#3d5ee1",
                backgroundColor: examScoreGradient,
                pointBackgroundColor: "#3d5ee1",
                tension: 0.1,
                pointRadius: 5,
              },
              {
                label: "Avg Attendance",
                data: [65, 45, 56, 55, 33],
                borderWidth: 2,
                fill: true,
                borderColor: "#89d5df",
                backgroundColor: attendanceGradient,
                pointBackgroundColor: "#89d5df",
                tension: 0.1,
                pointRadius: 5,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                stacked: true,
                beginAtZero: true,
                ticks: {
                  padding: 10, // Adjusts the space between the Y-axis and the chart data
                },
              },
            },
            plugins: {
              legend: {
                position: "bottom", // This moves the legend to the bottom of the chart
                labels: {
                  boxWidth: 20, // Adjust the width of the legend boxes
                  padding: 15, // Add padding between the legend items
                },
              },
            },
          },
        });
      } else {
        console.error("Chart element not found.");
      }
    }
  }, [isClientSode]);

  useEffect(() => {
    const getLeaveStatusFromStudentId = async () => {
      var studentId = parseInt(sessionStorage.getItem("UserId") ?? "0", 10);
      var leavesMonth = new Date().getMonth() + 1;
      if (leaveStatusstartDate?.getMonth() != null) {
        leavesMonth = leaveStatusstartDate?.getMonth() + 1;
      }
      var leavesYear =
        leaveStatusstartDate?.getFullYear() ?? new Date().getFullYear();
      const leaveStatus: StudentsLeave[] = await GetLeaveStatus(
        studentId,
        leavesMonth,
        leavesYear
      );
      if (leaveStatus.length > 0) {
        setLeaveStatusData(leaveStatus);
      }
    };

    getLeaveStatusFromStudentId();
  }, [leaveStatusstartDate]);

  useEffect(() => {
    const getAttendanceCountFromStudentId = async () => {
      var studentId = parseInt(sessionStorage.getItem("UserId") ?? "0", 10);
      var attendanceMonth = new Date().getMonth() + 1;
      if (AttendancestartDate?.getMonth() != null) {
        attendanceMonth = AttendancestartDate?.getMonth() + 1;
      }
      var attendanceYear =
        AttendancestartDate?.getFullYear() ?? new Date().getFullYear();
      const attendanceCount: StudentAttendanceCountProps | null =
        await GetAttendanceData(studentId, attendanceMonth, attendanceYear);
      console.log(attendanceCount);
      if (attendanceCount != null) {
        setStudentAttendanceCount(attendanceCount);
      }
    };

    getAttendanceCountFromStudentId();
  }, [AttendancestartDate]);

  useEffect(() => {
    const getLast7DaysAttendance = async () => {
      var studentId = parseInt(sessionStorage.getItem("UserId") ?? "0", 10);
      var endDate = new Date();
      var startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 6);
      var last7DaysAttendance: Last7DaysAttendaceProps[] =
        await GetLast7DaysAttendance(studentId, startDate, endDate);
      console.log(last7DaysAttendance);
      setLast7DaysAttendance(last7DaysAttendance);
    };
    getLast7DaysAttendance();
  }, []);

  useEffect(() => {
    const getStudentExamsFromDateandId = async () => {
      var studentId = parseInt(sessionStorage.getItem("UserId") ?? "0", 10);
      const studentExams: StudentExamProps[] = await GetStudentExams(
        studentId,
        examDate ?? null
      );
      setStudentExamData(studentExams);
    };

    getStudentExamsFromDateandId();
  }, [examDate]);

  function convertTo12HourFormat(time: string): string {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));

    // Format the date to 12-hour format with AM/PM
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleTimeString([], options);
  }

  const card = (
    <React.Fragment>
      <CardContent className="dashboard-card-content">
        <Box className="card-content-main-box">
          <Box
            className="card-content-icon-div"
            sx={{
              backgroundColor: "#3d5ee1",
            }}
          >
            <AssuredWorkloadIcon sx={{ color: "white" }} />
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography className="total-text">Pay Fees</Typography>
        </Box>
      </CardContent>
    </React.Fragment>
  );

  const card2 = (
    <React.Fragment>
      <CardContent className="dashboard-card-content">
        <Box className="card-content-main-box">
          <Box
            className="card-content-icon-div"
            sx={{
              backgroundColor: "#3fc83d",
            }}
          >
            <LibraryBooksIcon sx={{ color: "white" }} />
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography className="total-text">Exam Result</Typography>
        </Box>
      </CardContent>
    </React.Fragment>
  );

  const card3 = (
    <React.Fragment>
      <CardContent className="dashboard-card-content">
        <Box className="card-content-main-box">
          <Box
            className="card-content-icon-div"
            sx={{
              backgroundColor: "#eab300",
            }}
          >
            <CalendarMonthIcon sx={{ color: "white" }} />
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography className="total-text">Calendar</Typography>
        </Box>
      </CardContent>
    </React.Fragment>
  );

  const card4 = (
    <React.Fragment>
      <CardContent className="dashboard-card-content">
        <Box className="card-content-main-box">
          <Box
            className="card-content-icon-div"
            sx={{
              backgroundColor: "#202c4b",
            }}
          >
            <EditCalendarIcon sx={{ color: "white" }} />
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography className="total-text">Attendance</Typography>
        </Box>
      </CardContent>
    </React.Fragment>
  );

  return (
    <>
      {loading && (
        <Box className="loading-spinner">
          <img src={LoadingGif.src} alt="loading-gif" />
        </Box>
      )}
      {/* BOX FOR ALL CARDS */}

      <div className="d-flex row">
        <div className="col-xxl-8">
          <div className="row flex-fill">
            <div className="col-xl-6">
              <div className="flex-fill">
                <Box className={style.profile_main_div}>
                  <Box>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Image
                        src={demoImage.src}
                        alt="profile-pic"
                        width={100}
                        height={100}
                      />
                      <Box>
                        <Typography className={style.studentid_typography}>
                          #123456B
                        </Typography>
                        <Typography className={style.student_name_typography}>
                          Kishan Dabhoya
                        </Typography>
                        <Typography sx={{ color: "lightgrey" }}>
                          Class: |||,C | Roll No : 35645
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      className={style.profile_dotted_line}
                    ></Typography>
                    <Box className={style.edit_btn_main_box}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Typography sx={{ color: "white" }}>
                          1st Quarterly
                        </Typography>
                        <Typography
                          className={style.pass_typography}
                          sx={{
                            backgroundColor: "#29bf17",
                          }}
                        >
                          {" "}
                          Pass
                        </Typography>
                      </Box>
                      <Button className={style.edit_profile_btn}>
                        Edit Profile
                      </Button>
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    marginTop: 3,
                    backgroundColor: "white",
                    paddingBottom: 2,
                  }}
                >
                  <Box className={style.leave_status_header}>
                    <Typography className={style.leave_status_heading}>
                      Leave Status
                    </Typography>
                    <Box
                      className="leave_status_calendar_div"
                      sx={{
                        display: "flex",
                        gap: 1,
                        width: "100px",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <DatePicker
                        selected={leaveStatusstartDate}
                        onChange={(date: Date | null) =>
                          setLeaveStatusStartDate(date)
                        }
                        dateFormat="MM/yyyy" // Display only month and year
                        showMonthYearPicker // Show only month and year picker
                        dropdownMode="select"
                      />
                      <CalendarIcon />
                    </Box>
                  </Box>
                  <Typography
                    className={style.header_bottomline_typography}
                  ></Typography>
                  <Box
                    sx={{
                      overflowY: "auto",
                      minHeight: "270px",
                      maxHeight: "270px",
                      marginTop: 1,
                    }}
                  >
                    {leaveStatusData?.map((leaveStatus) => (
                      <Box sx={{ marginTop: 1, padding: 1 }}>
                        <Box className={style.leave_inner_box}>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Box
                              className={style.leave_inner_content_icon}
                              sx={{
                                backgroundColor: getLeaveBackgroundColor(
                                  leaveStatus.leaveReason
                                ),
                              }}
                            >
                              <BlockIcon
                                sx={{
                                  color: getLeaveIconColor(
                                    leaveStatus.leaveReason
                                  ),
                                  fontSize: "15px",
                                }}
                              />
                            </Box>
                            <Box>
                              <h6>{leaveStatus.leaveReason}</h6>
                              <Typography
                                sx={{ fontSize: "15px", color: "grey" }}
                              >
                                Date:{" "}
                                {formatDate(new Date(leaveStatus.leaveDate))}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <LeaveStatus status={leaveStatus.leaveStatus} />
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </div>
            </div>
            <div className="col-xl-6 pie-chart-main-div">
              <Box className="card flex-fill pie-chart-container ">
                <Box className="student-attedance-chart-header pb-2">
                  <h5>Attendance</h5>
                  <Box className="student-attedance-chart-header-inner-box">
                    <ArrowCircleLeftIcon onClick={handleDecreaseMonth} />
                    <DatePicker
                      selected={AttendancestartDate}
                      onChange={(date: Date | null) =>
                        setAttendanceStartDate(date)
                      }
                      dateFormat="MM/yyyy" // Display only month and year
                      showMonthYearPicker // Show only month and year picker
                      dropdownMode="select"
                    />
                    <ArrowCircleRightIcon onClick={handleIncreaseMonth} />
                  </Box>
                </Box>

                <Box className={style.attendance_chart_present_absent_div}>
                  <Box className="absent-present-div">
                    <Typography>Present</Typography>
                    <Typography>
                      {studentAttendanceCount?.totalPresent}
                    </Typography>
                  </Box>
                  <Box className="absent-present-div">
                    <Typography>Absent</Typography>
                    <Typography>
                      {studentAttendanceCount?.totalAbsent}
                    </Typography>
                  </Box>
                </Box>
                <span className="pie-chart-count">
                  {studentAttendanceCount?.totalAbsentPresent}
                </span>
                {/* <PieChart
                  colors={["red", "#3fc83d"]}
                  className="pie-chart"
                  height={255}
                  width={200}
                  series={[
                    {
                      data: pieData,
                      innerRadius: radius,
                      valueFormatter,
                    },
                  ]}
                  margin={{ left: 20, right: 20, bottom: 0, top: -20 }}
                  slotProps={{
                    legend: {
                      itemMarkHeight: 10,
                      itemMarkWidth: 10,
                      direction: "row",
                      // itemGap: 100,
                      itemGap: 20,
                      position: { vertical: "bottom", horizontal: "right" },
                      // padding: -80,
                    },
                  }}
                  skipAnimation={false}
                /> */}
                {studentAttendanceCount?.totalAbsentPresent ?? 0 > 0 ? (
                  <Box>
                    <canvas id="attendanceChart"></canvas>
                  </Box>
                ) : (
                  <Box sx={{ position: "relative" }}>
                    <canvas id="attendanceChart"></canvas>
                    <Typography
                      sx={{
                        position: "absolute",
                        top: "80px",
                        left: "100px",
                      }}
                    >
                      No Data Found
                    </Typography>
                  </Box>
                )}

                <Box className={style.attendance_last7days_main_div}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <h5>Last 7 Days</h5>
                    <Typography sx={{ color: "grey", fontSize: 13 }}>
                      {formattedSevenDaysAgo} - {formattedCurrentDate}
                    </Typography>
                  </Box>
                  <Box sx={{ marginTop: 1, display: "flex", gap: 1 }}>
                    {Last7DaysAttendance?.map((attendance) => (
                      <Box
                        className={style.attendance_last7days_weeks}
                        sx={{
                          backgroundColor:
                            attendance.status == 1
                              ? "#1abe17"
                              : attendance.status == 0
                              ? "#e82646"
                              : "white",
                          color: attendance.status === null ? "black" : "white",
                        }}
                      >
                        {attendance.weekDay}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </div>
            <div className="col-xl-12 d-flex">
              <Box sx={{ flexGrow: 1, marginTop: 3 }}>
                <Grid2 container spacing={2}>
                  {/* Card 1 */}
                  <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
                    <Card
                      className="studentDashboard-cards"
                      variant="outlined"
                      sx={{
                        borderRadius: "15px",
                        borderBottom: "2px solid #3d5ee1",
                        // border: "none",
                        boxShadow: "0 0 2px rgba(33,33,33,.2)",
                      }}
                    >
                      {card}
                    </Card>
                  </Grid2>
                  {/* Card 2 */}
                  <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
                    <Card
                      className="studentDashboard-cards"
                      variant="outlined"
                      sx={{
                        borderRadius: "15px",
                        borderBottom: "2px solid #3fc83d",

                        boxShadow: "0 0 2px rgba(33,33,33,.2)",
                      }}
                    >
                      {card2}
                    </Card>
                  </Grid2>
                  {/* Card 3 */}
                  <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
                    <Card
                      className="studentDashboard-cards"
                      variant="outlined"
                      sx={{
                        borderRadius: "15px",
                        borderBottom: "2px solid #eab300",

                        boxShadow: "0 0 2px rgba(33,33,33,.2)",
                      }}
                    >
                      {card3}
                    </Card>
                  </Grid2>
                  {/* Card 4 */}
                  <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
                    <Card
                      className="studentDashboard-cards"
                      variant="outlined"
                      sx={{
                        borderRadius: "15px",
                        borderBottom: "2px solid #202c4b",

                        boxShadow: "0 0 2px rgba(33,33,33,.2)",
                      }}
                    >
                      {card4}
                    </Card>
                  </Grid2>
                </Grid2>
              </Box>
            </div>
          </div>
        </div>
        <div className="col-xxl-4 card flex-fill student-event-calender-div">
          <Box className=" event-calender-box">
            <h5 className="mt-2">Exam Calender</h5>
            <button
              style={{
                backgroundColor: "transparent",
                border: "none",
                marginRight: "10px",
              }}
            >
              <MoreHorizIcon sx={{ fontSize: "20px" }} />
            </button>
          </Box>
          <Box className="event-calender-inner-div">
            {isClientSode && (
              // <LocalizationProvider dateAdapter={AdapterDayjs}>
              //   <DateCalendar
              //     sx={{ width: "100%", maxWidth: "100%" }}
              //     value={value}
              //     onChange={(newValue) => setValue(newValue)}
              //   />
              // </LocalizationProvider>
              <Calendar
                className={style.calendar}
                value={examDate}
                onChange={(
                  newValue: Value,
                  event: React.MouseEvent<HTMLButtonElement>
                ) => {
                  if (newValue instanceof Date) {
                    setExamDate(newValue);
                  }
                }}
              />
            )}
          </Box>
          <h5 className="ms-2 mt-2">Exams</h5>
          <Box sx={{ marginTop: 1 }} className={style.exam_details_main_div}>
            {!studentExamData || studentExamData.length === 0 ? (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography>
                  No exam found
                </Typography>
              </Box>
            ) : (
              studentExamData.map((exam) => (
                <Box className="exam-content-inner-div-1" key={exam.examId}>
                  <Box className="exam-inner-content-header">
                    <Typography sx={{ fontSize: 18, fontWeight: "500" }}>
                      {exam.examType}
                    </Typography>
                    <Typography className="days-more-left">
                      <ScheduleIcon sx={{ fontSize: "12px" }} />{" "}
                      {exam.remainingDays} days more
                    </Typography>
                  </Box>
                  <Box className="exam-content-inner-div-2">
                    <Typography sx={{ fontSize: 20, fontWeight: "500" }}>
                      {exam.subjectName}
                    </Typography>
                    <Box>
                      <EventIcon sx={{ fontSize: "20px" }} />{" "}
                      {new Date(exam.examDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </Box>
                  </Box>
                  <Box className="exam-content-inner-div-2">
                    <Typography sx={{ fontSize: 15, fontWeight: "500" }}>
                      <ScheduleIcon /> {convertTo12HourFormat(exam.startTime)} -{" "}
                      {convertTo12HourFormat(exam.endTime)}
                    </Typography>
                    <Typography>Room No. {exam.RoomNo}</Typography>
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </div>
      </div>

      <div className="d-flex row mt-4">
        <div className="col-xxl-7 d-flex">
          <div className="card flex-fill bg-white">
            <Box className={style.leave_status_header}>
              <h5 className={style.leave_status_heading}>Performance</h5>
              <Box sx={{ display: "flex", gap: 1, color: "grey" }}>
                <CalendarIcon />
                <select className={style.leave_status_dropdown}>
                  <option>2024-2025</option>
                </select>
              </Box>
            </Box>
            <Typography
              className={style.header_bottomline_typography}
            ></Typography>
            <Box sx={{ padding: 2 }}>
              <canvas
                height={355}
                style={{ width: "100%", height: "100%" }}
                id="performanceChart"
              ></canvas>
            </Box>
          </div>
        </div>
        <div className="col-xxl-5 d-flex">
          <div className="card flex-fill bg-white">
            <Box className={style.leave_status_header}>
              <h5 className={style.leave_status_heading}>Todo</h5>
              <Box sx={{ display: "flex", gap: 1, color: "grey" }}>
                <CalendarIcon />
                <select className={style.leave_status_dropdown}>
                  <option>This Week</option>
                  <option>Today</option>
                  <option>This Month</option>
                </select>
              </Box>
            </Box>
            <Typography
              className={style.header_bottomline_typography}
            ></Typography>
            <Box sx={{ padding: 2, maxHeight: "355px", overflowY: "auto" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", gap: 1 }}>
                  <input type="checkbox" />
                  <Box>
                    <h6>Send reminder for homework</h6>
                    <Typography
                      sx={{
                        color: "gray",
                        fontSize: "0.8em",
                        margin: 0,
                        padding: 0,
                      }}
                    >
                      01:00 PM
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    paddingRight: 1,
                    paddingLeft: 1,
                    borderRadius: "5px",
                    backgroundColor: "rgba(26, 190, 23, 0.1)",
                    color: "#1ABE17",
                    fontWeight: "600",
                    fontSize: "15px",
                  }}
                >
                  Completed
                </Box>
              </Box>
            </Box>
          </div>
        </div>
      </div>
      <div className={style.faculties_main_div}>
        <div className={style.faculties_header_div}>
          <h5>Class Faculties</h5>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Box className={style.faculties_crousel_btns} onClick={handlePrev}>
              <ChevronLeftIcon />
            </Box>
            <Box className={style.faculties_crousel_btns} onClick={handleNext}>
              <ChevronRightIcon />
            </Box>
          </Box>
        </div>
        <Typography className={style.header_bottomline_typography}></Typography>
        <Box className={style.slider_main_div}>
          <Slider ref={sliderRef} className={style.slider} {...settings}>
            {[...Array(6)].map((_, index) => (
              <Box className={style.slider_box} key={index}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <img
                    src={demoImage.src}
                    alt="demoImage"
                    style={{ width: "2.813rem", height: "2.813rem" }}
                  />
                  <Box>
                    <h6 style={{ marginBottom: "0.2rem" }}>Daniel Josua</h6>
                    <span style={{ color: "grey" }}>Spanish</span>
                  </Box>
                </Box>
                <Box
                  className={style.btn_container}
                  sx={{ display: "flex", marginTop: 2, flexWrap: "wrap" }}
                >
                  <a
                    style={{ border: "1px solid rgba(110, 102, 102, 0.2)" }}
                    className={`${style.btn} btn bg-white w-50 d-flex align-items-center justify-content-center fw-semibold fs-12`}
                  >
                    <EmailOutlined sx={{ marginRight: 1, fontSize: "15px" }} />
                    Email
                  </a>
                  <a
                    style={{ border: "1px solid rgba(110, 102, 102, 0.2)" }}
                    className={`${style.btn} btn bg-white w-50 d-flex align-items-center justify-content-center fw-semibold fs-12`}
                  >
                    <MessageOutlined
                      sx={{ marginRight: 1, fontSize: "15px" }}
                    />
                    Chat
                  </a>
                </Box>
              </Box>
            ))}
          </Slider>
        </Box>
      </div>

      <div className="d-flex row mt-4">
        <div className="col-xxl-4 col-xl-6 d-flex">
          <Box
            className="card flex-fill"
            sx={{
              backgroundColor: "white",
            }}
          >
            <Box className={style.leave_status_header}>
              <h5 className={style.leave_status_heading}>Notice Board</h5>
              <Box sx={{ display: "flex", gap: 1, fontWeight: "600" }}>
                View All
              </Box>
            </Box>
            <Typography
              className={style.header_bottomline_typography}
            ></Typography>
            <Box sx={{ overflowY: "auto", maxHeight: "300x" }}>
              <Box>
                <Box className={style.notice_board_main_box}>
                  <Box className={style.notice_board_inner_box}>
                    <Box className={style.notice_board_icon_box}>
                      <BlockIcon sx={{ color: "red", fontSize: "15px" }} />
                    </Box>
                    <Box>
                      <h6>New Syllabus Instructions</h6>
                      <Typography sx={{ fontSize: "15px", color: "grey" }}>
                        <CalendarIcon
                          sx={{ fontSize: "14px", marginRight: 0.5 }}
                        />{" "}
                        Added On: 15 Jun 2025
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ChevronRightIcon sx={{ color: "grey" }} />
                  </Box>
                </Box>
              </Box>
              <Box>
                <Box className={style.notice_board_main_box}>
                  <Box className={style.notice_board_inner_box}>
                    <Box className={style.notice_board_icon_box}>
                      <BlockIcon sx={{ color: "red", fontSize: "15px" }} />
                    </Box>
                    <Box>
                      <h6>New Syllabus Instructions</h6>
                      <Typography sx={{ fontSize: "15px", color: "grey" }}>
                        <CalendarIcon
                          sx={{ fontSize: "14px", marginRight: 0.5 }}
                        />{" "}
                        Added On: 15 Jun 2025
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ChevronRightIcon sx={{ color: "grey" }} />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </div>
        <div className="exam-result-main-div col-xxl-4 col-xl-6 d-flex">
          <Box
            className="card flex-fill"
            sx={{
              backgroundColor: "white",
            }}
          >
            <Box className={style.leave_status_header}>
              <h5 className={style.leave_status_heading}>Exam Result</h5>
              <Box sx={{ display: "flex", gap: 1, color: "grey" }}>
                <CalendarIcon />
                <select className={style.leave_status_dropdown}>
                  <option>1st Quarter</option>
                  <option>2st Quarter</option>
                  <option>Half Yearly</option>
                  <option>Model</option>
                  <option>Finals</option>
                </select>
              </Box>
            </Box>
            <Typography
              className={style.header_bottomline_typography}
            ></Typography>
            <Box sx={{ padding: 2, height: "100%" }}>
              <Box className={style.Exam_result_marks_main_box}>
                <Box
                  className={style.Exam_result_marks_inner_box}
                  sx={{
                    backgroundColor: "#ebeffc",
                    color: "#5a76e5",
                  }}
                >
                  Mat : 100
                </Box>
                <Box
                  className={style.Exam_result_marks_inner_box}
                  sx={{
                    backgroundColor: "rgba(26, 190, 23, 0.1)",
                    color: "#1ABE17",
                  }}
                >
                  Phy : 100
                </Box>
                <Box
                  className={style.Exam_result_marks_inner_box}
                  sx={{
                    backgroundColor: "rgba(234, 179, 0, 0.1)",
                    color: "#EAB300",
                  }}
                >
                  Che : 100
                </Box>
                <Box
                  className={style.Exam_result_marks_inner_box}
                  sx={{
                    backgroundColor: "rgba(232, 38, 70, 0.1)",
                    color: "#E82646",
                  }}
                >
                  Eng : 100
                </Box>
              </Box>
              <Box
                sx={{ width: "100%", height: "100%", padding: 2, marginTop: 1 }}
              >
                <canvas
                  style={{ width: "100%", height: "100%" }}
                  id="examResultChart"
                ></canvas>
              </Box>
            </Box>
          </Box>
        </div>
        <div className="fees-reminder-main-div col-xxl-4 col-xl-6 d-flex">
          <Box
            className="card flex-fill"
            sx={{
              backgroundColor: "white",
            }}
          >
            <Box className={style.leave_status_header}>
              <h5 className={style.leave_status_heading}>Fees Reminder</h5>
              <Box sx={{ display: "flex", gap: 1, fontWeight: "600" }}>
                View All
              </Box>
            </Box>
            <Typography
              sx={{
                marginTop: 1,
                color: "white",
                width: "100%",
                borderBottom: "1px solid lightgrey",
              }}
            ></Typography>
            <Box>
              {[...Array(5)].map((_, index) => (
                <Box sx={{ padding: 0 }} key={index}>
                  <Box className={style.fees_reminder_main_box}>
                    <Box className={style.notice_board_inner_box}>
                      <Box className={style.fees_reminder_icon_box}>
                        <BlockIcon sx={{ color: "red", fontSize: "18px" }} />
                      </Box>
                      <Box>
                        <h6>Transport Fees</h6>
                        <Typography sx={{ fontSize: "15px", color: "grey" }}>
                          $2500
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "end",
                        justifyContent: "center",
                      }}
                    >
                      <h6>Last Date</h6>
                      <Typography sx={{ fontSize: "15px", color: "grey" }}>
                        25 May 2024
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
