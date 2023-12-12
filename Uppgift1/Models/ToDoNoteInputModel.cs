using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Uppgift1.Models
{
    [NotMapped]
    public class ToDoNoteInputModel
    {
        public string Text { get; set; } = null!;
        public string Heading { get; set; } = null!;

        public DateTime? DeadLine { get; set; }

        public ToDoNoteInputModel(string heading, string text)
        {
            Heading = heading;
            Text = text;
        }
    }
}