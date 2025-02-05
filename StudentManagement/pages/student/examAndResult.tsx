import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import StudentDetailsLayout from "@/components/layouts/StudentDetailsLayout/StudentDetailsLayout";
import { Box } from "@mui/material";
import { CalendarIcon } from "@mui/x-date-pickers";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import {
  FinalResultProps,
  GetWholeYearStudentResults,
  StudentResult,
} from "@/utils/studentUtils/studentDashboard's";
import { ClearOutlined } from "@mui/icons-material";

const ExamAndResult: React.FC = () => {
  const [resultYear, setResultYear] = useState<number>(
    new Date().getFullYear() - 1
  );

  const [groupedResult, setGroupedResults] = useState<{
    [key: string]: StudentResult[];
  }>({});

  const groupResultByExamType = (results: StudentResult[]) => {
    return results.reduce((acc, result) => {
      const year = new Date(result.examDate).getFullYear();
      const key = `${result.examName} ${year}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(result);
      return acc;
    }, {} as { [key: string]: StudentResult[] });
  };
  useEffect(() => {
    const getResult = async () => {
      var studentId = parseInt(sessionStorage.getItem("UserId") ?? "0", 10);
      const results: StudentResult[] = await GetWholeYearStudentResults(
        studentId,
        resultYear
      );
      console.log("result", results);
      console.log(results.length);
      if (results.length > 0) {
        console.log(results);
        const groupedResult = groupResultByExamType(results);
        setGroupedResults(groupedResult);
      }
    };
    getResult();
  }, [resultYear]);
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
              selected={new Date(resultYear, 0, 1)}
              onChange={(date: Date | null) =>
                setResultYear(
                  date?.getFullYear() ?? new Date().getFullYear() - 1
                )
              }
              dateFormat="yyyy" // Display only month and year
              showMonthYearPicker // Show only month and year picker
              dropdownMode="select"
            />
            <CalendarIcon />
          </Box>
        </div>
        <div className="card-body">
          <div className="accordions-items-seperate" id="accordionExample">
            {Object.keys(groupedResult).map((examKey: string, index) => {
              const resultsForExam = groupedResult[examKey];
              const totalsForExam = resultsForExam.reduce(
                (sum, result) => sum + result.maxMarks,
                0
              );
              const totalMarksObtained = resultsForExam.reduce(
                (sum, result) => sum + result.markObtained,
                0
              );
              const percentage = (totalMarksObtained / totalsForExam) * 100;
              const isAnySubjectFail = resultsForExam.some(
                (result) => result.markObtained < result.minMarks
              );

              const resultStatus = isAnySubjectFail ? "Fail" : "Pass";
              const uniqueId = `collapse-${index}`;

              return (
                <div className="accordion-item mb-3">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#${uniqueId}`}
                      aria-expanded="false"
                      aria-controls="collapseOne"
                    >
                      {resultStatus == "Fail" ? (
                        <span className="avatar avatar-sm bg-danger me-2">
                          <ClearOutlined />
                        </span>
                      ) : (
                        <span className="avatar avatar-sm bg-successs me-2">
                          <CheckOutlinedIcon />
                        </span>
                      )}

                      {examKey}
                    </button>
                  </h2>
                  <div
                    id={uniqueId}
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
                            {resultsForExam.map((result) => (
                              <tr key={result.resultId}>
                                <td>{result.subjectName}</td>
                                <td>{result.maxMarks}</td>
                                <td>{result.minMarks}</td>
                                <td>{result.markObtained}</td>
                                <td className="text-end">
                                  <span
                                    className={`badge badge-soft-${
                                      result.markObtained >= result.minMarks
                                        ? "success"
                                        : "reject"
                                    } d-inline-flex align-items-center`}
                                  >
                                    •{" "}
                                    {result.markObtained >= result.minMarks
                                      ? "Pass"
                                      : "Fail"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                            <tr>
                              <td className="bg-darks text-white">-</td>
                              <td className="bg-darks text-white">
                                Total : {totalsForExam}
                              </td>
                              <td className="bg-darks text-white" colSpan={2}>
                                Marks Obtained : {totalMarksObtained}
                              </td>
                              <td className="bg-darks text-white text-end">
                                <div className="d-flex align-items-center justify-content-end">
                                  <span className="me-2">
                                    Percentage : {percentage.toFixed(2)}%
                                  </span>
                                  <h6 className="fw-normal text-white mb-0">
                                    Result :
                                    <span
                                      className={`text-${
                                        resultStatus === "Pass"
                                          ? "success"
                                          : "danger"
                                      }`}
                                    >
                                      {" "}{resultStatus}
                                    </span>
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
              );
            })}
          </div>
        </div>
      </div>
    </StudentDetailsLayout>
  );
};

export default ExamAndResult;
