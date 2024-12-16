using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagementAPI.Models
{
    public class LocationDto
    {
        public IList<Country> Countries { get; set; }

        public IList<City> Cities { get; set;}

        public IList<State> States { get; set; }
    }

    public class Country
    {
        public int CountryId { get; set; }
        public string CountryName { get; set; }
    }

    public class City
    {
        public int CityId { get; set; }
        public string CityName { get; set; }
        public int StateId { get; set; }

        public int CountryId { get; set; }
    }

    public class State
    {
        public int StateId { get; set;}
        public string StateName { get; set;}

        public int CountryId { get; set;}   
    }
}
