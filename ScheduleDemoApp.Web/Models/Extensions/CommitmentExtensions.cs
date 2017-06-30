using Microsoft.EntityFrameworkCore;
using Schedule.Data;
using Schedule.Data.Models;
using ScheduleDemoApp.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScheduleDemoApp.Models.Extensions
{
    public static class CommitmentExtensions
    {
        public static Task<IEnumerable<CommitmentModel>> GetCommitments(this AppDbContext db)
        {
            return Task.Run(() =>
            {
                var model = db.Commitments
                .Include(x => x.CommitmentPeople)
                .Include(x => x.Category)
                .Select(x => new CommitmentModel
                {
                    id = x.Id,
                    body = x.Body,
                    subject = x.Subject,
                    startDate = x.StartDate,
                    endDate = x.EndDate,
                    location = x.Location,
                    category = new CategoryModel
                    {
                        id = x.CategoryId,
                        name = x.Category.Name
                    },
                    people = x.CommitmentPeople.Select(y => new PersonModel
                    {
                        id = y.PersonId,
                        name = y.Person.Name
                    }).OrderBy(y => y.name).AsEnumerable()
                }).OrderBy(x => x.startDate).AsEnumerable();

                return model;
            });
        }

        public static async Task<IEnumerable<CommitmentModel>> GetPersonalCommitments(this AppDbContext db, int id)
        {
            var commitmentIds = await db.CommitmentPeople.Where(x => x.PersonId == id).Select(x => x.CommitmentId).Distinct().ToListAsync();

            var model = db.Commitments.Include(x => x.CommitmentPeople)
                .Include(x => x.Category)
                .Where(x => commitmentIds.Contains(x.Id))
                .Select(x => new CommitmentModel
                {
                    id = x.Id,
                    body = x.Body,
                    subject = x.Subject,
                    startDate = x.StartDate,
                    endDate = x.EndDate,
                    location = x.Location,
                    category = new CategoryModel
                    {
                        id = x.CategoryId,
                        name = x.Category.Name
                    },
                    people = x.CommitmentPeople.Select(y => new PersonModel
                    {
                        id = y.PersonId,
                        name = y.Person.Name
                    }).OrderBy(y => y.name).AsEnumerable()
                }).OrderBy(x => x.startDate).AsEnumerable();

            return model;
        }
    }
}
