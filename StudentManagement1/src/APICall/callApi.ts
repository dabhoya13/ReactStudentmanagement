interface FormDataProps {
  ControllerName: string;
  MethodName: string;
  DataObject: any;
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
    throw new Error();
  }
};
