import { CallAPI } from "../../APICall/callApi";

interface GenderWiseCountProps{
    Gender:string,
    GenderCount:number,
}

export const GetGenderWiseCounts = async (): Promise<GenderWiseCountProps[]> => {

    const formData = {
        ControllerName: "Student",
        MethodName: "GetStudentCountByGender",
        DataObject : JSON.stringify(null),
        RoleIds :  [ "1" ],
    };

    var response = await CallAPI(formData);
    if(response != null && response.result != null)
    {
        const GenderWiseCounts : GenderWiseCountProps[] = response.result.data.map((item: any) => ({
            Gender: item.gender == 1 ? "Male" : "Female",
            GenderCount: item.genderCount
        }));
        return GenderWiseCounts;
    }else{
        return [];
    }
} 