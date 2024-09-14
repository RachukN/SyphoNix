using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;

[ApiController]
[Route("api/[controller]")]
public class ArtistsController : ControllerBase
{
    private readonly HttpClient _httpClient;

    public ArtistsController(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    [HttpGet]
    public async Task<IActionResult> GetArtists([FromQuery] string ids)
    {
        var accessToken = "YOUR_SPOTIFY_ACCESS_TOKEN"; // Отримайте ваш Spotify access token

        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var response = await _httpClient.GetAsync($"https://api.spotify.com/v1/artists?ids={ids}");
        if (!response.IsSuccessStatusCode)
        {
            return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
        }

        var artists = await response.Content.ReadAsStringAsync();
        return Ok(artists);
    }
}
