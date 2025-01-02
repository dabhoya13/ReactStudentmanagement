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

        public string LeaveReason { get; set; }

        public int LeaveStatus { get; set; }

        public int LeaveId { get; set; }
         
        public DateTime LeaveDate { get; set; }

        public int Month { get; set; }

        public int Year { get; set; }
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
