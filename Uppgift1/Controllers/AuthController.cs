using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Uppgift1.Data;
using Uppgift1.Models;

namespace Uppgift1.Controllers
{
    [Route("[controller]")]
    public class AuthController : Controller
    {
        private readonly NoteDbContext _context;
        private readonly IConfiguration _configuration;
        public AuthController(NoteDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] UserDto registerDto)
        {
            if (registerDto == null || registerDto.Username == "" || registerDto.Password == "") return BadRequest(new { message = "Error" });

            var existingUser = _context.User.Where(x => x.Username == registerDto.Username).FirstOrDefault();

            if (existingUser != null)
                return BadRequest(new { message = "User already exist" });

            //Using package called "BCrypt" which is "state of the art" encryption and handles the salt aswell.
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            User user = new User(registerDto.Username, passwordHash);
            _context.Add(user);
            _context.SaveChanges();

            return Ok(new { message = $"User already exist" });
        }
        [HttpPost("login")]
        public IActionResult Login([FromBody] UserDto loginDto)
        {
            if (loginDto == null) return BadRequest(new { message = $"Error" });

            var userFromDb = _context.User.Where(x => x.Username == loginDto.Username).FirstOrDefault();

            if (userFromDb == null)
                return BadRequest(new { message = $"Bad password or username" });

            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, userFromDb.PasswordHash))
                return BadRequest(new { message = $"Bad password or username" });

            var token = GenerateToken(userFromDb.Username, userFromDb.PasswordHash);

            return Ok(new { message = $"Success!", token });
        }
        //Creating token.
        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username)
            };

            var appSettingsKey = _configuration.GetSection("Authentication:Schemes:Bearer:SigningKeys:0:Value");
            //This key should be stored somewhere else maybe keyvault.
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(appSettingsKey.Value));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials,
                issuer: "dotnet-user-jwts",
                audience: "https://localhost:7275"
                );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        private string GenerateToken(string userName, string password)
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