import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  FormControl,
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
import { useFormik } from "formik";
import * as Yup from "yup";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Widgets } from "@mui/icons-material";
import dayjs from "dayjs";
import { ChangeEvent, useEffect, useState } from "react";
import { CallAPI, CallAPIForFileUpload } from "../../APICall/callApi";
import { useNavigate } from "react-router-dom";
import { GetNoticeDetailsById } from "../Hod/AdminDashboard's";
import React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
interface DeleteModalProps {
  isOpen: boolean;
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
        Delete Notice
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
          Are you Sure you want to delete this notice?
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
  const navigate = useNavigate();
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

      console.log(values);
      const formData = {
        ControllerName: "Hod",
        MethodName: "UpsertNoticeDetails",
        DataObject: JSON.stringify(noticeModel),
        RoleIds: ["1"],
      };

      var response = await CallAPI(formData);
      if (response.isSuccess == true && noticeModel.ImageName != null) {
        var response1 = await CallAPIForFileUpload(values.file);
        if (response1.statusCode == 200) {
          window.location.reload();
        }
      } else if (response.isSuccess == true) {
        window.location.reload();
      } else {
        navigate("/login");
      }
    },
    // var response = await CallLoginAPI(formData);
    //   if (response.result != null && response.result.data.jwtToken != null) {
    //     v
    // },
  });

  useEffect(() => {
    const loadingData = async () => {
      console.log("loading data");
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
            sx={{ backgroundColor: "#6a6cf6", color: "white", marginTop: 2 }}
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
      console.log("submit");
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
                <DemoContainer
                  components={["DatePicker", "DatePicker", "DatePicker"]}
                >
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
                </DemoContainer>
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
