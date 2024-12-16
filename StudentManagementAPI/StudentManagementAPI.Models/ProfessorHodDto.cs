using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagementAPI.Models
{
    public class ProfessorHodDto
    {
        public int Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public DateTime BirthDate { get; set; }

        public string Email { get; set; }   

        public string MobileNumber { get; set; }

        public string UserName { get; set; }

        public string Password { get; set; }

        public int CountryId { get; set; }

        public int StateId { get; set; }

        public int CityId { get; set; }

        public string? CountryName { get; set; } = null;

        public string? StateName { get; set; } = null;

        public string? CityName { get; set; } = null;
        public string? ImageName { get; set; } = null;
        public string? ImageUrl { get; set; } = null;


        public string PostalCode { get; set; }
    }
}
