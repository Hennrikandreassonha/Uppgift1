using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Uppgift1.Models
{
    public class ToDoNote
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Heading { get; set; } = null!;
        public string Text { get; set; } = null!;
        public bool IsDone { get; set; } = false;
        public DateTime? DeadLine { get; set; }
        public DateTime? Created { get; set; }

        public User User { get; set; }

        public ToDoNote()
        {

        }
        public ToDoNote(string heading, string text, DateTime created, int userId, DateTime? deadline = null)
        {
            Heading = heading;
            Text = text;
            DeadLine = deadline;
            Created = created;
            UserId = userId;
        }
    }
}