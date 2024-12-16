using StudentManagementAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagementAPI.Services.MainServices
{
    public interface IStudentServices
    {
        Task<T> GetStudent<T>(string Procedure, int Id);

        Task<LoginInformationDto> GetLoginStudentDetails(StudentLoginDto studentLoginDto);
        Task<LoginInformationDto> CheckUserNamePassword(StudentLoginDto studentLoginDto);
        dynamic GetDynamicData(string controllerName, string methodName, object dataObj);
        Task AddVerificationRecord(LoginInformationDto loginInformationDto);
        Task<bool> UpdateVerificationRecord(string token, int UserId);
        Task<IList<GenderWiseCountDto>> GetStudentCountByGender();

        Task<StudentProfessorCount> GetStudentProfessorCount();

        Task UpsertNoticeDetails(NoticeDto noticeDto);

        Task<IList<NoticeDto>> GetALlNotices();

        Task DeleteNotice(int NoticeId);

        Task<NoticeDto> GetNoticeById(int NoticeId);

        Task<IList<AttendanceCountDto>> GetAttendanceCountByMonthYear(AttendanceMonthYearDto attendanceMonthYearDto);

        Task<IList<T>> GetDataWithPagination<T>(PaginationDto paginationDto, string sp);

        Task DeleteStudentById(int StudentId);

        Task<T> GetOneRecordFromId<T>(string Procedure, int Id);

        Task UpsertStudentDetails(Student student);

        Task<Student> CheckUsernameExistOrNot(string userName);

        Task<IList<T>> GetAllRecordsWithoutPagination<T>(string procedureName);

        Task<IList<Student>> GetExportStudentList(string searchQuery);

        Task<LocationDto> GetAllCountriesStatesCitites();

        Task UpdateProfessorHodDetails(ProfessorHodDto professorHodDto);

        Task UpdateHodProfilePicture(ProfessorHodDto professorHodDto);

        Task UpdateHodPersonalInfo(ProfessorHodDto professorHodDto);

        Task UpdateHodAddressInfo(ProfessorHodDto professorHodDto);

    }
}
