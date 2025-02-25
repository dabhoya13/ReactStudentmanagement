﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagementAPI.Models
{
    public class CourseDto
    {
        public int CourseId { get; set; }

        public string CourseName { get; set; }
    }

    public class SubjectDto
    {
        public int SubjectId { get; set; }

        public string SubjectName { get; set; }

        public int CourseId { get; set; }
    }
}
