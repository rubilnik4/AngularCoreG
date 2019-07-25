using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace AngularCore.Models
{  
    public class ListOfTasks
    {
       
        public int Id { get; set; }       
        public string Email { get; set; }
        [Required]
        public string Name { get; set; }
        public List<TaskTo> TasksTo { get; set; }
        public ListOfTasks()
        {
            TasksTo = new List<TaskTo>();
        }
    }
   
    public class TaskTo
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public bool Complete { get; set; }
        public int ListOfTasksId { get; set; }
        public ListOfTasks ListOfTasks { get; set; }
    }

}
