using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagementAPI.Models
{
    public class StudentResults
    {
        public int ResultId { get; set; }
        public int StudentId { get; set; }
        public string SubjectName { get; set; }
        public string ExamName { get; set; }

        public DateTime ExamDate { get; set; }

        public int ExamTypeId { get; set; }

        public int ExamId { get; set; }
        public int SubjectId { get; set; }
        public int MinMarks { get; set; }
        public int MaxMarks { get; set; }
        public int MarkObtained { get; set; }

        public int StartYear { get; set; }

        public bool Status { get; set; }
    }

    public class FinalResult
    {
        public IList<StudentResults> Results { get; set;}
        
        public bool FinalStatus { get; set; }

        public decimal FinalPercentage { get; set; }
    }
}
