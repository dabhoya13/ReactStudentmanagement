using Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudentManagementAPI.Models;
using StudentManagementAPI.Services.MainServices;
using StudentManagementAPI.Services;
using System.Net;
using AutoMapper;

namespace StudentManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private APIResponse _response;
        private readonly IStudentServices _studentServices;
        private readonly IConfiguration _configuration;


        public CourseController(IStudentServices studentServices, IConfiguration configuration, IJwtServices jwtServices,IMapper mapper)
        {
            this._response = new();
            _studentServices = studentServices;
            _configuration = configuration;
        }

        [ProducesResponseType(StatusCodes.Status200OK)]
        [HttpGet("GetAllCourses")]
        public async Task<ActionResult<APIResponse>> GetAllCourses()
        {

            try
            {
                IList<CourseDto> courses= await _studentServices.GetAllRecordsWithoutPagination<CourseDto>("[dbo].[Get_All_Courses]");
                RoleBaseResponse<IList<CourseDto>> roleBaseResponse = new()
                {
                    data = courses,
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
