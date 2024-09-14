// DataController.cs
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Spotify.Controllers;
using System.Net.Http.Headers;

[ApiController]
[Route("api/[controller]")]
public class DataController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public DataController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchSpotify([FromQuery] string query, [FromQuery] string type = "album,artist,track,playlist")
    {
        var accessToken = await GetStoredAccessToken();
        if (string.IsNullOrEmpty(accessToken))
        {
            return Unauthorized("Access token is missing or expired.");
        }

        var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var url = $"https://api.spotify.com/v1/search?q={query}&type={type}&limit=10&market=US";
        var response = await client.GetAsync(url);

        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            // Process data as needed
            return Ok(JsonConvert.DeserializeObject<dynamic>(content));
        }

        return BadRequest("Failed to retrieve search results from Spotify.");
    }

    private async Task<string> GetStoredAccessToken()
    {
        // Retrieve the stored access token, implement refresh if expired
        // Here we are just returning a static variable for simplicity
        return await Task.FromResult(TokenController._accessToken); // Replace with your actual token retrieval logic
    }
}
