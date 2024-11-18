using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagementAPI.Models
{
    public class ApiRequest
    {
        public string ControllerName { get; set; }

        public string MethodName { get; set; }

        public string DataObject { get; set; }

        public string? PageName { get; set; }

        public int? RoleId { get; set; } = null;

        public List<string>? RoleIds { get; set; } = null;

        public string? MethodType { get; set; } = null;

    }
}
