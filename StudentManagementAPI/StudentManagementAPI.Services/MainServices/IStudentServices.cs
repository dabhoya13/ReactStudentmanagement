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

        Task<IList<AttendanceDto>> GetAttendanceFromMonthYear(int month, int year,int studentId);

        Task AddTodayStudentAttendance(AttendanceDto attendanceDto);

        Task<IList<Student>> GetAllStudentsWithAttendance();

        Task HodSubmitAttendance(AttendanceDto attendanceDto);

        Task<IList<StudentsLeaveDto>> GetStudentLeaveById(int StudentId, int month, int year);

        Task<StudentAttendanceCountDto> GetStudentAttendanceCountById(int studentId, int month, int year);

        Task<IList<AttendanceDto>> GetLast7DaysAttendance(int StudentId, DateTime startDate, DateTime endDate);

        Task<IList<StudentExam>> GetStudentExams(int StudentId, DateTime? ExamDate);

        Task<IList<Faculty>> GetFacultyForDashboard();

        Task<IList<ClassesDto>> GetAllClasses();

        Task UpsertStudentExam(StudentExam studentExam);

        Task<IList<StudentTodo>> GetTodolistFromDate(DateTime? date);

        Task AddStudentTodo(StudentTodo studentTodo);

        Task<IList<StudentResults>> GetStudentResultsById(StudentResults studentResults);

        Task ChangeTodoStatus(StudentTodo studentTodo);

        Task DeleteTodo(StudentTodo studentTodo);

        Task<IList<NoticeDto>> GetAllNoticeWithPagination(int page);

        Task<IList<Parents>> GetParentsByStudentId(int studentId);

        Task<IList<StudentDocuments>> GetStudentDocuments(int studentId);

        Task<IList<StudentsLeaveDto>> GetAllStudentLeavesWithPagination(PaginationDto paginationDto);

        Task AddStudentLeave(StudentsLeaveDto studentsLeaveDto);

        Task<StudentsLeaveDto> GetTotalLeaves();

        Task<IList<StudentResults>> GetWholeYearResult(StudentResults studentResults);

        Task<IList<ExamType>> GetAllExamTypes();
    }
}
