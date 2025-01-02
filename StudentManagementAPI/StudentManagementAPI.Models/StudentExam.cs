using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagementAPI.Models
{
    public class StudentExam
    {
        public int ExamId { get; set; }

        public string SubjectName { get; set; }

        public TimeSpan StartTime { get; set; } 

        public TimeSpan EndTime { get; set; }

        public DateTime? ExamDate { get; set; } = null;

        public int RoomNo { get; set; }

        public string ExamType { get; set; }

        public int ClassId { get; set; }

        public int StudentId { get; set; }

        public int RemainingDays { get; set; }
    }
}
