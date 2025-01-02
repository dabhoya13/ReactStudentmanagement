import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  OutlinedInput,
  Select,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { insert, useFormik } from "formik";
import * as Yup from "yup";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Email, Widgets } from "@mui/icons-material";
import dayjs from "dayjs";
import { ChangeEvent, useEffect, useState } from "react";
import { CallAPI, CallAPIForFileUpload } from "../../pages/api/callApi";
import { GetNoticeDetailsById } from "../adminUtils/adminDashboard's";
import React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import demoImage from "../../../public/assets/Images/profile-image.jpg";
import EmailIcon from "@mui/icons-material/Email";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DateRangeIcon from "@mui/icons-material/DateRange";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import EditIcon from "@mui/icons-material/Edit";
import { useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
interface DeleteModalProps {
  isOpen: boolean;
  text: string;
  onClose: () => void;
  onDelete: () => void;
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

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  text,
  onClose,
  onDelete,
}) => {
  return (
    <BootstrapDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={isOpen}
    >
      <DialogTitle
        sx={{ m: 0, p: 2, backgroundColor: "#4c8cf8", color: "white" }}
        id="customized-dialog-title"
      >
        Delete {text}
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
        <Typography gutterBottom>
          Are you Sure you want to delete this {text}?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ display: "flex", gap: 1 }}>
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
          autoFocus
          sx={{
            backgroundColor: "red",
            color: "white",
            borderRadius: "5px",
            "&:hover": {
              backgroundColor: "white",
              color: "red",
              border: "1px solid red",
            },
          }}
          onClick={onDelete}
        >
          Delete
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
};

interface NoticeProps {
  noticeId: number;
  shortDescription: string;
  longDescription: string;
  date: Date;
  title: string;
  imageName: string;
  imageUrl: string;
}

interface NoticeAddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  noticeId: number;
  initialData?: NoticeProps | null;
}

export const AddEditNoticeModal: React.FC<NoticeAddEditModalProps> = ({
  isOpen,
  onClose,
  noticeId,
  initialData,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scroll, setScroll] = React.useState<DialogProps["scroll"]>("body"); // Change default scroll to 'body'
  const [oldImage, setOldImage] = useState<boolean>(false);
  const router = useRouter();
  const currentDateMinusOneDay = dayjs().subtract(1, "day");
  const validationSchema = Yup.object({
    title: Yup.string().required("Please Enter Title"),
    shortDescription: Yup.string()
      .required("Please Enter ShortDescription")
      .max(1000),
    longDescription: Yup.string().required("Please Enter LongDescription"),
    date: Yup.date()
      .required("Please Select Date")
      .test("is-after", "Selected date cannot be in past", (value) => {
        // Convert the value to a dayjs object if it's not already one
        return dayjs(value).isAfter(currentDateMinusOneDay, "day");
      }),
    file:
      noticeId != null && noticeId != 0
        ? Yup.mixed().notRequired()
        : Yup.mixed().required("Please Upload Image."),
  });

  interface FormValues {
    title: string | null;
    shortDescription: string | null;
    longDescription: string | null;
    date: any;
    file: File | null;
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      title: "",
      shortDescription: "",
      longDescription: "",
      date: null,
      file: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      let formattedDate = null;
      formattedDate = new Date(values.date)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      let noticeModel = {
        NoticeId: noticeId,
        Title: values.title,
        ShortDescription: values.shortDescription,
        LongDescription: values.longDescription,
        Date: formattedDate,
        ImageName: values.file?.name,
      };

      const formData = {
        ControllerName: "Hod",
        MethodName: "UpsertNoticeDetails",
        DataObject: JSON.stringify(noticeModel),
        RoleIds: ["1"],
      };

      var response = await CallAPI(formData);
      if (response.isSuccess == true && noticeModel.ImageName != null) {
        var response1 = await CallAPIForFileUpload(values.file, "NoticeImages");
        if (response1.statusCode == 200) {
          window.location.reload();
        }
      } else if (response.isSuccess == true) {
        window.location.reload();
      } else {
        router.replace("/login");
      }
    },
    // var response = await CallLoginAPI(formData);
    //   if (response.result != null && response.result.data.jwtToken != null) {
    //     v
    // },
  });

  useEffect(() => {
    const loadingData = async () => {
      setIsLoading(true);
      if (noticeId != 0) {
        try {
          if (initialData?.imageUrl) {
            setImagePreview(initialData.imageUrl);
            setOldImage(true);
          }
          formik.setValues({
            title: initialData?.title ?? "",
            longDescription: initialData?.longDescription ?? "",
            shortDescription: initialData?.shortDescription ?? "",
            file: null,
            date: initialData?.date ? dayjs(initialData.date) : null,
          });
        } catch (error) {
          console.error("Failed to load notice data", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setImagePreview(null);
        setOldImage(false);
        formik.setValues({
          title: "",
          longDescription: "",
          shortDescription: "",
          file: null,
          date: null,
        });
      }
    };
    loadingData();
  }, [initialData]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue("file", file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };

      reader.readAsDataURL(file);
      setOldImage(false);
    }
  };

  return (
    <BootstrapDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={isOpen}
      scroll={scroll}
      sx={{ maxHeight: "100vh", overflowY: "auto" }}
    >
      <DialogTitle
        sx={{ m: 0, p: 2, backgroundColor: "#4c8cf8", color: "white" }}
        id="customized-dialog-title"
      >
        {noticeId != 0 ? "Edit Notice" : "Add Notice"}
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
        <form className="login-form w-100" onSubmit={formik.handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <span>Title:</span>
            <TextField
              margin="normal"
              required
              className="login-textfield"
              fullWidth
              id="title"
              label="Title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && !!formik.errors.title}
              helperText={formik.touched.title && formik.errors.title}
              sx={{
                marginTop: 1,
                "& .MuiFormHelperText-root": { color: "red" },
              }}
            />
          </Box>
          <Box sx={{ marginTop: 3, display: "flex", flexDirection: "column" }}>
            <span>Short Description:</span>
            <TextField
              required
              fullWidth
              className="login-textfield"
              id="short"
              label="Short Description"
              name="shortDescription"
              value={formik.values.shortDescription}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.shortDescription &&
                !!formik.errors.shortDescription
              }
              helperText={
                formik.touched.shortDescription &&
                formik.errors.shortDescription
              }
              sx={{
                marginTop: 1,
                "& .MuiFormHelperText-root": { color: "red" },
              }}
            />
          </Box>
          <Box sx={{ marginTop: 3, display: "flex", flexDirection: "column" }}>
            <span>Select Date:</span>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{ width: "180px" }}
                onChange={(date) => formik.setFieldValue("date", date)}
                value={formik.values.date}
                disablePast
                slotProps={{
                  textField: {
                    error: formik.touched.date && !!formik.errors.date,
                    helperText:
                      formik.touched.date &&
                      typeof formik.errors.date === "string"
                        ? formik.errors.date
                        : "",
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
          <Box sx={{ marginTop: 3, display: "flex", flexDirection: "column" }}>
            <span>Long Description</span>
            <TextField
              required
              fullWidth
              className="login-textfield"
              id="long"
              label="Long Description"
              name="longDescription"
              value={formik.values.longDescription}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.longDescription &&
                !!formik.errors.longDescription
              }
              multiline
              rows={4}
              helperText={
                formik.touched.longDescription && formik.errors.longDescription
              }
              sx={{
                marginTop: 1,
                "& .MuiFormHelperText-root": { color: "red" },
              }}
            />
          </Box>

          <Box
            className="Dashboard-fileUpload-box"
            sx={{ marginTop: 3, display: "flex", flexDirection: "column" }}
          >
            <span className="mb-3">Select Image:</span>
            <button type="button" className="upload-btn d-flex gap-2">
              Upload
            </button>
            <input
              className="mb-3"
              type="file"
              id="myinputfile"
              name="file"
              onChange={(event) => handleFileChange(event)}
              onBlur={formik.handleBlur}
            />
            {formik.touched.file && !!formik.errors.file && (
              <Typography variant="body2" color="error">
                {formik.errors.file}
              </Typography>
            )}
            {oldImage && (
              <Box
                sx={{
                  position: "absolute",
                  backgroundColor: "white",
                  zIndex: 100000,
                  marginTop: "45px",
                  width: "50%",
                }}
              >
                <Typography>{initialData?.imageName}</Typography>
              </Box>
            )}
            {/* Preview the image */}
            {imagePreview && (
              <Box sx={{ marginTop: 2 }}>
                <img
                  src={imagePreview}
                  alt="File Preview"
                  style={{ maxWidth: "200px", maxHeight: "200px" }}
                />
              </Box>
            )}
          </Box>

          <Button
            fullWidth
            type="submit"
            sx={{ backgroundColor: "#6a6cf6", color: "white", marginTop: 5 }}
          >
            Submit
          </Button>
        </form>
      </DialogContent>
    </BootstrapDialog>
  );
};

interface FormValues {
  date: any;
  halfs: number;
}
interface ChangeAttendanceGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
}

export const ChangeAttendanceGraphModal: React.FC<
  ChangeAttendanceGraphModalProps
> = ({ isOpen, onClose, onSubmit }) => {
  const validationSchema = Yup.object({
    date: Yup.date().required("Please Select Date"),
    halfs: Yup.number().required("Please Select Halfs."),
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      date: dayjs(),
      halfs: 1,
    },
    validationSchema,
    onSubmit: async (values) => {
      onSubmit(values);
    },
  });

  return (
    <Dialog disableEscapeKeyDown open={isOpen} onClose={onClose}>
      <DialogTitle>Select Month/Year and Half</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          <form onSubmit={formik.handleSubmit}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {/* <DemoContainer
                  components={["DatePicker", "DatePicker", "DatePicker"]}
                > */}
                <DatePicker
                  onChange={(date) => formik.setFieldValue("date", date)}
                  value={formik.values.date}
                  label={"Select month/year"}
                  views={["month", "year"]}
                  slotProps={{
                    textField: {
                      error: formik.touched.date && !!formik.errors.date,
                      helperText:
                        formik.touched.date &&
                        typeof formik.errors.date === "string"
                          ? formik.errors.date
                          : "",
                    },
                  }}
                />
                {/* </DemoContainer> */}
              </LocalizationProvider>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Select
                name="halfs"
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                className="attendance-half-dropdown"
                value={formik.values.halfs}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.halfs && !!formik.errors.halfs}
              >
                <MenuItem value={1}>Months's FirstHalf</MenuItem>
                <MenuItem value={2}>Months's SecondHalf</MenuItem>
              </Select>
              {formik.touched.halfs && !!formik.errors.halfs && (
                <Typography variant="body2" color="error">
                  {formik.errors.halfs}
                </Typography>
              )}
            </FormControl>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                fullWidth
                onClick={onClose}
                sx={{
                  backgroundColor: "grey",
                  color: "white",
                  marginTop: 2,
                }}
              >
                Cancel
              </Button>

              <Button
                fullWidth
                type="submit"
                sx={{
                  backgroundColor: "#6a6cf6",
                  color: "white",
                  marginTop: 2,
                }}
              >
                Select
              </Button>
            </Box>
          </form>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

interface StudentProps {
  studentId: number;
  firstName: string;
  lastName: string;
  birthDate: Date;
  userName: string;
  courseId: number;
  email: string;
  gender: number | null;
  imageName: string;
  imageUrl: string;
  courseName: string | null;
}

interface StudentAddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: number;
  initialData?: StudentProps | null;
}

interface CoursesProps {
  courseName: string;
  courseId: number;
}

export const AddEditStudentModal: React.FC<StudentAddEditModalProps> = ({
  isOpen,
  onClose,
  studentId,
  initialData,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [courses, setCourses] = useState<CoursesProps[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [oldImage, setOldImage] = useState<boolean>(false);

  const router = useRouter();
  const currentDateMinusOneDay = dayjs().subtract(0, "day");
  const validationSchema = Yup.object({
    firstName: Yup.string().required("Please Enter FirstName").max(50),
    lastName: Yup.string().required("Please Enter LastName").max(50),
    userName: Yup.string().required("Please Enter UserName").max(50),
    courseId: Yup.number()
      .required("Please Select Course")
      .min(1, "Please Select Course"),
    birthDate: Yup.date()
      .required("Please Select BirthDate")
      .test("is-after", "Selected date cannot be in future", (value) => {
        // Convert the value to a dayjs object if it's not already one
        return dayjs(value).isBefore(currentDateMinusOneDay, "day");
      }),
    email: Yup.string()
      .required("Please Enter an Email Address")
      .email("Please Enter Valid Email Address"),
    gender: Yup.number()
      .required("Please Select Gender")
      .min(1, "Please Select Gender"),
    file:
      studentId != null && studentId != 0
        ? Yup.mixed().notRequired()
        : Yup.mixed().required("Please Upload Image."),
  });

  interface FormValues {
    firstName: string | null;
    lastName: string | null;
    userName: string | null;
    birthDate: any;
    courseId: number;
    email: string | null;
    gender: number;
    file: File | null;
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      birthDate: null,
      userName: "",
      courseId: 0,
      email: "",
      gender: 0,
      file: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      let studentModel = {
        StudentId: studentId,
        FirstName: values.firstName,
        LastName: values.lastName,
        UserName: values.userName,
        BirthDate: new Date(values.birthDate),
        Email: values.email,
        Gender: values.gender,
        CourseId: values.courseId,
        ImageName: values.file?.name,
      };
      const formData = {
        ControllerName: "Student",
        MethodName: "UpsertStudentDetails",
        DataObject: JSON.stringify(studentModel),
        RoleIds: ["1"],
      };

      if (studentId == 0) {
        const checkUsernameformData = {
          ControllerName: "Student",
          MethodName: "CheckUsernameExist",
          DataObject: JSON.stringify(values.userName),
          RoleIds: ["1"],
        };
        var checkUsernameResponse = await CallAPI(checkUsernameformData);

        if (checkUsernameResponse.result.data.userName != null) {
          formik.setFieldError("userName", "UserName already exists");
          return;
        } else {
          formik.setFieldError("userName", "");
          var response = await CallAPI(formData);
          if (response.isSuccess == true && studentModel.ImageName != null) {
            var response1 = await CallAPIForFileUpload(
              values.file,
              "StudentProfiles"
            );
            if (response1.statusCode == 200) {
              window.location.reload();
            }
          } else if (response.isSuccess == true) {
            window.location.reload();
          } else {
            router.replace("/login");
          }
        }
      } else {
        var response = await CallAPI(formData);
        if (response.isSuccess == true && studentModel.ImageName != null) {
          var response1 = await CallAPIForFileUpload(
            values.file,
            "StudentProfiles"
          );
          if (response1.statusCode == 200) {
            window.location.reload();
          }
        } else if (response.isSuccess == true) {
          window.location.reload();
        } else {
          router.replace("/login");
        }
      }
    },
  });

  useEffect(() => {
    const getCourses = async () => {
      const formData = {
        ControllerName: "Course",
        MethodName: "GetAllCourses",
        DataObject: JSON.stringify(null),
        RoleIds: ["1"],
      };

      var response = await CallAPI(formData);
      if (response.isSuccess == true) {
        const courses: CoursesProps[] = response.result.data;
        setCourses(courses);
      }
    };
    getCourses();
  }, []);

  useEffect(() => {
    const loadingData = async () => {
      setIsLoading(true);
      if (studentId != 0) {
        try {
          if (initialData?.imageUrl) {
            setImagePreview(initialData.imageUrl);
            setOldImage(true);
          }
          formik.setValues({
            firstName: initialData?.firstName ?? "",
            lastName: initialData?.lastName ?? "",
            userName: initialData?.userName ?? "",
            email: initialData?.email ?? "",
            courseId: initialData?.courseId ?? 0,
            birthDate: initialData?.birthDate
              ? dayjs(initialData.birthDate)
              : null,
            gender: initialData?.gender ?? 0,
            file: null,
          });
        } catch (error) {
          console.error("Failed to load notice data", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setImagePreview(null);
        setOldImage(false);
        formik.setValues({
          firstName: "",
          lastName: "",
          userName: "",
          email: "",
          courseId: 0,
          birthDate: null,
          gender: 0,
          file: null,
        });
      }
    };
    loadingData();
  }, [initialData]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue("file", file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };

      reader.readAsDataURL(file);
      setOldImage(false);
    }
  };

  return (
    <BootstrapDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={isOpen}
      scroll="body"
      sx={{ maxHeight: "100vh", overflowY: "auto" }}
    >
      <DialogTitle
        sx={{ m: 0, p: 2, backgroundColor: "#4c8cf8", color: "white" }}
        id="customized-dialog-title"
      >
        {studentId != 0 ? "Edit Student" : "Add Student"}
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
        <form className="login-form w-100 row" onSubmit={formik.handleSubmit}>
          <Box
            className="col-12 col-md-6 col-lg-6 col-sm-12"
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <span>First Name:</span>
            <TextField
              margin="normal"
              required
              className="login-textfield"
              fullWidth
              id="firstName"
              label="FirstName"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.firstName && !!formik.errors.firstName}
              helperText={formik.touched.firstName && formik.errors.firstName}
              sx={{
                marginTop: 1,
                "& .MuiFormHelperText-root": { color: "red" },
              }}
            />
          </Box>
          <Box
            className="col-12 col-md-6 col-lg-6 col-sm-12"
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <span>Last Name:</span>
            <TextField
              required
              fullWidth
              className="login-textfield"
              id="lastName"
              label="Last Name"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.lastName && !!formik.errors.lastName}
              helperText={formik.touched.lastName && formik.errors.lastName}
              sx={{
                marginTop: 1,
                "& .MuiFormHelperText-root": { color: "red" },
              }}
            />
          </Box>
          <Box
            className="col-12 col-md-6 col-lg-6 col-sm-12"
            sx={{
              marginTop: { sm: "8px", xs: "8px" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Select BirthDate:</span>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{ marginTop: 1 }}
                onChange={(date) => formik.setFieldValue("birthDate", date)}
                value={formik.values.birthDate}
                disableFuture
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    error:
                      formik.touched.birthDate && !!formik.errors.birthDate,
                    helperText:
                      formik.touched.birthDate &&
                      typeof formik.errors.birthDate === "string"
                        ? formik.errors.birthDate
                        : "",
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
          <Box
            className="col-12 col-md-6 col-lg-6 col-sm-12"
            sx={{
              marginTop: { sm: "8px", xs: "8px" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Select Course:</span>
            <FormControl
              fullWidth
              sx={{ marginTop: 1 }}
              error={formik.touched.courseId && !!formik.errors.courseId}
            >
              <InputLabel id="courseId-label">Course</InputLabel>
              <Select
                labelId="courseId-label"
                id="courseId"
                value={formik.values.courseId}
                label="Course"
                name="courseId"
                onChange={(e) => {
                  formik.setFieldValue("courseId", e.target.value);
                }}
                onBlur={formik.handleBlur}
              >
                <MenuItem value={0}>
                  <em>None</em>
                </MenuItem>
                {courses.map((course) => (
                  <MenuItem value={course.courseId} key={course.courseId}>
                    {course.courseName}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.courseId && formik.errors.courseId && (
                <FormHelperText>{formik.errors.courseId}</FormHelperText>
              )}
            </FormControl>
          </Box>
          <Box
            className="col-12 col-md-6 col-lg-6 col-sm-12"
            sx={{
              marginTop: { sm: "8px", xs: "8px" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Select Gender:</span>
            <FormControl
              fullWidth
              sx={{ marginTop: 1 }}
              error={formik.touched.gender && !!formik.errors.gender}
            >
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                id="gender"
                value={formik.values.gender}
                label="Gender"
                name="gender"
                onChange={(e) => formik.setFieldValue("gender", e.target.value)}
                onBlur={formik.handleBlur}
              >
                <MenuItem value={0}>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={1}>Male</MenuItem>
                <MenuItem value={2}>Female</MenuItem>
              </Select>
              {formik.touched.gender && formik.errors.gender && (
                <FormHelperText>{formik.errors.gender}</FormHelperText>
              )}
            </FormControl>
          </Box>
          <Box
            className="col-12 col-md-6 col-lg-6 col-sm-12"
            sx={{
              marginTop: { sm: "8px", xs: "8px" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>UserName:</span>
            <TextField
              required
              fullWidth
              className="login-textfield"
              id="userName"
              label="UserName"
              name="userName"
              value={formik.values.userName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.userName && !!formik.errors.userName}
              helperText={formik.touched.userName && formik.errors.userName}
              sx={{
                marginTop: 1,
                "& .MuiFormHelperText-root": { color: "red" },
              }}
            />
          </Box>

          <Box
            className="col-12 col-md-6 col-lg-6 col-sm-12"
            sx={{
              marginTop: { sm: "8px", xs: "8px" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Email:</span>
            <TextField
              required
              fullWidth
              className="login-textfield"
              id="email"
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && !!formik.errors.email}
              helperText={formik.touched.email && formik.errors.email}
              sx={{
                marginTop: 1,
                "& .MuiFormHelperText-root": { color: "red" },
              }}
            />
          </Box>
          <Box
            className="Dashboard-fileUpload-box"
            sx={{ marginTop: 3, display: "flex", flexDirection: "column" }}
          >
            <span className="mb-3">Select Image:</span>
            <button type="button" className="upload-btn d-flex gap-2">
              Upload
            </button>
            <input
              className="mb-3"
              type="file"
              id="myinputfile"
              name="file"
              onChange={(event) => handleFileChange(event)}
              onBlur={formik.handleBlur}
            />
            {formik.touched.file && !!formik.errors.file && (
              <Typography variant="body2" color="error">
                {formik.errors.file}
              </Typography>
            )}
            {oldImage && (
              <Box
                sx={{
                  position: "absolute",
                  backgroundColor: "white",
                  zIndex: 100000,
                  marginTop: "45px",
                  width: "50%",
                }}
              >
                <Typography>{initialData?.imageName}</Typography>
              </Box>
            )}
            {/* Preview the image */}
            {imagePreview && (
              <Box sx={{ marginTop: 2 }}>
                <img
                  src={imagePreview}
                  alt="File Preview"
                  style={{ maxWidth: "200px", maxHeight: "200px" }}
                />
              </Box>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 3 }}>
            <Button
              onClick={onClose}
              fullWidth
              type="submit"
              sx={{ backgroundColor: "#800000", color: "white", marginTop: 2 }}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              type="submit"
              sx={{ backgroundColor: "#6a6cf6", color: "white", marginTop: 2 }}
            >
              Submit
            </Button>
          </Box>
        </form>
      </DialogContent>
    </BootstrapDialog>
  );
};

interface ModelProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: StudentProps | null;
}
export const ViewStudentProfileModal: React.FC<ModelProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  return (
    <BootstrapDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={isOpen}
      scroll="body"
      sx={{ maxHeight: "100vh", overflowY: "auto" }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          m: 0,
          p: 2,
          backgroundColor: "#4c8cf8",
          borderRadius: "0px 0px 20px 20px",
          color: "white",
        }}
        id="customized-dialog-title"
      >
        Profile
        <Box
          sx={{
            marginTop: 2,
            borderRadius: "50%",
            height: "150px",
            border: "5px solid white",
            width: "150px",
          }}
        >
          <Avatar
            sx={{ width: "100%", height: "100%" }}
            alt="Travis Howard"
            src={initialData?.imageUrl ?? ""}
          />
        </Box>
        <Typography
          sx={{ color: "white", fontWeight: "600", marginTop: 2, fontSize: 18 }}
        >
          {initialData?.firstName + " " + initialData?.lastName}
        </Typography>
        <Typography
          sx={{ color: "#F3E5AB", fontWeight: "450", marginTop: 0.2 }}
        >
          {initialData?.courseName}
        </Typography>
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
        <Box sx={{ display: "flex", gap: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EmailIcon />
          </Box>
          <Box>
            Email
            <Typography sx={{ fontWeight: "600" }}>
              {initialData?.email}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2, border: 1 }} variant="middle" />
        <Box sx={{ display: "flex", gap: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PhoneAndroidIcon />
          </Box>
          <Box>
            Mobile
            <Typography sx={{ fontWeight: "600" }}>898956563222</Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2, border: 1 }} variant="middle" />
        <Box sx={{ display: "flex", gap: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DateRangeIcon />
          </Box>
          <Box>
            BirthDate
            <Typography sx={{ fontWeight: "600" }}>
              {new Date(
                initialData?.birthDate ?? new Date()
              ).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2, border: 1 }} variant="middle" />
        <Box sx={{ display: "flex", gap: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {initialData?.gender == 1 ? <MaleIcon /> : <FemaleIcon />}
          </Box>
          <Box>
            Gender
            <Typography sx={{ fontWeight: "600" }}>
              {initialData?.gender == 1 ? "Male" : "Female"}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2, border: 1 }} variant="middle" />
        <Box sx={{ display: "flex", gap: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AccountCircleIcon />
          </Box>
          <Box>
            UserName
            <Typography sx={{ fontWeight: "600" }}>
              {initialData?.userName}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  );
};

interface ExportReportProps {
  isOpen: boolean;
  onClose: () => void;
  onExcelHandle: () => void;
  onPdfHandle: () => void;
}

export const ExportReportModal: React.FC<ExportReportProps> = ({
  isOpen,
  onClose,
  onExcelHandle,
  onPdfHandle,
}) => {
  return (
    <BootstrapDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={isOpen}
    >
      <DialogTitle
        sx={{ m: 0, p: 2, backgroundColor: "#4c8cf8", color: "white" }}
        id="customized-dialog-title"
      >
        Export Report
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
      <DialogContent dividers sx={{ display: "flex", gap: 2 }}>
        <Button
          onClick={onPdfHandle}
          fullWidth
          sx={{
            backgroundColor: "grey",
            color: "white",
            borderRadius: "5px",
            position: "relative",
            top: 0,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "top 0.3s ease",
            "&:hover": {
              top: "-5px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
            },
          }}
        >
          Export PDF
        </Button>
        <Button
          onClick={onExcelHandle}
          fullWidth
          sx={{
            backgroundColor: "grey",
            color: "white",
            borderRadius: "5px",
            position: "relative",
            top: 0,
            transition: "all 0.3s ease",
            "&:hover": {
              top: "-5px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
            },
          }}
        >
          Export Excel
        </Button>
      </DialogContent>
    </BootstrapDialog>
  );
};

interface HodProps {
  Id: number;
  firstName: string;
  lastName: string;
  birthDate: Date;
  userName: string;
  email: string;
  mobileNumber: string;
  countryId: number;
  cityId: number;
  stateId: number;
  postalCode: string;
  imageName: string;
  imageUrl: string;
}

interface HodEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  hodId: number;
  initialData?: HodProps | null;
}

interface CountryProps {
  countryId: number;
  countryName: string;
}

interface StateProps {
  countryId: number;
  stateName: string;
  stateId: number;
}

interface CityProps {
  countryId: number;
  cityName: string;
  cityId: number;
  stateId: number;
}

interface ConStateCityProp {
  countries: CountryProps[];
  states: StateProps[];
  cities: CityProps[];
}

export const EditHodModel: React.FC<HodEditModalProps> = ({
  isOpen,
  onClose,
  hodId,
  initialData,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [countries, setCountries] = useState<CountryProps[]>([]);
  const [states, setstates] = useState<StateProps[]>([]);
  const [cities, setCities] = useState<CityProps[]>([]);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [oldImage, setOldImage] = useState<boolean>(false);

  const router = useRouter();
  const currentDateMinusOneDay = dayjs().subtract(0, "day");
  const validationSchema = Yup.object({
    firstName: Yup.string().required("Please Enter FirstName").max(50),
    lastName: Yup.string().required("Please Enter LastName").max(50),
    userName: Yup.string().required("Please Enter UserName").max(50),
    countryId: Yup.number()
      .required("Please Select Country")
      .min(1, "Please Select Country"),
    stateId: Yup.number()
      .required("Please Select State")
      .min(1, "Please Select State"),
    cityId: Yup.number()
      .required("Please Select City")
      .min(1, "Please Select City"),
    birthDate: Yup.date()
      .required("Please Select BirthDate")
      .test("is-after", "Selected date cannot be in future", (value) => {
        // Convert the value to a dayjs object if it's not already one
        return dayjs(value).isBefore(currentDateMinusOneDay, "day");
      }),
    email: Yup.string()
      .required("Please Enter an Email Address")
      .email("Please Enter Valid Email Address"),
    mobileNumber: Yup.string()
      .required("Please Enter Mobile Number")
      .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
    postalCode: Yup.string().required("Please Enter PostalCode"),
    file:
      hodId != null && hodId != 0
        ? Yup.mixed().notRequired()
        : Yup.mixed().required("Please Upload Image."),
  });

  interface FormValues {
    firstName: string | null;
    lastName: string | null;
    userName: string | null;
    birthDate: any;
    email: string | null;
    mobileNumber: string;
    countryId: number;
    stateId: number;
    cityId: number;
    postalCode: string;
    file: File | null;
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      birthDate: null,
      userName: "",
      mobileNumber: "",
      email: "",
      countryId: 0,
      stateId: 0,
      cityId: 0,
      postalCode: "",
      file: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      let hodModel = {
        Id: hodId,
        FirstName: values.firstName,
        LastName: values.lastName,
        UserName: values.userName,
        BirthDate: new Date(values.birthDate),
        Email: values.email,
        MobileNumber: values.mobileNumber,
        CountryId: values.countryId,
        StateId: values.stateId,
        CityId: values.cityId,
        PostalCode: values.postalCode,
        ImageName: values.file?.name,
      };
      const formData = {
        ControllerName: "Hod",
        MethodName: "UpdateProfessorHodDetails",
        DataObject: JSON.stringify(hodModel),
        RoleIds: ["1"],
      };

      var response = await CallAPI(formData);
      if (response.isSuccess == true && hodModel.ImageName != null) {
        var response1 = await CallAPIForFileUpload(values.file, "HodProfiles");
        var imageUrl =
          "https://localhost:7199/HodProfiles/" + hodModel.ImageName;
        sessionStorage.setItem("ProfilePicture", imageUrl);
        if (response1.statusCode == 200) {
          window.location.reload();
        }
      } else if (response.isSuccess == true) {
        window.location.reload();
      } else {
        router.replace("/login");
      }
    },
  });

  useEffect(() => {
    const getCountries = async () => {
      const formData = {
        ControllerName: "Hod",
        MethodName: "GetAllCountiesStatesCities",
        DataObject: JSON.stringify(null),
        RoleIds: ["1"],
      };

      var response = await CallAPI(formData);
      if (response.isSuccess == true) {
        const conStateCity: ConStateCityProp = response.result.data;
        setCountries(conStateCity.countries);
        setCities(conStateCity.cities);
        setstates(conStateCity.states);
      }
    };
    getCountries();
  }, []);

  useEffect(() => {
    const loadingData = async () => {
      setIsLoading(true);
      if (hodId != 0) {
        try {
          if (initialData?.imageUrl) {
            setImagePreview(initialData.imageUrl);
            setOldImage(true);
          }
          formik.setValues({
            firstName: initialData?.firstName ?? "",
            lastName: initialData?.lastName ?? "",
            userName: initialData?.userName ?? "",
            email: initialData?.email ?? "",
            countryId: initialData?.countryId ?? 0,
            stateId: initialData?.stateId ?? 0,
            cityId: initialData?.cityId ?? 0,
            birthDate: initialData?.birthDate
              ? dayjs(initialData.birthDate)
              : null,
            mobileNumber: initialData?.mobileNumber ?? "",
            file: null,
            postalCode: initialData?.postalCode ?? "",
          });
        } catch (error) {
          console.error("Failed to load notice data", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setImagePreview(null);
        setOldImage(false);
        formik.setValues({
          firstName: "",
          lastName: "",
          userName: "",
          email: "",
          mobileNumber: "",
          countryId: 0,
          stateId: 0,
          cityId: 0,
          postalCode: "",
          birthDate: null,
          file: null,
        });
      }
    };
    loadingData();
  }, [initialData]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue("file", file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };

      reader.readAsDataURL(file);
      setOldImage(false);
    }
  };

  return (
    <BootstrapDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={isOpen}
      scroll="body"
      sx={{ maxHeight: "100vh", overflowY: "auto" }}
    >
      <DialogTitle
        sx={{ m: 0, p: 2, backgroundColor: "#4c8cf8", color: "white" }}
        id="customized-dialog-title"
      >
        Edit Hod Details
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
        <form className="login-form w-100 row" onSubmit={formik.handleSubmit}>
          <Box
            className="col-12 col-md-6 col-lg-6 col-sm-12"
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <span>First Name:</span>
            <TextField
              margin="normal"
              required
              className="login-textfield"
              fullWidth
              id="firstName"
              label="FirstName"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.firstName && !!formik.errors.firstName}
              helperText={formik.touched.firstName && formik.errors.firstName}
              sx={{
                marginTop: 1,
                "& .MuiFormHelperText-root": { color: "red" },
              }}
            />
          </Box>
          <Box
            className="col-12 col-md-6 col-lg-6 col-sm-12"
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <span>Last Name:</span>
            <TextField
              required
              fullWidth
              className="login-textfield"
              id="lastName"
              label="Last Name"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.lastName && !!formik.errors.lastName}
              helperText={formik.touched.lastName && formik.errors.lastName}
              sx={{
                marginTop: 1,
                "& .MuiFormHelperText-root": { color: "red" },
              }}
            />
          </Box>
          <Box
            className="col-12 col-md-6 col-lg-6 col-sm-12"
            sx={{
              marginTop: { sm: "8px", xs: "8px" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Select BirthDate:</span>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{ marginTop: 1 }}
                onChange={(date) => formik.setFieldValue("birthDate", date)}
                value={formik.values.birthDate}
                disableFuture
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    error:
                      formik.touched.birthDate && !!formik.errors.birthDate,
                    helperText:
                      formik.touched.birthDate &&
                      typeof formik.errors.birthDate === "string"
                        ? formik.errors.birthDate
                        : "",
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
          <Box
            className="col-12 col-md-6 col-lg-6 col-sm-12"
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <span>Mobile Number:</span>
            <TextField
              required
              fullWidth
              className="login-textfield"
              id="mobileNumber"
              label="Mobile Number"
              name="mobileNumber"
              value={formik.values.mobileNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.mobileNumber && !!formik.errors.mobileNumber
              }
              helperText={
                formik.touched.mobileNumber && formik.errors.mobileNumber
              }
              sx={{
                marginTop: 1,
                "& .MuiFormHelperText-root": { color: "red" },
              }}
            />
          </Box>
          <Box
            className="col-12 col-md-6 col-lg-6 col-sm-12"
            sx={{
              marginTop: { sm: "8px", xs: "8px" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Select Country:</span>
            <FormControl
              fullWidth
              sx={{ marginTop: 1 }}
              error={formik.touched.countryId && !!formik.errors.countryId}
            >
              <InputLabel id="courseId-label">Country</InputLabel>
              <Select
                readOnly
                sx={{ backgroundColor: "#D3D3D3" }}
                labelId="courseId-label"
                id="countryId"
                value={formik.values.countryId}
                label="Country"
                name="countryId"
                onChange={(e) => {
                  formik.setFieldValue("countryId", e.target.value);
                }}
                onBlur={formik.handleBlur}
              >
                <MenuItem value={0}>
                  <em>None</em>
                </MenuItem>
                {countries.map((country: CountryProps) => (
                  <MenuItem value={country.countryId} key={country.countryId}>
                    {country.countryName}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.countryId && formik.errors.countryId && (
                <FormHelperText>{formik.errors.countryId}</FormHelperText>
              )}
            </FormControl>
          </Box>
          <Box
            className="col-12 col-md-6 col-lg-6 col-sm-12"
            sx={{
              marginTop: { sm: "8px", xs: "8px" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Select State:</span>
            <FormControl
              fullWidth
              sx={{ marginTop: 1 }}
              error={formik.touched.stateId && !!formik.errors.stateId}
            >
              <InputLabel id="gender-label">State</InputLabel>
              <Select
                sx={{ backgroundColor: "#D3D3D3" }}
                readOnly
                labelId="gender-label"
                id="stateId"
                value={formik.values.stateId}
                label="State"
                name="stateId"
                onChange={(e) =>
                  formik.setFieldValue("stateId", e.target.value)
                }
                onBlur={formik.handleBlur}
              >
                <MenuItem value={0}>
                  <em>None</em>
                </MenuItem>
                {states.map((state: StateProps) => (
                  <MenuItem value={state.stateId} key={state.stateId}>
                    {state.stateName}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.stateId && formik.errors.stateId && (
                <FormHelperText>{formik.errors.stateId}</FormHelperText>
              )}
            </FormControl>
          </Box>
          <Box
            className="col-12 col-md-6 col-lg-6 col-sm-12"
            sx={{
              marginTop: { sm: "8px", xs: "8px" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Select City:</span>
            <FormControl
              fullWidth
              sx={{ marginTop: 1 }}
              error={formik.touched.countryId && !!formik.errors.countryId}
            >
              <InputLabel id="courseId-label">City</InputLabel>
              <Select
                labelId="courseId-label"
                id="cityId"
                value={formik.values.cityId}
                label="City"
                name="cityId"
                onChange={(e) => {
                  const selectedCityId = e.target.value;
                  const selectedCity = cities.find(
                    (city: CityProps) => city.cityId === selectedCityId
                  );
                  if (selectedCity) {
                    // Set the selected values in formik state
                    formik.setFieldValue("cityId", selectedCity.cityId);
                    formik.setFieldValue("stateId", selectedCity.stateId);
                    formik.setFieldValue("countryId", selectedCity.countryId);
                  }
                }}
                onBlur={formik.handleBlur}
              >
                <MenuItem value={0}>
                  <em>None</em>
                </MenuItem>
                {cities.map((city: CityProps) => (
                  <MenuItem value={city.cityId} key={city.cityId}>
                    {city.cityName}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.cityId && formik.errors.cityId && (
                <FormHelperText>{formik.errors.cityId}</FormHelperText>
              )}
            </FormControl>
          </Box>
          <Box
            className="col-12 col-md-6 col-lg-6 col-sm-12"
            sx={{
              marginTop: { sm: "8px", xs: "8px" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>PostalCode:</span>
            <TextField
              required
              fullWidth
              className="login-textfield"
              id="postalCode"
              label="PostalCode"
              name="postalCode"
              value={formik.values.postalCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.postalCode && !!formik.errors.postalCode}
              helperText={formik.touched.postalCode && formik.errors.postalCode}
              sx={{
                marginTop: 1,
                "& .MuiFormHelperText-root": { color: "red" },
              }}
            />
          </Box>

          <Box
            className="col-12 col-md-6 col-lg-6 col-sm-12"
            sx={{
              marginTop: { sm: "8px", xs: "8px" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>UserName:</span>
            <TextField
              required
              fullWidth
              className="login-textfield"
              id="userName"
              label="UserName"
              name="userName"
              value={formik.values.userName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.userName && !!formik.errors.userName}
              helperText={formik.touched.userName && formik.errors.userName}
              sx={{
                marginTop: 1,
                "& .MuiFormHelperText-root": { color: "red" },
              }}
            />
          </Box>

          <Box
            className="col-12 col-md-6 col-lg-6 col-sm-12"
            sx={{
              marginTop: { sm: "8px", xs: "8px" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Email:</span>
            <TextField
              required
              fullWidth
              className="login-textfield"
              id="email"
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && !!formik.errors.email}
              helperText={formik.touched.email && formik.errors.email}
              sx={{
                marginTop: 1,
                "& .MuiFormHelperText-root": { color: "red" },
              }}
            />
          </Box>
          <Box
            className="Dashboard-fileUpload-box"
            sx={{ marginTop: 3, display: "flex", flexDirection: "column" }}
          >
            <span className="mb-3">Select Image:</span>
            <button type="button" className="upload-btn d-flex gap-2">
              Upload
            </button>
            <input
              className="mb-3"
              type="file"
              id="myinputfile"
              name="file"
              onChange={(event) => handleFileChange(event)}
              onBlur={formik.handleBlur}
            />
            {formik.touched.file && !!formik.errors.file && (
              <Typography variant="body2" color="error">
                {formik.errors.file}
              </Typography>
            )}
            {oldImage && (
              <Box
                sx={{
                  position: "absolute",
                  backgroundColor: "white",
                  zIndex: 100000,
                  marginTop: "45px",
                  width: "50%",
                }}
              >
                <Typography>{initialData?.imageName}</Typography>
              </Box>
            )}
            {/* Preview the image */}
            {imagePreview && (
              <Box sx={{ marginTop: 2 }}>
                <img
                  src={imagePreview}
                  alt="File Preview"
                  style={{ maxWidth: "200px", maxHeight: "200px" }}
                />
              </Box>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 3 }}>
            <Button
              onClick={onClose}
              type="button"
              fullWidth
              sx={{ backgroundColor: "#800000", color: "white", marginTop: 2 }}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              type="submit"
              sx={{ backgroundColor: "#6a6cf6", color: "white", marginTop: 2 }}
            >
              Submit
            </Button>
          </Box>
        </form>
      </DialogContent>
    </BootstrapDialog>
  );
};

interface HodProfilePictureProps {
  imageName: string;
  imageUrl: string;
  firstName: string;
  lastName: string;
}

interface ProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  hodId: number;
  initialData?: HodProfilePictureProps | null;
}

export const EditProfilePictureModel: React.FC<ProfilePictureModalProps> = ({
  isOpen,
  onClose,
  hodId,
  initialData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();
  const validationSchema = Yup.object({
    firstName: Yup.string().required("Please Enter FirstName").max(50),
    lastName: Yup.string().required("Please Enter LastName").max(50),
    file:
      hodId != null && hodId != 0
        ? Yup.mixed().notRequired()
        : Yup.mixed().required("Please Upload Image."),
  });

  interface FormValues {
    firstName: string | null;
    lastName: string | null;
    file: File | null;
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      file: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      let hodModel = {
        Id: hodId,
        FirstName: values.firstName,
        LastName: values.lastName,
        ImageName: values.file?.name,
      };
      const formData = {
        ControllerName: "Hod",
        MethodName: "UpdateHodProfilePicture",
        DataObject: JSON.stringify(hodModel),
        RoleIds: ["1"],
      };

      var response = await CallAPI(formData);
      if (response.isSuccess == true && hodModel.ImageName != null) {
        var response1 = await CallAPIForFileUpload(values.file, "HodProfiles");
        var imageUrl =
          "https://localhost:7199/HodProfiles/" + hodModel.ImageName;
        sessionStorage.setItem("ProfilePicture", imageUrl);
        if (response1.statusCode == 200) {
          window.location.reload();
        }
      } else if (response.isSuccess == true) {
        window.location.reload();
      } else {
        router.replace("/login");
      }
    },
  });

  useEffect(() => {
    const loadingData = async () => {
      if (hodId != 0) {
        try {
          if (initialData?.imageUrl) {
            setImagePreview(initialData.imageUrl);
          }
          formik.setValues({
            firstName: initialData?.firstName ?? "",
            lastName: initialData?.lastName ?? "",
            file: null,
          });
        } catch (error) {
          console.error("Failed to load notice data", error);
        } finally {
        }
      } else {
        setImagePreview(null);
        formik.setValues({
          firstName: "",
          lastName: "",
          file: null,
        });
      }
    };
    loadingData();
  }, [initialData]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue("file", file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };
  return (
    <BootstrapDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={isOpen}
      scroll="body"
      sx={{ maxHeight: "100vh", overflowY: "auto" }}
    >
      <DialogTitle
        sx={{ m: 0, p: 2, backgroundColor: "#4c8cf8", color: "white" }}
        id="customized-dialog-title"
      >
        Edit Hod Profile Details
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
        <form className="login-form w-100" onSubmit={formik.handleSubmit}>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 4,
            }}
          >
            <Box
              sx={{
                position: "relative",
                marginTop: 2,
                borderRadius: "50%",
                height: "150px",
                border: "5px solid white",
                width: "150px",
                display: "flex",
              }}
            >
              <Avatar
                sx={{ width: "100%", height: "100%" }}
                alt="Travis Howard"
                src={imagePreview ?? ""}
              />
              <EditIcon
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  position: "absolute",
                  bottom: "0px",
                  right: "5px",
                  padding: "5px",
                  width: "32px",
                  height: "32px",
                  backgroundColor: "orange",
                  color: "black",
                  border: "none",
                  borderRadius: "50%",
                }}
                fontSize="small"
              />

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </Box>
          </Box>

          <Box className="row">
            <Box
              className="col-12 col-md-6 col-lg-6 col-sm-12"
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <span>First Name:</span>
              <TextField
                margin="normal"
                required
                className="login-textfield"
                fullWidth
                id="firstName"
                label="FirstName"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.firstName && !!formik.errors.firstName}
                helperText={formik.touched.firstName && formik.errors.firstName}
                sx={{
                  marginTop: 1,
                  "& .MuiFormHelperText-root": { color: "red" },
                }}
              />
            </Box>
            <Box
              className="col-12 col-md-6 col-lg-6 col-sm-12"
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <span>Last Name:</span>
              <TextField
                required
                fullWidth
                className="login-textfield"
                id="lastName"
                label="Last Name"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.lastName && !!formik.errors.lastName}
                helperText={formik.touched.lastName && formik.errors.lastName}
                sx={{
                  marginTop: 1,
                  "& .MuiFormHelperText-root": { color: "red" },
                }}
              />
              <Box sx={{ display: "flex", gap: 3 }}>
                <Button
                  onClick={onClose}
                  type="button"
                  fullWidth
                  sx={{
                    backgroundColor: "#800000",
                    color: "white",
                    marginTop: 2,
                  }}
                >
                  Cancel
                </Button>
                <Button
                  fullWidth
                  type="submit"
                  sx={{
                    backgroundColor: "#6a6cf6",
                    color: "white",
                    marginTop: 2,
                  }}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Box>
        </form>
      </DialogContent>
    </BootstrapDialog>
  );
};

interface HodPersonalInformationProps {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  userName: string;
  birthDate: Date;
}

interface HodEditPersonalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  hodId: number;
  initialData?: HodPersonalInformationProps | null;
}

export const EditHodPersonalInfoModel: React.FC<
  HodEditPersonalInfoModalProps
> = ({ isOpen, onClose, hodId, initialData }) => {
  const router = useRouter();
  const currentDateMinusOneDay = dayjs().subtract(0, "day");
  const validationSchema = Yup.object({
    firstName: Yup.string().required("Please Enter FirstName").max(50),
    lastName: Yup.string().required("Please Enter LastName").max(50),
    userName: Yup.string().required("Please Enter UserName").max(50),
    birthDate: Yup.date()
      .required("Please Select BirthDate")
      .test("is-after", "Selected date cannot be in future", (value) => {
        // Convert the value to a dayjs object if it's not already one
        return dayjs(value).isBefore(currentDateMinusOneDay, "day");
      }),
    email: Yup.string()
      .required("Please Enter an Email Address")
      .email("Please Enter Valid Email Address"),
    mobileNumber: Yup.string()
      .required("Please Enter Mobile Number")
      .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
  });

  interface FormValues {
    firstName: string | null;
    lastName: string | null;
    userName: string | null;
    birthDate: any;
    email: string | null;
    mobileNumber: string;
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      birthDate: null,
      userName: "",
      mobileNumber: "",
      email: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      let hodModel = {
        Id: hodId,
        FirstName: values.firstName,
        LastName: values.lastName,
        UserName: values.userName,
        BirthDate: new Date(values.birthDate),
        Email: values.email,
        MobileNumber: values.mobileNumber,
      };
      const formData = {
        ControllerName: "Hod",
        MethodName: "UpdateHodPersonalInfo",
        DataObject: JSON.stringify(hodModel),
        RoleIds: ["1"],
      };

      var response = await CallAPI(formData);
      if (response.statusCode == 200) {
        window.location.reload();
      } else {
        router.replace("/login");
      }
    },
  });

  useEffect(() => {
    const loadingData = async () => {
      if (hodId != 0) {
        try {
          formik.setValues({
            firstName: initialData?.firstName ?? "",
            lastName: initialData?.lastName ?? "",
            userName: initialData?.userName ?? "",
            email: initialData?.email ?? "",
            birthDate: initialData?.birthDate
              ? dayjs(initialData.birthDate)
              : null,
            mobileNumber: initialData?.mobileNumber ?? "",
          });
        } catch (error) {
          console.error("Failed to load notice data", error);
        } finally {
        }
      } else {
        formik.setValues({
          firstName: "",
          lastName: "",
          userName: "",
          email: "",
          mobileNumber: "",
          birthDate: null,
        });
      }
    };
    loadingData();
  }, [initialData]);

  return (
    <BootstrapDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={isOpen}
      scroll="body"
      sx={{ maxHeight: "100vh", overflowY: "auto" }}
    >
      <DialogTitle
        sx={{ m: 0, p: 2, backgroundColor: "#4c8cf8", color: "white" }}
        id="customized-dialog-title"
      >
        Edit Hod Details
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
        <form className="login-form w-100 row" onSubmit={formik.handleSubmit}>
          <Box
            className="col-12 col-md-6 col-lg-6 col-sm-12"
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <span>First Name:</span>
            <TextField
              margin="normal"
              required
              className="login-textfield"
              fullWidth
              id="firstName"
              label="FirstName"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.firstName && !!formik.errors.firstName}
              helperText={formik.touched.firstName && formik.errors.firstName}
              sx={{
                marginTop: 1,
                "& .MuiFormHelperText-root": { color: "red" },
              }}
            />
          </Box>
          <Box
            className="col-12 col-md-6 col-lg-6 col-sm-12"
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <span>Last Name:</span>
            <TextField
              required
              fullWidth
              className="login-textfield"
              id="lastName"
              label="Last Name"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.lastName && !!formik.errors.lastName}
              helperText={formik.touched.lastName && formik.errors.lastName}
              sx={{
                marginTop: 1,
                "& .MuiFormHelperText-root": { color: "red" },
              }}
            />
          </Box>
          <Box
            className="col-12 col-md-6 col-lg-6 col-sm-12"
            sx={{
              marginTop: { sm: "8px", xs: "8px" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Select BirthDate:</span>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{ marginTop: 1 }}
                onChange={(date) => formik.setFieldValue("birthDate", date)}
                value={formik.values.birthDate}
                disableFuture
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    error:
                      formik.touched.birthDate && !!formik.errors.birthDate,
                    helperText:
                      formik.touched.birthDate &&
                      typeof formik.errors.birthDate === "string"
                        ? formik.errors.birthDate
                        : "",
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
          <Box
            className="col-12 col-md-6 col-lg-6 col-sm-12"
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <span>Mobile Number:</span>
            <TextField
              required
              fullWidth
              className="login-textfield"
              id="mobileNumber"
              label="Mobile Number"
              name="mobileNumber"
              value={formik.values.mobileNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.mobileNumber && !!formik.errors.mobileNumber
              }
              helperText={
                formik.touched.mobileNumber && formik.errors.mobileNumber
              }
              sx={{
                marginTop: 1,
                "& .MuiFormHelperText-root": { color: "red" },
              }}
            />
          </Box>

          <Box
            className="col-12 col-md-6 col-lg-6 col-sm-12"
            sx={{
              marginTop: { sm: "8px", xs: "8px" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>UserName:</span>
            <TextField
              required
              fullWidth
              className="login-textfield"
              id="userName"
              label="UserName"
              name="userName"
              value={formik.values.userName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.userName && !!formik.errors.userName}
              helperText={formik.touched.userName && formik.errors.userName}
              sx={{
                marginTop: 1,
                "& .MuiFormHelperText-root": { color: "red" },
              }}
            />
          </Box>

          <Box
            className="col-12 col-md-6 col-lg-6 col-sm-12"
            sx={{
              marginTop: { sm: "8px", xs: "8px" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Email:</span>
            <TextField
              required
              fullWidth
              className="login-textfield"
              id="email"
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && !!formik.errors.email}
              helperText={formik.touched.email && formik.errors.email}
              sx={{
                marginTop: 1,
                "& .MuiFormHelperText-root": { color: "red" },
              }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 3 }}>
            <Button
              onClick={onClose}
              type="button"
              fullWidth
              sx={{ backgroundColor: "#800000", color: "white", marginTop: 2 }}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              type="submit"
              sx={{ backgroundColor: "#6a6cf6", color: "white", marginTop: 2 }}
            >
              Submit
            </Button>
          </Box>
        </form>
      </DialogContent>
    </BootstrapDialog>
  );
};

interface HodAddressInfoProps {
  countryId: number;
  cityId: number;
  stateId: number;
  postalCode: string;
}

interface HodAddressInfoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  hodId: number;
  initialData?: HodAddressInfoProps | null;
}

export const EditHodAddressInfoModel: React.FC<
  HodAddressInfoEditModalProps
> = ({ isOpen, onClose, hodId, initialData }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [countries, setCountries] = useState<CountryProps[]>([]);
  const [states, setstates] = useState<StateProps[]>([]);
  const [cities, setCities] = useState<CityProps[]>([]);
  const router = useRouter();
  const validationSchema = Yup.object({
    countryId: Yup.number()
      .required("Please Select Country")
      .min(1, "Please Select Country"),
    stateId: Yup.number()
      .required("Please Select State")
      .min(1, "Please Select State"),
    cityId: Yup.number()
      .required("Please Select City")
      .min(1, "Please Select City"),
    postalCode: Yup.string()
      .required("Please Enter PostalCode")
      .max(6, "Please Enter valid PostalCode"),
  });

  interface FormValues {
    countryId: number;
    stateId: number;
    cityId: number;
    postalCode: string;
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      countryId: 0,
      stateId: 0,
      cityId: 0,
      postalCode: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      let hodModel = {
        Id: hodId,
        CountryId: values.countryId,
        StateId: values.stateId,
        CityId: values.cityId,
        PostalCode: values.postalCode,
      };
      const formData = {
        ControllerName: "Hod",
        MethodName: "UpdateHodAddressInfo",
        DataObject: JSON.stringify(hodModel),
        RoleIds: ["1"],
      };

      var response = await CallAPI(formData);
      if (response.statusCode == 200) {
        window.location.reload();
      } else {
        router.replace("/login");
      }
    },
  });

  useEffect(() => {
    const getCountries = async () => {
      const formData = {
        ControllerName: "Hod",
        MethodName: "GetAllCountiesStatesCities",
        DataObject: JSON.stringify(null),
        RoleIds: ["1"],
      };

      var response = await CallAPI(formData);
      if (response.isSuccess == true) {
        const conStateCity: ConStateCityProp = response.result.data;
        setCountries(conStateCity.countries);
        setCities(conStateCity.cities);
        setstates(conStateCity.states);
      }
    };
    getCountries();
  }, []);

  useEffect(() => {
    const loadingData = async () => {
      setIsLoading(true);
      if (hodId != 0) {
        try {
          formik.setValues({
            countryId: initialData?.countryId ?? 0,
            stateId: initialData?.stateId ?? 0,
            cityId: initialData?.cityId ?? 0,
            postalCode: initialData?.postalCode ?? "",
          });
        } catch (error) {
          console.error("Failed to load notice data", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        formik.setValues({
          countryId: 0,
          stateId: 0,
          cityId: 0,
          postalCode: "",
        });
      }
    };
    loadingData();
  }, [initialData]);

  return (
    <BootstrapDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={isOpen}
      scroll="body"
      sx={{ maxHeight: "100vh", overflowY: "auto" }}
    >
      <DialogTitle
        sx={{ m: 0, p: 2, backgroundColor: "#4c8cf8", color: "white" }}
        id="customized-dialog-title"
      >
        Edit Hod Details
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
        <form className="login-form w-100 row" onSubmit={formik.handleSubmit}>
          <Box
            className="col-12 col-md-6 col-lg-6 col-sm-12"
            sx={{
              marginTop: { sm: "8px", xs: "8px" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Select Country:</span>
            <FormControl
              fullWidth
              sx={{ marginTop: 1 }}
              error={formik.touched.countryId && !!formik.errors.countryId}
            >
              <InputLabel id="courseId-label">Country</InputLabel>
              <Select
                readOnly
                sx={{ backgroundColor: "#D3D3D3" }}
                labelId="courseId-label"
                id="countryId"
                value={formik.values.countryId}
                label="Country"
                name="countryId"
                onChange={(e) => {
                  formik.setFieldValue("countryId", e.target.value);
                }}
                onBlur={formik.handleBlur}
              >
                <MenuItem value={0}>
                  <em>None</em>
                </MenuItem>
                {countries.map((country: CountryProps) => (
                  <MenuItem value={country.countryId} key={country.countryId}>
                    {country.countryName}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.countryId && formik.errors.countryId && (
                <FormHelperText>{formik.errors.countryId}</FormHelperText>
              )}
            </FormControl>
          </Box>
          <Box
            className="col-12 col-md-6 col-lg-6 col-sm-12"
            sx={{
              marginTop: { sm: "8px", xs: "8px" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Select State:</span>
            <FormControl
              fullWidth
              sx={{ marginTop: 1 }}
              error={formik.touched.stateId && !!formik.errors.stateId}
            >
              <InputLabel id="gender-label">State</InputLabel>
              <Select
                sx={{ backgroundColor: "#D3D3D3" }}
                readOnly
                labelId="gender-label"
                id="stateId"
                value={formik.values.stateId}
                label="State"
                name="stateId"
                onChange={(e) =>
                  formik.setFieldValue("stateId", e.target.value)
                }
                onBlur={formik.handleBlur}
              >
                <MenuItem value={0}>
                  <em>None</em>
                </MenuItem>
                {states.map((state: StateProps) => (
                  <MenuItem value={state.stateId} key={state.stateId}>
                    {state.stateName}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.stateId && formik.errors.stateId && (
                <FormHelperText>{formik.errors.stateId}</FormHelperText>
              )}
            </FormControl>
          </Box>
          <Box
            className="col-12 col-md-6 col-lg-6 col-sm-12"
            sx={{
              marginTop: { sm: "8px", xs: "8px" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Select City:</span>
            <FormControl
              fullWidth
              sx={{ marginTop: 1 }}
              error={formik.touched.countryId && !!formik.errors.countryId}
            >
              <InputLabel id="courseId-label">City</InputLabel>
              <Select
                labelId="courseId-label"
                id="cityId"
                value={formik.values.cityId}
                label="City"
                name="cityId"
                onChange={(e) => {
                  const selectedCityId = e.target.value;
                  const selectedCity = cities.find(
                    (city: CityProps) => city.cityId === selectedCityId
                  );
                  if (selectedCity) {
                    // Set the selected values in formik state
                    formik.setFieldValue("cityId", selectedCity.cityId);
                    formik.setFieldValue("stateId", selectedCity.stateId);
                    formik.setFieldValue("countryId", selectedCity.countryId);
                  }
                }}
                onBlur={formik.handleBlur}
              >
                <MenuItem value={0}>
                  <em>None</em>
                </MenuItem>
                {cities.map((city: CityProps) => (
                  <MenuItem value={city.cityId} key={city.cityId}>
                    {city.cityName}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.cityId && formik.errors.cityId && (
                <FormHelperText>{formik.errors.cityId}</FormHelperText>
              )}
            </FormControl>
          </Box>
          <Box
            className="col-12 col-md-6 col-lg-6 col-sm-12"
            sx={{
              marginTop: { sm: "8px", xs: "8px" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>PostalCode:</span>
            <TextField
              required
              fullWidth
              className="login-textfield"
              id="postalCode"
              label="PostalCode"
              name="postalCode"
              value={formik.values.postalCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.postalCode && !!formik.errors.postalCode}
              helperText={formik.touched.postalCode && formik.errors.postalCode}
              sx={{
                marginTop: 1,
                "& .MuiFormHelperText-root": { color: "red" },
              }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 3 }}>
            <Button
              onClick={onClose}
              type="button"
              fullWidth
              sx={{ backgroundColor: "#800000", color: "white", marginTop: 2 }}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              type="submit"
              sx={{ backgroundColor: "#6a6cf6", color: "white", marginTop: 2 }}
            >
              Submit
            </Button>
          </Box>
        </form>
      </DialogContent>
    </BootstrapDialog>
  );
};

interface ViewHodProfileProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: HodProps | null;
}
export const ViewHodProfileModal: React.FC<ViewHodProfileProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  return (
    <BootstrapDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={isOpen}
      scroll="body"
      sx={{ maxHeight: "100vh", overflowY: "auto" }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          m: 0,
          p: 2,
          backgroundColor: "#4c8cf8",
          borderRadius: "0px 0px 20px 20px",
          color: "white",
        }}
        id="customized-dialog-title"
      >
        Profile
        <Box
          sx={{
            marginTop: 2,
            borderRadius: "50%",
            height: "150px",
            border: "5px solid white",
            width: "150px",
          }}
        >
          <Avatar
            sx={{ width: "100%", height: "100%" }}
            alt="Travis Howard"
            src={initialData?.imageUrl ?? ""}
          />
        </Box>
        <Typography
          sx={{ color: "white", fontWeight: "600", marginTop: 2, fontSize: 18 }}
        >
          {initialData?.firstName + " " + initialData?.lastName}
        </Typography>
        <Typography
          sx={{ color: "#F3E5AB", fontWeight: "450", marginTop: 0.2 }}
        >
          Hod
        </Typography>
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
        <Box sx={{ display: "flex", gap: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EmailIcon />
          </Box>
          <Box>
            Email
            <Typography sx={{ fontWeight: "600" }}>
              {initialData?.email}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2, border: 1 }} variant="middle" />
        <Box sx={{ display: "flex", gap: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PhoneAndroidIcon />
          </Box>
          <Box>
            Mobile
            <Typography sx={{ fontWeight: "600" }}>
              {initialData?.mobileNumber}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2, border: 1 }} variant="middle" />
        <Box sx={{ display: "flex", gap: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DateRangeIcon />
          </Box>
          <Box>
            BirthDate
            <Typography sx={{ fontWeight: "600" }}>
              {new Date(
                initialData?.birthDate ?? new Date()
              ).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2, border: 1 }} variant="middle" />
        <Box sx={{ display: "flex", gap: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AccountCircleIcon />
          </Box>
          <Box>
            UserName
            <Typography sx={{ fontWeight: "600" }}>
              {initialData?.userName}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  );
};

interface StudentAttendanceDataProps {
  studentId: number;
  firstName: string;
  lastName: string;
  imageName: string;
  imageUrl: string;
  status: boolean;
}

interface SubmitAttendanceModal {
  isOpen: boolean;
  onClose: () => void;
  initialData?: StudentAttendanceDataProps[] | null;
}

interface AttendanceState {
  [studentId: number]: boolean;
}
interface AttendanceWithStudentId {
  StudentId: number;
  Status: boolean;
}
export const SubmitAttendanceModal: React.FC<SubmitAttendanceModal> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const router = useRouter();
  const [studentAttendanceStatus, setStudentAttendanceStatus] =
    useState<AttendanceState>();
  useEffect(() => {
    const attendanceStatus: AttendanceState = {};
    initialData?.map((student) => {
      attendanceStatus[student.studentId] = student.status;
    });
    setStudentAttendanceStatus(attendanceStatus);
  }, [initialData]);

  const handleAttendanceStatusChange = (studnetId: number, value: string) => {
    setStudentAttendanceStatus((prev) => ({
      ...prev,
      [studnetId]: value == "1" ? true : false,
    }));
  };

  const onSumit = async () => {
    if (studentAttendanceStatus) {
      const AttedancesWithStudentId: AttendanceWithStudentId[] = [];
      Object.entries(studentAttendanceStatus).forEach(([studentId, status]) => {
        AttedancesWithStudentId.push({
          StudentId: parseInt(studentId),
          Status: status,
        });
      });

      let attendanceModel = {
        AttedancesWithStudentId: AttedancesWithStudentId,
      };
      const formData = {
        ControllerName: "Student",
        MethodName: "SubmitAttendanceByHod",
        DataObject: JSON.stringify(attendanceModel),
        RoleIds: ["1"],
      };

      var response = await CallAPI(formData);
      if (response.statusCode == 200) {
        window.location.reload();
      } else {
        router.replace("/login");
      }
    }
  };
  return (
    <BootstrapDialog
      scroll="body"
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={isOpen}
    >
      <DialogTitle
        sx={{ m: 0, p: 2, backgroundColor: "#4c8cf8", color: "white" }}
        id="customized-dialog-title"
      >
        Submit Today's Attendance
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
      <DialogContent
        dividers
        sx={{
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        {initialData?.map((student) => (
          <Box className="submit-attendance-dialog-content" key={student.studentId}>
            <Box className="submit-attendance-image-box">
              <Avatar
                sx={{ width: "100%", height: "100%" }}
                alt="Travis Howard"
                src={student?.imageUrl ?? ""}
              />
            </Box>
            <Box>
              <Typography>
                {student.firstName} {student.lastName}
              </Typography>
            </Box>
            <Box>
              {/* <Typography
                sx={{
                  color: student.status ? "green" : "red",
                }}
              >
                {student.status ? "Present" : "Absent"}
              </Typography> */}

              <select
                className={
                  studentAttendanceStatus?.[student.studentId]
                    ? "submit-attendance-model-select-true"
                    : "submit-attendance-model-select-false"
                }
                value={studentAttendanceStatus?.[student.studentId] ? "1" : "0"}
                onChange={(e) =>
                  handleAttendanceStatusChange(
                    student.studentId,
                    e.target.value
                  )
                }
              >
                <option value="1" style={{ color: "green" }}>
                  Present
                </option>
                <option value="0" style={{ color: "red" }}>
                  Absent
                </option>
              </select>
            </Box>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            fullWidth
            onClick={onClose}
            sx={{
              backgroundColor: "grey",
              color: "white",
              marginTop: 2,
            }}
          >
            Cancel
          </Button>

          <Button
          onClick={onSumit}
            fullWidth
            type="button"
            sx={{
              backgroundColor: "#6a6cf6",
              color: "white",
              marginTop: 2,
            }}
          >
            Submit
          </Button>
        </Box>
      </DialogActions>
    </BootstrapDialog>
  );
};
