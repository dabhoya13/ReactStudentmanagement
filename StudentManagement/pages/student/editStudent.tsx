import { useRouter } from "next/router";
import style from "../../../styles/editStudent.module.css";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import FileOpenOutlinedIcon from "@mui/icons-material/FileOpenOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import EnhancedEncryptionOutlinedIcon from "@mui/icons-material/EnhancedEncryptionOutlined";
import PDFIcon from "../../public/Images/PDF_file_icon.svg.png";
import * as Yup from "yup";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  TextField,
} from "@mui/material";
import {
  ClearIcon,
  DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";
import {
  GetStudentDetailsById,
  ParentsProps,
  StudentDataProps,
  StudentDocumentProps,
} from "@/utils/adminUtils/allStudent's";
import {
  ClassesProps,
  CoursesProps,
  GetAllClasses,
} from "@/utils/studentUtils/studentDashboard's";
import dayjs from "dayjs";
import { useFormik } from "formik";
import {
  CallAPI,
  CallAPIForFileUpload,
  CallAPIForStudentDocumentsUpload,
  CallAPIForStudentFileUpload,
} from "@/pages/api/callApi";

interface EditStudentProps {
  studentId: number;
}

const EditStudent: React.FC = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<CoursesProps[]>([]);
  const [classes, setClasses] = useState<ClassesProps[]>([]);

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [fatherprofileImage, setFatherProfileImage] = useState<string | null>(
    null
  );
  const [motherProfileImage, setMotherProfileImage] = useState<string | null>(
    null
  );

  const [documentNames, setDocumentNames] = useState<string[]>([]);
  const [documents, setDocuments] = useState<StudentDocumentProps[]>([]);
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const [deletedDocuments, setDeletedDocuments] = useState<
    StudentDocumentProps[]
  >([]);
  const currentDateMinusOneDay = dayjs().subtract(1, "day");
  const [slideIndex, setSlideIndex] = useState<number>(1);
  const [deleteSlideIndex, setDeleteSlideIndex] = useState<number>(1);

  const plusDivs = (n: number) => {
    setSlideIndex((prevIndex) => {
      const newIndex = prevIndex + n;
      if (newIndex > documents.length) return 1;
      if (newIndex < 1) return documents.length;
      return newIndex;
    });
  };

  const plusDeletedDivs = (n: number) => {
    setDeleteSlideIndex((prevIndex) => {
      const newIndex = prevIndex + n;
      if (newIndex > deletedDocuments.length) return 1;
      if (newIndex < 1) return deletedDocuments.length;
      return newIndex;
    });
  };

  const handleProfileImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      formik.setFieldValue("file", file);
      const imgUrl = URL.createObjectURL(file);
      setProfileImage(imgUrl);
    }
  };

  const handleFatherProfileImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      formik.setFieldValue("fatherFile", file);
      const imgUrl = URL.createObjectURL(file);
      setFatherProfileImage(imgUrl);
    }
  };

  const handleMotherProfileImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      formik.setFieldValue("motherFile", file);
      const imgUrl = URL.createObjectURL(file);
      setMotherProfileImage(imgUrl);
    }
  };

  const handleUploadDocumentChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const filesName = Array.from(event.target.files).map((file) => file.name);
      setDocumentNames(filesName);
      setDocumentFiles(files);
    }
  };

  const validationSchema = Yup.object({
    academicYear: Yup.string().required("Academic Year Required"),
    admissionDate: Yup.date()
      .required("Please Select AdmissionDate")
      .test("is-after", "Selected date cannot be in future", (value) => {
        // Convert the value to a dayjs object if it's not already one
        return dayjs(value).isBefore(currentDateMinusOneDay, "day");
      }),
    firstName: Yup.string().required("Please Enter FirstName").max(50),
    lastName: Yup.string().required("Please Enter LastName").max(50),
    courseId: Yup.number()
      .required("Please Select Course")
      .min(1, "Please Select Course"),
    class: Yup.number()
      .required("Please Select Class")
      .min(1, "Please Select Class"),
    rollNo: Yup.number().required("Please Enter Roll No"),
    gender: Yup.number()
      .required("Please Select Gender")
      .min(1, "Please Select Gender"),
    birthDate: Yup.date()
      .required("Please Select BirthDate")
      .test("is-after", "Selected date cannot be in future", (value) => {
        // Convert the value to a dayjs object if it's not already one
        return dayjs(value).isBefore(currentDateMinusOneDay, "day");
      }),
    bloodGroup: Yup.string().notRequired(),
    religion: Yup.string().notRequired(),
    category: Yup.string().notRequired(),
    cast: Yup.string().notRequired(),
    mobileNumber: Yup.string()
      .required("Please Enter Mobile Number")
      .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
    email: Yup.string()
      .required("Please Enter an Email Address")
      .email("Please Enter Valid Email Address"),
    motherTongue: Yup.string().notRequired(),
    fatherName: Yup.string().required("Please Enter Father's name"),
    fatherEmail: Yup.string()
      .required("Please Enter Father's Email")
      .email("Please Enter Father's Email"),
    fatherNumber: Yup.string()
      .required("Please Enter Father's Number")
      .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
    fatherOccupation: Yup.string().required("Please Enter Father's Occupation"),
    motherName: Yup.string().required("Please Enter Mother's Name"),
    motherEmail: Yup.string()
      .required("Please Enter Mother's Email")
      .email("Please Enter Mother's Email"),
    motherNumber: Yup.string()
      .required("Please Enter Mother's Number")
      .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
    motherOccupation: Yup.string().required("Please Enter Mother's Occupation"),
    currentAddress: Yup.string().required("Please Enter Current Address"),
    parmanentAddress: Yup.string().required("Please Enter Parmanent Address"),
    previousSchoolName: Yup.string().notRequired(),
    previousSchoolAddress: Yup.string().notRequired(),
    userName: Yup.string().required("Please Enter UserName").max(50),
    passWord: Yup.string()
      .required("Please Enter Password")
      .max(50)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        ""
      ),
    otherDetails: Yup.string().notRequired().max(200),
    file: Yup.mixed().notRequired(),
    fatherFile: Yup.mixed().notRequired(),
    motherFile: Yup.mixed().notRequired(),
  });

  interface FormValues {
    academicYear: string;
    admissionDate: any;
    firstName: string;
    lastName: string;
    courseId: number;
    class: number;
    rollNo: number;
    gender: number;
    birthDate: any;
    bloodGroup: string;
    religion: string;
    category: string;
    cast: string;
    mobileNumber: string;
    email: string;
    motherTongue: string;
    fatherName: string;
    fatherEmail: string;
    fatherNumber: string;
    fatherOccupation: string;
    motherName: string;
    motherEmail: string;
    motherNumber: string;
    motherOccupation: string;
    currentAddress: string;
    parmanentAddress: string;
    previousSchoolName: string;
    previousSchoolAddress: string;
    userName: string;
    passWord: string;
    otherDetails: string;
    file: File | null;
    fatherFile: File | null;
    motherFile: File | null;
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      academicYear: "",
      admissionDate: "",
      firstName: "",
      lastName: "",
      courseId: 0,
      class: 0,
      rollNo: 0,
      gender: 0,
      birthDate: "",
      bloodGroup: "",
      religion: "",
      category: "",
      cast: "",
      mobileNumber: "",
      email: "",
      motherTongue: "",
      fatherName: "",
      fatherEmail: "",
      fatherNumber: "",
      fatherOccupation: "",
      motherName: "",
      motherEmail: "",
      motherNumber: "",
      motherOccupation: "",
      currentAddress: "",
      parmanentAddress: "",
      previousSchoolName: "",
      previousSchoolAddress: "",
      userName: "",
      passWord: "",
      otherDetails: "",
      file: null,
      fatherFile: null,
      motherFile: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      // console.log(values);
      const studentId = parseInt(sessionStorage.getItem("UserId") ?? "0", 10);
      const parents: ParentsProps[] = [
        {
          parentName: values.fatherName,
          parentEmail: values.fatherEmail,
          parentImage: values.fatherFile?.name ?? "",
          occupation: values.fatherOccupation,
          parentImageUrl: "",
          parentId: 0,
          parentNumber: values.fatherNumber,
          relation: 1,
        },
        {
          parentName: values.motherName,
          parentEmail: values.motherEmail,
          parentImage: values.motherFile?.name ?? "",
          occupation: values.motherOccupation,
          parentImageUrl: "",
          parentId: 0,
          parentNumber: values.motherNumber,
          relation: 2,
        },
      ];

      const documents: StudentDocumentProps[] = documentFiles
        ? documentFiles.map((doc, index) => ({
            studentDocumentId: index + 1,
            studentDocumentName: doc.name,
            studentDocumentUrl: "",
            studentId: studentId,
          }))
        : [];

      let studentModel = {
        AcademicYear: values.academicYear,
        AdmissionDate: new Date(values.admissionDate),
        FirstName: values.firstName,
        LastName: values.lastName,
        CourseId: values.courseId,
        ClassId: values.class,
        RollNo: values.rollNo,
        Gender: values.gender,
        BirthDate: new Date(values.birthDate),
        BloodGroup: values.bloodGroup,
        Reigion: values.religion,
        Category: values.category,
        Caste: values.cast,
        MobileNumber: values.mobileNumber,
        Email: values.email,
        MotherTongue: values.motherTongue,
        CurrentAddress: values.currentAddress,
        PermanentAddress: values.parmanentAddress,
        PreviousSchoolName: values.previousSchoolName,
        PreviousSchoolAddress: values.previousSchoolAddress,
        UserName: values.userName,
        PassWord: values.passWord,
        OtherInfo: values.otherDetails,
        StudentId: studentId,
        ImageName: values.file?.name,
        Parents: parents,
        Documents: documents,
        DeletedDocuments:deletedDocuments
      };
      const formData = {
        ControllerName: "Student",
        MethodName: "UpsertStudentDetails",
        DataObject: JSON.stringify(studentModel),
        RoleIds: ["1", "3"],
      };
      var response = await CallAPI(formData);
      console.log(response);
      if (response.statusCode != 200) {
        router.replace("/");
        console.log("not 200");
      } else {
        var response1 = await CallAPIForStudentFileUpload(
          values.file,
          values.motherFile,
          values.fatherFile
        );

        var response2 = await CallAPIForStudentDocumentsUpload(
          documentFiles,
          studentId
        );
        if (response1.statusCode == 200 && response2.statusCode == 200) {
          window.location.reload();
        } else {
          router.replace("/");
        }
      }
    },
    validateOnBlur: true,
    validateOnChange: true,
  });

  useEffect(() => {
    const getCourses = async () => {
      const formData = {
        ControllerName: "Course",
        MethodName: "GetAllCourses",
        DataObject: JSON.stringify(null),
        RoleIds: ["1", "3"],
      };

      var response = await CallAPI(formData);
      if (response.isSuccess == true) {
        const courses: CoursesProps[] = response.result.data;
        setCourses(courses);
      }
    };
    getCourses();

    const getAllClasses = async () => {
      const classes: ClassesProps[] = await GetAllClasses();
      setClasses(classes);
    };
    getAllClasses();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const studentId = parseInt(sessionStorage.getItem("UserId") ?? "0", 10);
      console.log(studentId);
      if (studentId !== 0) {
        const studentData = await GetStudentDetailsById(studentId);
        if (studentData != null) {
          setProfileImage(studentData.imageUrl);
          console.log(studentData);
          try {
            formik.setValues({
              academicYear: studentData?.academicYear ?? "",
              admissionDate: studentData?.admissionDate
                ? dayjs(studentData.admissionDate).format("YYYY-MM-DD")
                : "",
              firstName: studentData?.firstName ?? "",
              lastName: studentData?.lastName ?? "",
              courseId: studentData?.courseId ?? 0,
              class: studentData?.classId ?? 0,
              rollNo: studentData?.rollNo ?? null,
              gender: studentData?.gender ?? 0,
              userName: studentData?.userName ?? "",
              birthDate: studentData?.birthDate
                ? dayjs(studentData.birthDate).format("YYYY-MM-DD")
                : "",
              bloodGroup: studentData?.bloodGroup ?? "",
              religion: studentData?.reigion ?? "",
              category: studentData?.category ?? "",
              cast: studentData?.caste ?? "",
              mobileNumber: studentData?.mobileNumber ?? "",
              email: studentData?.email ?? "",
              motherTongue: studentData?.motherTongue ?? "",
              fatherName:
                studentData.parents.length > 0
                  ? studentData?.parents[0].parentName
                  : "",
              fatherEmail:
                studentData.parents.length > 0
                  ? studentData?.parents[0].parentEmail
                  : "",
              fatherNumber:
                studentData.parents.length > 0
                  ? studentData?.parents[0].parentNumber
                  : "",
              fatherOccupation:
                studentData.parents.length > 0
                  ? studentData?.parents[0].occupation
                  : "",
              motherName:
                studentData.parents.length > 0
                  ? studentData?.parents[1].parentName
                  : "",
              motherEmail:
                studentData.parents.length > 0
                  ? studentData?.parents[1].parentEmail
                  : "",
              motherNumber:
                studentData.parents.length > 0
                  ? studentData?.parents[1].parentNumber
                  : "",
              motherOccupation:
                studentData.parents.length > 0
                  ? studentData?.parents[1].occupation
                  : "",
              currentAddress: studentData?.currentAddress ?? "",
              parmanentAddress: studentData?.permanentAddress ?? "",
              previousSchoolName: studentData?.previousSchoolName ?? "",
              previousSchoolAddress: studentData?.previousSchoolAddress ?? "",
              passWord: studentData?.password ?? "",
              otherDetails: studentData?.otherInfo ?? "",
              file: null,
              fatherFile: null,
              motherFile: null,
            });
          } catch (error) {
            console.error("Failed to load notice data", error);
          } finally {
          }
          if (studentData.parents != null && studentData.parents.length > 0) {
            if (
              studentData.parents[0].relation == 1 &&
              studentData.parents[1].relation == 2
            ) {
              setFatherProfileImage(studentData.parents[0].parentImageUrl);
              setMotherProfileImage(studentData.parents[1].parentImageUrl);
            } else {
              setFatherProfileImage(studentData.parents[1].parentImageUrl);
              setMotherProfileImage(studentData.parents[0].parentImageUrl);
            }
          }
          if (
            studentData.documents != null &&
            studentData.documents.length > 0
          ) {
            console.log(studentData.documents);
            setDocuments(studentData.documents);
          }
        }
      } else {
        console.log("StudentID not string");
        // router.replace("/");
      }
    };
    fetchData();
  }, []);

  const handleFileDelete = async (document: StudentDocumentProps) => {
    console.log("click");
    setDeletedDocuments((previousDeletedDocuments) => [
      ...previousDeletedDocuments,
      document,
    ]);
    setDocuments((prevDocuments) =>
      prevDocuments.filter(
        (doc) => doc.studentDocumentId !== document.studentDocumentId
      )
    );
    setSlideIndex(1);
  };

  const handleRestoreFile = (document: StudentDocumentProps) => {
    setDocuments((prevDocuments) => [...prevDocuments, document]);

    setDeletedDocuments((prevDeletedDocuments) =>
      prevDeletedDocuments.filter(
        (deletedDoc) =>
          deletedDoc.studentDocumentId !== document.studentDocumentId
      )
    );
    setDeleteSlideIndex(1);
  };
  return (
    <>
      <h3 className="mb-3">Edit Student</h3>
      <div className="row">
        <div className="col-md-12">
          <form onSubmit={formik.handleSubmit}>
            <div className="card">
              <div className="card-header bg-lights">
                <div className="d-flex align-items-center">
                  <span
                    style={{ color: "#515B73" }}
                    className="bg-white avatar avatar-sm me-2 text-grey-7 flex-shrink-0"
                  >
                    <InfoOutlinedIcon sx={{ fontSize: "0.95rem" }} />
                  </span>
                  <h4 className="mb-0 text-dark font-weight-bold">
                    Personal Information
                  </h4>
                </div>
              </div>
              <div className="card-body pb-0">
                <div className="row">
                  <div className="col-md-12">
                    <div className="d-flex align-items-center flex-wrap row-gap-3 mb-4">
                      <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark ">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt="profile-img"
                            className="w-100 h-100 object-cover"
                          />
                        ) : (
                          <AddPhotoAlternateOutlinedIcon className="fs-16" />
                        )}
                      </div>
                      <div className="profile-upload">
                        <div className="profile-uploader d-flex align-items-center ">
                          <div className="drag-upload-btn mb-3">
                            Upload
                            <input
                              type="file"
                              className="form-control image-sign"
                              onChange={handleProfileImageChange}
                            ></input>
                          </div>
                        </div>
                        <p className="fs-6">
                          Upload image size 4MB, Format JPG, PNG, SVG
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row row-cols-xxl-5 row-cols-md-6">
                  <div className="col-xxl col-xl-3 col-md-6">
                    <div className="mb-4">
                      <label className="form-label">Academic Year</label>
                      <FormControl
                        fullWidth
                        error={
                          formik.touched.academicYear &&
                          !!formik.errors.academicYear
                        }
                      >
                        <input
                          className="edit-profile-select"
                          id="academicYear"
                          value={formik.values.academicYear}
                          name="academicYear"
                          onChange={(e) => {
                            formik.setFieldValue(
                              "academicYear",
                              e.target.value
                            );
                          }}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.academicYear &&
                          formik.errors.academicYear && (
                            <FormHelperText>
                              {formik.errors.academicYear}
                            </FormHelperText>
                          )}
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-xxl col-xl-3 col-md-6">
                    <div className="mb-4">
                      <label className="form-label">Admission Date</label>
                      <FormControl
                        fullWidth
                        error={
                          formik.touched.admissionDate &&
                          !!formik.errors.admissionDate
                        }
                      >
                        <input
                          type="date"
                          className="edit-profile-select"
                          id="admissionDate"
                          value={formik.values.admissionDate}
                          name="admissionDate"
                          onChange={(e) => {
                            formik.setFieldValue(
                              "admissionDate",
                              e.target.value
                            );
                          }}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.admissionDate &&
                          formik.errors.admissionDate && (
                            <FormHelperText>
                              {typeof formik.errors.admissionDate === "string"
                                ? formik.errors.admissionDate
                                : ""}
                            </FormHelperText>
                          )}
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-xxl col-xl-3 col-md-6">
                    <div className="mb-4">
                      <label className="form-label">First Name</label>
                      <FormControl
                        fullWidth
                        error={
                          formik.touched.firstName && !!formik.errors.firstName
                        }
                      >
                        <input
                          className="edit-profile-select"
                          id="firstName"
                          value={formik.values.firstName}
                          name="firstName"
                          onChange={(e) => {
                            formik.setFieldValue("firstName", e.target.value);
                          }}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.firstName &&
                          formik.errors.firstName && (
                            <FormHelperText>
                              {formik.errors.firstName}
                            </FormHelperText>
                          )}
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-xxl col-xl-3 col-md-6">
                    <div className="mb-4">
                      <label className="form-label">Last Name</label>
                      <FormControl
                        fullWidth
                        error={
                          formik.touched.lastName && !!formik.errors.lastName
                        }
                      >
                        <input
                          className="edit-profile-select"
                          id="lastName"
                          value={formik.values.lastName}
                          name="lastName"
                          onChange={(e) => {
                            formik.setFieldValue("lastName", e.target.value);
                          }}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.lastName && formik.errors.lastName && (
                          <FormHelperText>
                            {formik.errors.lastName}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-xxl col-xl-3 col-md-6">
                    <div className="mb-4">
                      <label className="form-label">Course</label>
                      <FormControl
                        fullWidth
                        error={
                          formik.touched.courseId && !!formik.errors.courseId
                        }
                      >
                        <select
                          className="edit-profile-select"
                          id="courseId"
                          value={formik.values.courseId}
                          name="courseId"
                          onChange={(e) => {
                            formik.setFieldValue("courseId", e.target.value);
                          }}
                          onBlur={formik.handleBlur}
                        >
                          <option value={0}>None</option>
                          {courses?.map((course) => (
                            <option
                              value={course.courseId}
                              key={course.courseId}
                            >
                              {course.courseName}
                            </option>
                          ))}
                        </select>
                        {formik.touched.courseId && formik.errors.courseId && (
                          <FormHelperText>
                            {formik.errors.courseId}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-xxl col-xl-3 col-md-6">
                    <div className="mb-4">
                      <label className="form-label">Class</label>
                      <FormControl
                        fullWidth
                        error={formik.touched.class && !!formik.errors.class}
                      >
                        <select
                          className="edit-profile-select"
                          id="class"
                          value={formik.values.class}
                          name="class"
                          onChange={(e) => {
                            formik.setFieldValue("class", e.target.value);
                          }}
                          onBlur={formik.handleBlur}
                        >
                          <option value={0}>None</option>
                          {classes?.map((classs) => (
                            <option value={classs.classId} key={classs.classId}>
                              {classs.className} {classs.classRank}
                            </option>
                          ))}
                        </select>
                        {formik.touched.class && formik.errors.class && (
                          <FormHelperText>{formik.errors.class}</FormHelperText>
                        )}
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-xxl col-xl-3 col-md-6">
                    <div className="mb-4">
                      <label className="form-label">Roll No</label>
                      <FormControl
                        fullWidth
                        error={formik.touched.rollNo && !!formik.errors.rollNo}
                      >
                        <input
                          className="edit-profile-select"
                          id="rollNo"
                          value={formik.values.rollNo}
                          name="rollNo"
                          onChange={(e) => {
                            formik.setFieldValue("rollNo", e.target.value);
                          }}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.rollNo && formik.errors.rollNo && (
                          <FormHelperText>
                            {formik.errors.rollNo}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </div>
                  </div>

                  <div className="col-xxl col-xl-3 col-md-6">
                    <div className="mb-4">
                      <label className="form-label">Gender</label>
                      <FormControl
                        fullWidth
                        error={formik.touched.gender && !!formik.errors.gender}
                      >
                        <select
                          className="edit-profile-select"
                          id="gender"
                          value={formik.values.gender}
                          name="gender"
                          onChange={(e) => {
                            formik.setFieldValue("gender", e.target.value);
                          }}
                          onBlur={formik.handleBlur}
                        >
                          <option value={0}>None</option>
                          <option value={1}>Male</option>
                          <option value={2}>Female</option>
                        </select>
                        {formik.touched.gender && formik.errors.gender && (
                          <FormHelperText>
                            {formik.errors.gender}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-xxl col-xl-3 col-md-6">
                    <div className="mb-4">
                      <label className="form-label">Date Of Birth</label>
                      <FormControl
                        fullWidth
                        error={
                          formik.touched.birthDate && !!formik.errors.birthDate
                        }
                      >
                        <input
                          type="date"
                          className="edit-profile-select"
                          id="birthDate"
                          value={formik.values.birthDate}
                          name="birthDate"
                          onChange={(e) => {
                            formik.setFieldValue("birthDate", e.target.value);
                          }}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.birthDate &&
                          formik.errors.birthDate && (
                            <FormHelperText>
                              {typeof formik.errors.birthDate === "string"
                                ? formik.errors.birthDate
                                : ""}
                            </FormHelperText>
                          )}
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-xxl col-xl-3 col-md-6">
                    <div className="mb-4">
                      <label className="form-label">Blood Group</label>
                      <FormControl
                        fullWidth
                        error={
                          formik.touched.bloodGroup &&
                          !!formik.errors.bloodGroup
                        }
                      >
                        <input
                          className="edit-profile-select"
                          id="bloodGroup"
                          value={formik.values.bloodGroup}
                          name="bloodGroup"
                          onChange={(e) => {
                            formik.setFieldValue("bloodGroup", e.target.value);
                          }}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.bloodGroup &&
                          formik.errors.bloodGroup && (
                            <FormHelperText>
                              {formik.errors.bloodGroup}
                            </FormHelperText>
                          )}
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-xxl col-xl-3 col-md-6">
                    <div className="mb-4">
                      <label className="form-label">Religion</label>
                      <FormControl
                        fullWidth
                        error={
                          formik.touched.religion && !!formik.errors.religion
                        }
                      >
                        <input
                          className="edit-profile-select"
                          id="religion"
                          value={formik.values.religion}
                          name="religion"
                          onChange={(e) => {
                            formik.setFieldValue("religion", e.target.value);
                          }}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.religion && formik.errors.religion && (
                          <FormHelperText>
                            {formik.errors.religion}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </div>
                  </div>

                  <div className="col-xxl col-xl-3 col-md-6">
                    <div className="mb-4">
                      <label className="form-label">Category</label>
                      <FormControl
                        fullWidth
                        error={
                          formik.touched.category && !!formik.errors.category
                        }
                      >
                        <select
                          className="edit-profile-select"
                          id="category"
                          value={formik.values.category}
                          name="category"
                          onChange={(e) => {
                            formik.setFieldValue("category", e.target.value);
                          }}
                          onBlur={formik.handleBlur}
                        >
                          <option value={0}>None</option>
                          <option value={"General (GC)"}>General (GC)</option>
                          <option value={"Economically Weaker Sections (EWS)"}>
                            Economically Weaker Sections (EWS)
                          </option>
                          <option value={"Other Backward Classes (OBC)"}>
                            Other Backward Classes (OBC)
                          </option>
                          <option value={"Scheduled Castes (SC)"}>
                            Scheduled Castes (SC)
                          </option>
                          <option value={"Scheduled Tribes (ST)"}>
                            Scheduled Tribes (ST)
                          </option>
                        </select>
                        {formik.touched.category && formik.errors.category && (
                          <FormHelperText>
                            {formik.errors.category}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-xxl col-xl-3 col-md-6">
                    <div className="mb-4">
                      <label className="form-label">Cast</label>
                      <FormControl
                        fullWidth
                        error={formik.touched.cast && !!formik.errors.cast}
                      >
                        <input
                          className="edit-profile-select"
                          id="cast"
                          value={formik.values.cast}
                          name="cast"
                          onChange={(e) => {
                            formik.setFieldValue("cast", e.target.value);
                          }}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.cast && formik.errors.cast && (
                          <FormHelperText>{formik.errors.cast}</FormHelperText>
                        )}
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-xxl col-xl-3 col-md-6">
                    <div className="mb-4">
                      <label className="form-label">Contact Number</label>
                      <FormControl
                        fullWidth
                        error={
                          formik.touched.mobileNumber &&
                          !!formik.errors.mobileNumber
                        }
                      >
                        <input
                          className="edit-profile-select"
                          id="mobileNumber"
                          value={formik.values.mobileNumber}
                          name="mobileNumber"
                          onChange={(e) => {
                            formik.setFieldValue(
                              "mobileNumber",
                              e.target.value
                            );
                          }}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.mobileNumber &&
                          formik.errors.mobileNumber && (
                            <FormHelperText>
                              {formik.errors.mobileNumber}
                            </FormHelperText>
                          )}
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-xxl col-xl-3 col-md-6">
                    <div className="mb-4">
                      <label className="form-label">Email Address</label>
                      <FormControl
                        fullWidth
                        error={formik.touched.email && !!formik.errors.email}
                      >
                        <input
                          type="email"
                          className="edit-profile-select"
                          id="email"
                          value={formik.values.email}
                          name="email"
                          onChange={(e) => {
                            formik.setFieldValue("email", e.target.value);
                          }}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.email && formik.errors.email && (
                          <FormHelperText>{formik.errors.email}</FormHelperText>
                        )}
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-xxl col-xl-3 col-md-6">
                    <div className="mb-4">
                      <label className="form-label">Mother Tongue</label>
                      <FormControl
                        fullWidth
                        error={
                          formik.touched.motherTongue &&
                          !!formik.errors.motherTongue
                        }
                      >
                        <input
                          className="edit-profile-select"
                          id="motherTongue"
                          value={formik.values.motherTongue}
                          name="motherTongue"
                          onChange={(e) => {
                            formik.setFieldValue(
                              "motherTongue",
                              e.target.value
                            );
                          }}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.motherTongue &&
                          formik.errors.motherTongue && (
                            <FormHelperText>
                              {formik.errors.motherTongue}
                            </FormHelperText>
                          )}
                      </FormControl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header bg-lights">
                <div className="d-flex align-items-center ">
                  <span
                    style={{ color: "#515B73" }}
                    className="bg-white avatar avatar-sm me-2 text-grey-7 flex-shrink-0"
                  >
                    <GroupOutlinedIcon sx={{ fontSize: "0.95rem" }} />
                  </span>
                  <h4 className="mb-0 text-dark font-weight-bold">
                    Parents Information
                  </h4>
                </div>
              </div>
              <div className="card-body pb-0">
                <div className="border-bottom mb-4">
                  <h5 className="mb-3">Father's Info</h5>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="d-flex align-items-center flex-wrap row-gap-3 mb-4">
                        <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark ">
                          {fatherprofileImage ? (
                            <img
                              src={fatherprofileImage}
                              alt="profile-img"
                              className="w-100 h-100 object-cover"
                            />
                          ) : (
                            <AddPhotoAlternateOutlinedIcon className="fs-16" />
                          )}
                        </div>
                        <div className="profile-upload">
                          <div className="profile-uploader d-flex align-items-center ">
                            <div className="drag-upload-btn mb-3">
                              Upload
                              <input
                                type="file"
                                className="form-control image-sign"
                                onChange={handleFatherProfileImageChange}
                              ></input>
                            </div>
                          </div>
                          <p className="fs-6">
                            Upload image size 4MB, Format JPG, PNG, SVG
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="mb-4">
                        <label className="form-label">Father Name</label>
                        <FormControl
                          fullWidth
                          error={
                            formik.touched.fatherName &&
                            !!formik.errors.fatherName
                          }
                        >
                          <input
                            className="edit-profile-select"
                            id="fatherName"
                            value={formik.values.fatherName}
                            name="fatherName"
                            onChange={(e) => {
                              formik.setFieldValue(
                                "fatherName",
                                e.target.value
                              );
                            }}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.fatherName &&
                            formik.errors.fatherName && (
                              <FormHelperText>
                                {formik.errors.fatherName}
                              </FormHelperText>
                            )}
                        </FormControl>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="mb-4">
                        <label className="form-label">Email</label>
                        <FormControl
                          fullWidth
                          error={
                            formik.touched.fatherEmail &&
                            !!formik.errors.fatherEmail
                          }
                        >
                          <input
                            type="email"
                            className="edit-profile-select"
                            id="fatherEmail"
                            value={formik.values.fatherEmail}
                            name="fatherEmail"
                            onChange={(e) => {
                              formik.setFieldValue(
                                "fatherEmail",
                                e.target.value
                              );
                            }}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.fatherEmail &&
                            formik.errors.fatherEmail && (
                              <FormHelperText>
                                {formik.errors.fatherEmail}
                              </FormHelperText>
                            )}
                        </FormControl>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="mb-4">
                        <label className="form-label">Phone Number</label>
                        <FormControl
                          fullWidth
                          error={
                            formik.touched.fatherNumber &&
                            !!formik.errors.fatherNumber
                          }
                        >
                          <input
                            className="edit-profile-select"
                            id="fatherNumber"
                            value={formik.values.fatherNumber}
                            name="fatherNumber"
                            onChange={(e) => {
                              formik.setFieldValue(
                                "fatherNumber",
                                e.target.value
                              );
                            }}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.fatherNumber &&
                            formik.errors.fatherNumber && (
                              <FormHelperText>
                                {formik.errors.fatherNumber}
                              </FormHelperText>
                            )}
                        </FormControl>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="mb-4">
                        <label className="form-label">Father Occupation</label>
                        <FormControl
                          fullWidth
                          error={
                            formik.touched.fatherOccupation &&
                            !!formik.errors.fatherOccupation
                          }
                        >
                          <input
                            className="edit-profile-select"
                            id="fatherOccupation"
                            value={formik.values.fatherOccupation}
                            name="fatherOccupation"
                            onChange={(e) => {
                              formik.setFieldValue(
                                "fatherOccupation",
                                e.target.value
                              );
                            }}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.fatherOccupation &&
                            formik.errors.fatherOccupation && (
                              <FormHelperText>
                                {formik.errors.fatherOccupation}
                              </FormHelperText>
                            )}
                        </FormControl>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-bottom mb-4">
                  <h5 className="mb-3">Mother's Info</h5>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="d-flex align-items-center flex-wrap row-gap-3 mb-4">
                        <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark ">
                          {motherProfileImage ? (
                            <img
                              src={motherProfileImage}
                              alt="profile-img"
                              className="w-100 h-100 object-cover"
                            />
                          ) : (
                            <AddPhotoAlternateOutlinedIcon className="fs-16" />
                          )}
                        </div>
                        <div className="profile-upload">
                          <div className="profile-uploader d-flex align-items-center ">
                            <div className="drag-upload-btn mb-3">
                              Upload
                              <input
                                type="file"
                                className="form-control image-sign"
                                onChange={handleMotherProfileImageChange}
                              ></input>
                            </div>
                          </div>
                          <p className="fs-6">
                            Upload image size 4MB, Format JPG, PNG, SVG
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="mb-4">
                        <label className="form-label">Mother Name</label>
                        <FormControl
                          fullWidth
                          error={
                            formik.touched.motherName &&
                            !!formik.errors.motherName
                          }
                        >
                          <input
                            className="edit-profile-select"
                            id="motherName"
                            value={formik.values.motherName}
                            name="motherName"
                            onChange={(e) => {
                              formik.setFieldValue(
                                "motherName",
                                e.target.value
                              );
                            }}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.motherName &&
                            formik.errors.motherName && (
                              <FormHelperText>
                                {formik.errors.motherName}
                              </FormHelperText>
                            )}
                        </FormControl>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="mb-4">
                        <label className="form-label">Email</label>
                        <FormControl
                          fullWidth
                          error={
                            formik.touched.motherEmail &&
                            !!formik.errors.motherEmail
                          }
                        >
                          <input
                            type="email"
                            className="edit-profile-select"
                            id="motherEmail"
                            value={formik.values.motherEmail}
                            name="motherEmail"
                            onChange={(e) => {
                              formik.setFieldValue(
                                "motherEmail",
                                e.target.value
                              );
                            }}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.motherEmail &&
                            formik.errors.motherEmail && (
                              <FormHelperText>
                                {formik.errors.motherEmail}
                              </FormHelperText>
                            )}
                        </FormControl>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="mb-4">
                        <label className="form-label">Phone Number</label>
                        <FormControl
                          fullWidth
                          error={
                            formik.touched.motherNumber &&
                            !!formik.errors.motherNumber
                          }
                        >
                          <input
                            className="edit-profile-select"
                            id="motherNumber"
                            value={formik.values.motherNumber}
                            name="motherNumber"
                            onChange={(e) => {
                              formik.setFieldValue(
                                "motherNumber",
                                e.target.value
                              );
                            }}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.motherNumber &&
                            formik.errors.motherNumber && (
                              <FormHelperText>
                                {formik.errors.motherNumber}
                              </FormHelperText>
                            )}
                        </FormControl>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="mb-4">
                        <label className="form-label">Mother Occupation</label>
                        <FormControl
                          fullWidth
                          error={
                            formik.touched.motherOccupation &&
                            !!formik.errors.motherOccupation
                          }
                        >
                          <input
                            className="edit-profile-select"
                            id="motherOccupation"
                            value={formik.values.motherOccupation}
                            name="motherOccupation"
                            onChange={(e) => {
                              formik.setFieldValue(
                                "motherOccupation",
                                e.target.value
                              );
                            }}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.motherOccupation &&
                            formik.errors.motherOccupation && (
                              <FormHelperText>
                                {formik.errors.motherOccupation}
                              </FormHelperText>
                            )}
                        </FormControl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header bg-lights">
                <div className="d-flex align-items-center ">
                  <span
                    style={{ color: "#515B73" }}
                    className="bg-white avatar avatar-sm me-2 text-grey-7 flex-shrink-0"
                  >
                    <MapOutlinedIcon sx={{ fontSize: "0.95rem" }} />
                  </span>
                  <h4 className="mb-0 text-dark font-weight-bold">Address</h4>
                </div>
              </div>
              <div className="card-body pb-0">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label className="form-label">Current Address</label>
                      <FormControl
                        fullWidth
                        error={
                          formik.touched.currentAddress &&
                          !!formik.errors.currentAddress
                        }
                      >
                        <input
                          className="edit-profile-select"
                          id="currentAddress"
                          value={formik.values.currentAddress}
                          name="currentAddress"
                          onChange={(e) => {
                            formik.setFieldValue(
                              "currentAddress",
                              e.target.value
                            );
                          }}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.currentAddress &&
                          formik.errors.currentAddress && (
                            <FormHelperText>
                              {formik.errors.currentAddress}
                            </FormHelperText>
                          )}
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label className="form-label">Parmanent Address</label>
                      <FormControl
                        fullWidth
                        error={
                          formik.touched.parmanentAddress &&
                          !!formik.errors.parmanentAddress
                        }
                      >
                        <input
                          className="edit-profile-select"
                          id="parmanentAddress"
                          value={formik.values.parmanentAddress}
                          name="parmanentAddress"
                          onChange={(e) => {
                            formik.setFieldValue(
                              "parmanentAddress",
                              e.target.value
                            );
                          }}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.parmanentAddress &&
                          formik.errors.parmanentAddress && (
                            <FormHelperText>
                              {formik.errors.parmanentAddress}
                            </FormHelperText>
                          )}
                      </FormControl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header bg-lights">
                <div className="d-flex align-items-center ">
                  <span
                    style={{ color: "#515B73" }}
                    className="bg-white avatar avatar-sm me-2 text-grey-7 flex-shrink-0"
                  >
                    <InsertDriveFileOutlinedIcon sx={{ fontSize: "0.95rem" }} />
                  </span>
                  <h4 className="mb-0 text-dark font-weight-bold">Documents</h4>
                </div>
              </div>
              <div className="card-body pb-1">
                <div className="col-lg-12">
                  <div className="mb-2">
                    <div className="mb-3">
                      <label className="form-label mb-1">
                        Upload Documents
                      </label>
                      <p>Upload image size of 4MB, Accepted Format PDF</p>
                    </div>
                    <div className="upload-documents-div d-flex align-items-center justify-content-between flex-wrap">
                      <div className="d-flex align-items-center flex-wrap">
                        <div className="btn btn-primary drag-upload-btn mb-2 me-2">
                          <FileOpenOutlinedIcon />
                          Upload
                          <input
                            type="file"
                            multiple={true}
                            onChange={handleUploadDocumentChange}
                            className="form-control image_sign"
                          ></input>
                        </div>
                        <p className="mb-2">
                          {" "}
                          {documentNames.length > 0
                            ? documentNames.join(", ")
                            : "No files selected"}
                        </p>
                      </div>
                      <div className="d-flex align-items-center flex-wrap">
                        {documents.length > 0 && (
                          <div
                            className="upload-documents-inner-div container d-flex align-items-center"
                            style={{ width: "auto" }}
                          >
                            <button
                              type="button"
                              className="btn"
                              onClick={() => plusDivs(-1)}
                            >
                              &#10094;
                            </button>
                            {documents.map((document, index) => {
                              const url = document.studentDocumentUrl;
                              const isImage = (url: string) => {
                                return /\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(
                                  url
                                );
                              };

                              const isPDF = (url: string) => {
                                return /\.pdf$/i.test(url);
                              };
                              const openFile = () => {
                                const fileURL = url;
                                console.log(fileURL);
                                window.open(fileURL, "_blank");
                              };
                              return (
                                <div
                                  key={index}
                                  style={{
                                    position: "relative",
                                    display:
                                      slideIndex === index + 1
                                        ? "flex"
                                        : "none",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    paddingLeft: "40px",
                                    paddingRight: "40px",
                                  }}
                                >
                                  <ClearIcon
                                    onClick={() => handleFileDelete(document)}
                                    sx={{
                                      position: "absolute",
                                      top: "0",
                                      right: "10px",
                                      fontSize: "18",
                                    }}
                                  />
                                  {isImage(url) ? (
                                    <img
                                      onClick={openFile}
                                      src={url}
                                      alt={`Document ${document.studentDocumentName}`}
                                      width={50}
                                      height={50}
                                    />
                                  ) : (
                                    <img
                                      onClick={openFile}
                                      src={PDFIcon.src}
                                      alt="PDF Thumbnail"
                                      width={50}
                                      height={50}
                                    />
                                  )}
                                  <span>
                                    {document.studentDocumentName.slice(1)}
                                  </span>
                                </div>
                              );
                            })}

                            <button
                              type="button"
                              className="btn"
                              onClick={() => plusDivs(1)}
                            >
                              &#10095;
                            </button>
                          </div>
                        )}
                        {deletedDocuments.length > 0 && (
                          <div
                            className="upload-documents-inner-div container d-flex align-items-center"
                            style={{ width: "auto" }}
                          >
                            <button
                              type="button"
                              className="btn"
                              onClick={() => plusDeletedDivs(-1)}
                            >
                              &#10094;
                            </button>
                            {deletedDocuments.map((document, index) => {
                              const url = document.studentDocumentUrl;
                              const isImage = (url: string) => {
                                return /\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(
                                  url
                                );
                              };

                              const isPDF = (url: string) => {
                                return /\.pdf$/i.test(url);
                              };
                              const openFile = () => {
                                const fileURL = url;
                                console.log(fileURL);
                                window.open(fileURL, "_blank");
                              };
                              return (
                                <div
                                  key={index}
                                  style={{
                                    position: "relative",
                                    display:
                                      deleteSlideIndex === index + 1
                                        ? "flex"
                                        : "none",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    paddingLeft: "40px",
                                    paddingRight: "40px",
                                  }}
                                >
                                  <button
                                    type="button"
                                    onClick={() => handleRestoreFile(document)}
                                    style={{
                                      position: "absolute",
                                      top: "0",
                                      right: "10px",
                                      fontSize: "18",
                                    }}
                                  >
                                    Restore
                                  </button>
                                  {isImage(url) ? (
                                    <img
                                      onClick={openFile}
                                      src={url}
                                      alt={`Document ${document.studentDocumentName}`}
                                      width={50}
                                      height={50}
                                    />
                                  ) : (
                                    <img
                                      onClick={openFile}
                                      src={PDFIcon.src}
                                      alt="PDF Thumbnail"
                                      width={50}
                                      height={50}
                                    />
                                  )}
                                  <span>
                                    {document.studentDocumentName.slice(1)}
                                  </span>
                                </div>
                              );
                            })}

                            <button
                              type="button"
                              className="btn"
                              onClick={() => plusDeletedDivs(1)}
                            >
                              &#10095;
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header bg-lights">
                <div className="d-flex align-items-center ">
                  <span
                    style={{ color: "#515B73" }}
                    className="bg-white avatar avatar-sm me-2 text-grey-7 flex-shrink-0"
                  >
                    <BusinessOutlinedIcon sx={{ fontSize: "0.95rem" }} />
                  </span>
                  <h4 className="mb-0 text-dark font-weight-bold">
                    Previous School Details
                  </h4>
                </div>
              </div>
              <div className="card-body pb-0">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label className="form-label">School Name</label>
                      <FormControl
                        fullWidth
                        error={
                          formik.touched.previousSchoolName &&
                          !!formik.errors.previousSchoolName
                        }
                      >
                        <input
                          className="edit-profile-select"
                          id="previousSchoolName"
                          value={formik.values.previousSchoolName}
                          name="previousSchoolName"
                          onChange={(e) => {
                            formik.setFieldValue(
                              "previousSchoolName",
                              e.target.value
                            );
                          }}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.previousSchoolName &&
                          formik.errors.previousSchoolName && (
                            <FormHelperText>
                              {formik.errors.previousSchoolName}
                            </FormHelperText>
                          )}
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label className="form-label">Address</label>
                      <FormControl
                        fullWidth
                        error={
                          formik.touched.previousSchoolAddress &&
                          !!formik.errors.previousSchoolAddress
                        }
                      >
                        <input
                          className="edit-profile-select"
                          id="previousSchoolAddress"
                          value={formik.values.previousSchoolAddress}
                          name="previousSchoolAddress"
                          onChange={(e) => {
                            formik.setFieldValue(
                              "previousSchoolAddress",
                              e.target.value
                            );
                          }}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.previousSchoolAddress &&
                          formik.errors.previousSchoolAddress && (
                            <FormHelperText>
                              {formik.errors.previousSchoolAddress}
                            </FormHelperText>
                          )}
                      </FormControl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header bg-lights">
                <div className="d-flex align-items-center ">
                  <span
                    style={{ color: "#515B73" }}
                    className="bg-white avatar avatar-sm me-2 text-grey-7 flex-shrink-0"
                  >
                    <EnhancedEncryptionOutlinedIcon
                      sx={{ fontSize: "0.95rem" }}
                    />
                  </span>
                  <h4 className="mb-0 text-dark font-weight-bold">
                    Authentication Details
                  </h4>
                </div>
              </div>
              <div className="card-body pb-0">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label className="form-label">UserName</label>
                      <FormControl
                        fullWidth
                        error={
                          formik.touched.userName && !!formik.errors.userName
                        }
                      >
                        <input
                          autoComplete="username"
                          className="edit-profile-select"
                          id="userName"
                          value={formik.values.userName}
                          name="userName"
                          onChange={(e) => {
                            formik.setFieldValue("userName", e.target.value);
                          }}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.userName && formik.errors.userName && (
                          <FormHelperText>
                            {formik.errors.userName}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label className="form-label">Password</label>
                      <FormControl
                        fullWidth
                        error={
                          formik.touched.passWord && !!formik.errors.passWord
                        }
                      >
                        <input
                          autoComplete="current-password"
                          type={formik.values.passWord ? "text" : "password"}
                          className="edit-profile-select"
                          id="passWord"
                          value={formik.values.passWord}
                          name="passWord"
                          onChange={(e) => {
                            formik.setFieldValue("passWord", e.target.value);
                          }}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.passWord && formik.errors.passWord && (
                          <FormHelperText>
                            {formik.errors.passWord}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header bg-lights">
                <div className="d-flex align-items-center ">
                  <span
                    style={{ color: "#515B73" }}
                    className="bg-white avatar avatar-sm me-2 text-grey-7 flex-shrink-0"
                  >
                    <MapOutlinedIcon sx={{ fontSize: "0.95rem" }} />
                  </span>
                  <h4 className="mb-0 text-dark font-weight-bold">
                    Other Details
                  </h4>
                </div>
              </div>
              <div className="card-body pb-0">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-4">
                      <label className="form-label">Other Information</label>
                      <FormControl
                        fullWidth
                        error={
                          formik.touched.otherDetails &&
                          !!formik.errors.otherDetails
                        }
                      >
                        <textarea
                          rows={3}
                          id="otherDetails"
                          value={formik.values.otherDetails}
                          name="otherDetails"
                          onChange={(e) => {
                            formik.setFieldValue(
                              "otherDetails",
                              e.target.value
                            );
                          }}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.otherDetails &&
                          formik.errors.otherDetails && (
                            <FormHelperText>
                              {formik.errors.otherDetails}
                            </FormHelperText>
                          )}
                      </FormControl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-end">
              <button type="button" className="btn btn-light me-3">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditStudent;
