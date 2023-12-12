using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Uppgift1.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Name { get; set; } = null!;
        public List<ToDoNote>? Notes { get; set; }
    }
}