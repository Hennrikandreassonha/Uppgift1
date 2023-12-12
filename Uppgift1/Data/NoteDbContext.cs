using Microsoft.EntityFrameworkCore;
using Uppgift1.Models;

namespace Uppgift1.Data
{
    public class NoteDbContext : DbContext
    {
        public DbSet<ToDoNote> Note { get; set; }

        public NoteDbContext(DbContextOptions<NoteDbContext> options)
            : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

        }
    }
}
