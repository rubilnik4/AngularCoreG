using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AngularCore.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AngularCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ListOfTasksController : ControllerBase
    {
        ApplicationContext db;
        private readonly UserManager<IdentityUser> _userManager;

        public ListOfTasksController(ApplicationContext context, UserManager<IdentityUser> userManager)
        {
            _userManager = userManager;
            db = context;

            TaskTo firstTask = new TaskTo { Name = "First" };
            TaskTo secondTask = new TaskTo { Name = "Second" };
            TaskTo thirdTask = new TaskTo { Name = "Third" };
            TaskTo fourTask = new TaskTo { Name = "Four" };
            if (!db.TaskTo.Any())
            {
                db.TaskTo.Add(firstTask);
                db.TaskTo.Add(secondTask);
                db.TaskTo.Add(thirdTask);
                db.TaskTo.Add(fourTask);
                // db.SaveChanges();
            }

            if (!db.ListOfTasks.Any())
            {
                db.ListOfTasks.Add(new ListOfTasks { Name = "First", Email = "rubilnik4@gmail.com", TasksTo = new List<TaskTo> { firstTask, secondTask } });
                db.ListOfTasks.Add(new ListOfTasks { Name = "Second", Email = "rubilnik4@gmail.com", TasksTo = new List<TaskTo> { thirdTask, fourTask } });
                db.SaveChanges();
            }
        }
        private async Task<IdentityUser> GetCurrentUser()
        {
            IdentityUser user = await _userManager.GetUserAsync(User);
            return user;
        }

        [HttpGet]
        [Authorize]
        public async Task<IEnumerable<ListOfTasks>> Get()
        {
            var user = await GetCurrentUser();
            return await db.ListOfTasks.Where(l => l.Email == user.Email).Include(l => l.TasksTo).ToListAsync();
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ListOfTasks> Get(int id)
        {
            var user = await GetCurrentUser();
            return await db.ListOfTasks.FirstOrDefaultAsync(x => x.Id == id && x.Email == user.Email);
        }

        [HttpGet("/api/[Controller]/GetByRef/{id}")]
        [AllowAnonymous]
        public async Task<IEnumerable<ListOfTasks>> GetByRef(string id)
        {
            var userRef = await _userManager.FindByIdAsync(id);
            if (userRef != null)
            {
                return await db.ListOfTasks.Where(x => x.Email == userRef.Email).Include(l => l.TasksTo).ToListAsync();
            }
            return null;
        }
        [HttpGet("/api/[Controller]/GetZipByRef/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetZipByRef(string id)
        {
            var userRef = await GetByRef(id);
            if (userRef != null && userRef.Count() > 0)
            {
                // byte[] archiveFile;
                var archiveStream = new MemoryStream();

                using (var archive = new ZipArchive(archiveStream, ZipArchiveMode.Create, true))
                {
                    foreach (var gz in userRef)
                    {
                        List<string> listToByte = new List<string>();
                        listToByte.Add("Наименование: " + gz.Name + "\n");
                        listToByte.Add("Задачи:" + "\n");
                        foreach (var gzT in gz.TasksTo)
                        {
                            listToByte.Add(" - " + gzT.Name + "; " + (gzT.Complete == true ? "Выполнено" : "Не выполнено" + "\n"));
                        }
                        byte[] dataAsBytes = listToByte.SelectMany(s => Encoding.UTF8.GetBytes(s)).ToArray();

                        var zipArchiveEntry = archive.CreateEntry(gz.Name+".txt", CompressionLevel.Fastest);
                        using (var zipStream = zipArchiveEntry.Open())
                        {
                            new MemoryStream(dataAsBytes).CopyTo(zipStream);
                        }
                    }
                }
                archiveStream.Position = 0;
                return new FileStreamResult(archiveStream, "application/octet-stream");


            }
            return null;
        }


        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Post([FromBody]ListOfTasks listOfTask)
        {
            if (ModelState.IsValid)
            {
                var user = await GetCurrentUser();
                listOfTask.Email = user.Email;
                await db.ListOfTasks.AddAsync(listOfTask);
                await db.SaveChangesAsync();
                return Ok(listOfTask);
            }
            return BadRequest(ModelState);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Put(int id, [FromBody]ListOfTasks listOfTask)
        {
            var user = await GetCurrentUser();
            if (ModelState.IsValid && listOfTask.Email == user.Email)
            {
                var findWithId = db.TaskTo.Where(t => t.ListOfTasksId == id);
                var deleteTasks = findWithId.Except(listOfTask.TasksTo);
                if (deleteTasks != null)
                {
                    db.TaskTo.RemoveRange(deleteTasks);
                }

                db.Update(listOfTask);
                await db.SaveChangesAsync();
                return Ok(listOfTask);
            }
            return BadRequest(ModelState);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await GetCurrentUser();
            ListOfTasks listOfTask = await db.ListOfTasks.FirstOrDefaultAsync(x => x.Id == id && x.Email == user.Email);
            if (listOfTask != null)
            {
                db.ListOfTasks.Remove(listOfTask);
                await db.SaveChangesAsync();
            }
            return Ok(listOfTask);
        }
    }
}