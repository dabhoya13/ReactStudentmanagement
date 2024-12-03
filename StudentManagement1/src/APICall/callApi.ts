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
    console.log(data);

    return data;
  } catch (error) {
    throw new Error();
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
        body: JSON.stringify(formData),
      });
      var data = await response.json();
      if (data.statusCode === 401 || data.statusCode === 500 ) {
        sessionStorage.clear();
        window.location.href = "/login";
        return null;
      }
      return data;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error();
  }
};

export const CallAPIForFileUpload = async (File: File | null): Promise<any> => {
  const _baseAddress = "https://localhost:7199/api/";
  try {
    var token = sessionStorage.getItem("token");
    if (token != null) {
      var url = _baseAddress + "Hod/UploadStudentProfiles";
      const formData = new FormData();
      if (File) {
        formData.append("file", File);
      }
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          // "Content-Type": "multipart/form-data",
          token: `${token}`,
        },
        body:formData,
      });
      var data = await response.json();
      if (data.statusCode === 401 || data.statusCode === 500 ) {
        sessionStorage.clear();
        window.location.href = "/login";
        return null;
      }
      return data;
    } else {
      sessionStorage.clear();
      window.location.href = "/login";
      return null;
    }
  } catch (error) {
    throw new Error();
  }
};



