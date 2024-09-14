using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class MusicController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public MusicController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet("tracks")]
    public async Task<IActionResult> GetTracks([FromQuery] string ids, [FromQuery] string market = "US")
    {
        try
        {
            var accessToken = await GetStoredAccessToken();
            if (string.IsNullOrEmpty(accessToken))
            {
                return Unauthorized("Access token is missing or expired.");
            }

            var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            var url = $"https://api.spotify.com/v1/tracks?ids={ids}&market={market}";

            var response = await client.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                return Ok(JsonConvert.DeserializeObject<dynamic>(content));
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Spotify API Error: {errorContent}");
                return StatusCode((int)response.StatusCode, $"Spotify API Error: {errorContent}");
            }
        }
        catch (HttpRequestException httpEx)
        {
            Console.WriteLine($"Request error: {httpEx.Message}");
            return StatusCode(500, "A request error occurred when accessing the Spotify API.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Unexpected error: {ex.Message}");
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, "An unexpected error occurred on the server.");
        }
    }

    private async Task<string> GetStoredAccessToken()
    {
        if (string.IsNullOrEmpty(TokenController._accessToken) || IsTokenExpired())
        {
            Console.WriteLine("Access token is missing or expired, refreshing token...");
            await RefreshAccessToken();
        }

        if (string.IsNullOrEmpty(TokenController._accessToken))
        {
            Console.WriteLine("Failed to obtain a valid access token.");
            return null; // This will trigger Unauthorized response in GetTracks
        }

        return TokenController._accessToken;
    }

    private bool IsTokenExpired()
    {
        // Implement your expiration logic (e.g., based on token issue time and expires_in value)
        // Placeholder; replace with actual check
        return false;
    }

    private async Task RefreshAccessToken()
    {
        if (string.IsNullOrEmpty(TokenController._refreshToken))
        {
            Console.WriteLine("Refresh token is missing before attempting to refresh.");
            throw new Exception("Refresh token is missing.");
        }

        try
        {
            var clientId = _configuration["Spotify:ClientId"];
            var clientSecret = _configuration["Spotify:ClientSecret"];
            var authHeader = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));

            var client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Post, "https://accounts.spotify.com/api/token");
            request.Headers.Authorization = new AuthenticationHeaderValue("Basic", authHeader);
            request.Content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("grant_type", "refresh_token"),
                new KeyValuePair<string, string>("refresh_token", TokenController._refreshToken)
            });

            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var tokenResponse = JsonConvert.DeserializeObject<dynamic>(content);

                TokenController._accessToken = tokenResponse.access_token;
                TokenController._refreshToken = tokenResponse.refresh_token ?? TokenController._refreshToken; // Update if a new refresh token is provided
                Console.WriteLine("Successfully refreshed access token.");
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Failed to refresh access token. Error: {errorContent}");
                throw new Exception($"Failed to refresh access token. Error: {errorContent}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Unexpected error during token refresh: {ex.Message}");
            throw; // Re-throw to handle higher up in the call stack
        }
    }
}
