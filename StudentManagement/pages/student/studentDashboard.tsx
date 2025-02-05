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
import {
  AddCircleOutlineRounded,
  EmailOutlined,
  MessageOutlined,
} from "@mui/icons-material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Chart from "chart.js/auto";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  ChangeTodoStatus,
  deleteTodo,
  FacultyProps,
  GetAllNotices,
  GetAllStudentTodoList,
  GetAttendanceData,
  GetFacultiesForStudentDashboard,
  GetLast7DaysAttendance,
  GetLeaveStatus,
  GetStudentExamByExamId,
  GetStudentExams,
  GetStudentResultById,
  Last7DaysAttendaceProps,
  NoticeProps,
  StudentAttendanceCountProps,
  StudentExamProps,
  StudentResult,
  StudentsLeave,
  StudentTodo,
} from "@/utils/studentUtils/studentDashboard's";
import { Value } from "react-calendar/dist/esm/shared/types.js";
import {
  AddEditExamCalanderModal,
  AddStudentTodoList,
} from "@/utils/allModals/studentModals";

const generateRandomColor = (): string => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16); // Generate a random hex color code
  return `#${randomColor}`;
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
        "rgba(26, 190, 23, 0.1)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 25, 64, 0.2)",
      ],
      borderColor: [
        "rgb(255, 99, 132)",
        "#1ABE17",
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

const colorStyles = [
  {
    backgroundColor: "rgba(255, 99, 132, 0.2)",
    color: "rgb(255, 99, 132)",
  },
  {
    backgroundColor: "rgba(26, 190, 23, 0.1)",
    color: "#1ABE17",
  },
  {
    backgroundColor: "rgba(54, 162, 235, 0.2)",
    color: "rgb(54, 162, 235)",
  },
  {
    backgroundColor: "rgba(153, 102, 255, 0.2)",
    color: "rgb(153, 102, 255)",
  },
  {
    backgroundColor: "rgba(255, 25, 64, 0.2)",
    color: "rgb(255, 25, 64)",
  },
];

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
  const [studentExam, setStudentExam] = useState<StudentExamProps | null>(null);
  const [faculties, setFaculties] = useState<FacultyProps[]>();
  const [notices, setNotices] = useState<NoticeProps[]>();
  const [studentResult, setStudentResult] = useState<StudentResult[]>([]);
  const [examTypeId, setExamTypeId] = useState(2);
  const [isOpenExamAddEditCalender, setIsOpenExamAddEditCalender] =
    useState(false);
  const [isOpenAddTodoModal, setIsOpenAddTodoModal] = useState(false);

  const [studentAttendanceCount, setStudentAttendanceCount] =
    useState<StudentAttendanceCountProps>();

  const [leaveStatusstartDate, setLeaveStatusStartDate] = useState<Date | null>(
    new Date()
  );
  const [AttendancestartDate, setAttendanceStartDate] = useState<Date | null>(
    new Date()
  );

  const [todoDate, setTodoDate] = useState<Date | null>(null);
  const [Last7DaysAttendance, setLast7DaysAttendance] =
    useState<Last7DaysAttendaceProps[]>();
  const [examDate, setExamDate] = useState<Date | null>();
  const sliderRef = useRef<Slider>(null);
  const [attendanceChartInstance, setAttendanceChartInstance] =
    useState<Chart | null>(null);
  const [resultChartInstance, setResultChartInstance] = useState<Chart | null>(
    null
  );

  const [performanceChartInstance, setPerformanceChartInstance] =
    useState<Chart | null>(null);

  const [studentTodoList, setStudentTodoList] = useState<StudentTodo[]>();
  const handlePrev = () => {
    sliderRef.current?.slickPrev();
  };
  const [selectedTodos, setSelectedTodos] = useState<number[]>([]);
  const handleCheckboxChange = (todoId: number) => {
    setSelectedTodos((prevSelectedTodos) => {
      if (prevSelectedTodos.includes(todoId)) {
        return prevSelectedTodos.filter((id) => id !== todoId); // Remove from selected
      } else {
        return [...prevSelectedTodos, todoId]; // Add to selected
      }
    });
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

  const handleEditExamModalOpen = async (examId: number) => {
    setLoading(true);
    if (examId != 0) {
      try {
        const response = await GetStudentExamByExamId(examId);
        if (response != null) {
          setStudentExam(response);
        }
      } catch (error) {
        console.error("Failed to load notice data", error);
      } finally {
      }
    }
    setIsOpenExamAddEditCalender(true);
    setLoading(false);
  };

  const changeTodoStatus = async () => {
    try {
      await ChangeTodoStatus(selectedTodos);
      location.reload();
    } catch (error) {
      console.error("Failed to load notice data", error);
    }
  };

  const DeleteTodo = async () => {
    try {
      await deleteTodo(selectedTodos);
      location.reload();
    } catch (error) {
      console.error("Failed to load notice data", error);
    }
  };
  var settings = {
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(faculties?.length ?? 0, 4),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    centerMode: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(faculties?.length ?? 0, 3),
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
      if (studentResult.length > 0) {
        const examName = studentResult[0].examName; // Assuming all results belong to the same exam
        const subjectNames = studentResult.map((result) => result.subjectName);
        const marksObtained = studentResult.map(
          (result) => result.markObtained
        );

        examData.datasets[0].data = marksObtained;
        examData.labels = subjectNames;
        examData.datasets[0].label = examName;

        var examChartElement = document.getElementById(
          "examResultChart"
        ) as HTMLCanvasElement | null;
        if (examChartElement) {
          if (resultChartInstance) {
            resultChartInstance.destroy();
          }
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
          setResultChartInstance(mychart1);
        } else {
          console.error("Chart element not found.");
        }
      } else {
        var examChartElement = document.getElementById(
          "examResultChart"
        ) as HTMLCanvasElement | null;

        if (examChartElement) {
          // Destroy the existing chart if it exists
          if (resultChartInstance) {
            resultChartInstance.destroy();
            setResultChartInstance(null); // Optionally reset the chart instance to null
          }
        }
      }
    }
  }, [studentResult]);

  useEffect(() => {
    if (isClientSode) {
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

        if (performanceChartInstance) {
          performanceChartInstance.destroy();
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
        setPerformanceChartInstance(myChart3);
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
      setLeaveStatusData(leaveStatus);
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
      console.log(studentExams);
      setStudentExamData(studentExams);
    };

    getStudentExamsFromDateandId();
  }, [examDate]);

  useEffect(() => {
    const fetchData = async () => {
      const [allNotices, allfaculties] = await Promise.all([
        GetAllNotices(),
        GetFacultiesForStudentDashboard(),
      ]);
      setFaculties(allfaculties);
      setNotices(allNotices);
      settings = {
        infinite: true,
        speed: 500,
        slidesToShow:
          allfaculties.length > 4 ? 4 : allfaculties?.length ?? 0 * 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        centerMode: false,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow:
                allfaculties.length > 4 ? 4 : allfaculties?.length ?? 0 * 3,
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
    };
    fetchData();
  }, []);

  useEffect(() => {
    const getStudentExamResult = async () => {
      var studentId = parseInt(sessionStorage.getItem("UserId") ?? "0", 10);
      const studentResult = await GetStudentResultById(studentId, examTypeId);
      setStudentResult(studentResult);
    };
    getStudentExamResult();
  }, [examTypeId]);

  useEffect(() => {
    const getTodoList = async () => {
      const todoList = await GetAllStudentTodoList(todoDate);
      setStudentTodoList(todoList);
    };

    getTodoList();
  }, [todoDate]);
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

  return (
    <>
      {loading && (
        <Box className="loading-spinner">
          <img src={LoadingGif.src} alt="loading-gif" />
        </Box>
      )}
      <div className="row">
        <div className="col-xxl-8">
          <div className="row flex-fill">
            <div className="col-xl-6 d-flex">
              <div className="flex-fill">
                <div
                  className={`${style.profile_main_div} card position-relative p-0`}
                >
                  <div className="card-body ">
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
                      <Button
                        onClick={() => {
                          router.push(`/student/editStudent`);
                        }}
                        className={style.edit_profile_btn}
                      >
                        Edit Profile
                      </Button>
                    </Box>
                  </div>
                </div>
                <div className="card flex-fill">
                  <div className="card-header d-flex align-items-center justify-content-between">
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
                        color: "grey",
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
                  </div>
                  <Box
                    className="card-body p-0"
                    sx={{
                      overflowY: "auto",
                      minHeight: "270px",
                      maxHeight: "270px",
                      marginTop: 1,
                    }}
                  >
                    {leaveStatusData && leaveStatusData.length > 0 ? (
                      leaveStatusData.map((leaveStatus) => (
                        <Box
                          sx={{ marginTop: 1, padding: 1 }}
                          key={leaveStatus.leaveId}
                        >
                          <Box className={style.leave_inner_box}>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Box
                                className={style.leave_inner_content_icon}
                                sx={{
                                  backgroundColor: getLeaveBackgroundColor(
                                    leaveStatus.leaveTypeName
                                  ),
                                }}
                              >
                                <BlockIcon
                                  sx={{
                                    color: getLeaveIconColor(
                                      leaveStatus.leaveTypeName
                                    ),
                                    fontSize: "15px",
                                  }}
                                />
                              </Box>
                              <Box>
                                <h6>{leaveStatus.leaveTypeName}</h6>
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
                      ))
                    ) : (
                      <Typography className="d-flex align-items-center justify-content-center">
                        No data found
                      </Typography>
                    )}
                  </Box>
                </div>
              </div>
            </div>
            <div className="col-xl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h5 className="mt-2 card-title">Attendance</h5>
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
                </div>
                <div className="card-body d-flex flex-column align-items-center justify-content-between">
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
                  <span className="student-pie-chart-count">
                    {studentAttendanceCount?.totalAbsentPresent}
                  </span>
                  {studentAttendanceCount?.totalAbsentPresent ?? 0 > 0 ? (
                    <Box>
                      <canvas id="attendanceChart"></canvas>
                    </Box>
                  ) : (
                    <Box sx={{}}>
                      <canvas id="attendanceChart"></canvas>
                      <Typography
                        sx={{
                          position: "absolute",
                          top: "180px",
                          left: "200px",
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
                          key={attendance.date.toString()}
                          className={style.attendance_last7days_weeks}
                          sx={{
                            backgroundColor:
                              attendance.status == 1
                                ? "#1abe17"
                                : attendance.status == 0
                                ? "#e82646"
                                : "white",
                            color:
                              attendance.status === null ? "black" : "white",
                          }}
                        >
                          {attendance.weekDay}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </div>
              </div>
            </div>
            <div className="col-xl-12 d-flex">
              <div className="row flex-fill">
                <div className="col-sm-6 col-xl-3 d-flex">
                  {/* <Card
                    onClick={() =>
                      (window.location.href = "/student/studentFees")
                    }
                    className="studentDashboard-cards"
                    variant="outlined"
                    sx={{
                      borderRadius: "10px",
                      borderBottom: "2px solid #3d5ee1",
                      // border: "none",
                      boxShadow: "0 0 2px rgba(33,33,33,.2)",
                    }}
                  >
                    {card}
                  </Card> */}

                  <a
                    href="/student/studentFees"
                    className="card border-2 flex-fill animate-card"
                    style={{
                      padding: "0",
                      borderBottom: "2px solid #3d5ee1 !important",
                      borderRadius: "10px",
                      textDecoration: "none",
                    }}
                  >
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <span className="avatar avatar-md rounded bg-primary me-2">
                          <AssuredWorkloadIcon sx={{ color: "white" }} />
                        </span>
                        <h6>Pay Fees</h6>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="col-sm-6 col-xl-3 d-flex">
                  {/* <Card
                    onClick={() =>
                      (window.location.href = "/student/examAndResult")
                    }
                    className="   "
                    variant="outlined"
                    sx={{
                      borderRadius: "15px",
                      borderBottom: "2px solid #3fc83d",

                      boxShadow: "0 0 2px rgba(33,33,33,.2)",
                    }}
                  >
                    {card2}
                  </Card> */}
                  <a
                    href="/student/examAndResult"
                    className="card border-2 flex-fill animate-card"
                    style={{
                      padding: "0",
                      borderBottom: "2px solid #3fc83d",
                      borderRadius: "10px",
                      textDecoration: "none",
                    }}
                  >
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <span
                          className="avatar avatar-md rounded me-2"
                          style={{ backgroundColor: "#3fc83d" }}
                        >
                          <LibraryBooksIcon
                            sx={{ color: "white", fontSize: "15px" }}
                          />
                        </span>
                        <h6>Exam Results</h6>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="col-sm-6 col-xl-3 d-flex">
                  {/* <Card
                    onClick={() =>
                      (window.location.href = "/student/timeTable")
                    }
                    className="studentDashboard-cards"
                    variant="outlined"
                    sx={{
                      borderRadius: "15px",
                      borderBottom: "2px solid #eab300",

                      boxShadow: "0 0 2px rgba(33,33,33,.2)",
                    }}
                  >
                    {card3}
                  </Card> */}
                  <a
                    href="/student/timeTable"
                    className="card border-2 flex-fill animate-card"
                    style={{
                      padding: "0",
                      borderBottom: "2px solid #eab300",
                      borderRadius: "10px",
                      textDecoration: "none",
                    }}
                  >
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <span
                          className="avatar avatar-md rounded me-2"
                          style={{ backgroundColor: "#eab300" }}
                        >
                          <CalendarMonthIcon
                            sx={{ color: "white", fontSize: "15px" }}
                          />
                        </span>
                        <h6>Calender</h6>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="col-sm-6 col-xl-3 d-flex">
                  {/* <Card
                    onClick={() =>
                      (window.location.href = "/student/leaveAndAttendance")
                    }
                    className="studentDashboard-cards"
                    variant="outlined"
                    sx={{
                      borderRadius: "15px",
                      borderBottom: "2px solid #202c4b",

                      boxShadow: "0 0 2px rgba(33,33,33,.2)",
                    }}
                  >
                    {card4}
                  </Card> */}
                  <a
                    href="/student/leaveAndAttendance"
                    className="card border-2 flex-fill animate-card"
                    style={{
                      padding: "0",
                      borderBottom: "2px solid #202c4b !important",
                      borderRadius: "10px",
                      textDecoration: "none",
                    }}
                  >
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <span
                          className="avatar avatar-md rounded me-2"
                          style={{ backgroundColor: "#202c4b" }}
                        >
                          <CalendarMonthIcon
                            sx={{ color: "white", fontSize: "15px" }}
                          />
                        </span>
                        <h6>Attendance</h6>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xxl-4 d-flex">
          <div className="card flex-fill">
            <Box className="card-header d-flex align-items-center justify-content-between">
              <h5 className="mt-2 card-title">Exam Calender</h5>
              <button
                onClick={() => {
                  setStudentExam(null);
                  setIsOpenExamAddEditCalender(true);
                }}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  marginRight: "10px",
                }}
              >
                <MoreHorizIcon sx={{ fontSize: "20px" }} />
              </button>
            </Box>
            <Box className="card-body p-0">
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
              <h5 className="ms-2 mt-2">Exams</h5>
              <Box
                sx={{ marginTop: 1 }}
                className={style.exam_details_main_div}
              >
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
                    <Typography>No exam found</Typography>
                  </Box>
                ) : (
                  studentExamData.map((exam) => (
                    <Box
                      onClick={() => handleEditExamModalOpen(exam.examId)}
                      className="exam-content-inner-div-1"
                      key={exam.examId}
                    >
                      <Box className="exam-inner-content-header">
                        <Typography sx={{ fontSize: 18, fontWeight: "500" }}>
                          {exam.examName}
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
                          <ScheduleIcon />{" "}
                          {convertTo12HourFormat(exam.startTime)} -{" "}
                          {convertTo12HourFormat(exam.endTime)}
                        </Typography>
                        <Typography>Room No. {exam.roomNo}</Typography>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </Box>
          </div>
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
            <Box className={`card-header ${style.leave_status_header}`}>
              <h5 className={style.leave_status_heading}>Todo</h5>
              <Box
                className="todo_calendar_div"
                sx={{
                  display: "flex",
                  gap: 1,
                  width: "120px",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "grey",
                }}
              >
                <AddCircleOutlineRounded
                  onClick={() => setIsOpenAddTodoModal(true)}
                />
                <DatePicker
                  selected={todoDate}
                  onChange={(date: Date | null) => setTodoDate(date)}
                  dateFormat="dd/MM/yyyy" // Display only month and year
                  showDateSelect
                  dropdownMode="select"
                />
                <CalendarIcon />
              </Box>
            </Box>
            <Box
              className="card-body"
              sx={{ padding: 2, maxHeight: "355px", overflowY: "auto" }}
            >
              {studentTodoList && studentTodoList.length > 0 ? (
                studentTodoList.map((todo) => (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 2,
                    }}
                    key={todo.todoId}
                  >
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <input
                        type="checkbox"
                        onChange={() => handleCheckboxChange(todo.todoId)}
                        checked={selectedTodos.includes(todo.todoId)}
                      />
                      <Box>
                        <h6>{todo.todoName}</h6>
                        <Typography
                          sx={{
                            color: "gray",
                            fontSize: "0.8em",
                            margin: 0,
                            padding: 0,
                          }}
                        >
                          Date: {format(todo.todoDate, "dd MMM, yyyy")} ||{" "}
                          {convertTo12HourFormat(todo.time)}
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
                      {todo.status ? "Completed" : "Pending"}
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography className="d-flex align-items-center justify-content-center">
                  No data found
                </Typography>
              )}
            </Box>

            {selectedTodos.length > 0 && (
              <Box
                sx={{
                  marginTop: 2,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                  gap: 0.5,
                }}
              >
                <button
                  className={style.todo_status_btn}
                  onClick={changeTodoStatus}
                >
                  Change Status
                </button>
                <button className={style.todo_delete_btn} onClick={DeleteTodo}>
                  Delete
                </button>
              </Box>
            )}
          </div>
        </div>
      </div>
      <div className={`card ${style.faculties_main_div}`}>
        <div className={`card-header ${style.faculties_header_div}`}>
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
        <Box className={`card-body ${style.slider_main_div}`}>
          <Slider ref={sliderRef} className={style.slider} {...settings}>
            {faculties?.map((faculty) => (
              <Box className={style.slider_box} key={faculty.facultyId}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <img
                    src={faculty.imageUrl}
                    alt="demoImage"
                    style={{ width: "2.813rem", height: "2.813rem" }}
                  />
                  <Box>
                    <h6 style={{ marginBottom: "0.2rem" }}>
                      {faculty.facultyFirstName} {faculty.facultyLastName}
                    </h6>
                    <span style={{ color: "grey" }}>{faculty.courseName}</span>
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
            <Box className={`card-header ${style.leave_status_header}`}>
              <h5 className={style.leave_status_heading}>Notice Board</h5>
              <Box
                onClick={() => router.push("/student/allNotices")}
                sx={{ display: "flex", gap: 1, fontWeight: "600" }}
              >
                View All
              </Box>
            </Box>
            <Box className="p-0" sx={{ overflowY: "auto", maxHeight: "400px" }}>
              {notices?.map((notice) => (
                <Box
                  onClick={() =>
                    router.push(`/student/notice/${notice.noticeId}`)
                  }
                  key={notice.noticeId}
                >
                  <Box className={style.notice_board_main_box}>
                    <Box className={style.notice_board_inner_box}>
                      <Box
                        sx={{ marginRight: "15px" }}
                        className={style.notice_board_icon_box}
                      >
                        <img
                          src={notice.imageUrl}
                          alt="notice-board-img"
                          width={20}
                          height={20}
                        />
                      </Box>
                      <Box>
                        <h6>{notice.title}</h6>
                        <Typography sx={{ fontSize: "15px", color: "grey" }}>
                          <CalendarIcon
                            sx={{ fontSize: "14px", marginRight: 0.5 }}
                          />{" "}
                          Date: {format(notice.date, "dd MMM, yyyy")}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ChevronRightIcon sx={{ color: "grey" }} />
                    </Box>
                  </Box>
                </Box>
              ))}
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
            <Box className={`card-header ${style.leave_status_header}`}>
              <h5 className={style.leave_status_heading}>Exam Result</h5>
              <Box sx={{ display: "flex", gap: 1, color: "grey" }}>
                <CalendarIcon />
                <select
                  className={style.leave_status_dropdown}
                  value={examTypeId} // Bind value to examId state
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setExamTypeId(Number(e.target.value))
                  }
                >
                  <option value={2}>1st Quarter</option>
                  <option value={3}>2st Quarter</option>
                  <option value={4}>Model</option>
                  <option value={5}>Half Yearly</option>
                  <option value={6}>Finals</option>
                </select>
              </Box>
            </Box>
            <Box className="card-body" sx={{ padding: 2, height: "100%" }}>
              <Box className={style.Exam_result_marks_main_box}>
                {studentResult.map((result, index) => {
                  const { subjectName, markObtained } = result;
                  const colorStyle = colorStyles[index % colorStyles.length]; // This ensures the color cycles if there are more subjects than colors
                  return (
                    <Box
                      key={result.resultId}
                      className={style.Exam_result_marks_inner_box}
                      sx={{
                        backgroundColor: colorStyle.backgroundColor,
                        color: colorStyle.color,
                      }}
                    >
                      {subjectName}: {markObtained}
                    </Box>
                  );
                })}
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
        <div className="fees-reminder-main-div col-xxl-4 d-flex">
          <Box
            className="card flex-fill"
            sx={{
              backgroundColor: "white",
            }}
          >
            <Box className={`card-header ${style.leave_status_header}`}>
              <h5 className={style.leave_status_heading}>Fees Reminder</h5>
              <Box sx={{ display: "flex", gap: 1, fontWeight: "600" }}>
                View All
              </Box>
            </Box>
            <Box className="card-body p-0">
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
      <AddEditExamCalanderModal
        isOpen={isOpenExamAddEditCalender}
        onClose={() => {
          setIsOpenExamAddEditCalender(false);
          setStudentExam(null);
        }}
        initialData={studentExam}
      />
      <AddStudentTodoList
        isOpen={isOpenAddTodoModal}
        onClose={() => setIsOpenAddTodoModal(false)}
      />
    </>
  );
};

export default StudentDashboard;
