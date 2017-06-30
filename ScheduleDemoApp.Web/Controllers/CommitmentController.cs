using Microsoft.AspNetCore.Mvc;
using Schedule.Data;
using ScheduleDemoApp.Models.Extensions;
using ScheduleDemoApp.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScheduleDemoApp.Controllers
{
    [Route("api/[controller]")]
    public class CommitmentController : Controller
    {
        private AppDbContext db;

        public CommitmentController(AppDbContext db)
        {
            this.db = db;
        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<CommitmentModel>> GetCommitments()
        {
            return await db.GetCommitments();
        }

        [HttpGet("[action]/{id}")]
        public async Task<IEnumerable<CommitmentModel>> GetPersonalCommitments(int id)
        {
            return await db.GetPersonalCommitments(id);
        }
    }
}
