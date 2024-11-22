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

interface StudentProfessorsCountProps{
    studentCount:number,
    professorCount:number
}

export const GetStudentProfessorsCount = async (): Promise<StudentProfessorsCountProps> =>
{
    const formData = {
        ControllerName : "Student",
        MethodName : "GetStudentProfessorCount",
        DataObject : JSON.stringify(null),
        RoleIds :  [ "1" ],
    }

    var response = await CallAPI(formData);
    if(response != null && response.result != null)
    {
        const studentProfessorCount : StudentProfessorsCountProps = response.result.data;
        return studentProfessorCount;
    }else{
        return {
            studentCount : 0,
            professorCount : 0
        };
    }
}