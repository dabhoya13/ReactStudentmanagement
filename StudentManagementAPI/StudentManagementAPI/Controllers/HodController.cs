using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudentManagementAPI.Models;
using StudentManagementAPI.Services;
using StudentManagementAPI.Services.MainServices;
using System.IdentityModel.Tokens.Jwt;
using System.Net;

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
        public async Task<ActionResult<APIResponse>> UploadFiles(IFormFile File)
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
                    if (File == null || File.Length == 0)
                    {
                        _response.ErroMessages = new List<string>() { "No file provided" };
                        _response.StatusCode = HttpStatusCode.BadRequest;
                        _response.IsSuccess = false;
                        return BadRequest(_response);
                    }

                    var fileName = Path.GetFileName(File.FileName);
                    var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "NoticeImages");
                    var filePath = Path.Combine(uploadsFolderPath, fileName);
                    if (!Directory.Exists(uploadsFolderPath))
                    {
                        Directory.CreateDirectory(uploadsFolderPath);
                    }
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await File.CopyToAsync(stream);
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
    }
}
