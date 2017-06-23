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
    public static class CategoryExtensions
    {
        public static Task<IEnumerable<CategoryModel>> GetCategories(this AppDbContext db)
        {
            return Task.Run(() =>
            {
                var model = db.Categories.Include(x => x.Commitments).Select(x => new CategoryModel
                {
                    id = x.Id,
                    name = x.Name,
                    commitments = x.Commitments.Select(y => new CommitmentModel
                    {
                        id = y.Id,
                        location = y.Location,
                        subject = y.Subject,
                        body = y.Body,
                        startDate = y.StartDate,
                        endDate = y.EndDate

                    }).OrderBy(y => y.startDate).AsEnumerable()

                }).OrderBy(x => x.name).AsEnumerable();

                return model;
            });

        }

        public static Task<IEnumerable<CategoryModel>> GetSimpleCategories(this AppDbContext db)
        {
            return Task.Run(() =>
            {
                var model = db.Categories.Select(x => new CategoryModel
                {
                    id = x.Id,
                    name = x.Name
                }).OrderBy(x => x.name).AsEnumerable();

                return model;
            });

        }

        public static async Task<CategoryModel> GetCategory(this AppDbContext db, int id)
        {
            var category = await db.Categories.Include(x => x.Commitments).FirstOrDefaultAsync(x => x.Id == id);

            var model = new CategoryModel
            {
                id = category.Id,
                name = category.Name,
                commitments = category.Commitments.Select(y => new CommitmentModel
                {
                    id = y.Id,
                    location = y.Location,
                    subject = y.Subject,
                    body = y.Body,
                    startDate = y.StartDate,
                    endDate = y.EndDate

                }).OrderBy(y => y.startDate).AsEnumerable()

            };

            return model;
        }

        public static async Task<CategoryModel> GetSimpleCategory(this AppDbContext db, int id)
        {
            var category = await db.Categories.FindAsync(id);

            var model = new CategoryModel
            {
                id = category.Id,
                name = category.Name
            };

            return model;
        }

        public static async Task AddCategory(this AppDbContext db, CategoryModel model)
        {
            if (await model.Validate(db))
            {
                var category = new Category
                {
                    Name = model.name
                };

                await db.Categories.AddAsync(category);
                await db.SaveChangesAsync();
            }
        }

        public static async Task UpdateCategory(this AppDbContext db, CategoryModel model)
        {
            if (await model.Validate(db))
            {
                var category = await db.Categories.FindAsync(model.id);
                category.Name = model.name;
                await db.SaveChangesAsync();
            }
        }

        public static async Task DeleteCategory(this AppDbContext db, int id)
        {
            var category = await db.Categories.FindAsync(id);
            db.Categories.Remove(category);
            await db.SaveChangesAsync();

        }

        public static async Task<bool> Validate(this CategoryModel model, AppDbContext db)
        {
            if (string.IsNullOrEmpty(model.name))
            {
                throw new Exception("The provided category must have a name");
            }

            if (model.id > 0)
            {
                var check = await db.Categories.FirstOrDefaultAsync(x => x.Name.ToLower().Equals(model.name.ToLower()) && !(x.Id == model.id));

                if (check != null)
                {
                    throw new Exception("The specified person already exists");
                }
            }
            else
            {
                var check = await db.Categories.FirstOrDefaultAsync(x => x.Name.ToLower().Equals(model.name.ToLower()));

                if (check != null)
                {
                    throw new Exception("The specified person already exists");
                }
            }

            return true;
        }
    }

}
