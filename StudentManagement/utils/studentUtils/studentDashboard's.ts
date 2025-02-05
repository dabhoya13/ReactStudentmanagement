import { CallAPI } from "@/pages/api/callApi";
import { InteractionMode } from "chart.js";
import Time from "react-datepicker/dist/time";
import { number } from "yup";
import { ExamTypeProps } from "../allModals/studentModals";

export interface StudentsLeave {
  studentId: number;
  leaveStatus: number;
  leaveTypeName: string;
  leaveTypeId: number;
  leaveDate: Date;
  leaveId: number;
  month: number;
  year: number;
  createdDate: number;
  medicalLeaveCount: number;
  casualLeaveCount: number;
  maternityLeaveCount: number;
  numberOfDays: number;
  paternityLeaveCount: number;
  totalMedicalLeave: number;
  totalCasualLeave: number;
  totalMaternityLeave: number;
  totalPaternityLeave: number;
}
export const GetLeaveStatus = async (
  studentId: number,
  month: number,
  year: number
): Promise<StudentsLeave[]> => {
  if (studentId != null && studentId != 0) {
    const StudentLeave = {
      StudentId: studentId,
      Month: month,
      Year: year,
    };
    const formData = {
      ControllerName: "Student",
      MethodName: "GetStudentLeaveStatus",
      DataObject: JSON.stringify(StudentLeave),
      RoleIds: ["3"],
    };

    var response = await CallAPI(formData);
    if (response != null && response.isSuccess == true) {
      const leaveStatusDetails: StudentsLeave[] = response.result.data;
      return leaveStatusDetails;
    }
  }
  return [];
};

export interface StudentAttendanceCountProps {
  studentId: number;
  totalPresent: number;
  totalAbsent: number;
  totalAbsentPresent: number;
}

export const GetAttendanceData = async (
  studentId: number,
  month: number,
  year: number
): Promise<StudentAttendanceCountProps | null> => {
  if (studentId != null && studentId != 0) {
    const StudentWithMonthYear = {
      StudentId: studentId,
      Month: month,
      Year: year,
    };
    const formData = {
      ControllerName: "Student",
      MethodName: "GetStudentAttendanceCount",
      DataObject: JSON.stringify(StudentWithMonthYear),
      RoleIds: ["3"],
    };

    var response = await CallAPI(formData);
    if (response != null && response.isSuccess == true) {
      const attendanceDetails: StudentAttendanceCountProps =
        response.result.data;
      return attendanceDetails;
    }
  }
  return null;
};

export interface Last7DaysAttendaceProps {
  status: number | null;
  date: Date;
  weekDay: string;
}

export const GetLast7DaysAttendance = async (
  studentId: number,
  startDate: Date,
  endDate: Date
): Promise<Last7DaysAttendaceProps[]> => {
  if (studentId != null && studentId != 0) {
    const Student7DaysProps = {
      StudentId: studentId,
      StartDate: startDate,
      EndDate: endDate,
    };
    const formData = {
      ControllerName: "Student",
      MethodName: "GetStudentLast7daysAttendances",
      DataObject: JSON.stringify(Student7DaysProps),
      RoleIds: ["3"],
    };

    var response = await CallAPI(formData);
    if (response != null && response.isSuccess == true) {
      const attendanceDetails: Last7DaysAttendaceProps[] = response.result.data;
      return attendanceDetails;
    }
  }
  return [];
};

export interface StudentExamProps {
  studentId: number;
  examId: number;
  subjectId: number;
  subjectName: string;
  startTime: string;
  endTime: string;
  courseId: number;
  examDate: Date;
  roomNo: number;
  examType: number;
  examName: string;
  classId: number;
  remainingDays: number;
}

export const GetStudentExams = async (
  studentId: number,
  examDate: Date | null
): Promise<StudentExamProps[]> => {
  if (studentId != null && studentId != 0) {
    const StudentExam = {
      StudentId: studentId,
      ExamDate: examDate,
    };
    const formData = {
      ControllerName: "Student",
      MethodName: "GetStudentExamsFromDate",
      DataObject: JSON.stringify(StudentExam),
      RoleIds: ["3"],
    };

    var response = await CallAPI(formData);
    if (response != null && response.isSuccess == true) {
      const studentExams: StudentExamProps[] = response.result.data;
      return studentExams;
    }
  }
  return [];
};

export const GetStudentExamByExamId = async (
  examId: number
): Promise<StudentExamProps | null> => {
  if (examId != null && examId != 0) {
    const formData = {
      ControllerName: "Student",
      MethodName: "GetStudentExamByExamId",
      DataObject: JSON.stringify(examId),
      RoleIds: ["3"],
    };

    var response = await CallAPI(formData);
    if (response != null && response.isSuccess == true) {
      const studentExams: StudentExamProps = response.result.data;
      return studentExams;
    }
  }
  return null;
};

export interface FacultyProps {
  facultyId: number;
  facultyFirstName: string;
  facultyLastName: string;
  imageName: string;
  imageUrl: string;
  courseName: string;
}

export const GetFacultiesForStudentDashboard = async (): Promise<
  FacultyProps[]
> => {
  const formData = {
    ControllerName: "Student",
    MethodName: "GetAllFacultyForStudentDashboard",
    DataObject: JSON.stringify(null),
    RoleIds: ["3"],
  };

  var response = await CallAPI(formData);
  if (response != null && response.isSuccess == true) {
    const faculties: FacultyProps[] = response.result.data;
    return faculties;
  } else {
    return [];
  }
};

export interface NoticeProps {
  noticeId: number;
  shortDescription: string;
  longDescription: string;
  date: Date;
  title: string;
  imageName: string;
  imageUrl: string;
}
export const GetAllNotices = async (): Promise<NoticeProps[]> => {
  const formData = {
    ControllerName: "Hod",
    MethodName: "GetAllNotices",
    DataObject: JSON.stringify(null),
    RoleIds: ["3"],
  };

  var response = await CallAPI(formData);
  if (response != null && response.result != null) {
    const notices: NoticeProps[] = response.result.data;
    return notices;
  } else {
    return [];
  }
};

export interface CoursesProps {
  courseId: number;
  courseName: string;
}

export interface ClassesProps {
  classId: number;
  className: string;
  classRank: number;
}
export const GetAllClasses = async (): Promise<ClassesProps[]> => {
  const formData = {
    ControllerName: "Student",
    MethodName: "GetAllClasses",
    DataObject: JSON.stringify(null),
    RoleIds: ["3"],
  };

  var response = await CallAPI(formData);
  if (response != null && response.result != null) {
    const classes: ClassesProps[] = response.result.data;
    return classes;
  } else {
    return [];
  }
};

export interface SubjectsProps {
  subjectId: number;
  subjectName: string;
  courseId: number;
}

export const GetAllSubjects = async (): Promise<SubjectsProps[]> => {
  const formData = {
    ControllerName: "Student",
    MethodName: "GetAllSubjects",
    DataObject: JSON.stringify(null),
    RoleIds: ["3"],
  };

  var response = await CallAPI(formData);
  if (response != null && response.result != null) {
    const subjects: SubjectsProps[] = response.result.data;
    return subjects;
  } else {
    return [];
  }
};

export const GetAllCourses = async (): Promise<CoursesProps[]> => {
  const formData = {
    ControllerName: "Course",
    MethodName: "GetAllCourses",
    DataObject: JSON.stringify(null),
    RoleIds: ["3"],
  };

  var response = await CallAPI(formData);
  if (response != null && response.result != null) {
    const courses: CoursesProps[] = response.result.data;
    return courses;
  } else {
    return [];
  }
};

export const GetAllExamTypes = async (): Promise<ExamTypeProps[]> => {
  const formData = {
    ControllerName: "Student",
    MethodName: "GetAllExamTypes",
    DataObject: JSON.stringify(null),
    RoleIds: ["3"],
  };

  var response = await CallAPI(formData);
  if (response != null && response.result != null) {
    const examTypes: ExamTypeProps[] = response.result.data;
    return examTypes;
  } else {
    return [];
  }
};

export interface StudentTodo {
  todoId: number;
  todoName: String;
  todoDate: Date;
  status: boolean;
  time: string;
  isDeleted: boolean;
}

export const GetAllStudentTodoList = async (
  date: Date | null
): Promise<StudentTodo[]> => {
  const StudentTodo = {
    todoDate: date,
  };
  const formData = {
    ControllerName: "Student",
    MethodName: "GetAllStudentTodoListByDate",
    DataObject: JSON.stringify(StudentTodo),
    RoleIds: ["3"],
  };

  var response = await CallAPI(formData);
  if (response != null && response.result != null) {
    const todoList: StudentTodo[] = response.result.data;
    console.log("student todo::::", todoList);
    return todoList;
  } else {
    return [];
  }
};

export interface StudentResult {
  resultId: number;
  studentId: number;
  examId: number;
  subjectId: number;
  minMarks: number;
  examName: string;
  subjectName: string;
  maxMarks: number;
  markObtained: number;
  examDate: Date;
}

export const GetStudentResultById = async (
  studentId: number,
  examId: number
): Promise<StudentResult[]> => {
  const StudentResults = {
    StudentId: studentId,
    ExamTypeId: examId,
  };
  const formData = {
    ControllerName: "Student",
    MethodName: "GetStudentResultById",
    DataObject: JSON.stringify(StudentResults),
    RoleIds: ["3"],
  };

  var response = await CallAPI(formData);
  if (response != null && response.result != null) {
    const studentResult: StudentResult[] = response.result.data;
    return studentResult;
  } else {
    return [];
  }
};

export const ChangeTodoStatus = async (todoIds: number[]) => {
  const StudentTodo = {
    TodoIds: todoIds,
  };
  const formData = {
    ControllerName: "Student",
    MethodName: "ChangeTodoStatus",
    DataObject: JSON.stringify(StudentTodo),
    RoleIds: ["3"],
  };

  var response = await CallAPI(formData);
};

export const deleteTodo = async (todoIds: number[]) => {
  const StudentTodo = {
    TodoIds: todoIds,
  };
  const formData = {
    ControllerName: "Student",
    MethodName: "DeleteTodo",
    DataObject: JSON.stringify(StudentTodo),
    RoleIds: ["3"],
  };

  var response = await CallAPI(formData);
};

export interface FinalResultProps {
  results: StudentResult[];
  finalpercentage: number;
  finalStatus: boolean;
}

export const GetWholeYearStudentResults = async (
  studentId: number,
  startYear: number
): Promise<StudentResult[]> => {
  const StudentResults = {
    StudentId: studentId,
    StartYear: startYear,
  };
  const formData = {
    ControllerName: "Student",
    MethodName: "GetWholeYearStudentResult",
    DataObject: JSON.stringify(StudentResults),
    RoleIds: ["3"],
  };

  var response = await CallAPI(formData);
  var finalResult: StudentResult[] = [];
  if (response != null && response.isSuccess) {
    finalResult = response.result.data;
  }
  return finalResult;
};