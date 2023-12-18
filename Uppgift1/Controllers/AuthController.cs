using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Uppgift1.Data;
using Uppgift1.Models;
using Uppgift1.Repository;

namespace Uppgift1.Controllers
{
    [Route("[controller]")]
    public class AuthController : Controller
    {
        private IUserRepository _repo;

        private readonly IConfiguration _configuration;
        public AuthController(IUserRepository repo, IConfiguration configuration)
        {
            _configuration = configuration;
            _repo = repo;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] UserDto registerDto)
        {
            if (registerDto == null || registerDto.Username == "" || registerDto.Password == "") return BadRequest(new { message = "Error" });

            var existingUser = _repo.GetUser(registerDto.Username);

            if (existingUser != null)
                return BadRequest(new { message = "User already exist" });

            //Using package called "BCrypt" which is "state of the art" encryption and handles the salt aswell.
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            User user = new User(registerDto.Username, passwordHash);
            _repo.AddUser(user);

            return Ok(new { message = $"Registerd!" });
        }
        [HttpPost("login")]
        public IActionResult Login([FromBody] UserDto loginDto)
        {
            if (loginDto == null) return BadRequest(new { message = $"Error" });

            var userFromDb = _repo.GetUser(loginDto.Username);

            if (userFromDb == null)
                return BadRequest(new { message = $"Bad password or username" });

            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, userFromDb.PasswordHash))
                return BadRequest(new { message = $"Bad password or username" });

            var token = GenerateToken();

            return Ok(new { message = $"Success!", token, id = userFromDb.Id});
        }
        //Creating token. It is valid for one day.
        private string GenerateToken()
        {
            SecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtConfiguration:TokenSecret"]));
            SigningCredentials credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);
            var token = new JwtSecurityToken(null, null,
                null,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials
                );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}