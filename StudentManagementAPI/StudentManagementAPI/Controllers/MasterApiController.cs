using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
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
        };


        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status203NonAuthoritative)]
        [HttpPost("{controllerName}/{methodName}")]
        public ActionResult<APIResponse> CallExternalGetMethod(ApiRequest apiRequest)
        {
            try
            {
                var header = this.Request.Headers;
                if (!_jwtService.ValidateToken(header["token"], out JwtSecurityToken jwtSecurityToken))
                {

                    _response.ErroMessages = new List<string>() { "JWT TOKEN IS INVALID "};
                    _response.StatusCode = HttpStatusCode.Unauthorized;
                    _response.IsSuccess = false;
                }
                else
                {
                    var userRoles = jwtSecurityToken.Claims?.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value);
                    if(userRoles == null || (apiRequest.RoleIds?.Count == 0 ) || !apiRequest.RoleIds.Any(role => userRoles.Contains(role)))
                    {
                        _response.ErroMessages = new List<string> { "Not Authoried " };
                        _response.IsSuccess = false;
                        _response.StatusCode = HttpStatusCode.Unauthorized;
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
                                    var result = methodInfo.Invoke(controller, new object[] { value });
                                    var actionResult = (ActionResult<APIResponse>)result;
                                    _response = actionResult.Value;
                                }
                                else
                                {
                                    if (apiRequest.MethodName == "GetAllStudents")
                                    {
                                        var result = methodInfo.Invoke(controller, header["token"]);
                                        var actionResult = (ActionResult<APIResponse>)result;
                                        _response = actionResult.Value;
                                    }
                                    else
                                    {
                                        var result = methodInfo.Invoke(controller, null);
                                        var actionResult = (ActionResult<APIResponse>)result;
                                        _response = actionResult.Value;
                                    }
                                }
                            }
                            else
                            {
                                _response.ErroMessages = new List<string> { "Method Invalid" };
                                _response.IsSuccess = false;
                                _response.StatusCode = HttpStatusCode.NotFound;
                            }
                            return _response;

                        }
                        else
                        {
                            _response.ErroMessages = new List<string> { "Controller Invalid" };
                            _response.IsSuccess = false;
                            _response.StatusCode = HttpStatusCode.NotFound;
                        }
                    }
                    
                   
                }
                return _response;

            }
            catch (Exception ex)
            {
                _response.ErroMessages = new List<string>() { ex.Message.ToString() };
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.IsSuccess = false;
                return _response;
            }
        }


        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpPost("{controllerName}/{methodName}/Login")]
        public ActionResult<APIResponse> CallExternamLoginMethod(ApiRequest apiRequest)
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
                            var result = methodInfo.Invoke(controller, new object[] { value });
                            var actionResult = (ActionResult<APIResponse>)result;
                            _response = actionResult.Value;
                            return _response;
                        }
                        else
                        {
                            var result = methodInfo.Invoke(controller, null);
                            var actionResult = (ActionResult<APIResponse>)result;
                            _response = actionResult.Value;
                            return _response;
                        }

                    }
                    else
                    {
                        _response.ErroMessages = new List<string> { "Method Or Controller Invalid" };
                        _response.IsSuccess = false;
                        _response.StatusCode = HttpStatusCode.NotFound;
                        return _response;
                    }
                }
                else
                {
                    _response.ErroMessages = new List<string> { "Controller Invalid" };
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    return _response;
                }

            }
            catch (Exception ex)
            {
                _response.ErroMessages = new List<string> { ex.Message };
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.InternalServerError;
                return _response;
            }
        }


    }
}
