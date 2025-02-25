﻿using AutoMapper;
using Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using SelectPdf;
using StudentManagementAPI.Models;
using StudentManagementAPI.Services;
using StudentManagementAPI.Services.MainServices;
using System.Drawing;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace StudentManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private APIResponse _response;
        private readonly IStudentServices _studentServices;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        private readonly IJwtServices _jwtServices;

        public StudentController(IStudentServices studentServices, IConfiguration configuration, IJwtServices jwtServices, IMapper mapper)
        {
            this._response = new();
            _studentServices = studentServices;
            _configuration = configuration;
            _mapper = mapper;
            _jwtServices = jwtServices;
        }

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [HttpGet]
        public async Task<ActionResult<APIResponse>> GetStudentCountByGender()
        {
            try
            {
                RoleBaseResponse<IList<GenderWiseCountDto>> roleBaseResponse = new();
                IList<GenderWiseCountDto> genderWiseCounts = await _studentServices.GetStudentCountByGender();

                if (genderWiseCounts != null && genderWiseCounts.Count > 0)
                {
                    roleBaseResponse.data = genderWiseCounts;
                    _response.result = roleBaseResponse;
                    _response.StatusCode = HttpStatusCode.OK;
                    _response.IsSuccess = true;
                }
                else
                {
                    List<GenderWiseCountDto> genderWiseCountDtos = new()
                {
                    new GenderWiseCountDto()
                    {
                        Gender = 1,
                        GenderCount = 0,
                    },

                    new GenderWiseCountDto()
                    {
                        Gender = 2,
                        GenderCount = 0,
                    }
                };
                    IList<GenderWiseCountDto> emptyCounts = genderWiseCountDtos;
                    roleBaseResponse.data = emptyCounts;
                    _response.result = roleBaseResponse;
                    _response.StatusCode = HttpStatusCode.OK;
                    _response.IsSuccess = true;
                }
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.ErroMessages = new List<string> { ex.Message };
            }
            return _response;
        }


        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [HttpGet("GetStudentProfessorCount")]
        public async Task<ActionResult<APIResponse>> GetStudentProfessorCount()
        {
            try
            {
                RoleBaseResponse<StudentProfessorCount> roleBaseResponse = new();
                StudentProfessorCount studentProfessorCount = await _studentServices.GetStudentProfessorCount();

                if (studentProfessorCount != null)
                {
                    roleBaseResponse.data = studentProfessorCount;
                    _response.result = roleBaseResponse;
                    _response.StatusCode = HttpStatusCode.OK;
                    _response.IsSuccess = true;
                }
                else
                {
                    StudentProfessorCount newStudentProfessorCount = new()
                    {
                        ProfessorCount = 0,
                        StudentCount = 0,
                    };
                    roleBaseResponse.data = newStudentProfessorCount;
                    _response.result = roleBaseResponse;
                    _response.StatusCode = HttpStatusCode.OK;
                    _response.IsSuccess = true;
                }
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.ErroMessages = new List<string> { ex.Message };
            }
            return _response;
        }

        [HttpPut("DeleteStudent")]
        public async Task<ActionResult<APIResponse>> DeleteStudentById(int StudentId)
        {
            try
            {
                await _studentServices.DeleteStudentById(StudentId);
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                _response.ErroMessages = new List<string>() { "Internal Server error try again after sometimes" };
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
            }
            return _response;
        }


        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [HttpGet("CheckUsernameExist")]
        public async Task<ActionResult<APIResponse>> CheckUsernameExist(string userName)
        {
            try
            {
                Student student = await _studentServices.CheckUsernameExistOrNot(userName);
                RoleBaseResponse<Student> roleBaseResponse = new()
                {
                    data = student,
                };
                _response.result = roleBaseResponse;
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                _response.ErroMessages = new List<string>() { "Internal Server error try again after sometimes" };
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
            }
            return _response;
        }

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpGet("{studentId:int}", Name = "GetStudentDetailsById")]
        public async Task<ActionResult<APIResponse>> GetStudentDetailsById(int studentId)
        {
            try
            {
                if (studentId == 0)
                {
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.ErroMessages = new List<string> { "Invalid StudentId" };
                    _response.IsSuccess = false;
                    return _response;
                }

                Student student = await _studentServices.GetOneRecordFromId<Student>("[dbo].[Get_Student_Details_ById]", studentId);
                IList<Parents> parents = await _studentServices.GetParentsByStudentId(studentId);
                IList<StudentDocuments> studentDocuments = await _studentServices.GetStudentDocuments(studentId);
                student.Parents = parents;
                student.Documents = studentDocuments;
                RoleBaseResponse<Student> roleBaseResponse = new()
                {
                    data = student
                };
                if (student.StudentId > 0)
                {
                    _response.result = roleBaseResponse;
                    _response.StatusCode = HttpStatusCode.OK;
                    _response.IsSuccess = true;
                }
                else
                {
                    _response.ErroMessages = new List<string> { "Student Not Fount" };
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.NotFound;
                    return _response;
                }
            }
            catch (Exception ex)
            {
                _response.ErroMessages = new List<string>() { ex.Message.ToString() };
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
            }
            return _response;

        }


        [HttpPost("UpsertStudentDetails")]
        public async Task<ActionResult<APIResponse>> UpsertStudentDetails(Student student)
        {
            try
            {
                await _studentServices.UpsertStudentDetails(student);
                if(student.DeletedDocuments != null && student.DeletedDocuments.Count > 0)
                {
                        var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Uploads", "StudentDocuments");
                    foreach(var document in student.DeletedDocuments)
                    {
                        var filePath = Path.Combine(uploadsFolderPath, document.StudentDocumentName);
                        if(System.IO.File.Exists(filePath))
                        {
                            try
                            {
                                System.IO.File.Delete(filePath);
                            }
                            catch (Exception ex)
                            {
                                _response.IsSuccess = false;
                                _response.ErroMessages = new List<string> { ex.Message };
                                _response.StatusCode = HttpStatusCode.InternalServerError;
                            }
                        }
                    }
                }
                _response.IsSuccess = true;
                _response.result = null;
                _response.StatusCode = HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErroMessages = new List<string> { ex.Message };
                _response.StatusCode = HttpStatusCode.InternalServerError;
            }
            return _response;
        }

        [HttpGet("ExportExcelReport")]
        public async Task<ActionResult<APIResponse>> ExportExcelReport(PaginationDto paginationDto)
        {
            try
            {
                IList<Student> students = await _studentServices.GetExportStudentList(paginationDto.SearchQuery);
                List<ExportStudent> ExportStudents = _mapper.Map<List<ExportStudent>>(students);

                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using (var package = new ExcelPackage())
                {
                    var worksheet = package.Workbook.Worksheets.Add("Student Management System");
                    worksheet.Cells[1, 1, 1, 9].Merge = true;
                    worksheet.View.ShowGridLines = false;
                    // Set title cell value and styles
                    var titleCell = worksheet.Cells[1, 1];
                    titleCell.Value = "School Management System";
                    titleCell.Style.Font.Size = 16;
                    titleCell.Style.Font.Color.SetColor(Color.White);
                    titleCell.Style.Font.Bold = true;
                    titleCell.Style.Fill.PatternType = ExcelFillStyle.Solid;
                    titleCell.Style.Fill.BackgroundColor.SetColor(Color.Blue);
                    titleCell.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    titleCell.Style.VerticalAlignment = ExcelVerticalAlignment.Center;

                    // Adjust row height to fit title
                    worksheet.Row(1).Height = 30; // Set to an appropriate value
                    worksheet.Cells["A2"].Value = string.Empty;
                    worksheet.Cells["A3"].Value = string.Empty;

                    worksheet.Cells[7, 1, 7, 9].Merge = true;

                    var headerCell = worksheet.Cells[7, 1];
                    headerCell.Value = "All Students";
                    headerCell.Style.Font.Size = 16;
                    headerCell.Style.Font.Color.SetColor(Color.White);
                    headerCell.Style.Font.Bold = true;
                    headerCell.Style.Fill.PatternType = ExcelFillStyle.Solid;
                    headerCell.Style.Fill.BackgroundColor.SetColor(Color.Blue);
                    headerCell.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    headerCell.Style.VerticalAlignment = ExcelVerticalAlignment.Center;

                    worksheet.Cells["A8"].LoadFromCollection(ExportStudents, true);

                    var headerRow = worksheet.Cells[8, 1, 8, worksheet.Dimension.End.Column];

                    headerRow.Style.Font.Bold = true;
                    worksheet.Cells.AutoFitColumns();

                    var rowCount = worksheet.Dimension.Rows;
                    var colCount = worksheet.Dimension.Columns;

                    //for (int row = 1; row <= rowCount; row++)
                    //{
                    //    for (int col = 1; col <= colCount; col++)
                    //    {
                    //        var cell = worksheet.Cells[row, col];
                    //        if (cell.Value != null && !string.IsNullOrWhiteSpace(cell.Text))
                    //        {
                    //            cell.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    //            cell.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    //            cell.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    //            cell.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                    //        }
                    //    }
                    //}
                    var result = package.GetAsByteArray();
                    _response.result = result;
                    _response.StatusCode = HttpStatusCode.OK;
                    _response.IsSuccess = true;
                }
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErroMessages = new List<string> { ex.Message };
                _response.StatusCode = HttpStatusCode.InternalServerError;
            }
            return _response;

        }

        [HttpGet("ExportPdfReport")]
        public async Task<ActionResult<APIResponse>> ExportPdfReport(ExportPdfViewModel exportPdfViewModel)
        {
            try
            {
                IList<Student> students = await _studentServices.GetExportStudentList(exportPdfViewModel.SearchQuery);
                List<ExportStudent> ExportStudents = _mapper.Map<List<ExportStudent>>(students);

                string filePath = Path.Combine("wwwroot", "Uploads", "PdfTemplate", "PdfTemplate.html");
                string template = System.IO.File.ReadAllText(filePath);

                string tableRows = string.Join("\n", ExportStudents.Select(d => $@"
                    <tr>
                        <td>{d.CreatedDate}</td>
                        <td>{d.StudentId}</td>
                        <td>{d.FirstName}</td>
                        <td>{d.LastName}</td>
                        <td>{d.BirthDate}</td>
                        <td>{d.CourseName}</td>
                        <td>{d.UserName}</td>
                        <td>{d.Gender}</td>
                        <td>{d.Email}</td>
                    </tr>   "));

                string htmlContent = template.Replace("{{tableRows}}", tableRows);

                var converter = new HtmlToPdf();
                converter.Options.PdfPageSize = PdfPageSize.A4;
                converter.Options.PdfPageOrientation = PdfPageOrientation.Portrait;
                converter.Options.MarginTop = 10;
                converter.Options.MarginBottom = 0;
                converter.Options.DisplayHeader = true;
                converter.Options.DisplayFooter = true;
                converter.Header.DisplayOnFirstPage = true;
                converter.Header.DisplayOnOddPages = true;
                converter.Header.DisplayOnEvenPages = true;
                converter.Header.Height = 230;
                converter.Footer.Height = 100;

                string headerHtmlPath = Path.Combine("wwwroot", "Uploads", "PdfTemplate", "PdfHeader.html");
                string headerHtmlContent = System.IO.File.ReadAllText(headerHtmlPath);
                string hodEmail = exportPdfViewModel.Email == "null" ? "dabhoyakishan12@gmail.com" : exportPdfViewModel.Email;
                string hodUsername = exportPdfViewModel.UserName ?? "";
                string hodName = exportPdfViewModel.FullName ?? "";
                string updatedHeaderHtmlContent = headerHtmlContent
                     .Replace("{{HodName}}", hodName)
                    .Replace("{{todayDate}}", DateTime.Now.ToString("dd MMM, yyyy"))
                    .Replace("{{HodEmail}}", hodEmail)
                    .Replace("{{HodUsername}}", hodUsername);
                PdfHtmlSection headerHtmlSection = new PdfHtmlSection(updatedHeaderHtmlContent, string.Empty)
                {
                    AutoFitHeight = HtmlToPdfPageFitMode.AutoFit
                };

                converter.Header.Add(headerHtmlSection);

                PdfImageSection imageSection = new PdfImageSection(30, 23, 35, "wwwroot/Images/school_logo.png");
                imageSection.Width = 35;
                imageSection.Height = 35;

                // Add the image to the header
                converter.Header.Add(imageSection);

                string footerHtmlPath = Path.Combine("wwwroot", "Uploads", "PdfTemplate", "PdfFooter.html");
                string footerHtmlContent = System.IO.File.ReadAllText(footerHtmlPath);

                PdfHtmlSection footerHtmlSection = new PdfHtmlSection(footerHtmlContent, string.Empty)
                {
                    AutoFitHeight = HtmlToPdfPageFitMode.AutoFit
                };

                PdfTextSection text = new PdfTextSection(-35, 20, "Page: {page_number} ", new System.Drawing.Font("Arial", 12));
                text.HorizontalAlign = PdfTextHorizontalAlign.Right;
                converter.Footer.Add(text);
                converter.Footer.Add(footerHtmlSection);

                var document = converter.ConvertHtmlString(htmlContent);
                if (document.Pages.Count > 1)
                {
                    // Remove the last page if it is blank
                    PdfPage lastPage = document.Pages[document.Pages.Count - 1];
                    document.Pages.Remove(lastPage);
                }
                using var stream = new MemoryStream();
                document.Save(stream);
                var result = stream.ToArray();
                _response.result = result;
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;

            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErroMessages = new List<string> { ex.Message };
                _response.StatusCode = HttpStatusCode.InternalServerError;
            }
            return _response;
        }


        [HttpGet("GetAttendanceFromMonthYear")]
        public async Task<ActionResult<APIResponse>> GetAttendanceFromMonthYear(AttendanceDto attendanceDto)
        {
            try
            {
                IList<AttendanceDto> attendanceDtos = await _studentServices.GetAttendanceFromMonthYear(attendanceDto.Month, attendanceDto.Year, attendanceDto.StudentId);
                RoleBaseResponse<IList<AttendanceDto>> roleBaseResponse = new()
                {
                    data = attendanceDtos,
                };
                _response.result = roleBaseResponse;
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErroMessages = new List<string> { ex.Message };
                _response.StatusCode = HttpStatusCode.InternalServerError;
            }
            return _response;
        }

        [HttpPost("AddStudentAttendance")]
        public async Task<ActionResult<APIResponse>> AddStudentAttendance(AttendanceDto attendanceDto)
        {
            try
            {
                await _studentServices.AddTodayStudentAttendance(attendanceDto);
                RoleBaseResponse<bool> roleBaseResponse = new()
                {
                    data = true,
                };
                _response.result = roleBaseResponse;
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErroMessages = new List<string> { ex.Message };
                _response.StatusCode = HttpStatusCode.InternalServerError;
            }
            return _response;
        }

        [HttpPost("SubmitAttendanceByHod")]
        public async Task<ActionResult<APIResponse>> SubmitAttendanceByHod(AttendanceDto attendanceDto)
        {
            try
            {
                await _studentServices.HodSubmitAttendance(attendanceDto);
                RoleBaseResponse<bool> roleBaseResponse = new()
                {
                    data = true,
                };
                _response.result = roleBaseResponse;
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErroMessages = new List<string> { ex.Message };
                _response.StatusCode = HttpStatusCode.InternalServerError;
            }
            return _response;
        }

        [HttpGet("GetStudentLeaveStatus")]
        public async Task<ActionResult<APIResponse>> GetStudentLeaveStatus(StudentMonthYearDto studentMonthYear)
        {
            try
            {
                IList<StudentsLeaveDto> newStudentLeaves = await _studentServices.GetStudentLeaveById(studentMonthYear.StudentId, studentMonthYear.Month, studentMonthYear.Year);
                RoleBaseResponse<IList<StudentsLeaveDto>> roleBaseResponse = new()
                {
                    data = newStudentLeaves,
                };
                _response.result = roleBaseResponse;
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErroMessages = new List<string> { ex.Message };
                _response.StatusCode = HttpStatusCode.InternalServerError;
            }
            return _response;
        }


        [HttpGet("GetStudentAttendanceCount")]
        public async Task<ActionResult<APIResponse>> GetStudentAttendanceCount(StudentMonthYearDto studentMonthYear)
        {
            try
            {
                StudentAttendanceCountDto studentAttendanceCount = await _studentServices.GetStudentAttendanceCountById(studentMonthYear.StudentId, studentMonthYear.Month, studentMonthYear.Year);
                studentAttendanceCount.TotalAbsentPresent = studentAttendanceCount.TotalPresent + studentAttendanceCount.TotalAbsent;
                RoleBaseResponse<StudentAttendanceCountDto> roleBaseResponse = new()
                {
                    data = studentAttendanceCount,
                };
                _response.result = roleBaseResponse;
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErroMessages = new List<string> { ex.Message };
                _response.StatusCode = HttpStatusCode.InternalServerError;
            }
            return _response;
        }

        [HttpGet("GetStudentLast7daysAttendances")]
        public async Task<ActionResult<APIResponse>> GetStudentLast7daysAttendances(StudentLast7DaysViewModel studentLast7DaysViewModel)
        {
            try
            {
                IList<AttendanceDto> attendances = await _studentServices.GetLast7DaysAttendance(studentLast7DaysViewModel.StudentId, studentLast7DaysViewModel.StartDate, studentLast7DaysViewModel.EndDate);
                RoleBaseResponse<IList<AttendanceDto>> roleBaseResponse = new()
                {
                    data = attendances,
                };
                _response.result = roleBaseResponse;
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErroMessages = new List<string> { ex.Message };
                _response.StatusCode = HttpStatusCode.InternalServerError;
            }
            return _response;
        }


        [HttpGet("GetStudentExamsFromDate")]
        public async Task<ActionResult<APIResponse>> GetStudentExamsFromDate(StudentExam studentExam)
        {
            try
            {
                if (studentExam.ExamDate != null)
                {
                    studentExam.ExamDate = studentExam.ExamDate?.Date.AddDays(1);
                }
                IList<StudentExam> studentExams = await _studentServices.GetStudentExams(studentExam.StudentId, studentExam.ExamDate);
                RoleBaseResponse<IList<StudentExam>> roleBaseResponse = new()
                {
                    data = studentExams,
                };
                _response.result = roleBaseResponse;
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErroMessages = new List<string> { ex.Message };
                _response.StatusCode = HttpStatusCode.InternalServerError;
            }
            return _response;
        }

        [HttpGet("GetAllFacultyForStudentDashboard")]
        public async Task<ActionResult<APIResponse>> GetAllFacultyForStudentDashboard()
        {
            try
            {
                IList<Faculty> faculties = await _studentServices.GetFacultyForDashboard();
                RoleBaseResponse<IList<Faculty>> roleBaseResponse = new()
                {
                    data = faculties,
                };
                _response.result = roleBaseResponse;
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErroMessages = new List<string> { ex.Message };
                _response.StatusCode = HttpStatusCode.InternalServerError;
            }
            return _response;
        }


        [HttpGet("GetAllClasses")]
        public async Task<ActionResult<APIResponse>> GetAllClasses()
        {
            try
            {
                IList<ClassesDto> classes = await _studentServices.GetAllClasses();
                RoleBaseResponse<IList<ClassesDto>> roleBaseResponse = new()
                {
                    data = classes,
                };
                _response.result = roleBaseResponse;
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErroMessages = new List<string> { ex.Message };
                _response.StatusCode = HttpStatusCode.InternalServerError;
            }
            return _response;
        }

        [HttpGet("GetStudentExamByExamId")]
        public async Task<ActionResult<APIResponse>> GetStudentExamByExamId(int examId)
        {
            try
            {
                StudentExam studentExam = await _studentServices.GetOneRecordFromId<StudentExam>("[dbo].[get_studentExam_byId]", examId);
                RoleBaseResponse<StudentExam> roleBaseResponse = new()
                {
                    data = studentExam,
                };
                _response.result = roleBaseResponse;
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErroMessages = new List<string> { ex.Message };
                _response.StatusCode = HttpStatusCode.InternalServerError;
            }
            return _response;
        }


        [ProducesResponseType(StatusCodes.Status200OK)]
        [HttpGet("GetAllSubjects")]
        public async Task<ActionResult<APIResponse>> GetAllSubjects()
        {

            try
            {
                IList<SubjectDto> subjects = await _studentServices.GetAllRecordsWithoutPagination<SubjectDto>("[dbo].[get_All_Subjects]");
                RoleBaseResponse<IList<SubjectDto>> roleBaseResponse = new()
                {
                    data = subjects,
                };
                _response.result = roleBaseResponse;
                _response.IsSuccess = true;
                _response.StatusCode = HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                _response.ErroMessages = new List<string>() { "Internal Server error try again after sometimes" };
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
            }
            return _response;

        }


        [HttpPost("UpsertStudentExam")]
        public async Task<ActionResult<APIResponse>> UpsertStudentExam(StudentExam studentExam)
        {
            try
            {
                studentExam.ExamDate = studentExam.ExamDate?.AddDays(1);
                await _studentServices.UpsertStudentExam(studentExam);
                _response.IsSuccess = true;
                _response.StatusCode = HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErroMessages = new List<string> { ex.Message };
                _response.StatusCode = HttpStatusCode.InternalServerError;
            }
            return _response;
        }

        [HttpGet("GetAllStudentTodoListByDate")]
        public async Task<ActionResult<APIResponse>> GetAllStudentTodoListByDate(StudentTodo studentTodo)
        {

            try
            {
                IList<StudentTodo> studentTodos = await _studentServices.GetTodolistFromDate(studentTodo.TodoDate);
                RoleBaseResponse<IList<StudentTodo>> roleBaseResponse = new()
                {
                    data = studentTodos,
                };
                _response.result = roleBaseResponse;
                _response.IsSuccess = true;
                _response.StatusCode = HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                _response.ErroMessages = new List<string>() { "Internal Server error try again after sometimes" };
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
            }
            return _response;
        }

        [HttpPost("AddStudentTodo")]
        public async Task<ActionResult<APIResponse>> AddStudentTodo(StudentTodo studentTodo)
        {
            try
            {
                await _studentServices.AddStudentTodo(studentTodo);
                RoleBaseResponse<bool> roleBaseResponse = new()
                {
                    data = true,
                };
                _response.result = roleBaseResponse;
                _response.IsSuccess = true;
                _response.StatusCode = HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                _response.ErroMessages = new List<string>() { "Internal Server error try again after sometimes" };
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
            }
            return _response;
        }

        [HttpGet("GetStudentResultById")]
        public async Task<ActionResult<APIResponse>> GetStudentResultById(StudentResults studentResults)
        {

            try
            {
                IList<StudentResults> studentResults1 = await _studentServices.GetStudentResultsById(studentResults);
                RoleBaseResponse<IList<StudentResults>> roleBaseResponse = new()
                {
                    data = studentResults1,
                };
                _response.result = roleBaseResponse;
                _response.IsSuccess = true;
                _response.StatusCode = HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                _response.ErroMessages = new List<string>() { "Internal Server error try again after sometimes" };
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
            }
            return _response;
        }

        [HttpPut("ChangeTodoStatus")]
        public async Task<ActionResult<APIResponse>> ChangeTodoStatus(StudentTodo studentTodo)
        {

            try
            {
                _studentServices.ChangeTodoStatus(studentTodo);
                RoleBaseResponse<bool> roleBaseResponse = new()
                {
                    data = true,
                };
                _response.result = roleBaseResponse;
                _response.IsSuccess = true;
                _response.StatusCode = HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                _response.ErroMessages = new List<string>() { "Internal Server error try again after sometimes" };
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
            }
            return _response;
        }


        [HttpPut("DeleteTodo")]
        public async Task<ActionResult<APIResponse>> DeleteTodo(StudentTodo studentTodo)
        {

            try
            {
                _studentServices.DeleteTodo(studentTodo);
                RoleBaseResponse<bool> roleBaseResponse = new()
                {
                    data = true,
                };
                _response.result = roleBaseResponse;
                _response.IsSuccess = true;
                _response.StatusCode = HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                _response.ErroMessages = new List<string>() { "Internal Server error try again after sometimes" };
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
            }
            return _response;
        }

        [HttpGet("GetAllNoticesWithPagination")]
        public async Task<ActionResult<APIResponse>> GetAllNoticesWithPagination(int page)
        {
            try
            {
                RoleBaseResponse<IList<NoticeDto>> roleBaseResponse = new();
                IList<NoticeDto> notices = await _studentServices.GetAllNoticeWithPagination(page);
                if (notices != null)
                {
                    roleBaseResponse.data = notices;
                }
                _response.result = roleBaseResponse;
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
                return _response;

            }
            catch (Exception ex)
            {
                _response.ErroMessages = new List<string>() { "Internal Server error try again after sometimes" };
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
                return _response;
            }
        }

        [HttpGet("GetStudentUsedLeaveCounts")]
        public async Task<ActionResult<APIResponse>> GetStudentUsedLeaveCounts(int studentId)
        {
            try
            {
                RoleBaseResponse<StudentsLeaveDto> roleBaseResponse = new();
                StudentsLeaveDto leavesCount = await _studentServices.GetOneRecordFromId<StudentsLeaveDto>("[dbo].[get_used_leave_count]", studentId);
                StudentsLeaveDto totalLeaves = await _studentServices.GetTotalLeaves();
                leavesCount.TotalMedicalLeave = totalLeaves.TotalMedicalLeave;
                leavesCount.TotalCasualLeave = totalLeaves.TotalCasualLeave;
                leavesCount.TotalMaternityLeave = totalLeaves.TotalMaternityLeave;
                leavesCount.TotalPaternityLeave = totalLeaves.TotalPaternityLeave;
                roleBaseResponse.data = leavesCount;
                _response.result = roleBaseResponse;
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
                return _response;

            }
            catch (Exception ex)
            {
                _response.ErroMessages = new List<string>() { "Internal Server error try again after sometimes" };
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
                return _response;
            }
        }

        [HttpGet("GetAllStudentsLeave")]
        public async Task<ActionResult<APIResponse>> GetAllStudentsLeave(PaginationDto paginationDto)
        {
            try
            {
                if (paginationDto.StartIndex < 0 || paginationDto.PageSize < 0)
                {
                    return _response;
                }
                IList<StudentsLeaveDto> studentsLeaveDtos = await _studentServices.GetAllStudentLeavesWithPagination(paginationDto);
                int totalItems = studentsLeaveDtos.Count > 0 ? studentsLeaveDtos.FirstOrDefault(x => x.LeaveId != 0)?.TotalRecords ?? 0 : 0;
                int TotalPages = (int)Math.Ceiling((decimal)totalItems / paginationDto.PageSize);
                RoleBaseResponse<IList<StudentsLeaveDto>> roleBaseResponse = new()
                {
                    data = studentsLeaveDtos,
                    StartIndex = paginationDto.StartIndex,
                    PageSize = paginationDto.PageSize,
                    TotalItems = totalItems,
                    TotalPages = TotalPages,
                    CurrentPage = (int)Math.Ceiling((double)paginationDto.StartIndex / paginationDto.PageSize),
                    searchQuery = paginationDto.SearchQuery,
                };
                _response.result = roleBaseResponse;
                _response.IsSuccess = true;
                _response.StatusCode = HttpStatusCode.OK;

            }
            catch (Exception ex)
            {
                _response.ErroMessages = new List<string>() { "Internal Server error try again after sometimes" };
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
                return _response;
            }
            return _response;
        }

        [HttpPost("AddStudentLeave")]
        public async Task<ActionResult<APIResponse>> AddStudentLeave(StudentsLeaveDto studentsLeaveDto)
        {
            try
            {
                await _studentServices.AddStudentLeave(studentsLeaveDto);
                RoleBaseResponse<bool> roleBaseResponse = new()
                {
                    data = true,
                };
                _response.result = roleBaseResponse;
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErroMessages = new List<string> { ex.Message };
                _response.StatusCode = HttpStatusCode.InternalServerError;
            }
            return _response;
        }

        [HttpGet("GetWholeYearStudentResult")]
        public async Task<ActionResult<APIResponse>> GetWholeYearStudentResult(StudentResults studentResults)
        {
            try
            {
                IList<StudentResults> studentResultss = await _studentServices.GetWholeYearResult(studentResults);
                //int totalMarksObtained = 0;
                //int totalMarks = 0;
                //bool allSubjectsPassed = true;

                //foreach(var result in studentResultss)
                //{
                //    totalMarksObtained += result.MarkObtained;
                //    totalMarks += result.MaxMarks;

                //    if(!result.Status)
                //    {
                //        allSubjectsPassed = false;
                //    }
                //}

                //decimal percentage = totalMarks > 0 ? (decimal)totalMarksObtained / totalMarks * 100 : 0;
                RoleBaseResponse<IList<StudentResults>> roleBaseResponse = new()
                {
                    data = studentResultss,
                };
                _response.result = roleBaseResponse;
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErroMessages = new List<string> { ex.Message };
                _response.StatusCode = HttpStatusCode.InternalServerError;
            }
            return _response;
        }

        [HttpGet("GetAllExamTypes")]
        public async Task<ActionResult<APIResponse>> GetAllExamTypes()
        {
            try
            {
                IList<ExamType> examTypes = await _studentServices.GetAllExamTypes();
                RoleBaseResponse<IList<ExamType>> roleBaseResponse = new()
                {
                    data = examTypes,
                };
                _response.result = roleBaseResponse;
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErroMessages = new List<string> { ex.Message };
                _response.StatusCode = HttpStatusCode.InternalServerError;
            }
            return _response;
        }

        [HttpPut("UploadFiles")]
        public async Task<ActionResult<APIResponse>> UploadFiles(IFormFile? file, IFormFile? motherFile, IFormFile? fatherFile)
        {
            try
            {
                var token = this.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                if (!_jwtServices.ValidateToken(token, out JwtSecurityToken jwtSecurityToken))
                {

                    _response.ErroMessages = new List<string>() { "JWT TOKEN IS INVALID " };
                    _response.StatusCode = HttpStatusCode.Unauthorized;
                    _response.IsSuccess = false;
                    return Unauthorized(_response);
                }
                else
                {
                    if (file != null && file.Length != 0)
                    {
                        var fileName = Path.GetFileName(file.FileName);
                        var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Uploads", "StudentProfiles");
                        var filePath = Path.Combine(uploadsFolderPath, fileName);
                        if (!Directory.Exists(uploadsFolderPath))
                        {
                            Directory.CreateDirectory(uploadsFolderPath);
                        }

                        if (!System.IO.File.Exists(filePath))
                        {
                            using var stream = new FileStream(filePath, FileMode.Create);
                            await file.CopyToAsync(stream);
                        }
                    }


                    var uploadsParentFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Uploads", "ParentProfiles");
                    if (fatherFile != null && fatherFile.Length != 0)
                    {
                        var fatherFileName = Path.GetFileName(fatherFile.FileName);
                        var fatherFilePath = Path.Combine(uploadsParentFolderPath, fatherFileName);
                        if (!Directory.Exists(uploadsParentFolderPath))
                        {
                            Directory.CreateDirectory(uploadsParentFolderPath);
                        }

                        if (!System.IO.File.Exists(fatherFilePath))
                        {
                            using var stream = new FileStream(fatherFilePath, FileMode.Create);
                            await fatherFile.CopyToAsync(stream);
                        }
                    }


                    if (motherFile != null && motherFile.Length != 0)
                    {
                        var motherFileName = Path.GetFileName(motherFile.FileName);
                        var motherFilePath = Path.Combine(uploadsParentFolderPath, motherFileName);
                        if (!Directory.Exists(uploadsParentFolderPath))
                        {
                            Directory.CreateDirectory(uploadsParentFolderPath);
                        }

                        if (!System.IO.File.Exists(motherFilePath))
                        {
                            using var stream = new FileStream(motherFilePath, FileMode.Create);
                            await motherFile.CopyToAsync(stream);
                        }
                    }


                    _response.StatusCode = HttpStatusCode.OK;
                    _response.IsSuccess = true;
                    return Ok(_response);
                }
            }
            catch (Exception ex)
            {

                _response.ErroMessages = new List<string>() { "Internal Server error try again after sometimes" };
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
                return _response;
            }
        }


        [HttpPut("UploadStudentDocuments")]
        public async Task<ActionResult<APIResponse>> UploadStudentDocuments(List<IFormFile>? files, [FromForm] string? studentId)
        {
            try
            {
                var token = this.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                if (!_jwtServices.ValidateToken(token, out JwtSecurityToken jwtSecurityToken))
                {

                    _response.ErroMessages = new List<string>() { "JWT TOKEN IS INVALID " };
                    _response.StatusCode = HttpStatusCode.Unauthorized;
                    _response.IsSuccess = false;
                    return Unauthorized(_response);
                }
                else
                {
                    if(files != null && files.Any())
                    {
                        var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Uploads", "StudentDocuments");
                        if (!Directory.Exists(uploadsFolderPath))
                        {
                            Directory.CreateDirectory(uploadsFolderPath);
                        }

                        foreach(var file in files)
                        {
                            if(file.Length > 0)
                            {
                                var fileName = studentId + Path.GetFileName(file.FileName);
                                var filePath = Path.Combine(uploadsFolderPath, fileName);
                                if (!System.IO.File.Exists(filePath))
                                {
                                    using var stream = new FileStream(filePath, FileMode.Create);
                                    await file.CopyToAsync(stream);
                                }
                            }
                        }
                    }

                    _response.StatusCode = HttpStatusCode.OK;
                    _response.IsSuccess = true;
                    return Ok(_response);
                }
            }
            catch (Exception ex)
            {

                _response.ErroMessages = new List<string>() { "Internal Server error try again after sometimes" };
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
                return _response;
            }
        }
    }
}