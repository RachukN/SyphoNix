namespace Spotify.Controllers
{
    using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
    using Spotify.Data;
    [Route("api/[controller]")]
[ApiController]
public class UserProfileController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UserProfileController(ApplicationDbContext context)
    {
        _context = context;
    }

    // Метод для отримання профілю користувача
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetUserProfile(string userId)
    {
        var userProfile = await _context.Users
            .Where(u => u.Id == userId)
            .Select(u => new
            {
                u.Email,
                u.Gender,
                u.BirthDay,
                u.BirthMonth,
                u.BirthYear,
                u.Country,
                u.Region
            })
            .FirstOrDefaultAsync();

        if (userProfile == null)
        {
            return NotFound();
        }

        return Ok(userProfile);
    }

    // Метод для оновлення профілю користувача
    [HttpPut("{userId}")]
    public async Task<IActionResult> UpdateUserProfile(string userId, [FromBody] UserProfileUpdateDto updateDto)
    {
        var user = await _context.Users.FindAsync(userId);

        if (user == null)
        {
            return NotFound();
        }

        user.Gender = updateDto.Gender;
        user.BirthDay = updateDto.BirthDay;
        user.BirthMonth = updateDto.BirthMonth;
        user.BirthYear = updateDto.BirthYear;
        user.Country = updateDto.Country;
        user.Region = updateDto.Region;

        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

public class UserProfileUpdateDto
{
    public string Gender { get; set; }
    public int BirthDay { get; set; }
    public string BirthMonth { get; set; }
    public int BirthYear { get; set; }
    public string Country { get; set; }
    public string Region { get; set; }
}

}
