using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagementAPI.Models
{
    public class AttendanceCountDto
    {
        public int AttendanceCountId { get; set; }

        public int TotalPresent { get; set; }

        public int TotalAbsent { get; set; }

        public DateTime Date { get; set; }
    }

    public class AttendanceMonthYearDto
    {
        public int Month { get; set; }

        public int Year { get; set; }

        public int Half { get; set; }
    }
}
