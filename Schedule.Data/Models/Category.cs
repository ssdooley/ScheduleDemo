﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Schedule.Data.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Commitment> Commitments { get; set; }
    }
}
