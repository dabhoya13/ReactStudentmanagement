import { LargeNumberLike } from "crypto";
import { CallAPI } from "../../pages/api/callApi";
import { csCZ } from "@mui/x-date-pickers/locales";

interface PaginationProps {
  SearchQuery: string | null;
  StartIndex: number;
  PageSize: number;
}
  export interface StudentDocumentProps {
    studentDocumentId: number;
    studentDocumentName: string;
    studentDocumentUrl: string;
    studentId: number;
  }
export interface StudentDataProps {
  academicYear: string;
  admissionDate: Date;
  studentId: number;
  firstName: string;
  lastName: string;
  birthDate: Date;
  userName: string;
  courseName: string;
  courseId: number;
  email: string;
  status: boolean;
  gender: number | null;
  imageName: string;
  imageUrl: string;
  classId: number;
  className: string;
  classRank: string;
  rollNo: number;
  bloodGroup: string;
  reigion: string;
  caste: string;
  category: string;
  motherTongue: string;
  mobileNumber: string;
  fatherName: string;
  fatherEmail: string;
  fatherNumber: string;
  fatherOccupation: string;
  motherName: string;
  motherEmail: string;
  motherNumber: string;
  motherOccupation: string;
  currentAddress: string;
  permanentAddress: string;
  previousSchoolName: string;
  previousSchoolAddress: string;
  otherInfo: string;
  password: string;
  parents: ParentsProps[];
  documents: StudentDocumentProps[];
}

export interface ParentsProps {
  parentId: number;
  parentName: string;
  relation: number;
  parentNumber: string;
  parentEmail: string;
  parentImage: string;
  parentImageUrl: string;
  occupation: string;
}
interface PaginationResponseProps {
  students: StudentDataProps[];
  totalItems: number;
  totalPages: number;
  startIndex: number;
}

export const getAllStudentsData = async (
  pagination: PaginationProps
): Promise<PaginationResponseProps | null> => {
  const formData = {
    ControllerName: "Hod",
    MethodName: "GetAllStudents",
    DataObject: JSON.stringify(pagination),
    RoleIds: ["1"],
  };
  var studentData: StudentDataProps[] = [];
  var response = await CallAPI(formData);
  if (response != null && response.result != null) {
    studentData = response.result.data.map((item: any) => ({
      studentId: item.studentId,
      firstName: item.firstName,
      lastName: item.lastName,
      birthDate: item.birthDate,
      userName: item.userName,
      courseName: item.courseName,
      courseId: item.courseId,
      email: item.email,
      status: item.status == null ? false : item.status,
    }));
    const paginatioResponse: PaginationResponseProps = {
      students: studentData,
      totalItems: response.result.totalItems,
      totalPages: response.result.totalPages,
      startIndex: response.result.startIndex,
    };
    return paginatioResponse;
  }
  return null;
};

export const DeleteStudent = async (StudentId: number) => {
  if (StudentId != 0) {
    const formData = {
      ControllerName: "Student",
      MethodName: "DeleteStudentById",
      DataObject: JSON.stringify(StudentId),
      RoleIds: ["1"],
    };

    var response = await CallAPI(formData);
    if (response.isSuccess == true) {
      window.location.reload();
    } else {
      window.location.href = "/login";
    }
  }
};

export const GetStudentDetailsById = async (
  StudentId: number
): Promise<StudentDataProps | null> => {
  if (StudentId != 0) {
    const formData = {
      ControllerName: "Student",
      MethodName: "GetStudentDetailsById",
      DataObject: JSON.stringify(StudentId),
      RoleIds: ["1", "3"],
    };

    var response = await CallAPI(formData);
    const studentDataProps: StudentDataProps | null =
      response?.result?.data ?? null;
    if (studentDataProps) {
      return studentDataProps;
    } else {
      console.error("Data not found in the response");
      return null;
    }
  } else {
    return null;
  }
};

export const ExcelExportReport = async (SearchQuery: string | null) => {
  try {
    const paginationDto = {
      SearchQuery: SearchQuery,
    };
    const formData = {
      ControllerName: "Student",
      MethodName: "ExportExcelReport",
      DataObject: JSON.stringify(paginationDto),
      RoleIds: ["1"],
    };
    var response = await CallAPI(formData);
    if (response.result != null) {
      const base64String = response.result;
      const binaryString = atob(base64String); // Decode the base64 string
      const byteArray = new Uint8Array(binaryString.length);

      // Convert binary string to byte array
      for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Students_List.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    }
  } catch (err) {
    throw new Error();
  }
};

export const PDFExportReport = async (SearchQuery: string | null) => {
  try {
    const fullName = sessionStorage.getItem("FullName");
    const email = sessionStorage.getItem("Email");
    const userName = sessionStorage.getItem("UserName");

    const exportPdfViewModel = {
      SearchQuery: SearchQuery,
      FullName: fullName,
      UserName: userName,
      Email: email,
    };

    const formData = {
      ControllerName: "Student",
      MethodName: "ExportPdfReport",
      DataObject: JSON.stringify(exportPdfViewModel),
      RoleIds: ["1"],
    };
    var response = await CallAPI(formData);
    if (response.result != null) {
      const base64String = response.result;
      const binaryString = atob(base64String); // Decode the base64 string
      const byteArray = new Uint8Array(binaryString.length);

      // Convert binary string to byte array
      for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([byteArray], { type: "application/pdf" });
      if (blob.size > 0) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Students_List.pdf";
        a.click();
        window.URL.revokeObjectURL(url);
      }
    }
  } catch (err) {
    throw new Error();
  }
};

interface StudentAttendanceDataProps {
  studentId: number;
  firstName: string;
  lastName: string;
  imageName: string;
  imageUrl: string;
  status: boolean;
}
export const GetStudentsAttendanceData = async (): Promise<
  StudentAttendanceDataProps[]
> => {
  const formData = {
    ControllerName: "Hod",
    MethodName: "GetAllStudentsWithAttendance",
    DataObject: JSON.stringify(null),
    RoleIds: ["1"],
  };

  var response = await CallAPI(formData);
  const studentDataProps: StudentAttendanceDataProps[] = response.result.data;
  console.log(studentDataProps);
  return studentDataProps;
};

