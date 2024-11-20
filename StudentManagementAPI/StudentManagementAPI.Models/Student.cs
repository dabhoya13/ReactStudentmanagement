using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagementAPI.Models
{
    public class Student
    {
        [Key]
        public int StudentId { get; set; }

        [StringLength(50)]
        public string FirstName { get; set; } = null!;

        [StringLength(50)]
        public string LastName { get; set; } = null!;

        public DateTime? BirthDate { get; set; }

        public DateTime? CreatedDate { get; set; } = DateTime.Now;


        public int CourseId { get; set; }

        public string? Dob { get; set; } = null;

        public string? CourseName { get; set; } = null;

        public string UserName { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string? JwtToken { get; set; } = null;

        public int? RowNumber { get; set; } = 1;

        public int? TotalRecords { get; set; } = 0;

        [RegularExpression("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$", ErrorMessage = "Enter Correct Email")]
        [Required]
        public string Email { get; set; }

        public bool IsBlocked { get; set; }

        public int Gender { get; set; }
    }

    public class GenderWiseCountDto
    {
        public int Gender { get; set; }

        public int GenderCount { get; set; }
    }
}
