
using StudentManagementAPI.Models;
using System.IdentityModel.Tokens.Jwt;

namespace StudentManagementAPI.Services
{
    public interface IJwtServices
    {
        string GenerateToken(LoginInformationDto loginInformationDto);

        bool ValidateToken(string? token, out JwtSecurityToken jwtSecurityToken);
    }
}
