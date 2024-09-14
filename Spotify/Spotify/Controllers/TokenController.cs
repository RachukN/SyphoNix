// TokenController.cs
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class TokenController : ControllerBase
{
    private readonly IConfiguration _configuration;
    public static string _accessToken; // Change 'private' to 'public' or 'internal'
    public static string _refreshToken;

    public TokenController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpPost("exchange-code")]
    public async Task<IActionResult> ExchangeCodeForToken([FromQuery] string code)
    {
        var tokenResponse = await GetTokensFromSpotify(code);
        if (tokenResponse != null)
        {
            _accessToken = tokenResponse.access_token;
            _refreshToken = tokenResponse.refresh_token;
            // Consider securely storing these tokens in a database or other secure storage
            return Ok(tokenResponse);
        }

        return BadRequest("Failed to obtain access token.");
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken()
    {
        if (string.IsNullOrEmpty(_refreshToken))
        {
            return BadRequest("No refresh token available.");
        }

        var tokenResponse = await RefreshAccessToken();
        if (tokenResponse != null)
        {
            // Update the stored access token
            _accessToken = tokenResponse.access_token;
            return Ok(tokenResponse);
        }

        return BadRequest("Failed to refresh access token.");
    }

    private async Task<dynamic> GetTokensFromSpotify(string code)
    {
        var clientId = _configuration["Spotify:ClientId"];
        var clientSecret = _configuration["Spotify:ClientSecret"];
        var redirectUri = _configuration["Spotify:RedirectUri"];

        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Post, "https://accounts.spotify.com/api/token");
        var authHeader = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));
        request.Headers.Authorization = new AuthenticationHeaderValue("Basic", authHeader);

        var body = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("grant_type", "authorization_code"),
            new KeyValuePair<string, string>("code", code),
            new KeyValuePair<string, string>("redirect_uri", redirectUri)
        });
        request.Content = body;

        var response = await client.SendAsync(request);
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<dynamic>(content);
        }

        return null;
    }

    private async Task<dynamic> RefreshAccessToken()
    {
        var clientId = _configuration["Spotify:ClientId"];
        var clientSecret = _configuration["Spotify:ClientSecret"];

        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Post, "https://accounts.spotify.com/api/token");
        var authHeader = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));
        request.Headers.Authorization = new AuthenticationHeaderValue("Basic", authHeader);

        var body = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("grant_type", "refresh_token"),
            new KeyValuePair<string, string>("refresh_token", _refreshToken)
        });
        request.Content = body;

        var response = await client.SendAsync(request);
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<dynamic>(content);
        }

        return null;
    }
}
