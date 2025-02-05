import { CallAPI } from "@/pages/api/callApi";
import { StudentsLeave } from "./studentDashboard's";

export const GetStudentUsedLeaveCounts = async (
  studentId: number
): Promise<StudentsLeave | null> => {
  if (studentId != null && studentId != 0) {
    const formData = {
      ControllerName: "Student",
      MethodName: "GetStudentUsedLeaveCounts",
      DataObject: JSON.stringify(studentId),
      RoleIds: ["3"],
    };

    var response = await CallAPI(formData);
    if (response != null && response.isSuccess == true) {
      const leaveCounts: StudentsLeave = response.result.data;
      return leaveCounts;
    }
  }
  return null;
};

export interface PaginationProps {
  SearchQuery: string | null;
  StartIndex: number;
  PageSize: number;
  StudentId:number;
}

export interface PaginationResponseProps {
  studentsLeave: StudentsLeave[];
  totalItems: number;
  totalPages: number;
  startIndex: number;
}

export const GetAllStudentsLeave = async (
  pagination: PaginationProps
): Promise<PaginationResponseProps | null> => {
  const formData = {
    ControllerName: "Student",
    MethodName: "GetAllStudentsLeave",
    DataObject: JSON.stringify(pagination),
    RoleIds: ["1","3"],
  };
  var studentLeaveData: StudentsLeave[] = [];
  var response = await CallAPI(formData);
  if (response != null && response.result != null) {
    studentLeaveData = response.result.data.map((item: any) => ({
      leaveId: item.leaveId,
      leaveTypeName: item.leaveTypeName,
      leaveTypeId: item.leaveTypeId,
      leaveDate: item.leaveDate,
      leaveStatus: item.leaveStatus,
      createdDate: item.createdDate,
      numberOfDays: item.numberOfDays,
      isDeleted: item.isDeleted,
    }));
    const paginatioResponse: PaginationResponseProps = {
      studentsLeave: studentLeaveData,
      totalItems: response.result.totalItems,
      totalPages: response.result.totalPages,
      startIndex: response.result.startIndex,
    };
    return paginatioResponse;
  }
  return null;
};
