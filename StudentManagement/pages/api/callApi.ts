interface FormDataProps {
  ControllerName: string;
  MethodName: string;
  DataObject: any;
}

interface MainFormDataProps {
  ControllerName: string;
  MethodName: string;
  DataObject: any;
  RoleIds: string[];
}

export const CallLoginAPI = async (formData: FormDataProps): Promise<any> => {
  const _baseAddress = "https://localhost:7199/MasterAPI/";
  try {
    var url =
      _baseAddress +
      formData.ControllerName +
      "/" +
      formData.MethodName +
      "/Login";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    var data = await response.json();

    return data;
  } catch (error) {
    sessionStorage.clear();
    window.location.href = "/";
    return null;
  }
};

export const CallAPI = async (formData: MainFormDataProps): Promise<any> => {
  const _baseAddress = "https://localhost:7199/MasterAPI/";
  try {
    var token = sessionStorage.getItem("token");
    if (token != null) {
      var url =
        _baseAddress +
        formData.ControllerName +
        "/" +
        formData.MethodName +
        "/";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      var data = await response.json();
      if (data.statusCode === 401 || data.statusCode === 500) {
        sessionStorage.clear();
        window.location.href = "/";
        return null;
      }
      return data;
    } else {
      sessionStorage.clear();
      window.location.href = "/";
      return null;
    }
  } catch (error) {
    sessionStorage.clear();
    window.location.href = "/";
    return null;
  }
};

export const CallAPIForFileUpload = async (
  File: File | null,
  FolderName: string
): Promise<any> => {
  const _baseAddress = "https://localhost:7199/api/";
  try {
    var token = sessionStorage.getItem("token");
    if (token != null) {
      var url = _baseAddress + "Hod/UploadFiles";
      const formData = new FormData();
      if (File) {
        formData.append("file", File);
      }
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          // "Content-Type": "multipart/form-data",
          folderName: FolderName,
          token: `${token}`,
        },
        body: formData,
      });
      var data = await response.json();
      if (data.statusCode === 401 || data.statusCode === 500) {
        sessionStorage.clear();
        window.location.href = "/";
        return null;
      }
      return data;
    } else {
      sessionStorage.clear();
      window.location.href = "/";
      return null;
    }
  } catch (error) {
    sessionStorage.clear();
    window.location.href = "/";
    return null;
  }
};

export const CallAPIForStudentFileUpload = async (
  File: File | null,
  MotherFile: File | null,
  FatherFile: File | null
): Promise<any> => {
  const _baseAddress = "https://localhost:7199/api/";
  try {
    var token = sessionStorage.getItem("token");
    if (token != null) {
      var url = _baseAddress + "Student/UploadFiles";
      const formData = new FormData();
      if (File) {
        formData.append("file", File);
      }
      if (MotherFile) {
        formData.append("motherFile", MotherFile);
      }
      if (FatherFile) {
        formData.append("fatherFile", FatherFile);
      }
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      var data = await response.json();

      if (data.statusCode === 401 || data.statusCode === 500) {
        sessionStorage.clear();
        window.location.href = "/";
        return null;
      }
      return data;
    } else {
      sessionStorage.clear();
      window.location.href = "/";
      return null;
    }
  } catch (error) {
    sessionStorage.clear();
    window.location.href = "/";
    return null;
  }
};

export const CallAPIForStudentDocumentsUpload = async (
  Files: File[],
  studentId: number
): Promise<any> => {
  const _baseAddress = "https://localhost:7199/api/";
  try {
    var token = sessionStorage.getItem("token");
    if (token != null) {
      var url = _baseAddress + "Student/UploadStudentDocuments";
      const formData = new FormData();
      Files.forEach((file) => {
        formData.append("files", file); // Append each file under the same key "files"
      });
      console.log("upload studentID",studentId);
      formData.append("studentId", `${studentId}`);
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      var data = await response.json();
      console.log("data", response);

      if (data.statusCode === 401 || data.statusCode === 500) {
        sessionStorage.clear();
        window.location.href = "/";
        return null;
      }
      return data;
    } else {
      sessionStorage.clear();
      window.location.href = "/";
      return null;
    }
  } catch (error) {
    sessionStorage.clear();
    window.location.href = "/";
    return null;
  }
};
