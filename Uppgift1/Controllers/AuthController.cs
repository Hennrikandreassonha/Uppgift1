using Microsoft.AspNetCore.Mvc;
using Uppgift1.Data;
using Uppgift1.Models;

namespace Uppgift1.Controllers
{
    [Route("[controller]")]
    public class AuthController : Controller
    {
        private readonly NoteDbContext _context;
        public AuthController(NoteDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public ActionResult<User> Register([FromBody] UserDto userDto)
        {
            if (userDto == null) return BadRequest("Error");

            var existingUser = _context.User.Where(x => x.Username == userDto.Username).FirstOrDefault();

            //Might not be so good to give Username away
            if (existingUser != null) 
                return BadRequest(new { message = $"User with username: {userDto.Username} already exists" });

            //Using package called "BCrypt" which is "state of the art" encryption and handles the salt aswell.
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

            User user = new User(userDto.Username, passwordHash);
            _context.Add(user);
            _context.SaveChanges();

            return Ok($"User with username {user.Username} created, you can now login.");
        }
    }
}

