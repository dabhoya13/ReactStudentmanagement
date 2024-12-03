using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudentManagementAPI.Models;
using StudentManagementAPI.Services;
using StudentManagementAPI.Services.MainServices;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;

namespace StudentManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HodController : ControllerBase
    {
        private APIResponse _response;
        private readonly IStudentServices _studentServices;
        private readonly IConfiguration _configuration;
        private readonly IJwtServices _jwtServices;


        public HodController(IStudentServices studentServices, IConfiguration configuration, IJwtServices jwtServices)
        {
            this._response = new();
            _studentServices = studentServices;
            _configuration = configuration;
            _jwtServices = jwtServices;
        }


        [HttpPost]
        public async Task<ActionResult<APIResponse>> UpsertNoticeDetails(NoticeDto noticeDto)
        {
            try
            {
                await _studentServices.UpsertNoticeDetails(noticeDto);
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

        [HttpPut("UploadFiles")]
        public async Task<ActionResult<APIResponse>> UploadFiles(IFormFile file)
        {
            try
            {
                var header = this.Request.Headers;
                if (!_jwtServices.ValidateToken(header["token"], out JwtSecurityToken jwtSecurityToken))
                {

                    _response.ErroMessages = new List<string>() { "JWT TOKEN IS INVALID " };
                    _response.StatusCode = HttpStatusCode.Unauthorized;
                    _response.IsSuccess = false;
                    return Unauthorized(_response);
                }
                else
                {
                    if (file == null || file.Length == 0)
                    {
                        _response.ErroMessages = new List<string>() { "No file provided" };
                        _response.StatusCode = HttpStatusCode.BadRequest;
                        _response.IsSuccess = false;
                        return BadRequest(_response);
                    }

                    var fileName = Path.GetFileName(file.FileName);
                    var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "NoticeImages");
                    var filePath = Path.Combine(uploadsFolderPath, fileName);
                    if (!Directory.Exists(uploadsFolderPath))
                    {
                        Directory.CreateDirectory(uploadsFolderPath);
                    }

                    if(!System.IO.File.Exists(filePath))
                    {
                        using var stream = new FileStream(filePath, FileMode.Create);
                        await file.CopyToAsync(stream);
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

        [HttpPut("UploadStudentProfiles")]
        public async Task<ActionResult<APIResponse>> UploadStudentProfiles(IFormFile file)
        {
            try
            {
                var header = this.Request.Headers;
                if (!_jwtServices.ValidateToken(header["token"], out JwtSecurityToken jwtSecurityToken))
                {

                    _response.ErroMessages = new List<string>() { "JWT TOKEN IS INVALID " };
                    _response.StatusCode = HttpStatusCode.Unauthorized;
                    _response.IsSuccess = false;
                    return Unauthorized(_response);
                }
                else
                {
                    if (file == null || file.Length == 0)
                    {
                        _response.ErroMessages = new List<string>() { "No file provided" };
                        _response.StatusCode = HttpStatusCode.BadRequest;
                        _response.IsSuccess = false;
                        return BadRequest(_response);
                    }

                    var fileName = Path.GetFileName(file.FileName);
                    var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "StudentProfiles");
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

        [HttpGet]
        public async Task<ActionResult<APIResponse>> GetAllNotices()
        {
            try
            {
                RoleBaseResponse<IList<NoticeDto>> roleBaseResponse = new();
                IList<NoticeDto> notices = await _studentServices.GetALlNotices();
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

        [HttpPut("DeleteNotice")]
        public async Task<ActionResult<APIResponse>> DeleteNotice(int NoticeId)
        {
            try
            {
                await _studentServices.DeleteNotice(NoticeId);
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

        [HttpGet("GetNoticeDetailsById")]
        public async Task<ActionResult<APIResponse>> GetNoticeDetailsById(int NoticeId)
        {
            try
            {
                NoticeDto noticeDto = await _studentServices.GetNoticeById(NoticeId);
                RoleBaseResponse<NoticeDto> roleBaseResponse= new()
                {
                    data = noticeDto,
                };

                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
                _response.result = roleBaseResponse;
            }catch(Exception ex)
            {
                _response.ErroMessages = new List<string>() { "Internal Server error try again after sometimes" };
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
            }
            return _response;
        }

        [HttpGet("GetAttendanceTotalCountsByMonthYear")]
        public async Task<ActionResult<APIResponse>> GetAttendanceTotalCountsByMonthYear(AttendanceMonthYearDto attendanceMonthYearDto)
        {
            try
            {
                IList<AttendanceCountDto> attendanceCountDtos= await _studentServices.GetAttendanceCountByMonthYear(attendanceMonthYearDto);
                RoleBaseResponse<IList<AttendanceCountDto>> roleBaseResponse = new()
                {
                    data = attendanceCountDtos,
                };

                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
                _response.result = roleBaseResponse;
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
        [HttpGet("GetAllStudents")]
        public async Task<ActionResult<APIResponse>> GetAllStudents(PaginationDto paginationDto)
        {

            try
            {
                if (paginationDto.StartIndex < 0 || paginationDto.PageSize < 0)
                {
                    return _response;
                }
                IList<Student> students = await _studentServices.GetDataWithPagination<Student>(paginationDto, "[dbo].[Get_All_Students_Data]");
                int totalItems = students.Count > 0 ? students.FirstOrDefault(x => x.StudentId != 0)?.TotalRecords ?? 0 : 0;
                int TotalPages = (int)Math.Ceiling((decimal)totalItems / paginationDto.PageSize);
                RoleBaseResponse<IList<Student>> roleBaseResponse = new()
                {
                    data = students,
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
            }
            return _response;

        }
    }
}
