using Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudentManagementAPI.Models;
using StudentManagementAPI.Services;
using StudentManagementAPI.Services.MainServices;
using System.Net;

namespace StudentManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private APIResponse _response;
        private readonly IStudentServices _studentServices;
        private readonly IConfiguration _configuration;


        public StudentController(IStudentServices studentServices, IConfiguration configuration, IJwtServices jwtServices)
        {
            this._response = new();
            _studentServices = studentServices;
            _configuration = configuration;
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
                Student student =  await _studentServices.CheckUsernameExistOrNot(userName);
                RoleBaseResponse<Student> roleBaseResponse = new()
                {
                    data = student,
                };
                _response.result= roleBaseResponse;
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
    }
}
