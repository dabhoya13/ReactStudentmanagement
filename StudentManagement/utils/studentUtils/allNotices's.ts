import { CallAPI } from "@/pages/api/callApi";
import { NoticeProps } from "./studentDashboard's";

export const GetAllNoticesWithPagination = async (
  page: number
): Promise<NoticeProps[]> => {
  const formData = {
    ControllerName: "Student",
    MethodName: "GetAllNoticesWithPagination",
    DataObject: JSON.stringify(page),
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

export const GetNoticeByNoticeId = async (
  noticeId: number
): Promise<NoticeProps | null> => {
  const formData = {
    ControllerName: "Hod",
    MethodName: "GetNoticeDetailsById",
    DataObject: JSON.stringify(noticeId),
    RoleIds: ["3"],
  };

  console.log("foirmdata", formData);
  var response = await CallAPI(formData);
  if (response != null && response.result != null) {
    console.log("foirmdata", response);
    const notice: NoticeProps = response.result.data;
    return notice;
  } else {
    return null;
  }
};
