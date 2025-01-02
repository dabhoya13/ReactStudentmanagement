import { CallAPI } from "@/pages/api/callApi";
import { InteractionMode } from "chart.js";
import Time from "react-datepicker/dist/time";

export interface StudentsLeave {
  studentId: number;
  leaveStatus: number;
  leaveReason: string;
  leaveDate: Date;
  leaveId: number;
  month: number;
  year: number;
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
      const attendanceDetails: Last7DaysAttendaceProps[] =
        response.result.data;
      return attendanceDetails;
    }
  }
  return [];
};

export interface StudentExamProps{
  studentId:number,
  examId:number,
  subjectName:string,
  startTime:string,
  endTime:string,
  examDate:Date,
  RoomNo:number,
  examType:string,
  classId:number,
  remainingDays:number,
}

export const GetStudentExams = async (
  studentId: number,
  examDate:Date | null
): Promise<StudentExamProps[]> => {
  if (studentId != null && studentId != 0) {
    const StudentExam = {
      StudentId: studentId,
      ExamDate:examDate
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
