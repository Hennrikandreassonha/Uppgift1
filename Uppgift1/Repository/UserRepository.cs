using Uppgift1.Data;
using Uppgift1.Models;

namespace Uppgift1.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly NoteDbContext _context;
        public UserRepository(NoteDbContext context)
        {
            _context = context;
        }

        public User? AddUser(User? user)
        {
            //Checking if user already exists.
            var existingUser = _context.User.Where(x => x.Username == user.Username).FirstOrDefault();
            if (existingUser != null) return null;

            _context.User.Add(user);
            _context.SaveChanges();

            return user;
        }

        public User? GetUser(int? id)
        {
            if (id == null) return null;

            return _context.User.Find(id);
        }
        public User? GetUser(string? username)
        {
            if (username == null) return null;

            return _context.User.Where(x => x.Username == username).FirstOrDefault();
        }
    }
}
