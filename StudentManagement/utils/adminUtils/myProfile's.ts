import { CallAPI } from "../../pages/api/callApi";


interface HodProps {
    Id: number;
    firstName: string;
    lastName: string;
    birthDate: Date;
    userName: string;
    email: string;
    mobileNumber: string;
    countryId: number;
    cityId: number;
    stateId: number;
    countryCode: string;
    imageName: string;
    imageUrl: string;
    countryName:string;
    cityName:String;
    stateName:String;
    postalCode:string;
  }
export const GetHodDetailsById = async  (Id: number):Promise<HodProps | null> => {

    const formData= {
        ControllerName: "Hod",
        MethodName:"GetHodDetailsById",
        DataObject:JSON.stringify(Id),
        RoleIds : ["1"]
    };

    var response = await CallAPI(formData);
    if(response != null && response.isSuccess == true)
    {
        const hodDetails: HodProps = response.result.data;
        return hodDetails;
    }
    return null;

}