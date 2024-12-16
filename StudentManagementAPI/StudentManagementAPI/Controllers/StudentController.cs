using AutoMapper;
using Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using SelectPdf;
using StudentManagementAPI.Models;
using StudentManagementAPI.Services;
using StudentManagementAPI.Services.MainServices;
using System.Drawing;
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

        public StudentController(IStudentServices studentServices, IConfiguration configuration, IJwtServices jwtServices,IMapper mapper)
        {
            this._response = new();
            _studentServices = studentServices;
            _configuration = configuration;
            _mapper = mapper;
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

                string headerHtmlPath = Path.Combine("wwwroot","Uploads", "PdfTemplate", "PdfHeader.html");
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
    }
}