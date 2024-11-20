using Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using StudentManagementAPI.Models;
using StudentManagementAPI.Services.MainServices;
using System.Net;

namespace StudentManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private APIResponse _response;
        private readonly IStudentServices _studentServices;
        private readonly IConfiguration _configuration; 


        public LoginController(IStudentServices studentServices, IConfiguration configuration)
        {
            this._response = new();
            _studentServices = studentServices;
            _configuration = configuration;
        }

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [HttpGet("CheckLoginDetails", Name = "CheckLoginDetails")]
        public async Task<ActionResult<APIResponse>> CheckLoginDetails([FromQuery] StudentLoginDto studentLoginDto)
        {
            try
            {
                LoginInformationDto loginInformationDto = await _studentServices.GetLoginStudentDetails(studentLoginDto);
                if (loginInformationDto != null && loginInformationDto.StudentId != 0)
                {
                    RoleBaseResponse<LoginInformationDto> roleBaseResponse = new()
                    {
                        data = loginInformationDto,
                    };
                    //string token = Guid.NewGuid().ToString();
                    //loginInformationDto.token = token;
                    //_studentServices.AddVerificationRecord(loginInformationDto);

                    _response.result = roleBaseResponse;
                    _response.StatusCode = HttpStatusCode.OK;
                    _response.IsSuccess = true;
                }
                else
                {
                    LoginInformationDto loginInformationDto1 = await _studentServices.CheckUserNamePassword(studentLoginDto);
                    if (loginInformationDto1.UserName == null)
                    {
                        _response.ErroMessages = new List<string> { "User not Found" };
                        _response.IsSuccess = false;
                        _response.StatusCode = HttpStatusCode.NotFound;
                    }
                    else
                    {

                        RoleBaseResponse<LoginInformationDto> roleBaseResponse = new()
                        {
                            data = loginInformationDto1,
                        };
                        _response.result = roleBaseResponse;
                        _response.StatusCode = HttpStatusCode.OK;
                        _response.IsSuccess = true;
                    }
                }
            }
            catch (Exception ex)
            {
                _response.ErroMessages = new List<string> { ex.ToString() };
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.InternalServerError;
            }
            return _response;
        }
    }
}
