﻿
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using StudentManagementAPI.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace StudentManagementAPI.Services
{
    public class JwtServices : IJwtServices
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor = new HttpContextAccessor();

        public JwtServices(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(LoginInformationDto loginInformationDto)
        {
            try
            {
                DateTime expirationTime = DateTime.UtcNow.AddHours(2);
                long unixTimestamp = ((DateTimeOffset)expirationTime).ToUnixTimeSeconds();  
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier,loginInformationDto.UserName.ToString()),
                    new Claim(ClaimTypes.Name,loginInformationDto.UserName),
                    new Claim(ClaimTypes.Role,loginInformationDto.RoleId.ToString()),
                    new Claim(ClaimTypes.Expiration, unixTimestamp.ToString()),
                    new Claim(ClaimTypes.Version, loginInformationDto.SettingDescription),
                    new Claim("UserName",loginInformationDto.UserName),
                    new Claim("Role",loginInformationDto.RoleId.ToString()),
                    new Claim("UserId", loginInformationDto.Id != 0 ? loginInformationDto.Id.ToString() : loginInformationDto.StudentId.ToString()),
                };
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                var credential = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var expires = DateTime.UtcNow.AddHours(2);
                var token = new JwtSecurityToken(
                        _configuration["Jwt:Issuer"],
                        _configuration["Jwt:Audience"],
                        claims,
                        expires: expires,
                        signingCredentials: credential
                  );
                var identity = new ClaimsIdentity(claims, "jwt");
                var principal = new ClaimsPrincipal(identity);
                var httpContext = _httpContextAccessor.HttpContext;
                httpContext.User = principal;

                HttpContext http =  _httpContextAccessor.HttpContext;
                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public bool ValidateToken(string? token,out JwtSecurityToken jwtSecurityToken)
        {
            jwtSecurityToken = null;
            if(token.IsNullOrEmpty())
            {
                return false;
            }
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);
            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                },out SecurityToken validateToken);

                jwtSecurityToken = (JwtSecurityToken)validateToken;
                
                if (jwtSecurityToken == null)
                {
                    return false;
                }
                return true;
            }catch
            {
                return false;
            }
        }
    }
}
