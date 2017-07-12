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

        public static async Task<CommitmentModel> GetSimpleCommitment(this AppDbContext db, int id)
        {
            var commitment = await db.Commitments.Include(x => x.Category).FirstOrDefaultAsync(x => x.Id == id);

            var model = new CommitmentModel
            {
                id = commitment.Id,
                location = commitment.Location,
                subject = commitment.Subject,
                body = commitment.Body,
                category = new CategoryModel
                {
                    id = commitment.CategoryId,
                    name = commitment.Category.Name
                },
                startDate = commitment.StartDate,
                endDate = commitment.EndDate

            };
            return model;
        }

        public static async Task AddCommitment(this AppDbContext db, CommitmentModel model)
        {
            if (await model.Validate(db))
            {
                var commitment = new Commitment
                {
                    Id = model.id,
                    Location = model.location,
                    Subject = model.subject,
                    Body = model.body,
                    StartDate = model.startDate,
                    EndDate = model.endDate,
                    CategoryId = model.category.id
                };

                await db.Commitments.AddAsync(commitment);
                await db.SaveChangesAsync();
            }
        }

        public static async Task UpdateCommitment(this AppDbContext db, CommitmentModel model)
        {
            if (await model.Validate(db))
            {
                var commitment = await db.Commitments.FindAsync(model.id);
                commitment.Category.Id = model.category.id;
                await db.SaveChangesAsync();
            }
        }

        public static async Task DeleteCommitment(this AppDbContext db, int id)
        {
            var commitment = await db.Commitments.FindAsync(id);
            db.Commitments.Remove(commitment);
            await db.SaveChangesAsync();
        }

        public static Task<bool> Validate(this CommitmentModel model, AppDbContext db)
        {
            return Task.Run(() =>
            {
                if (model.startDate >= model.endDate)
                {
                    throw new Exception("Start Date must occur before End Date");
                }

                return true;
            });
        }

        
    }
}
