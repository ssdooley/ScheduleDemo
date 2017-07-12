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

        [HttpGet("[action]/{id}")]
        public async Task<CommitmentModel> GetSimpleCommitment([FromRoute]int id)
        {
            return await db.GetSimpleCommitment(id);
        }


        [HttpGet("[action]/{id}")]
        public async Task<ObjectResult> AddCommittment([FromBody]CommitmentModel model)
        {
            await db.AddCommitment(model);
            return Created("/api/Commitments/AddCommitment", model);
        }

        [HttpGet("[action]/{id}")]
        public async Task<ObjectResult> UpdateCommittment([FromBody]CommitmentModel model)
        {
            await db.UpdateCommitment(model);
            return Created("/api/Commitments/UpdateCommitment", model);
        }


        [HttpGet("[action]/{id}")]
        public async Task<ObjectResult> DeleteCommittment([FromBody]int id)
        {
            await db.DeleteCommitment(id);
            return Created("/api/Commitments/DeleteCommitment", id);
        }
    }
}
