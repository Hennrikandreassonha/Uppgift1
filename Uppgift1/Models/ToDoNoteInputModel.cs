using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Uppgift1.Models
{
    [NotMapped]
    public class ToDoNoteInputModel
    {
        public string Text { get; set; } = null!;
        public string Heading { get; set; } = null!;
        public int UserId{ get; set; }
        public string? Deadline { get; set; }
        [JsonIgnore]
        public DateTime Created { get; set; }
        public ToDoNoteInputModel()
        {
            
        }
        public ToDoNoteInputModel(string heading, string text, int userId)
        {
            Heading = heading;
            Text = text;
            UserId = userId;
            Deadline = null;
            Created = DateTime.Now;
        }
        public ToDoNoteInputModel(string heading, string text, int userId, string? deadline = null)
        {
            Heading = heading;
            Text = text;
            UserId = userId;
            Deadline = deadline;
            Created = DateTime.Now;
        }
    }
}