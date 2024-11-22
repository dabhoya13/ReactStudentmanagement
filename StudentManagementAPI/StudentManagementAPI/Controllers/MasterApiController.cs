using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using StudentManagementAPI.Models;
using StudentManagementAPI.Services;
using StudentManagementAPI.Services.MainServices;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Reflection;
using System.Security.Claims;

namespace StudentManagementAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class MasterAPIController : ControllerBase
    {

        private APIResponse _response;

        private readonly IStudentServices _studentServices;
        private readonly IJwtServices _jwtService;
        private readonly IConfiguration _configuration;
        public MasterAPIController(IStudentServices studentServices, IConfiguration configuration, IJwtServices jwtServices)
        {
            _studentServices = studentServices;
            this._response = new();
            _configuration = configuration;
            _jwtService = jwtServices;
        }
        public Dictionary<string, Type> controllers = new()
        {
            { "Login", typeof(LoginController) },
            { "Student", typeof(StudentController) },

        };


        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status203NonAuthoritative)]
        [HttpPost("{controllerName}/{methodName}")]
        public async Task<ActionResult<APIResponse>> CallExternalGetMethod(ApiRequest apiRequest)
        {
            try
            {
                var header = this.Request.Headers;
                if (!_jwtService.ValidateToken(header["token"], out JwtSecurityToken jwtSecurityToken))
                {

                    _response.ErroMessages = new List<string>() { "JWT TOKEN IS INVALID " };
                    _response.StatusCode = HttpStatusCode.Unauthorized;
                    _response.IsSuccess = false;
                    return Unauthorized(_response);
                }
                else
                {
                    var userRoles = jwtSecurityToken.Claims?.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value);
                    if (userRoles == null || (apiRequest.RoleIds?.Count == 0) || !apiRequest.RoleIds.Any(role => userRoles.Contains(role)))
                    {
                        _response.ErroMessages = new List<string> { "Not Authoried " };
                        _response.IsSuccess = false;
                        _response.StatusCode = HttpStatusCode.Unauthorized;
                        return Unauthorized(_response);
                    }
                    else
                    {
                        object controller = null;
                        if (controllers.TryGetValue(apiRequest.ControllerName, out Type controllerType))
                        {
                            controller = Activator.CreateInstance(controllerType, _studentServices, _configuration);
                            MethodInfo methodInfo = controller.GetType().GetMethod(apiRequest.MethodName);
                            if (methodInfo != null)
                            {
                                
                                if (apiRequest.DataObject != "null")
                                {
                                    object dtoObject = JsonConvert.DeserializeObject<dynamic>(apiRequest.DataObject);

                                    var value = _studentServices.GetDynamicData(apiRequest.ControllerName, apiRequest.MethodName, dtoObject);
                                    var result = await (Task<ActionResult<APIResponse>>)methodInfo.Invoke(controller, new object[] { value});

                                    //var actionResult = (ActionResult<APIResponse>)result;
                                    _response = result.Value;
                                }
                                else
                                {
                                    if (apiRequest.MethodName == "GetAllStudents")
                                    {
                                        var result = await (Task<ActionResult<APIResponse>>)methodInfo.Invoke(controller, header["token"]);
                                        //var actionResult = (ActionResult<APIResponse>)result;
                                        _response = result.Value;
                                    }
                                    else
                                    {
                                        var result = await (Task<ActionResult<APIResponse>>)methodInfo.Invoke(controller, null);
                                        //var actionResult = (ActionResult<APIResponse>)result;
                                        _response = result.Value;
                                    }
                                }
                            }
                            else
                            {
                                _response.ErroMessages = new List<string> { "Method Invalid" };
                                _response.IsSuccess = false;
                                _response.StatusCode = HttpStatusCode.NotFound;
                                return NotFound(_response);
                            }
                            return Ok(_response);

                        }
                        else
                        {
                            _response.ErroMessages = new List<string> { "Controller Invalid" };
                            _response.IsSuccess = false;
                            _response.StatusCode = HttpStatusCode.NotFound;
                            return NotFound(_response);

                        }
                    }
                }

            }
            catch (Exception ex)
            {
                _response.ErroMessages = new List<string>() { ex.Message.ToString() };
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
                return StatusCode(500, _response);
            }
        }


        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpPost("{controllerName}/{methodName}/Login")]
        public async Task<ActionResult<APIResponse>> CallExternamLoginMethod(ApiRequest apiRequest)
        {
            try
            {
                object controller = null;
                if (controllers.TryGetValue(apiRequest.ControllerName, out Type controllerType))
                {
                    controller = Activator.CreateInstance(controllerType, _studentServices, _configuration);
                    MethodInfo methodInfo = controller.GetType().GetMethod(apiRequest.MethodName);
                    if (methodInfo != null)
                    {
                        if (apiRequest.DataObject != "null")
                        {
                            object dtoObject = JsonConvert.DeserializeObject<dynamic>(apiRequest.DataObject);
                            //var newobj = ((JObject)dtoObject).ToObject<StudentLoginDto>();
                            var value = _studentServices.GetDynamicData(apiRequest.ControllerName, apiRequest.MethodName, dtoObject);
                            //int intValue = Convert.ToInt32(dtoObject);
                            var result = await (Task<ActionResult<APIResponse>>)methodInfo.Invoke(controller, new object[] { value });

                            _response = result.Value;
                            return Ok(_response);
                        }
                        else
                        {
                            var result = methodInfo.Invoke(controller, null);
                            var actionResult = (ActionResult<APIResponse>)result;
                            _response = actionResult.Value;
                            return Ok(_response);
                        }

                    }
                    else
                    {
                        _response.ErroMessages = new List<string> { "Method Or Controller Invalid" };
                        _response.IsSuccess = false;
                        _response.StatusCode = HttpStatusCode.NotFound;
                        return StatusCode(StatusCodes.Status400BadRequest, _response);

                    }
                }
                else
                {
                    _response.ErroMessages = new List<string> { "Controller Invalid" };
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    return StatusCode(StatusCodes.Status400BadRequest, _response);
                }

            }
            catch (Exception ex)
            {
                _response.ErroMessages = new List<string> { ex.Message };
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.InternalServerError;
                return StatusCode(StatusCodes.Status500InternalServerError, _response);

            }
        }


    }
}