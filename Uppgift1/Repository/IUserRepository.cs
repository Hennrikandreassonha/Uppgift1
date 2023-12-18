using Uppgift1.Models;

namespace Uppgift1.Repository
{
    public interface IUserRepository
    {
        User? GetUser(int? id);
        User? GetUser(string? username);
        User? AddUser(User? user);
    }
}
