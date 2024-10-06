namespace Spotify.Controllers
{
    using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
    using Spotify.Data;
    using Newtonsoft.Json;
    using System.Net.Http.Headers;
    using Spotify.Models;
    [Route("api/[controller]")]
[ApiController]
public class UserProfileController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UserProfileController(ApplicationDbContext context)
    {
        _context = context;
    }
        [HttpGet("all")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.Email,
                    u.Gender,
                    u.BirthDay,
                    u.BirthMonth,
                    u.BirthYear,
                    u.Country,
                    u.Region,
                    Role = _context.UserRoles
                        .Where(ur => ur.UserId == u.Id)
                        .Select(ur => ur.RoleId)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(users);
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
        [HttpGet("{userId}/track-count")]
        public async Task<IActionResult> GetTrackCount(string userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var trackCount = await _context.PlayedTracks
                .Where(pt => pt.UserId == userId)
                .CountAsync();

            return Ok(new { trackCount });
        }

        [HttpGet("{userId}/recently-played")]
        public async Task<IActionResult> GetRecentlyPlayedTracks(string userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null || string.IsNullOrEmpty(user.AccessToken))
            {
                return NotFound("User not found or no access token available.");
            }

            try
            {
                // Отримуємо недавно прослухані треки через Spotify API
                using var client = new HttpClient();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user.AccessToken);

                var response = await client.GetAsync("https://api.spotify.com/v1/me/player/recently-played");
                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode((int)response.StatusCode, "Failed to retrieve recently played tracks.");
                }

                var jsonResponse = await response.Content.ReadAsStringAsync();
                var recentlyPlayed = JsonConvert.DeserializeObject<dynamic>(jsonResponse);

                // Зберігаємо інформацію про прослухані треки в базі даних
                foreach (var item in recentlyPlayed.items)
                {
                    string trackId = item.track.id;
                    string trackName = item.track.name;

                    // Логіка для зберігання прослуханих треків у базі
                    var playedTrack = new PlayedTrack
                    {
                        UserId = userId,
                        TrackId = trackId,
                        TrackName = trackName,
                        PlayedAt = item.played_at
                    };

                    _context.PlayedTracks.Add(playedTrack);
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "Recently played tracks saved successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
        [HttpGet("{userId}/top-items")]
        public async Task<IActionResult> GetUserTopItems(string userId, string type = "tracks", string time_range = "medium_term", int limit = 20, int offset = 0)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null || string.IsNullOrEmpty(user.AccessToken))
            {
                return NotFound("User not found or no access token available.");
            }

            try
            {
                using var client = new HttpClient();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", user.AccessToken);

                // Запит до Spotify API для отримання топ-елементів
                var url = $"https://api.spotify.com/v1/me/top/{type}?time_range={time_range}&limit={limit}&offset={offset}";
                var response = await client.GetAsync(url);

                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode((int)response.StatusCode, "Failed to retrieve top items.");
                }

                var jsonResponse = await response.Content.ReadAsStringAsync();
                var topItems = JsonConvert.DeserializeObject<dynamic>(jsonResponse);

                return Ok(topItems);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User deleted successfully" });
        }

        [HttpGet("{userId}/token")]
        public async Task<IActionResult> GetUserToken(string userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null || string.IsNullOrEmpty(user.AccessToken))
            {
                return NotFound("Access token not found.");
            }

            return Ok(new { accessToken = user.AccessToken });
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
