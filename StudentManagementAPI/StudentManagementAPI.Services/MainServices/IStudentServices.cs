﻿using StudentManagementAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagementAPI.Services.MainServices
{
    public interface IStudentServices
    {
        T GetStudent<T>(string Procedure, int Id);

        LoginInformationDto GetLoginStudentDetails(StudentLoginDto studentLoginDto);

        LoginInformationDto CheckUserNamePassword(StudentLoginDto studentLoginDto);

        dynamic GetDynamicData(string controllerName, string methodName, object dataObj);

        void AddVerificationRecord(LoginInformationDto loginInformationDto);

        bool UpdateVerificationRecord(string token, int UserId);
    }
}