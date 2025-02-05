using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagementAPI.Models
{
    public class StudentsLeaveDto
    {
        public int StudentId { get; set; }

        public string LeaveTypeName { get; set; }

        public int LeaveTypeId { get; set; }

        public int LeaveStatus { get; set; }

        public int LeaveId { get; set; }

        public DateTime LeaveDate { get; set; }

        public DateTime CreatedDate { get; set; }

        public int Month { get; set; }

        public int Year { get; set; }

        public int NumberOfDays { get; set; }

        public int MedicalLeaveCount { get; set; }

        public int CasualLeaveCount { get; set; }

        public int MaternityLeaveCount { get; set; }

        public int PaternityLeaveCount { get; set; }

        public int TotalRecords { get; set; }

        public string Reason { get; set; }

        public int TotalMedicalLeave { get; set; }

        public int TotalCasualLeave { get; set; }
        
        public int TotalMaternityLeave { get; set; }
        
        public int TotalPaternityLeave { get; set; }
    }

    public class StudentMonthYearDto
    {
        public int StudentId { get; set; }

        public int Month { get; set; }

        public int Year { get; set; }
    }

    public class StudentLast7DaysViewModel
    {
        public int StudentId { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }
    }
}
