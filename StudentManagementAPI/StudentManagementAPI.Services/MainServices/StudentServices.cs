using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using StudentManagementAPI.DataContext;
using StudentManagementAPI.Models;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static StudentManagementAPI.DataContext.Enums;

namespace StudentManagementAPI.Services.MainServices
{
    public class StudentServices : IStudentServices
    {
        private readonly IJwtServices _jwtServices;
        private readonly IConfiguration _configuration;

        public StudentServices(IConfiguration configuration, IJwtServices jwtServices)
        {
            this._configuration = configuration;
            _jwtServices = jwtServices;
        }

        public async Task<T> GetStudent<T>(string Procedure, int Id)
        {
            Collection<DbParameters> parameters = new()
            {
                new DbParameters { Name = "@StudentId", Value = Id, DBType = DbType.Int64 }
            };
            T newobj = await DbClient.ExecuteOneRecordProcedure<T>(Procedure, parameters);
            return newobj;

        }

        public async Task<LoginInformationDto> GetLoginStudentDetails(StudentLoginDto studentLoginDto)
        {
            try
            {
                Collection<DbParameters> parameters = new Collection<DbParameters>();
                parameters.Add(new DbParameters() { Name = "@UserName", Value = studentLoginDto.UserName, DBType = DbType.String });
                parameters.Add(new DbParameters() { Name = "@PassWord", Value = studentLoginDto.Password, DBType = DbType.String });
                LoginInformationDto loginInformationDto =await DbClient.ExecuteOneRecordProcedure<LoginInformationDto>("[dbo].[Get_UserName_Password]", parameters);
                if (loginInformationDto != null && loginInformationDto.StudentId > 0)
                {
                    LoginInformationDto jwtClaimsDto = new()
                    {
                        StudentId = loginInformationDto.StudentId,
                        UserName = loginInformationDto.UserName,
                        Email = loginInformationDto.Email,
                        RoleId = 3,
                    };
                    loginInformationDto.RoleId = 3;
                    loginInformationDto.JwtToken = _jwtServices.GenerateToken(loginInformationDto);
                    //_jwtServices.GenerateToken(jwtClaimsDto);
                }
                return loginInformationDto;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<LoginInformationDto> CheckUserNamePassword(StudentLoginDto studentLoginDto)
        {
            try
            {
                Collection<DbParameters> parameters = new Collection<DbParameters>();
                parameters.Add(new DbParameters() { Name = "@UserName", Value = studentLoginDto.UserName, DBType = DbType.String });
                parameters.Add(new DbParameters() { Name = "@PassWord", Value = studentLoginDto.Password, DBType = DbType.String });
                LoginInformationDto loginInformationDto = await DbClient.ExecuteOneRecordProcedure<LoginInformationDto>("[dbo].[Get_ProfessorHod_UserName_Password]", parameters);
                if (loginInformationDto.Id != 0)
                {

                    loginInformationDto.RoleId = 1;
                    loginInformationDto.JwtToken = _jwtServices.GenerateToken(loginInformationDto);
                }
                return loginInformationDto;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task AddVerificationRecord(LoginInformationDto loginInformationDto)
        {
            Collection<DbParameters> parameters = new Collection<DbParameters>();
            parameters.Add(new DbParameters() { Name = "@UserId", Value = loginInformationDto.StudentId, DBType = DbType.String });
            parameters.Add(new DbParameters() { Name = "@Token", Value = loginInformationDto.token, DBType = DbType.String });
            await DbClient.ExecuteProcedure("[dbo].[Add_CheckStatus_Details]", parameters, ExecuteType.ExecuteNonQuery);
        }

        public static T GetDataModel<T>(object dataObj)
        {
            return ((JObject)dataObj).ToObject<T>();
        }

        public dynamic GetDynamicData(string controllerName, string methodName, object dataObj)
        {
            if (controllerName == "Login" && methodName == "CheckLoginDetails")
            {
                return GetDataModel<StudentLoginDto>(dataObj);
            }
            else
            {
                return null;
            }
        }

        public async Task<bool> UpdateVerificationRecord(string token, int UserId)
        {
            Collection<DbParameters> parameters = new Collection<DbParameters>();
            parameters.Add(new DbParameters() { Name = "@UserId", Value = UserId, DBType = DbType.String });
            parameters.Add(new DbParameters() { Name = "@Token", Value = token, DBType = DbType.String });
            int row = (int)await DbClient.ExecuteProcedure("[dbo].[Update_CheckStatus_Details]", parameters, ExecuteType.ExecuteNonQuery);
            if (row == 0)
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        //public IList<T> GetDataWithPagination<T>(PaginationDto paginationDto, string sp)
        //{
        //    try
        //    {
        //        Collection<DbParameters> parameters = new();
        //        parameters.Add(new DbParameters { Name = "@Search_Query", Value = paginationDto.searchQuery ?? "", DBType = DbType.String });
        //        parameters.Add(new DbParameters { Name = "@Sort_Column_Name", Value = paginationDto.OrderBy ?? "", DBType = DbType.String });
        //        parameters.Add(new DbParameters { Name = "@Start_index", Value = paginationDto.StartIndex, DBType = DbType.Int64 });
        //        parameters.Add(new DbParameters { Name = "@Page_Size", Value = paginationDto.PageSize, DBType = DbType.Int64 });
        //        if (paginationDto.FromDate != null && paginationDto.ToDate != null)
        //        {
        //            parameters.Add(new DbParameters { Name = "@FromDate", Value = paginationDto.FromDate, DBType = DbType.Date });
        //            parameters.Add(new DbParameters { Name = "@ToDate", Value = paginationDto.ToDate, DBType = DbType.Date });

        //        }
        //        //IList<Book> books = DbClient.ExecuteProcedure<Book>("[dbo].[Get_Books_List]", parameters);
        //        IList<T> data = DbClient.ExecuteProcedure<T>(sp, parameters);

        //        return data;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw;
        //    }
        //}


        public async Task<IList<GenderWiseCountDto>> GetStudentCountByGender()
        {
            try
            {
                IList<GenderWiseCountDto> genderWiseCount =await DbClient.ExecuteProcedure<GenderWiseCountDto>("[dbo].[Get_StudentCount_ByGender]", null);
                return genderWiseCount;
            }catch(Exception ex)
            {
                throw;
            }
        }


        public async Task<StudentProfessorCount> GetStudentProfessorCount()
        {
            try
            {
                StudentProfessorCount studentProfessorCount= await DbClient.ExecuteOneRecordProcedure<StudentProfessorCount>("[dbo].[Get_StudentProfessors_Count]", null);
                return studentProfessorCount;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
