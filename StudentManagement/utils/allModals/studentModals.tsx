import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import {
  ClassesProps,
  CoursesProps,
  GetAllClasses,
  GetAllCourses,
  GetAllExamTypes,
  GetAllSubjects,
  StudentExamProps,
  SubjectsProps,
} from "../studentUtils/studentDashboard's";
import CloseIcon from "@mui/icons-material/Close";
import { text } from "stream/consumers";
import { useRouter } from "next/router";
import * as Yup from "yup";
import dayjs, { Dayjs } from "dayjs";
import { useFormik } from "formik";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";
import LoadingGif from "../../public/Images/Animation.gif";
import { CallAPI } from "@/pages/api/callApi";

interface AddEditExamCalenderProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: StudentExamProps | null;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  "& .MuiPaper-root": {
    borderRadius: "15px !important",
    width: "100%",
  },
}));

export interface ExamTypeProps {
  examId: number;
  examName: string;
}

export const AddEditExamCalanderModal: React.FC<AddEditExamCalenderProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [subjects, setSubjects] = useState<SubjectsProps[]>();
  const [courses, setCourses] = useState<CoursesProps[]>();
  const [examTypes, setExamTypes] = useState<ExamTypeProps[]>([]);
  const [classes, setClasses] = useState<ClassesProps[]>();
  const currentDateMinusOneDay = dayjs().subtract(0, "day");
  const validationSchema = Yup.object({
    class: Yup.number()
      .required("Please Select Class")
      .min(1, "Please Select Class"),
    examType: Yup.number().required("Please Select ExamType").min(1,"Please Select Exam Type"),
    startTime: Yup.string().required("Please Enter Start Time").max(50),
    endTime: Yup.string().required("Please Enter End Time").max(50),
    examDate: Yup.date()
      .required("Please Select Exam Date")
      .test("is-before", "Selected date cannot be in Past", (value) => {
        // Convert the value to a dayjs object if it's not already one
        return dayjs(value).isAfter(currentDateMinusOneDay, "day");
      }),
    subject: Yup.number()
      .required("Please select subject")
      .min(1, "Please Select Class"),
    course: Yup.number()
      .required("Please select Course")
      .min(1, "Please Select Class"),
  });

  interface FormValues {
    class: number | null;
    examType: number | null;
    startTime: any;
    endTime: any;
    examDate: any;
    subject: number | null;
    course: number | null;
    roomNo: number | null;
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      class: 0,
      examType: 0,
      startTime: null,
      endTime: null,
      examDate: null,
      subject: 0,
      roomNo: null,
      course: 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values);

      let studentExam = {
        ExamId: initialData?.examId,
        SubjectId: values.subject,
        StartTime: values.startTime.format("HH:mm:ss"),
        EndTime: values.endTime.format("HH:mm:ss"),
        ExamDate: new Date(values.examDate),
        RoomNo: values.roomNo,
        ExamType: values.examType,
        ClassId: values.class,
      };
      const formData = {
        ControllerName: "Student",
        MethodName: "UpsertStudentExam",
        DataObject: JSON.stringify(studentExam),
        RoleIds: ["3"],
      };
      var response = await CallAPI(formData);
      if (response.isSuccess == true) {
        window.location.reload();
      } else {
        router.replace("/login");
      }
    },
  });

  useEffect(() => {
    const loadingData = async () => {
      if (initialData != null && initialData.examId != 0) {
        try {
          console.log("starttime ::::", initialData.startTime);
          console.log("starttime ::::", initialData.endTime);

          formik.setValues({
            class: initialData?.classId ?? 0,
            examType: initialData?.examType ?? "",
            startTime: initialData?.startTime
              ? dayjs(
                  `${dayjs().format("YYYY-MM-DD")} ${initialData.startTime}`
                ) // Combine date and time
              : null,
            endTime: initialData?.endTime
              ? dayjs(`${dayjs().format("YYYY-MM-DD")} ${initialData.endTime}`) // Combine date and time
              : null,
            subject: initialData?.subjectId ?? 0,
            examDate: initialData?.examDate
              ? dayjs(initialData.examDate)
              : null,
            roomNo: initialData?.roomNo ?? 0,
            course: initialData?.courseId ?? 0,
          });
        } catch (error) {
          console.error("Failed to load notice data", error);
        } finally {
        }
      } else {
        formik.setValues({
          class: 0,
          course: 0,
          endTime: null,
          examDate: null,
          examType: 0,
          roomNo: 0,
          startTime: null,
          subject: 0,
        });
      }
    };
    loadingData();
  }, [initialData]);
  useEffect(() => {
    const fetchData = async () => {
      const [classes, subjects, courses, examTypes] = await Promise.all([
        GetAllClasses(),
        GetAllSubjects(),
        GetAllCourses(),
        GetAllExamTypes(),
      ]);
      setClasses(classes);
      setSubjects(subjects);
      setCourses(courses);
      setExamTypes(examTypes);
    };

    fetchData();
  }, []);

  return (
    <>
      {isLoading && (
        <Box className="loading-spinner">
          <img src={LoadingGif.src} alt="loading-gif" />
        </Box>
      )}
      <BootstrapDialog
        fullWidth={true}
        maxWidth={"lg"}
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={isOpen}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, backgroundColor: "#4c8cf8", color: "white" }}
          id="customized-dialog-title"
        >
          {initialData == null ? "Add Exam Calender" : "Edit Exam Calender"}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon sx={{ color: "white" }} />
        </IconButton>
        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-4">
                    <div className="add-edit-exam-form-div mb-3">
                      <span className="form-label">Class</span>
                      <FormControl
                        fullWidth
                        error={formik.touched.class && !!formik.errors.class}
                      >
                        <InputLabel id="class-label">Class</InputLabel>
                        <Select
                          labelId="class-label"
                          id="class"
                          value={formik.values.class}
                          label="Class"
                          name="class"
                          onChange={(e) => {
                            formik.setFieldValue("class", e.target.value);
                          }}
                          onBlur={formik.handleBlur}
                        >
                          <MenuItem value={0}>
                            <em>None</em>
                          </MenuItem>
                          {classes?.map((classs) => (
                            <MenuItem
                              value={classs.classId}
                              key={classs.classId}
                            >
                              {classs.className} {classs.classRank}
                            </MenuItem>
                          ))}
                        </Select>
                        {formik.touched.class && formik.errors.class && (
                          <FormHelperText>{formik.errors.class}</FormHelperText>
                        )}
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="add-edit-exam-form-div mb-3">
                      <span className="form-label">Class</span>
                      <FormControl
                        fullWidth
                        error={formik.touched.class && !!formik.errors.class}
                      >
                        <InputLabel id="examType-label">Exam Type</InputLabel>
                        <Select
                          labelId="examType-label"
                          id="examType"
                          value={formik.values.examType}
                          label="ExamType"
                          name="examType"
                          onChange={(e) => {
                            formik.setFieldValue("examType", e.target.value);
                          }}
                          onBlur={formik.handleBlur}
                        >
                          <MenuItem value={0}>
                            <em>None</em>
                          </MenuItem>
                          {examTypes?.map((examType) => (
                            <MenuItem
                              value={examType.examId}
                              key={examType.examId}
                            >
                              {examType.examName}
                            </MenuItem>
                          ))}
                        </Select>
                        {formik.touched.examType && formik.errors.examType && (
                          <FormHelperText>
                            {formik.errors.examType}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="add-edit-exam-form-div mb-3">
                      <span className="form-label">Start Time</span>
                      <FormControl
                        fullWidth
                        error={
                          formik.touched.startTime && !!formik.errors.startTime
                        }
                      >
                        {/* <InputLabel >Start Time</InputLabel> */}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimePicker
                            name="startTime"
                            value={formik.values.startTime}
                            onChange={(time) =>
                              formik.setFieldValue("startTime", time)
                            }
                            ampm={true}
                          />
                          {formik.touched.startTime &&
                            formik.errors.startTime && (
                              <FormHelperText>
                                {formik.errors.startTime.toString()}
                              </FormHelperText>
                            )}
                        </LocalizationProvider>
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="add-edit-exam-form-div mb-3">
                      <span className="form-label">End Time</span>
                      <FormControl
                        fullWidth
                        error={
                          formik.touched.startTime && !!formik.errors.startTime
                        }
                      >
                        {/* <InputLabel >Start Time</InputLabel> */}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimePicker
                            name="endTime"
                            value={formik.values.endTime}
                            onChange={(time) =>
                              formik.setFieldValue("endTime", time)
                            }
                            ampm={true}
                          />
                          {formik.touched.endTime && formik.errors.endTime && (
                            <FormHelperText>
                              {formik.errors.endTime.toString()}
                            </FormHelperText>
                          )}
                        </LocalizationProvider>
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="add-edit-exam-form-div mb-3">
                      <span className="form-label">Exam Date</span>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          onChange={(date) =>
                            formik.setFieldValue("examDate", date)
                          }
                          value={formik.values.examDate}
                          disablePast
                          format="DD/MM/YYYY"
                          slotProps={{
                            textField: {
                              error:
                                formik.touched.examDate &&
                                !!formik.errors.examDate,
                              helperText:
                                formik.touched.examDate &&
                                typeof formik.errors.examDate === "string"
                                  ? formik.errors.examDate
                                  : "",
                              fullWidth: true,
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="add-edit-exam-form-div mb-3">
                      <span className="form-label">Course</span>
                      <FormControl
                        fullWidth
                        error={formik.touched.course && !!formik.errors.course}
                      >
                        <InputLabel id="course-label">Course</InputLabel>
                        <Select
                          labelId="course-label"
                          id="course"
                          value={formik.values.course}
                          label="Course"
                          name="course"
                          onChange={(e) => {
                            formik.setFieldValue("course", e.target.value);
                            formik.setFieldValue("subject", 0);
                          }}
                          onBlur={formik.handleBlur}
                        >
                          <MenuItem value={0}>
                            <em>None</em>
                          </MenuItem>
                          {courses?.map((course) => (
                            <MenuItem
                              value={course.courseId}
                              key={course.courseId}
                            >
                              {course.courseName}
                            </MenuItem>
                          ))}
                        </Select>
                        {formik.touched.course && formik.errors.course && (
                          <FormHelperText>
                            {formik.errors.course}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="add-edit-exam-form-div mb-3">
                      <span className="form-label">Subject</span>
                      <FormControl
                        fullWidth
                        error={
                          formik.touched.subject && !!formik.errors.subject
                        }
                      >
                        <InputLabel id="subject-label">Subject</InputLabel>
                        <Select
                          labelId="subject-label"
                          id="subject"
                          value={formik.values.subject}
                          label="Subject"
                          name="subject"
                          onChange={(e) => {
                            formik.setFieldValue("subject", e.target.value);
                          }}
                          onBlur={formik.handleBlur}
                        >
                          <MenuItem value={0}>
                            <em>None</em>
                          </MenuItem>

                          {subjects
                            ?.filter(
                              (subject) =>
                                subject.courseId === formik.values.course
                            )
                            .map((subject) => (
                              <MenuItem
                                value={subject.subjectId}
                                key={subject.subjectId}
                              >
                                {subject.subjectName}
                              </MenuItem>
                            ))}
                        </Select>
                        {formik.touched.subject && formik.errors.subject && (
                          <FormHelperText>
                            {formik.errors.subject}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="add-edit-exam-form-div mb-3">
                      <span id="room-label" className="form-label">
                        Room No
                      </span>
                      <TextField
                        required
                        fullWidth
                        className="login-textfield"
                        id="roomNo"
                        label="Room No"
                        name="roomNo"
                        value={formik.values.roomNo}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.roomNo && !!formik.errors.roomNo}
                        helperText={
                          formik.touched.roomNo && formik.errors.roomNo
                        }
                        sx={{
                          // marginTop: 1,
                          "& .MuiFormHelperText-root": { color: "red" },
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex gap-2 justify-content-end">
              <Button
                sx={{
                  backgroundColor: "grey",
                  color: "white",
                  borderRadius: "5px",
                  "&:hover": {
                    backgroundColor: "white",
                    border: "1px solid black",
                    color: "black",
                  },
                }}
                autoFocus
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="btn btn-primary"
                autoFocus
                sx={{
                  color: "white",
                  borderRadius: "5px",
                  "&:hover": {
                    backgroundColor: "white",
                    color: "red",
                    border: "1px solid red",
                  },
                }}
              >
                Submit
              </Button>
            </div>
          </form>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
};

interface AddEditStudentTodoProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddStudentTodoList: React.FC<AddEditStudentTodoProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currentDateMinusOneDay = dayjs().subtract(1, "day");
  const validationSchema = Yup.object({
    todoName: Yup.string().required("Please Enter ExamType").max(50),
    time: Yup.string().required("Please Enter Start Time").max(50),
    todoDate: Yup.date()
      .required("Please Select Exam Date")
      .test("is-before", "Selected date cannot be in Past", (value) => {
        // Convert the value to a dayjs object if it's not already one
        return dayjs(value).isAfter(currentDateMinusOneDay, "day");
      }),
  });

  interface FormValues {
    todoName: string | null;
    time: any;
    todoDate: any;
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      todoName: "",
      time: null,
      todoDate: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values);

      let studentTodo = {
        TodoName: values.todoName,
        Time: values.time.format("HH:mm:ss"),
        TodoDate: new Date(values.todoDate),
      };
      const formData = {
        ControllerName: "Student",
        MethodName: "AddStudentTodo",
        DataObject: JSON.stringify(studentTodo),
        RoleIds: ["3"],
      };
      var response = await CallAPI(formData);
      if (response.isSuccess == true) {
        window.location.reload();
      } else {
        router.replace("/login");
      }
    },
  });

  return (
    <>
      {isLoading && (
        <Box className="loading-spinner">
          <img src={LoadingGif.src} alt="loading-gif" />
        </Box>
      )}
      <BootstrapDialog
        fullWidth={true}
        maxWidth={"lg"}
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={isOpen}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, backgroundColor: "#4c8cf8", color: "white" }}
          id="customized-dialog-title"
        >
          Add ToDo Task
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon sx={{ color: "white" }} />
        </IconButton>
        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-4">
                    <div className="add-edit-exam-form-div mb-3">
                      <span className="form-label">Task Name</span>
                      <TextField
                        required
                        fullWidth
                        className="login-textfield"
                        id="name"
                        label="Task Name"
                        name="todoName"
                        value={formik.values.todoName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.todoName && !!formik.errors.todoName
                        }
                        helperText={
                          formik.touched.todoName && formik.errors.todoName
                        }
                        sx={{
                          // marginTop: 1,
                          "& .MuiFormHelperText-root": { color: "red" },
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="add-edit-exam-form-div mb-3">
                      <span className="form-label">Start Time</span>
                      <FormControl
                        fullWidth
                        error={formik.touched.time && !!formik.errors.time}
                      >
                        {/* <InputLabel >Start Time</InputLabel> */}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimePicker
                            name="time"
                            value={formik.values.time}
                            onChange={(time) =>
                              formik.setFieldValue("time", time)
                            }
                            ampm={true}
                          />
                          {formik.touched.time && formik.errors.time && (
                            <FormHelperText>
                              {formik.errors.time.toString()}
                            </FormHelperText>
                          )}
                        </LocalizationProvider>
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="add-edit-exam-form-div mb-3">
                      <span className="form-label">Date</span>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          onChange={(date) =>
                            formik.setFieldValue("todoDate", date)
                          }
                          value={formik.values.todoDate}
                          disablePast
                          format="DD/MM/YYYY"
                          slotProps={{
                            textField: {
                              error:
                                formik.touched.todoDate &&
                                !!formik.errors.todoDate,
                              helperText:
                                formik.touched.todoDate &&
                                typeof formik.errors.todoDate === "string"
                                  ? formik.errors.todoDate
                                  : "",
                              fullWidth: true,
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex gap-2 justify-content-end">
              <Button
                sx={{
                  backgroundColor: "grey",
                  color: "white",
                  borderRadius: "5px",
                  "&:hover": {
                    backgroundColor: "white",
                    border: "1px solid black",
                    color: "black",
                  },
                }}
                autoFocus
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="btn btn-primary"
                autoFocus
                sx={{
                  color: "white",
                  borderRadius: "5px",
                  "&:hover": {
                    backgroundColor: "white",
                    color: "red",
                    border: "1px solid red",
                  },
                }}
              >
                Submit
              </Button>
            </div>
          </form>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
};

interface AddLeaveProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: number;
}

export const AddLeaveModal: React.FC<AddLeaveProps> = ({
  isOpen,
  onClose,
  studentId,
}) => {
  const router = useRouter();
  const currentDateMinusOneDay = dayjs().subtract(1, "day");
  const validationSchema = Yup.object({
    reason: Yup.string().required("Please Enter Reason").max(500),
    leaveType: Yup.number()
      .required("Please Select Leave Type")
      .min(1, "Please Select Leave Type"),
    leaveDate: Yup.date()
      .required("Please Select Leave Date")
      .test("is-before", "Selected date cannot be in Past", (value) => {
        // Convert the value to a dayjs object if it's not already one
        return dayjs(value).isAfter(currentDateMinusOneDay, "day");
      }),
    noOfDays: Yup.number()
      .required("Please Enter No. Of Days")
      .min(1, "Please Enter No. Of Days"),
  });

  interface FormValues {
    reason: string | null;
    leaveType: number;
    leaveDate: any;
    noOfDays: number;
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      reason: "",
      leaveType: 0,
      leaveDate: null,
      noOfDays: 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values);

      let studentLeave = {
        LeaveTypeId: values.leaveType,
        LeaveDate: new Date(values.leaveDate),
        StudentId: studentId,
        NumberOfDays: values.noOfDays,
        Reason: values.reason,
        LeaveStatus: 1,
      };
      const formData = {
        ControllerName: "Student",
        MethodName: "AddStudentLeave",
        DataObject: JSON.stringify(studentLeave),
        RoleIds: ["3"],
      };
      var response = await CallAPI(formData);
      if (response.isSuccess == true) {
        window.location.reload();
      } else {
        router.replace("/login");
      }
    },
  });

  return (
    <>
      <BootstrapDialog
        fullWidth={true}
        maxWidth={"lg"}
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={isOpen}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, backgroundColor: "#4c8cf8", color: "white" }}
          id="customized-dialog-title"
        >
          Add Leave
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon sx={{ color: "white" }} />
        </IconButton>
        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-4">
                    <div className="add-edit-exam-form-div mb-3">
                      <span className="form-label">Leave Date</span>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          onChange={(date) =>
                            formik.setFieldValue("leaveDate", date)
                          }
                          value={formik.values.leaveDate}
                          disablePast
                          format="DD/MM/YYYY"
                          slotProps={{
                            textField: {
                              error:
                                formik.touched.leaveDate &&
                                !!formik.errors.leaveDate,
                              helperText:
                                formik.touched.leaveDate &&
                                typeof formik.errors.leaveDate === "string"
                                  ? formik.errors.leaveDate
                                  : "",
                              fullWidth: true,
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="add-edit-exam-form-div mb-3">
                      <span className="form-label">Leave Type</span>
                      <FormControl
                        fullWidth
                        error={
                          formik.touched.leaveType && !!formik.errors.leaveType
                        }
                      >
                        <InputLabel id="leaveType-label">Leave Type</InputLabel>
                        <Select
                          labelId="leaveType-label"
                          id="leaveType"
                          value={formik.values.leaveType}
                          label="Leave Type"
                          name="leaveType"
                          onChange={(e) => {
                            formik.setFieldValue("leaveType", e.target.value);
                          }}
                          onBlur={formik.handleBlur}
                        >
                          <MenuItem value={0}>
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={1}>
                            <em>Medical Leave</em>
                          </MenuItem>
                          <MenuItem value={2}>
                            <em>Casual Leave</em>
                          </MenuItem>
                          <MenuItem value={4}>
                            <em>Maternity Leave</em>
                          </MenuItem>
                          <MenuItem value={5}>
                            <em>Paternity Leave</em>
                          </MenuItem>
                          {/* {classes?.map((classs) => (
                            <MenuItem
                              value={classs.classId}
                              key={classs.classId}
                            >
                              {classs.className} {classs.classRank}
                            </MenuItem>
                          ))} */}
                        </Select>
                        {formik.touched.leaveType &&
                          formik.errors.leaveType && (
                            <FormHelperText>
                              {formik.errors.leaveType}
                            </FormHelperText>
                          )}
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="add-edit-exam-form-div mb-3">
                      <span className="form-label">No Of Days</span>
                      <TextField
                        type="number"
                        required
                        fullWidth
                        className="login-textfield"
                        id="noOfDays"
                        label="No Of Days"
                        name="noOfDays"
                        value={formik.values.noOfDays}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.noOfDays && !!formik.errors.noOfDays
                        }
                        helperText={
                          formik.touched.noOfDays && formik.errors.noOfDays
                        }
                        sx={{
                          // marginTop: 1,
                          "& .MuiFormHelperText-root": { color: "red" },
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="add-edit-exam-form-div mb-3">
                      <span className="form-label">Reason</span>
                      <TextField
                        required
                        fullWidth
                        className="login-textfield"
                        id="reason"
                        label="Reason"
                        name="reason"
                        multiline
                        rows={3}
                        value={formik.values.reason}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.reason && !!formik.errors.reason}
                        helperText={
                          formik.touched.reason && formik.errors.reason
                        }
                        sx={{
                          // marginTop: 1,
                          "& .MuiFormHelperText-root": { color: "red" },
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex gap-2 justify-content-end">
              <Button
                sx={{
                  backgroundColor: "grey",
                  color: "white",
                  borderRadius: "5px",
                  "&:hover": {
                    backgroundColor: "white",
                    border: "1px solid black",
                    color: "black",
                  },
                }}
                autoFocus
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="btn btn-primary"
                autoFocus
                sx={{
                  color: "white",
                  borderRadius: "5px",
                  "&:hover": {
                    backgroundColor: "white",
                    color: "red",
                    border: "1px solid red",
                  },
                }}
              >
                Submit
              </Button>
            </div>
          </form>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
};
