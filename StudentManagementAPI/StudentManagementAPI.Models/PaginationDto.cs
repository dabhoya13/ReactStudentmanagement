﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagementAPI.Models
{
    public class PaginationDto
    {
        public int StartIndex { get; set; } = 0;

        public int PageSize { get; set; } = 5;

        public string? SearchQuery { get; set; } = null;

        public string? OrderBy { get; set; } = null;

        public string? OrderDirection { get; set; } = null;

        public int StudentId { get; set; }
    }

    public class ExportPdfViewModel
    {
        public string? SearchQuery { get; set; } = null;
        public string FullName { get; set; }

        public string? Email { get; set;}
        public string? UserName { get; set; }

    }
}
