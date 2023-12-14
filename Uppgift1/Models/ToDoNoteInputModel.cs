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
        public string? Deadline { get; set; }
        [JsonIgnore]
        public DateTime Created { get; set; }

        public ToDoNoteInputModel(string heading, string text, string? deadline = null)
        {
            Heading = heading;
            Text = text;
            Deadline = deadline;
            Created = DateTime.Now;
        }
    }
}