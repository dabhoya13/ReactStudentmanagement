import { Navigate, useNavigate } from "react-router-dom";
import { getUserFromToken } from "../../Utils/Auth/Auth";
import Sidebar from "../Layouts/HodLayouts/Sidebar";
import Header from "../Layouts/HodLayouts/Header";
import { Box, Card, CardContent, Grid2, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import GroupIcon from "@mui/icons-material/Group";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { PieChart } from "@mui/x-charts/PieChart";

import { mobileOS, valueFormatter } from "../../Utils/PieCharts";
import { BarChart } from "@mui/x-charts";
import demoImage from "../../assets/Images/demo.jpg";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";

import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { GetGenderWiseCounts } from "./AdminDashboard's";
const AdminDashboard: React.FC = () => {
  const [radius, setRadius] = useState(50);
  const [itemNb, setItemNb] = useState(2);
  const [skipAnimation, setSkipAnimation] = useState(false);

  const [value, setValue] = React.useState<Dayjs | null>(dayjs("2024-11-20"));
  const [pieData, setPieData] = useState([
    { label: "Male", value: 10 },
    { label: "Female", value: 30 },
  ]);

  const user = getUserFromToken();
  if (!user || user.Role != "1") {
    return <Navigate to="/login" />;
  }


  useEffect(() => {
    const fetchGenderWiseCounts = async () => {
      const GenderWiseCounts = await GetGenderWiseCounts();
      console.log("GenderWiseCount", GenderWiseCounts);
      const updatedPieData = GenderWiseCounts.map(
        (item: { Gender: string; GenderCount: number }) => ({
          label: item.Gender,
          value: item.GenderCount,
        })
      );
      setPieData(updatedPieData);
    };

    fetchGenderWiseCounts();
  }, []);

  const card = (
    <React.Fragment>
      <CardContent
        sx={{
          backgroundColor: "transparent",
          border: "none",
          display: "flex",
          justifyContent: "start",
          padding: 3,
          gap: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              borderRadius: "50%",
              backgroundColor: "white",
              height: "40px",
              width: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SchoolIcon sx={{ color: "#4c8af6" }} />
          </Box>
        </Box>
        <Box>
          <Typography sx={{ fontWeight: "600", fontSize: "15px" }}>
            Total Students
          </Typography>
          <Typography sx={{ color: "grey", fontSize: "15px" }}>2500</Typography>
        </Box>
      </CardContent>
    </React.Fragment>
  );

  const card2 = (
    <React.Fragment>
      <CardContent
        sx={{
          backgroundColor: "transparent",
          border: "none",
          display: "flex",
          justifyContent: "start",
          padding: 3,
          gap: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              borderRadius: "50%",
              backgroundColor: "white",
              height: "40px",
              width: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <GroupIcon sx={{ color: "#4c8af6" }} />
          </Box>
        </Box>
        <Box>
          <Typography sx={{ fontWeight: "600", fontSize: "15px" }}>
            Total Students
          </Typography>
          <Typography sx={{ color: "grey", fontSize: "15px" }}>2500</Typography>
        </Box>
      </CardContent>
    </React.Fragment>
  );

  const card3 = (
    <React.Fragment>
      <CardContent
        sx={{
          backgroundColor: "transparent",
          border: "none",
          display: "flex",
          justifyContent: "start",
          padding: 3,
          gap: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              borderRadius: "50%",
              backgroundColor: "white",
              height: "40px",
              width: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <GroupsIcon sx={{ color: "#4c8af6" }} />
          </Box>
        </Box>
        <Box>
          <Typography sx={{ fontWeight: "600", fontSize: "15px" }}>
            Total Students
          </Typography>
          <Typography sx={{ color: "grey", fontSize: "15px" }}>2500</Typography>
        </Box>
      </CardContent>
    </React.Fragment>
  );

  const card4 = (
    <React.Fragment>
      <CardContent
        sx={{
          backgroundColor: "transparent",
          border: "none",
          display: "flex",
          justifyContent: "start",
          padding: 3,
          gap: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              borderRadius: "50%",
              backgroundColor: "white",
              height: "40px",
              width: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AttachMoneyIcon sx={{ color: "#4c8af6" }} />
          </Box>
        </Box>
        <Box>
          <Typography sx={{ fontWeight: "600", fontSize: "15px" }}>
            Total Students
          </Typography>
          <Typography sx={{ color: "grey", fontSize: "15px" }}>2500</Typography>
        </Box>
      </CardContent>
    </React.Fragment>
  );

  return (
    <>
      {/* BOX FOR ALL CARDS */}

      <Box sx={{ flexGrow: 1 }}>
        <Grid2 container spacing={2}>
          {/* Card 1 */}
          <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
            <Card
              className="adminDashboard-cards"
              variant="outlined"
              sx={{
                borderRadius: "15px",
                border: "none",
                boxShadow: "0 0 2px rgba(33,33,33,.2)",
              }}
            >
              {card}
            </Card>
          </Grid2>
          {/* Card 2 */}
          <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
            <Card
              className="adminDashboard-cards"
              variant="outlined"
              sx={{
                borderRadius: "15px",
                border: "none",
                boxShadow: "0 0 2px rgba(33,33,33,.2)",
              }}
            >
              {card2}
            </Card>
          </Grid2>
          {/* Card 3 */}
          <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
            <Card
              className="adminDashboard-cards"
              variant="outlined"
              sx={{
                borderRadius: "15px",
                border: "none",
                boxShadow: "0 0 2px rgba(33,33,33,.2)",
              }}
            >
              {card3}
            </Card>
          </Grid2>
          {/* Card 4 */}
          <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
            <Card
              className="adminDashboard-cards"
              variant="outlined"
              sx={{
                borderRadius: "15px",
                border: "none",
                boxShadow: "0 0 2px rgba(33,33,33,.2)",
              }}
            >
              {card4}
            </Card>
          </Grid2>
        </Grid2>
      </Box>

      {/* BOX FOR TWO CHARTS ATTENDENCE AND GENDER  */}

      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "column",
            md: "column",
            lg: "row",
            xl: "row",
          },
          marginTop: 5,
          gap: 5,
        }}
      >
        <Box
          className="pie-chart-container"
          sx={{
            padding: 1,
            borderRadius: "5px",
            boxShadow: "0 0 5px rgba(33,33,33,.2)",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: {
              lg: "auto",
              xl: "auto",
              md: "350px",
              sm: "350px",
              xs: "350px",
            },
            width: { lg: "35%", md: "100%", sm: "100%" },
          }}
        >
          <h3>Total Students By Gender</h3>
          <PieChart
            colors={["#1fe6d1", "#4b8bf8"]}
            className="pie-chart"
            height={200}
            width={300}
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
                itemGap: 130,
                position: { vertical: "bottom", horizontal: "right" },
                padding: -100,
              },
            }}
            skipAnimation={skipAnimation}
          />
        </Box>
        <Box
          sx={{
            padding: 1,
            borderRadius: "5px",
            boxShadow: "0 0 5px rgba(33,33,33,.2)",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            width: { lg: "70%", md: "100%", sm: "100%" },
          }}
        >
          <h3 style={{ marginLeft: 5 }}>Attendance</h3>
          <BarChart
            borderRadius={40}
            xAxis={
              [
                {
                  scaleType: "band",
                  data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                  categoryGapRatio: 0.5,
                  barGapRatio: 0.4,
                },
              ] as any
            }
            series={[
              { data: [100, 600, 300, 600, 700, 400], label: "Total Present" },
              { data: [200, 500, 600, 600, 700, 400], label: "Total Absent" },
            ]}
            grid={{ horizontal: true }}
            colors={["#1fe6d1", "#4b8bf8"]}
            height={300}
            sx={{
              width: "100%",
              maxWidth: "100%",
            }}
            slotProps={{
              legend: {
                itemMarkHeight: 10,
                itemMarkWidth: 10,
                position: { vertical: "top", horizontal: "left" },
              },
            }}
          />
        </Box>
      </Box>

      {/* BOX FOR NOTICE BOARD AND EVENT CALENDER */}

      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "column",
            md: "column",
            lg: "row",
            xl: "row",
          },
          marginTop: 5,
          gap: 5,
        }}
      >
        <Box
          sx={{
            width: { lg: "75%", md: "100%", sm: "100%", xs: "100%" },
            padding: 1,
            borderRadius: "5px",
            boxShadow: "0 0 5px rgba(33,33,33,.2)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <h3>Notice Board</h3>
            <button className="notice-board-add-btn">+</button>
          </Box>
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box
                sx={{
                  display: "flex",
                  marginTop: 2,
                  gap: 2,
                  alignItems: "center",
                  width: {
                    xs: "100%",
                    sm: "100%",
                    md: "50%",
                    lg: "50%",
                    xl: "50%",
                  },
                }}
              >
                <img
                  className="notice-board-imgs"
                  src={demoImage}
                  alt="notice-board-img"
                />
                <Typography sx={{ fontWeight: "600", wordBreak: "break-word" }}>
                  School annual sports day celebration 2024
                </Typography>
              </Box>
              <Box
                sx={{
                  display: {
                    sm: "none",
                    xs: "none",
                    md: "flex",
                    lg: "flex",
                    xl: "flex",
                  },
                  marginTop: 2,
                  gap: 2,
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#4c8cf8",
                    padding: 1,
                    borderRadius: "5px",
                  }}
                >
                  <Typography color="white">20 July, 2023</Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: {
                    sm: "none",
                    xs: "none",
                    md: "flex",
                    lg: "flex",
                    xl: "flex",
                  },
                  marginTop: 2,
                  gap: 0,
                  alignItems: "center",
                }}
              >
                <button className="notice-board-view-btn">
                  <VisibilityIcon sx={{ fontSize: "20px" }} />
                </button>
                <Typography sx={{ fontWeight: "600" }}>20K</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  marginTop: 2,
                  gap: 0,
                  alignItems: "center",
                }}
              >
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
            </Box>
            <Box
              sx={{
                display: {
                  sm: "flex",
                  xs: "flex",
                  md: "none",
                  lg: "none",
                  xl: "none",
                },
                gap: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  marginTop: 2,
                  gap: 2,
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#4c8cf8",
                    padding: 1,
                    borderRadius: "5px",
                  }}
                >
                  <Typography color="white">20 July, 2023</Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  marginTop: 2,
                  gap: 0,
                  alignItems: "center",
                }}
              >
                <button className="notice-board-view-btn">
                  <VisibilityIcon sx={{ fontSize: "20px" }} />
                </button>
                <Typography sx={{ fontWeight: "600" }}>20K</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <div className="event-calender-div">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              marginLeft: "5px",
            }}
          >
            <h3>Event Calender</h3>
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
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DateCalendar", "DateCalendar"]}>
                <DateCalendar
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
        </div>
      </Box>
    </>
  );
};

export default AdminDashboard;
