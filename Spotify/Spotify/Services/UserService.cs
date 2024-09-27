using System.Threading.Tasks;
// Змінити на ваш простір імен для ApplicationDbContext
using Spotify.Models; // Змінити на ваш простір імен для ApplicationUserusing Spotify.Data; 
using Spotify.Data;

public class UserService
{
    private readonly ApplicationDbContext _context;

    public UserService(ApplicationDbContext context)
    {
        _context = context;
    }

    // Метод для створення нового користувача
    public async Task CreateUserAsync(string spotifyUserId, string email, string displayName)
    {
        var user = new ApplicationUser
        {
            UserName = spotifyUserId,
            Email = email,
            FullName = displayName
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
    }

}
