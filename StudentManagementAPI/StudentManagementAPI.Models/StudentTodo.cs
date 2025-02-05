using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagementAPI.Models
{
    public class StudentTodo
    {
        public int TodoId { get; set; }
        public string TodoName { get; set; }
        public DateTime? TodoDate { get; set; } = null;
        public bool Status { get; set; }
        public TimeSpan Time { get; set; }
        public bool IsDeleted { get; set; }

        public List<int> TodoIds { get; set; }
    }
}
