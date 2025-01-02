import { CallAPI } from "@/pages/api/callApi";

interface AttedanceProps {
  attendanceId: number | null;
  studentId: number;
  status: boolean;
  date: Date;
  isSubmitted: boolean;
}
export const GetAttendanceDetails = async (
  month: number,
  year: number,
  studentId:number
): Promise<AttedanceProps[]> => {
  if (studentId != 0) {
    const attendaceMonthYear = {
      Month: month,
      Year: year,
      StudentId:studentId
    };
    const formData = {
      ControllerName: "Student",
      MethodName: "GetAttendanceFromMonthYear",
      DataObject: JSON.stringify(attendaceMonthYear),
      RoleIds: ["3"],
    };

    var response = await CallAPI(formData);
    if (response != null && response.isSuccess == true) {
      const attendaceDetails: AttedanceProps[] = response.result.data;
      return attendaceDetails;
    }
  }

  return [];
};

export const AddTodayAttendance = async (
  attendanceProps: AttedanceProps
): Promise<any> => {
  const attendance = {
    StudentId: attendanceProps.studentId,
    Status: attendanceProps.status,
    Date: attendanceProps.date,
  };
  const formData = {
    ControllerName: "Student",
    MethodName: "AddStudentAttendance",
    DataObject: JSON.stringify(attendance),
    RoleIds: ["3"],
  };

  var response = await CallAPI(formData);
  return response;
};
