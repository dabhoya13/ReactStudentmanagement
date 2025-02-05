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

        public int SubjectId { get; set; }

        public TimeSpan StartTime { get; set; }

        public TimeSpan EndTime { get; set; }

        public DateTime? ExamDate { get; set; } = null;

        public int RoomNo { get; set; }

        public int ExamType { get; set; }

        public string ExamName { get; set; }

        public int ClassId { get; set; }

        public int CourseId { get; set; }

        public int StudentId { get; set; }

        public int RemainingDays { get; set; }
    }

    public class ExamType
    {
        public int ExamId { get; set; }
        public string ExamName { get; set; }
    }
}