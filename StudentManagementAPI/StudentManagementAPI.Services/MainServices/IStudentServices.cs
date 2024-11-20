using StudentManagementAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagementAPI.Services.MainServices
{
    public interface IStudentServices
    {
        Task<T> GetStudent<T>(string Procedure, int Id);

        Task<LoginInformationDto> GetLoginStudentDetails(StudentLoginDto studentLoginDto);
        Task<LoginInformationDto> CheckUserNamePassword(StudentLoginDto studentLoginDto);
        dynamic GetDynamicData(string controllerName, string methodName, object dataObj);
        Task AddVerificationRecord(LoginInformationDto loginInformationDto);
        Task<bool> UpdateVerificationRecord(string token, int UserId);
        Task<IList<GenderWiseCountDto>> GetStudentCountByGender();
    }
}
