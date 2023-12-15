using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Uppgift1.Models
{
    public class User
    {
        public int Id { get; set; }
        [Index(IsUnique = true)]
        public string Username { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public List<ToDoNote>? Notes { get; set; }
        public User(string username, string passwordHash)
        {
            Username = username;
            PasswordHash = passwordHash;
        }
    }
}