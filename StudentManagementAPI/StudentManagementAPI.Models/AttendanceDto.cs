using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagementAPI.Models
{
    public class AttendanceDto
    {
        public int AttendanceId { get; set; }

        public bool? Status { get; set; } = null;

        public int StudentId { get; set; }

        public bool IsSubmitted { get; set; }

        public DateTime Date { get; set; }

        public int Month { get; set; }

        public int Year { get; set; }

        public string WeekDay { get; set; }

        public List<AttendanceStudentIdDto> AttedancesWithStudentId { get; set; }   
    }

    public class AttendanceStudentIdDto
    {
        public int StudentId { get; set; }
        public bool Status { get; set; }
    }
}
