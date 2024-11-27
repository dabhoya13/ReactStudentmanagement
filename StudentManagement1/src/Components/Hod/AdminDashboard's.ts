import { CallAPI } from "../../APICall/callApi";

interface GenderWiseCountProps {
  Gender: string;
  GenderCount: number;
}

export const GetGenderWiseCounts = async (): Promise<
  GenderWiseCountProps[]
> => {
  const formData = {
    ControllerName: "Student",
    MethodName: "GetStudentCountByGender",
    DataObject: JSON.stringify(null),
    RoleIds: ["1"],
  };

  var response = await CallAPI(formData);
  if (response != null && response.result != null) {
    const GenderWiseCounts: GenderWiseCountProps[] = response.result.data.map(
      (item: any) => ({
        Gender: item.gender == 1 ? "Male" : "Female",
        GenderCount: item.genderCount,
      })
    );
    return GenderWiseCounts;
  } else {
    return [];
  }
};

interface StudentProfessorsCountProps {
  studentCount: number;
  professorCount: number;
}

export const GetStudentProfessorsCount =
  async (): Promise<StudentProfessorsCountProps> => {
    const formData = {
      ControllerName: "Student",
      MethodName: "GetStudentProfessorCount",
      DataObject: JSON.stringify(null),
      RoleIds: ["1"],
    };

    var response = await CallAPI(formData);
    if (response != null && response.result != null) {
      const studentProfessorCount: StudentProfessorsCountProps =
        response.result.data;
      return studentProfessorCount;
    } else {
      return {
        studentCount: 0,
        professorCount: 0,
      };
    }
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
export const GetAllNotices = async (): Promise<NoticeProps[] | null> => {
  const formData = {
    ControllerName: "Hod",
    MethodName: "GetAllNotices",
    DataObject: JSON.stringify(null),
    RoleIds: ["1"],
  };

  var response = await CallAPI(formData);
  if (response != null && response.result != null) {
    const notices: NoticeProps[] = response.result.data;
    return notices;
  } else {
    return null;
  }
};

export const DeleteNotice = async (NoticeId: number) => {
  if (NoticeId != 0) {
    const formData = {
      ControllerName: "Hod",
      MethodName: "DeleteNotice",
      DataObject: JSON.stringify(NoticeId),
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

export const GetNoticeDetailsById = async (
  NoticeId: number
): Promise<NoticeProps | null> => {
  if (NoticeId != 0) {
    const formData = {
      ControllerName: "Hod",
      MethodName: "GetNoticeDetailsById",
      DataObject: JSON.stringify(NoticeId),
      RoleIds: ["1"],
    };

    var response = await CallAPI(formData);
    const NoticeProps: NoticeProps = response.result.data;
    return NoticeProps;
  } else {
    return null;
  }
};

interface GetAttendanceProps {
  month: number;
  year: number;
  half: number;
}

interface AttendanceCountProps {
  totalPresent: number;
  totalAbsent: number;
  date: string;
}
export const GetAttendanceByMonthYear = async (
  attendanceProps: GetAttendanceProps
): Promise<AttendanceCountProps[]> => {
  const formData = {
    ControllerName: "Hod",
    MethodName: "GetAttendanceTotalCountsByMonthYear",
    DataObject: JSON.stringify(attendanceProps),
    RoleIds: ["1"],
  };

  var response = await CallAPI(formData);
  if (response != null && response.result != null) {
    const AttendanceCounts: AttendanceCountProps[] = response.result.data.map(
      (item: any) => ({
        totalPresent: item.totalPresent,
        totalAbsent: item.totalAbsent,
        date: new Date(item.date).toLocaleDateString("en-CA"),
      })
    );

    return AttendanceCounts;
  } else {
    return [];
  }
};
