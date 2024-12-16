using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using StudentManagementAPI.DataContext;
using StudentManagementAPI.Models;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data;
using System.Linq;
using System.Runtime.CompilerServices;
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
                LoginInformationDto loginInformationDto = await DbClient.ExecuteOneRecordProcedure<LoginInformationDto>("[dbo].[Get_UserName_Password]", parameters);
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
            else if (controllerName == "Hod" && methodName == "UpsertNoticeDetails")
            {
                return GetDataModel<NoticeDto>(dataObj);
            }
            else if ((controllerName == "Hod" && methodName == "DeleteNotice") || (controllerName == "Hod" && methodName == "GetNoticeDetailsById"))
            {
                return Convert.ToInt32(dataObj);
            }
            else if (controllerName == "Hod" && methodName == "GetAttendanceTotalCountsByMonthYear")
            {
                return GetDataModel<AttendanceMonthYearDto>(dataObj);
            }
            else if ((controllerName == "Hod" && methodName == "GetAllStudents") ||
                     (controllerName == "Student" && methodName == "ExportExcelReport"))
            {
                return GetDataModel<PaginationDto>(dataObj);
            }
            else if ((controllerName == "Student" && methodName == "DeleteStudentById")
                    || (controllerName == "Student" && methodName == "GetStudentDetailsById")
                    || (controllerName == "Hod" && methodName == "GetHodDetailsById"))
            {
                return Convert.ToInt32(dataObj);
            }
            else if (
                    (controllerName == "Student" && methodName == "CheckUsernameExist"))
            {
                return dataObj.ToString();
            }
            else if (controllerName == "Student" && methodName == "UpsertStudentDetails")
            {
                return GetDataModel<Student>(dataObj);
            }
            else if ((controllerName == "Student" && methodName == "ExportPdfReport"))
            {
                return GetDataModel<ExportPdfViewModel>(dataObj);
            }
            else if ((controllerName == "Hod" && methodName == "UpdateProfessorHodDetails")
                || (controllerName == "Hod" && methodName == "UpdateHodProfilePicture")
                || (controllerName == "Hod" && methodName == "UpdateHodPersonalInfo")
                || (controllerName == "Hod" && methodName == "UpdateHodAddressInfo"))
            {
                return GetDataModel<ProfessorHodDto>(dataObj);
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
                IList<GenderWiseCountDto> genderWiseCount = await DbClient.ExecuteProcedure<GenderWiseCountDto>("[dbo].[Get_StudentCount_ByGender]", null);
                return genderWiseCount;
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        public async Task<StudentProfessorCount> GetStudentProfessorCount()
        {
            try
            {
                StudentProfessorCount studentProfessorCount = await DbClient.ExecuteOneRecordProcedure<StudentProfessorCount>("[dbo].[Get_StudentProfessors_Count]", null);
                return studentProfessorCount;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task UpsertNoticeDetails(NoticeDto noticeDto)
        {
            try
            {
                var table = new DataTable();
                table.Columns.Add("ShortDescription");
                table.Columns.Add("LongDescription");
                table.Columns.Add("Title");
                table.Columns.Add("ImageName");
                table.Columns.Add("Date");

                var row = table.NewRow();
                row["ShortDescription"] = noticeDto.ShortDescription;
                row["LongDescription"] = noticeDto.LongDescription;
                row["Title"] = noticeDto.Title;
                row["ImageName"] = noticeDto.ImageName;
                row["Date"] = (noticeDto.Date).ToString("MM-dd-yyyy HH:mm:ss");
                table.Rows.Add(row);

                if (noticeDto.NoticeId > 0)
                {
                    Collection<DbParameters> parameters = new();
                    parameters.Add(new DbParameters { Name = "@notice_table", Value = table, DBType = DbType.Object, TypeName = "Notice_Table" });
                    parameters.Add(new DbParameters { Name = "@noticeId", Value = noticeDto.NoticeId, DBType = DbType.Int32 });

                    await DbClient.ExecuteProcedure("[dbo].[Add_Edit_Notice_details]", parameters, ExecuteType.ExecuteNonQuery);
                }
                else
                {

                    Collection<DbParameters> addParameters = new();
                    addParameters.Add(new DbParameters { Name = "@notice_table", Value = table, DBType = DbType.Object, TypeName = "Notice_Table" });
                    await DbClient.ExecuteProcedure("[dbo].[Add_Edit_Notice_details]", addParameters, ExecuteType.ExecuteNonQuery);
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<IList<NoticeDto>> GetALlNotices()
        {
            try
            {
                IList<NoticeDto> noticeDtos = await DbClient.ExecuteProcedure<NoticeDto>("[dbo].[GetAll_Notice_details]", null);
                return noticeDtos;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task DeleteNotice(int NoticeId)
        {
            try
            {
                Collection<DbParameters> parameters = new();
                parameters.Add(new DbParameters { Name = "@noticeId", Value = NoticeId, DBType = DbType.Int32 });
                await DbClient.ExecuteProcedure("[dbo].[Delete_Notice_ById]", parameters, ExecuteType.ExecuteNonQuery);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<NoticeDto> GetNoticeById(int NoticeId)
        {
            try
            {
                Collection<DbParameters> parameters = new();
                parameters.Add(new DbParameters { Name = "@noticeId", Value = NoticeId, DBType = DbType.Int32 });
                NoticeDto noticeDto = await DbClient.ExecuteOneRecordProcedure<NoticeDto>("[dbo].[Get_Notice_ById]", parameters);
                return noticeDto;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<IList<AttendanceCountDto>> GetAttendanceCountByMonthYear(AttendanceMonthYearDto attendanceMonthYearDto)
        {
            try
            {
                Collection<DbParameters> parameters = new();
                parameters.Add(new DbParameters { Name = "@month", Value = attendanceMonthYearDto.Month, DBType = DbType.Int32 });
                parameters.Add(new DbParameters { Name = "@year", Value = attendanceMonthYearDto.Year, DBType = DbType.Int32 });
                parameters.Add(new DbParameters { Name = "@half", Value = attendanceMonthYearDto.Half, DBType = DbType.Int32 });

                IList<AttendanceCountDto> attendanceCountDtos = await DbClient.ExecuteProcedure<AttendanceCountDto>("[dbo].[get_Attendance_counts_by_MonthYear]", parameters);
                return attendanceCountDtos;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<IList<T>> GetDataWithPagination<T>(PaginationDto paginationDto, string sp)
        {
            try
            {
                Collection<DbParameters> parameters = new();
                parameters.Add(new DbParameters { Name = "@Search_Query", Value = paginationDto.SearchQuery ?? "", DBType = DbType.String });
                parameters.Add(new DbParameters { Name = "@Sort_Column_Name", Value = paginationDto.OrderBy ?? "", DBType = DbType.String });
                parameters.Add(new DbParameters { Name = "@Start_index", Value = paginationDto.StartIndex, DBType = DbType.Int64 });
                parameters.Add(new DbParameters { Name = "@Page_Size", Value = paginationDto.PageSize, DBType = DbType.Int64 });
                //if (paginationDto.FromDate != null && paginationDto.ToDate != null)
                //{
                //    parameters.Add(new DbParameters { Name = "@FromDate", Value = paginationDto.FromDate, DBType = DbType.Date });
                //    parameters.Add(new DbParameters { Name = "@ToDate", Value = paginationDto.ToDate, DBType = DbType.Date });

                //}
                //IList<Book> books = DbClient.ExecuteProcedure<Book>("[dbo].[Get_Books_List]", parameters);
                IList<T> data = await DbClient.ExecuteProcedure<T>(sp, parameters);

                return data;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<IList<T>> GetAllRecordsWithoutPagination<T>(string procedureName)
        {
            IList<T> allrecords = await DbClient.ExecuteProcedure<T>(procedureName, null);
            return allrecords;
        }

        public async Task DeleteStudentById(int StudentId)
        {
            try
            {
                Collection<DbParameters> parameters = new();
                parameters.Add(new DbParameters { Name = "@studentId", Value = StudentId, DBType = DbType.Int32 });
                await DbClient.ExecuteProcedure("[dbo].[Delete_Student_ById]", parameters, ExecuteType.ExecuteNonQuery);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<T> GetOneRecordFromId<T>(string Procedure, int Id)
        {
            Collection<DbParameters> parameters = new();
            parameters.Add(new DbParameters { Name = "@Id", Value = Id, DBType = DbType.Int64 });
            T newobj = await DbClient.ExecuteOneRecordProcedure<T>(Procedure, parameters);
            return newobj;

        }

        public async Task UpsertStudentDetails(Student student)
        {
            try
            {
                var table = new DataTable();
                table.Columns.Add("FirstName");
                table.Columns.Add("LastName");
                table.Columns.Add("UserName");
                table.Columns.Add("Email");
                table.Columns.Add("CourseId");
                table.Columns.Add("Password");
                table.Columns.Add("BirthDate");
                table.Columns.Add("Gender");
                table.Columns.Add("ImageName");


                var row = table.NewRow();
                row["FirstName"] = student.FirstName;
                row["LastName"] = student.LastName;
                row["UserName"] = student.UserName;
                row["Email"] = student.Email;
                row["CourseId"] = student.CourseId;
                row["Password"] = "Kp@123123";
                row["BirthDate"] = student.BirthDate.ToString("MM-dd-yyyy HH:mm:ss");
                row["Gender"] = student.Gender;
                row["ImageName"] = student.ImageName;

                table.Rows.Add(row);

                Collection<DbParameters> parameters = new();
                parameters.Add(new DbParameters { Name = "@student_table", Value = table, DBType = DbType.Object, TypeName = "Student_Table" });
                if (student.StudentId > 0)
                {
                    parameters.Add(new DbParameters { Name = "@studentId", Value = student.StudentId, DBType = DbType.Int32 });
                }
                await DbClient.ExecuteProcedure("[dbo].[Add_Edit_Student_details]", parameters, ExecuteType.ExecuteNonQuery);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<Student> CheckUsernameExistOrNot(string userName)
        {
            try
            {
                Collection<DbParameters> parameters = new();
                parameters.Add(new DbParameters { Name = "@userName", Value = userName, DBType = DbType.String });
                Student student = await DbClient.ExecuteOneRecordProcedure<Student>("[dbo].[Check_Username_exist]", parameters);
                return student;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<IList<Student>> GetExportStudentList(string searchQuery)
        {
            try
            {
                Collection<DbParameters> parameters = new();
                parameters.Add(new DbParameters { Name = "@Search_Query", Value = searchQuery, DBType = DbType.String });
                IList<Student> students = await DbClient.ExecuteProcedure<Student>("[dbo].[Get_All_Students_ForExport]", parameters);
                return students;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<LocationDto> GetAllCountriesStatesCitites()
        {
            try
            {
                IList<Country> countries = await DbClient.ExecuteProcedure<Country>("[dbo].[Get_All_Country]", null);
                IList<State> states = await DbClient.ExecuteProcedure<State>("[dbo].[Get_All_State]", null);
                IList<City> cities = await DbClient.ExecuteProcedure<City>("[dbo].[Get_All_City]", null);
                LocationDto locationDto = new()
                {
                    Cities = cities,
                    Countries = countries,
                    States = states,
                };
                return locationDto;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task UpdateProfessorHodDetails(ProfessorHodDto professorHodDto)
        {

            try
            {
                var table = new DataTable();
                table.Columns.Add("FirstName");
                table.Columns.Add("LastName");
                table.Columns.Add("UserName");
                table.Columns.Add("Email");
                table.Columns.Add("MobileNumber");
                table.Columns.Add("BirthDate");
                table.Columns.Add("CountryId");
                table.Columns.Add("StateId");
                table.Columns.Add("CityId");
                table.Columns.Add("PostalCode");
                table.Columns.Add("ImageName");

                var row = table.NewRow();
                row["FirstName"] = professorHodDto.FirstName;
                row["LastName"] = professorHodDto.LastName;
                row["UserName"] = professorHodDto.UserName;
                row["Email"] = professorHodDto.Email;
                row["MobileNumber"] = professorHodDto.MobileNumber;
                row["BirthDate"] = professorHodDto.BirthDate.ToString("MM-dd-yyyy HH:mm:ss");
                row["CountryId"] = professorHodDto.CountryId;
                row["StateId"] = professorHodDto.StateId;
                row["CityId"] = professorHodDto.CityId;
                row["PostalCode"] = professorHodDto.PostalCode;
                row["ImageName"] = professorHodDto.ImageName;


                table.Rows.Add(row);

                Collection<DbParameters> parameters = new();
                parameters.Add(new DbParameters { Name = "@professorHod", Value = table, DBType = DbType.Object, TypeName = "ProfessorHod_Table" });
                if (professorHodDto.Id > 0)
                {
                    parameters.Add(new DbParameters { Name = "@Id", Value = professorHodDto.Id, DBType = DbType.Int32 });
                    await DbClient.ExecuteProcedure("[dbo].[Update_ProfessorHod_Details]", parameters, ExecuteType.ExecuteNonQuery);
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task UpdateHodProfilePicture(ProfessorHodDto professorHodDto)
        {

            try
            {
                var table = new DataTable();
                table.Columns.Add("FirstName");
                table.Columns.Add("LastName");
                table.Columns.Add("ImageName");

                var row = table.NewRow();
                row["FirstName"] = professorHodDto.FirstName;
                row["LastName"] = professorHodDto.LastName;
                row["ImageName"] = professorHodDto.ImageName;


                table.Rows.Add(row);

                Collection<DbParameters> parameters = new();
                parameters.Add(new DbParameters { Name = "@professorHod", Value = table, DBType = DbType.Object, TypeName = "ProfessorHod_Profile_Picture_Table" });
                if (professorHodDto.Id > 0)
                {
                    parameters.Add(new DbParameters { Name = "@Id", Value = professorHodDto.Id, DBType = DbType.Int32 });
                    await DbClient.ExecuteProcedure("[dbo].[Update_Hod_ProfilePicture_Details]", parameters, ExecuteType.ExecuteNonQuery);
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task UpdateHodPersonalInfo(ProfessorHodDto professorHodDto)
        {

            try
            {
                var table = new DataTable();
                table.Columns.Add("FirstName");
                table.Columns.Add("LastName");
                table.Columns.Add("UserName");
                table.Columns.Add("BirthDate");
                table.Columns.Add("Email");
                table.Columns.Add("MobileNumber");


                var row = table.NewRow();
                row["FirstName"] = professorHodDto.FirstName;
                row["LastName"] = professorHodDto.LastName;
                row["UserName"] = professorHodDto.UserName;
                row["BirthDate"] = professorHodDto.BirthDate;
                row["Email"] = professorHodDto.Email;
                row["MobileNumber"] = professorHodDto.MobileNumber;


                table.Rows.Add(row);

                Collection<DbParameters> parameters = new();
                parameters.Add(new DbParameters { Name = "@professorHod", Value = table, DBType = DbType.Object, TypeName = "ProfessorHod_PersonalInfo_Table" });
                if (professorHodDto.Id > 0)
                {
                    parameters.Add(new DbParameters { Name = "@Id", Value = professorHodDto.Id, DBType = DbType.Int32 });
                    await DbClient.ExecuteProcedure("[dbo].[Update_Hod_PersonalInfo_Details]", parameters, ExecuteType.ExecuteNonQuery);
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task UpdateHodAddressInfo(ProfessorHodDto professorHodDto)
        {

            try
            {
                var table = new DataTable();
                table.Columns.Add("CountryId");
                table.Columns.Add("StateId");
                table.Columns.Add("CityId");
                table.Columns.Add("PostalCode");


                var row = table.NewRow();
                row["CountryId"] = professorHodDto.CountryId;
                row["StateId"] = professorHodDto.StateId;
                row["CityId"] = professorHodDto.CityId;
                row["PostalCode"] = professorHodDto.PostalCode;

                table.Rows.Add(row);

                Collection<DbParameters> parameters = new();
                parameters.Add(new DbParameters { Name = "@professorHod", Value = table, DBType = DbType.Object, TypeName = "ProfessorHod_AddressInfo_Table" });
                if (professorHodDto.Id > 0)
                {
                    parameters.Add(new DbParameters { Name = "@Id", Value = professorHodDto.Id, DBType = DbType.Int32 });
                    await DbClient.ExecuteProcedure("[dbo].[Update_Hod_AddressInfo_Details]", parameters, ExecuteType.ExecuteNonQuery);
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

    }
}
