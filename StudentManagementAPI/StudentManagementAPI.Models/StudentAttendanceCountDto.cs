using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagementAPI.Models
{
    public class StudentAttendanceCountDto
    {
        public int TotalPresent { get; set; }

        public int TotalAbsent { get; set; }

        public int TotalAbsentPresent { get; set; }

        public int StudentId { get; set; }
    }
}
