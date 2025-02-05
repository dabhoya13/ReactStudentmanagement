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

        public DateTime BirthDate { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;


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

        public bool Status { get; set; }

        public string ImageName { get; set; }

        public string ImageUrl { get; set; }

        public int ClassId { get; set; }

        public string ClassName { get; set; }

        public int ClassRank { get; set; }

        public int RollNo { get; set; }

        public string BloodGroup { get; set; }

        public string Reigion { get; set; }

        public string Caste { get; set; }

        public string Category { get; set; }

        public string MotherTongue { get; set; }

        public string MobileNumber { get; set; }

        public string CurrentAddress { get; set; }

        public string PermanentAddress { get; set; }

        public string PreviousSchoolName { get; set; }

        public string PreviousSchoolAddress { get; set; }

        public string OtherInfo { get; set; }

        public string AcademicYear { get; set; }
        public DateTime AdmissionDate { get; set; }


        public IList<Parents> Parents { get; set; }

        public IList<StudentDocuments> Documents { get; set; }
        public IList<StudentDocuments> DeletedDocuments { get; set; }

    }

    public class Parents
    {
        public int ParentId { get; set; }

        [StringLength(50)]
        public string ParentName { get; set; }

        public int Relation { get; set; }

        public string ParentNumber { get; set; }

        [RegularExpression("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$", ErrorMessage = "Enter Correct Email")]
        public string ParentEmail { get; set; }

        public string? ParentImage { get; set; } = null;

        public string ParentImageUrl { get; set; }

        public string Occupation { get; set; }
    }

    public class StudentDocuments
    {
        public int StudentDocumentId { get; set; }

        public string StudentDocumentName { get; set; }

        public int StudentId { get; set; }

        public string StudentDocumentUrl { get; set; }
    }

    public class GenderWiseCountDto
    {
        public int Gender { get; set; }

        public int GenderCount { get; set; }
    }

    public class StudentProfessorCount
    {
        public int StudentCount { get; set; }

        public int ProfessorCount { get; set; }
    }

    public class ExportStudent
    {
        [Key]
        [Required]
        public int StudentId { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string? BirthDate { get; set; }

        public string? CourseName { get; set; } = null;

        [Required(ErrorMessage = "UserName is Required")]
        public string UserName { get; set; } = null!;

        public string Gender { get; set; }

        public string Email { get; set; }

        public string CreatedDate { get; set; }

    }

}
