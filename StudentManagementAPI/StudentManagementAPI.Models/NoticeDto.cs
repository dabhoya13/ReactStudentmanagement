using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagementAPI.Models
{
    public class NoticeDto
    {
        public int NoticeId { get; set; }

        public string LongDescription { get; set; }

        public string ShortDescription { get; set; }

        public string Title { get; set; }
        public string ImageName { get; set; }

        public string? ImageUrl { get; set; } = null;
        public bool IsDeleted { get; set; }

        public DateTime Date { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime ModifiedDate { get; set;}
    }
}
