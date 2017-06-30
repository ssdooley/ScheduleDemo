using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScheduleDemoApp.Models.ViewModels
{
    public class CommitmentModel
    {
        public int id { get; set; }
        public string location { get; set; }
        public string subject { get; set; }
        public string body { get; set; }
        public DateTime startDate { get; set; }
        public DateTime endDate { get; set; }
        public CategoryModel category { get; set; }
        public IEnumerable<PersonModel> people { get; set; }
    }
}
