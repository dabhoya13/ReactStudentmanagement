using Azure;
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
                     (controllerName == "Student" && methodName == "ExportExcelReport") ||
                     (controllerName == "Student" && methodName == "GetAllStudentsLeave"))
            {
                return GetDataModel<PaginationDto>(dataObj);
            }
            else if ((controllerName == "Student" && methodName == "DeleteStudentById")
                    || (controllerName == "Student" && methodName == "GetStudentDetailsById")
                    || (controllerName == "Hod" && methodName == "GetHodDetailsById")
                    || (controllerName == "Student" && methodName == "GetStudentExamByExamId")
                    || (controllerName == "Student" && methodName == "GetAllNoticesWithPagination")
                    || (controllerName == "Student" && methodName == "GetStudentUsedLeaveCounts"))
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
            else if ((controllerName == "Student" && methodName == "GetAttendanceFromMonthYear")
                || (controllerName == "Student" && methodName == "AddStudentAttendance")
                || (controllerName == "Student" && methodName == "SubmitAttendanceByHod"))
            {
                return GetDataModel<AttendanceDto>(dataObj);
            }
            else if ((controllerName == "Student" && methodName == "GetStudentLeaveStatus")
                || (controllerName == "Student" && methodName == "GetStudentAttendanceCount"))
            {
                return GetDataModel<StudentMonthYearDto>(dataObj);
            }
            else if (controllerName == "Student" && methodName == "GetStudentLast7daysAttendances")
            {
                return GetDataModel<StudentLast7DaysViewModel>(dataObj);
            }
            else if ((controllerName == "Student" && methodName == "GetStudentExamsFromDate")
                || (controllerName == "Student" && methodName == "UpsertStudentExam"))
            {
                return GetDataModel<StudentExam>(dataObj);
            }
            else if ((controllerName == "Student" && methodName == "GetAllStudentTodoListByDate")
                || (controllerName == "Student" && methodName == "AddStudentTodo")
                || (controllerName == "Student" && methodName == "ChangeTodoStatus")
                || (controllerName == "Student" && methodName == "DeleteTodo"))

            {
                return GetDataModel<StudentTodo>(dataObj);
            }
            else if ((controllerName == "Student" && methodName == "GetStudentResultById") ||
                    (controllerName == "Student" && methodName == "GetWholeYearStudentResult"))
            {
                return GetDataModel<StudentResults>(dataObj);
            }
            else if (controllerName == "Student" && methodName == "AddStudentLeave")
            {
                return GetDataModel<StudentsLeaveDto>(dataObj);
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
            parameters.Add(new DbParameters { Name = "@Id", Value = Id, DBType = DbType.Int32 });
            T newobj = await DbClient.ExecuteOneRecordProcedure<T>(Procedure, parameters);
            return newobj;

        }

        public async Task UpsertStudentDetails(Student student)
        {
            try
            {
                var table = new DataTable();
                table.Columns.Add("AcademicYear");
                table.Columns.Add("AdmissionDate");
                table.Columns.Add("FirstName");
                table.Columns.Add("LastName");
                table.Columns.Add("Course");
                table.Columns.Add("Class");
                table.Columns.Add("RollNo");
                table.Columns.Add("Gender");
                table.Columns.Add("BirthDate");
                table.Columns.Add("BloodGroup");
                table.Columns.Add("Religion");
                table.Columns.Add("Category");
                table.Columns.Add("Caste");
                table.Columns.Add("MobileNumber");
                table.Columns.Add("Email");
                table.Columns.Add("MotherTongue");
                table.Columns.Add("CurrentAddress");
                table.Columns.Add("ParmanentAddres");
                table.Columns.Add("PreviousSchoolNam");
                table.Columns.Add("PreviousSchoolAd");
                table.Columns.Add("UserName");
                table.Columns.Add("Password");
                table.Columns.Add("OtherInfo");
                table.Columns.Add("ImageName");


                var row = table.NewRow();
                row["AcademicYear"] = student.AcademicYear;
                row["AdmissionDate"] = student.AdmissionDate.ToString("MM-dd-yyyy HH:mm:ss");
                row["FirstName"] = student.FirstName;
                row["LastName"] = student.LastName;
                row["Course"] = student.CourseId;
                row["Class"] = student.ClassId;
                row["RollNo"] = student.RollNo;
                row["Gender"] = student.Gender;
                row["BirthDate"] = student.BirthDate.ToString("MM-dd-yyyy HH:mm:ss");
                row["BloodGroup"] = student.BloodGroup;
                row["Religion"] = student.Reigion;
                row["Category"] = student.Category;
                row["Caste"] = student.Caste;
                row["MobileNumber"] = student.MobileNumber;
                row["Email"] = student.Email;
                row["MotherTongue"] = student.MotherTongue;
                row["CurrentAddress"] = student.CurrentAddress;
                row["ParmanentAddres"] = student.PermanentAddress;
                row["PreviousSchoolNam"] = student.PreviousSchoolName;
                row["PreviousSchoolAd"] = student.PreviousSchoolAddress;
                row["UserName"] = student.UserName;
                row["Password"] = student.Password;
                row["OtherInfo"] = student.OtherInfo;
                row["ImageName"] = student.ImageName;

                table.Rows.Add(row);

                var table2 = new DataTable();
                table2.Columns.Add("ParentName");
                table2.Columns.Add("Relation");
                table2.Columns.Add("ParentNumber");
                table2.Columns.Add("ParentEmail");
                table2.Columns.Add("ParentImage");
                table2.Columns.Add("Occupation");

                foreach (var parent in student.Parents)
                {
                    var row2 = table2.NewRow();
                    row2["ParentName"] = parent.ParentName;
                    row2["Relation"] = parent.Relation;
                    row2["ParentNumber"] = parent.ParentNumber;
                    row2["ParentEmail"] = parent.ParentEmail;
                    row2["ParentImage"] = parent.ParentImage ?? null;
                    row2["Occupation"] = parent.Occupation;
                    table2.Rows.Add(row2);
                }

                var table3 = new DataTable();
                table3.Columns.Add("StudentDocumentName");
                table3.Columns.Add("StudentId");

                foreach (var document in student.Documents)
                {
                    var row3 = table3.NewRow();
                    row3["StudentDocumentName"] = document.StudentDocumentName;
                    row3["StudentId"] = student.StudentId;
                    table3.Rows.Add(row3);
                }

                var table4 = new DataTable();
                table4.Columns.Add("StudentDocumentId");
                foreach (var document in student.DeletedDocuments)
                {
                    var row4 = table4.NewRow();
                    row4["StudentDocumentId"] = document.StudentDocumentId;
                    table4.Rows.Add(row4);
                }

                Collection<DbParameters> parameters = new();
                parameters.Add(new DbParameters { Name = "@student_table", Value = table, DBType = DbType.Object, TypeName = "Student_Table" });
                parameters.Add(new DbParameters { Name = "@parent_table", Value = table2, DBType = DbType.Object, TypeName = "Parent_Table" });
                parameters.Add(new DbParameters { Name = "@document_table", Value = table3, DBType = DbType.Object, TypeName = "Document_Table" });
                parameters.Add(new DbParameters { Name = "@deleted_document_table", Value = table4, DBType = DbType.Object, TypeName = "Deleted_Document_Table" });

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

        public async Task<IList<AttendanceDto>> GetAttendanceFromMonthYear(int month, int year, int studentId)
        {
            try
            {
                Collection<DbParameters> parameters = new();
                parameters.Add(new DbParameters { Name = "@month", Value = month, DBType = DbType.Int32 });
                parameters.Add(new DbParameters { Name = "@year", Value = year, DBType = DbType.Int32 });
                parameters.Add(new DbParameters { Name = "@studentId", Value = studentId, DBType = DbType.Int32 });

                IList<AttendanceDto> attendanceDtos = await DbClient.ExecuteProcedure<AttendanceDto>("[dbo].[Get_Attendance_From_MonthYear]", parameters);
                return attendanceDtos;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task AddTodayStudentAttendance(AttendanceDto attendanceDto)
        {
            try
            {
                Collection<DbParameters> parameters = new();
                parameters.Add(new DbParameters { Name = "@studentId", Value = attendanceDto.StudentId, DBType = DbType.Int32 });
                parameters.Add(new DbParameters { Name = "@date", Value = attendanceDto.Date, DBType = DbType.DateTime });
                parameters.Add(new DbParameters { Name = "@status", Value = attendanceDto.Status, DBType = DbType.Boolean });

                await DbClient.ExecuteProcedure("[dbo].[Add_Attendance]", parameters, ExecuteType.ExecuteNonQuery);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<IList<Student>> GetAllStudentsWithAttendance()
        {
            try
            {
                IList<Student> students = await DbClient.ExecuteProcedure<Student>("[dbo].[Get_AllStudent_With_Attendance]", null);
                return students;

            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task HodSubmitAttendance(AttendanceDto attendanceDto)
        {
            try
            {
                var table = new DataTable();
                table.Columns.Add("StudentId");
                table.Columns.Add("Status");

                if (attendanceDto.AttedancesWithStudentId.Count > 0)
                {
                    foreach (var attednaceWithStudentId in attendanceDto.AttedancesWithStudentId)
                    {
                        var row = table.NewRow();
                        row["StudentId"] = attednaceWithStudentId.StudentId;
                        row["Status"] = attednaceWithStudentId.Status;
                        table.Rows.Add(row);
                    }

                    Collection<DbParameters> parameters = new();
                    parameters.Add(new DbParameters { Name = "@AttendanceList", Value = table, DBType = DbType.Object, TypeName = "dbo.StudentAttendanceType" });
                    await DbClient.ExecuteProcedure("[dbo].[Submit_Attendance_By_Hod]", parameters, ExecuteType.ExecuteNonQuery);
                }

            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<IList<StudentsLeaveDto>> GetStudentLeaveById(int StudentId, int month, int year)
        {
            try
            {
                Collection<DbParameters> parameters = new();
                parameters.Add(new DbParameters { Name = "@studentId", Value = StudentId, DBType = DbType.Int32 });
                parameters.Add(new DbParameters { Name = "@month", Value = month, DBType = DbType.Int32 });
                parameters.Add(new DbParameters { Name = "@year", Value = year, DBType = DbType.Int32 });

                IList<StudentsLeaveDto> studentsLeaves = await DbClient.ExecuteProcedure<StudentsLeaveDto>("[dbo].[Get_LeaveStatus_ByStudentId]", parameters);
                return studentsLeaves;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<StudentAttendanceCountDto> GetStudentAttendanceCountById(int studentId, int month, int year)
        {
            try
            {
                Collection<DbParameters> parameters = new();
                parameters.Add(new DbParameters { Name = "@studentId", Value = studentId, DBType = DbType.Int32 });
                parameters.Add(new DbParameters { Name = "@month", Value = month, DBType = DbType.Int32 });
                parameters.Add(new DbParameters { Name = "@year", Value = year, DBType = DbType.Int32 });

                StudentAttendanceCountDto studentAttendanceCount = await DbClient.ExecuteOneRecordProcedure<StudentAttendanceCountDto>("[dbo].[Get_AttendanceCount_ByStudentId]", parameters);
                return studentAttendanceCount;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<IList<AttendanceDto>> GetLast7DaysAttendance(int StudentId, DateTime startDate, DateTime endDate)
        {
            try
            {
                Collection<DbParameters> parameters = new();
                parameters.Add(new DbParameters { Name = "@studentId", Value = StudentId, DBType = DbType.Int32 });
                parameters.Add(new DbParameters { Name = "@startDate", Value = startDate, DBType = DbType.DateTime });
                parameters.Add(new DbParameters { Name = "@endDate", Value = endDate, DBType = DbType.DateTime });

                IList<AttendanceDto> attendanceDto = await DbClient.ExecuteProcedure<AttendanceDto>("[dbo].[Get_Last7DaysAttendance]", parameters);
                return attendanceDto;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<IList<StudentExam>> GetStudentExams(int StudentId, DateTime? ExamDate)
        {
            try
            {
                Collection<DbParameters> parameters = new()
                {
                    new DbParameters { Name = "@studentId", Value = StudentId, DBType = DbType.Int32 },
                    new DbParameters { Name = "@date", Value = ExamDate, DBType = DbType.DateTime }
                };
                IList<StudentExam> studentExams = await DbClient.ExecuteProcedure<StudentExam>("[dbo].[Get_Exam_For_Student]", parameters);

                return studentExams;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<IList<Faculty>> GetFacultyForDashboard()
        {
            try
            {
                IList<Faculty> faculties = await DbClient.ExecuteProcedure<Faculty>("[dbo].[get_feculties_for_studentDashboard]", null);

                return faculties;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<IList<ClassesDto>> GetAllClasses()
        {

            try
            {
                IList<ClassesDto> classes = await DbClient.ExecuteProcedure<ClassesDto>("[dbo].[Get_All_Classes]", null);

                return classes;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task UpsertStudentExam(StudentExam studentExam)
        {
            try
            {
                var table = new DataTable();
                table.Columns.Add("SubjectId");
                table.Columns.Add("StartTime");
                table.Columns.Add("EndTime");
                table.Columns.Add("ExamDate");
                table.Columns.Add("RoomNo");
                table.Columns.Add("ExamType");
                table.Columns.Add("ClassId");


                var row = table.NewRow();
                row["SubjectId"] = studentExam.SubjectId;
                row["StartTime"] = studentExam.StartTime;
                row["EndTime"] = studentExam.EndTime;
                row["ExamDate"] = studentExam.ExamDate?.ToString("MM-dd-yyyy HH:mm:ss");
                row["RoomNo"] = studentExam.RoomNo;
                row["ExamType"] = studentExam.ExamType;
                row["ClassId"] = studentExam.ClassId;

                table.Rows.Add(row);

                Collection<DbParameters> parameters = new();
                parameters.Add(new DbParameters { Name = "@exam_table", Value = table, DBType = DbType.Object, TypeName = "Student_Exam" });
                if (studentExam.ExamId > 0)
                {
                    parameters.Add(new DbParameters { Name = "@examId", Value = studentExam.ExamId, DBType = DbType.Int32 });
                }
                await DbClient.ExecuteProcedure("[dbo].[Add_Edit_Student_exam]", parameters, ExecuteType.ExecuteNonQuery);
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        public async Task<IList<StudentTodo>> GetTodolistFromDate(DateTime? date)
        {
            Collection<DbParameters> parameters = new();
            parameters.Add(new DbParameters { Name = "@date", Value = date, DBType = DbType.Date });
            IList<StudentTodo> studentTodos = await DbClient.ExecuteProcedure<StudentTodo>("[dbo].[get_all_studentTodo]", parameters);
            return studentTodos;
        }

        public async Task AddStudentTodo(StudentTodo studentTodo)
        {
            if (studentTodo.TodoDate != null)
            {
                studentTodo.TodoDate = studentTodo.TodoDate?.Date.AddDays(1);
                Collection<DbParameters> parameters = new();
                parameters.Add(new DbParameters { Name = "@name", Value = studentTodo.TodoName, DBType = DbType.String });
                parameters.Add(new DbParameters { Name = "@time", Value = studentTodo.Time, DBType = DbType.Time });
                parameters.Add(new DbParameters { Name = "@date", Value = studentTodo.TodoDate, DBType = DbType.Date });
                await DbClient.ExecuteProcedure("[dbo].[add_StudentTodo]", parameters, ExecuteType.ExecuteNonQuery);
            }
        }

        public async Task<IList<StudentResults>> GetStudentResultsById(StudentResults studentResults)
        {
            Collection<DbParameters> parameters = new();
            parameters.Add(new DbParameters { Name = "@studentId", Value = studentResults.StudentId, DBType = DbType.Int32 });
            parameters.Add(new DbParameters { Name = "@examId", Value = studentResults.ExamTypeId, DBType = DbType.Int32 });

            IList<StudentResults> studentResults1 = await DbClient.ExecuteProcedure<StudentResults>("[dbo].[Get_Student_Result_ById]", parameters);
            return studentResults1;
        }

        public async Task ChangeTodoStatus(StudentTodo studentTodo)
        {
            string todoIdsString = string.Join(",", studentTodo.TodoIds);
            Collection<DbParameters> parameters = new();
            parameters.Add(new DbParameters { Name = "@TodoIds", Value = todoIdsString, DBType = DbType.String });
            await DbClient.ExecuteProcedure("[dbo].[change_todo_status]", parameters, ExecuteType.ExecuteNonQuery);

        }

        public async Task DeleteTodo(StudentTodo studentTodo)
        {
            string todoIdsString = string.Join(",", studentTodo.TodoIds);
            Collection<DbParameters> parameters = new();
            parameters.Add(new DbParameters { Name = "@TodoIds", Value = todoIdsString, DBType = DbType.String });
            await DbClient.ExecuteProcedure("[dbo].[delete_todo]", parameters, ExecuteType.ExecuteNonQuery);

        }

        public async Task<IList<NoticeDto>> GetAllNoticeWithPagination(int page)
        {
            Collection<DbParameters> parameters = new();
            parameters.Add(new DbParameters { Name = "@PageNumber", Value = page, DBType = DbType.Int32 });
            IList<NoticeDto> notices = await DbClient.ExecuteProcedure<NoticeDto>("[dbo].[GetAllNoticeWithPagination]", parameters);
            return notices;
        }

        public async Task<IList<StudentDocuments>> GetStudentDocuments(int studentId)
        {
            Collection<DbParameters> parameters = new();
            parameters.Add(new DbParameters { Name = "@studentId", Value = studentId, DBType = DbType.Int32 });
            IList<StudentDocuments> studentDocuments = await DbClient.ExecuteProcedure<StudentDocuments>("[dbo].[get_student_documents]", parameters);
            return studentDocuments;
        }

        public async Task<IList<Parents>> GetParentsByStudentId(int studentId)
        {
            Collection<DbParameters> parameters = new();
            parameters.Add(new DbParameters { Name = "@studentId", Value = studentId, DBType = DbType.Int32 });
            IList<Parents> parents = await DbClient.ExecuteProcedure<Parents>("[dbo].[get_parents_with_studentId]", parameters);
            return parents;
        }

        public async Task<IList<StudentsLeaveDto>> GetAllStudentLeavesWithPagination(PaginationDto paginationDto)
        {
            Collection<DbParameters> parameters = new();
            parameters.Add(new DbParameters { Name = "@Search_Query", Value = paginationDto.SearchQuery ?? "", DBType = DbType.String });
            parameters.Add(new DbParameters { Name = "@Sort_Column_Name", Value = paginationDto.OrderBy ?? "", DBType = DbType.String });
            parameters.Add(new DbParameters { Name = "@Start_index", Value = paginationDto.StartIndex, DBType = DbType.Int64 });
            parameters.Add(new DbParameters { Name = "@Page_Size", Value = paginationDto.PageSize, DBType = DbType.Int64 });
            parameters.Add(new DbParameters { Name = "@StudentId", Value = paginationDto.StudentId, DBType = DbType.Int64 });

            //if (paginationDto.FromDate != null && paginationDto.ToDate != null)
            //{
            //    parameters.Add(new DbParameters { Name = "@FromDate", Value = paginationDto.FromDate, DBType = DbType.Date });
            //    parameters.Add(new DbParameters { Name = "@ToDate", Value = paginationDto.ToDate, DBType = DbType.Date });

            //}
            //IList<Book> books = DbClient.ExecuteProcedure<Book>("[dbo].[Get_Books_List]", parameters);
            IList<StudentsLeaveDto> data = await DbClient.ExecuteProcedure<StudentsLeaveDto>("[dbo].[get_Student_AllLeave]", parameters);
            return data;
        }

        public async Task AddStudentLeave(StudentsLeaveDto studentsLeaveDto)
        {
            var table = new DataTable();
            table.Columns.Add("LeaveTypeId");
            table.Columns.Add("LeaveDate");
            table.Columns.Add("StudentId");
            table.Columns.Add("NumberOfDays");
            table.Columns.Add("LeaveStatus");
            table.Columns.Add("Reason");


            var row = table.NewRow();
            row["LeaveTypeId"] = studentsLeaveDto.LeaveTypeId;
            row["LeaveDate"] = studentsLeaveDto.LeaveDate.AddDays(1).ToString("MM-dd-yyyy HH:mm:ss");
            row["StudentId"] = studentsLeaveDto.StudentId;
            row["NumberOfDays"] = studentsLeaveDto.NumberOfDays;
            row["LeaveStatus"] = studentsLeaveDto.LeaveStatus;
            row["Reason"] = studentsLeaveDto.Reason;
            table.Rows.Add(row);
            Collection<DbParameters> addParameters = new();
            addParameters.Add(new DbParameters { Name = "@leave_Table", Value = table, DBType = DbType.Object, TypeName = "Student_Leave" });
            await DbClient.ExecuteProcedure("[dbo].[add_student_leave]", addParameters, ExecuteType.ExecuteNonQuery);


        }

        public async Task<StudentsLeaveDto> GetTotalLeaves()
        {
            try
            {
                StudentsLeaveDto studentsLeaveDto = await DbClient.ExecuteOneRecordProcedure<StudentsLeaveDto>("[dbo].[get_total_leave_count]", null);
                return studentsLeaveDto;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<IList<StudentResults>> GetWholeYearResult(StudentResults studentResults)
        {
            Collection<DbParameters> parameters = new();
            parameters.Add(new DbParameters { Name = "@studentId", Value = studentResults.StudentId, DBType = DbType.Int32 });
            parameters.Add(new DbParameters { Name = "@startYear", Value = studentResults.StartYear, DBType = DbType.Int32 });
            IList<StudentResults> studentResultss = await DbClient.ExecuteProcedure<StudentResults>("[dbo].[Get_Whole_Year_Student_Result]", parameters);
            return studentResultss;
        }

        public async Task<IList<ExamType>> GetAllExamTypes()
        {
            IList<ExamType> examTypes = await DbClient.ExecuteProcedure<ExamType>("[dbo].[get_All_ExamType]", null);
            return examTypes;
        }
    }
}
