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
    public class CategoryController : Controller
    {
        private AppDbContext db;

        public CategoryController(AppDbContext db)
        {
            this.db = db;
        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<CategoryModel>> GetCategories()
        {
            return await db.GetCategories();
        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<CategoryModel>> GetSimpleCategories()
        {
            return await db.GetSimpleCategories();
        }

        [HttpGet("[action]/{id}")]
        public async Task<CategoryModel> GetCategory([FromRoute]int id)
        {
            return await db.GetCategory(id);
        }

        [HttpGet("[action]/{id}")]
        public async Task<CategoryModel> GetSimpleCategory([FromRoute]int id)
        {
            return await db.GetSimpleCategory(id);
        }

        [HttpPost("[action]")]
        public async Task<ObjectResult> AddCategory([FromBody]CategoryModel model)
        {
            await db.AddCategory(model);
            return Created("/api/Categories/AddCategory", model);
        }

        [HttpPost("[action]")]
        public async Task<ObjectResult> UpdateCategory([FromBody]CategoryModel model)
        {
            await db.UpdateCategory(model);
            return Accepted("/api/Categories/UpdateCategory", model);
        }

        [HttpPost("[action]")]
        public async Task<ObjectResult> DeleteCategory([FromBody]int id)
        {
            await db.DeleteCategory(id);
            return Accepted("/api/Categories/DeleteCategory", id);
        }
    }
}
