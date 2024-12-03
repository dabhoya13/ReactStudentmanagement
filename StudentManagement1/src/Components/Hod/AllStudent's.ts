import { CallAPI } from "../../APICall/callApi";

interface PaginationProps {
  SearchQuery: string | null;
  StartIndex: number;
  PageSize: number;
}

interface StudentDataProps {
  studentId: number;
  firstName: string;
  lastName: string;
  birthDate: Date;
  userName: string;
  courseName: string;
  courseId: number;
  email: string;
  status: boolean;
  gender:number | null;
  imageName:string;
  imageUrl:string;
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
      RoleIds: ["1"],
    };

    var response = await CallAPI(formData);
    const studentDataProps: StudentDataProps = response.result.data;
    return studentDataProps;
  } else {
    return null;
  }
};
