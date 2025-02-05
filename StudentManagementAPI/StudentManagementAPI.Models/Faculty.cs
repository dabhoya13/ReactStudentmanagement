using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagementAPI.Models
{
    public class Faculty
    {
        public int FacultyId { get; set; }
        
        public string FacultyFirstName { get; set; }
        
        public string FacultyLastName { get; set; }
        
        public int CourseId { get; set; }
        
        public int Gender { get; set; }
        
        public string MobileNumber { get; set; }
        
        public string EmailAddress { get; set; }
        
        public string UserName { get; set; }
        
        public string Password { get; set; }
        
        public string BloodGroup { get; set; } 
        
        public DateTime CreatedDate { get; set; }
        
        public string FatherName { get; set; }
        
        public string MotherName { get; set; }
        
        public DateTime BirthDate { get; set; }
        
        public bool MaritalStatus { get; set; }
        
        public string Qualification { get; set; }
        
        public string Experience { get; set; }
        
        public string Address { get; set; }
        
        public string PermanentAddress { get; set; }
        
        public string Notes { get; set; }
        
        public string ImageName { get; set; }
        
        public string ImageUrl { get; set; }

        public string CourseName { get; set; }

    }
}
