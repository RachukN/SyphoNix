using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Spotify.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly string clientId = "75abbe1a1b5d489badb6aa0b0b6c7f65";  // Replace with your actual Client ID
        private readonly string clientSecret = "1d4b6037d0384b3a84aa24ea9cc413e4";  // Keep this secure
        private readonly string redirectUri = "http://localhost:5059/Auth/callback";  // Ensure this matches the registered redirect URI
        private readonly string spotifyAuthUrl = "https://accounts.spotify.com/authorize";
        private readonly string spotifyTokenUrl = "https://accounts.spotify.com/api/token";

        // Store code_verifier in a way that is accessible between requests
        private static string codeVerifier;

        [HttpGet("login")]
        public IActionResult Login()
        {
            codeVerifier = GenerateCodeVerifier();
            string codeChallenge = GenerateCodeChallenge(codeVerifier);
            string state = GenerateRandomString(16);

            // Include all required scopes
            var scopes = new List<string>
    {
        "user-read-private",
        "user-read-email",
        "user-modify-playback-state",
        "user-read-playback-state",
        "streaming"
    };

            string scope = "user-read-private user-read-email user-modify-playback-state user-read-playback-state streaming";


            var queryParams = new Dictionary<string, string>
            {
                ["client_id"] = clientId,
                ["response_type"] = "code",
                ["redirect_uri"] = redirectUri,
                ["state"] = state,
                ["scope"] = scope,
                ["code_challenge_method"] = "S256",
                ["code_challenge"] = codeChallenge
            };

            string fullAuthUrl = QueryHelpers.AddQueryString(spotifyAuthUrl, queryParams);

            return Redirect(fullAuthUrl);
        }




        [HttpGet("callback")]
        public async Task<IActionResult> Callback(string code, string state)
        {
            if (string.IsNullOrEmpty(code) || string.IsNullOrEmpty(state))
            {
                return BadRequest("Invalid request: Missing code or state.");
            }

            var tokenResponse = await ExchangeCodeForToken(code, codeVerifier);
            if (tokenResponse == null)
            {
                return BadRequest("Failed to obtain access token.");
            }

            var tokenData = JsonConvert.DeserializeObject<Dictionary<string, string>>(tokenResponse);
            if (!tokenData.TryGetValue("access_token", out string accessToken))
            {
                return BadRequest("Access token not found in response.");
            }

            // Optionally handle refresh token
            string refreshToken = tokenData.ContainsKey("refresh_token") ? tokenData["refresh_token"] : null;

            // You can store tokens in a secure way, like a server-side session or secure cookie
            // Store access token securely, and use refresh tokens if available

            Console.WriteLine("Access Token Obtained: " + accessToken);
            // Redirect to frontend with the access token
            return Redirect($"http://localhost:1573/home?access_token={accessToken}");
        }

        private async Task<string> ExchangeCodeForToken(string code, string codeVerifier)
        {
            using var client = new HttpClient();
            var postData = new Dictionary<string, string>
            {
                ["grant_type"] = "authorization_code",
                ["code"] = code,
                ["redirect_uri"] = redirectUri,
                ["client_id"] = clientId,
                ["code_verifier"] = codeVerifier
            };

            var request = new HttpRequestMessage(HttpMethod.Post, spotifyTokenUrl)
            {
                Content = new FormUrlEncodedContent(postData)
            };

            try
            {
                var response = await client.SendAsync(request);
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Failed to obtain access token. Status Code: {response.StatusCode}, Error: {errorContent}");
                    return null;
                }

                var json = await response.Content.ReadAsStringAsync();
                Console.WriteLine("Access Token Obtained Successfully");
                return json;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception occurred: {ex.Message}");
                return null;
            }
        }


        private static string GenerateRandomString(int length)
        {
            const string valid = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            StringBuilder res = new StringBuilder();
            using (var rng = new RNGCryptoServiceProvider())
            {
                byte[] uintBuffer = new byte[sizeof(uint)];
                while (length-- > 0)
                {
                    rng.GetBytes(uintBuffer);
                    uint num = BitConverter.ToUInt32(uintBuffer, 0);
                    res.Append(valid[(int)(num % (uint)valid.Length)]);
                }
            }

            return res.ToString();
        }

        private string GenerateCodeVerifier()
        {
            return GenerateRandomString(128);
        }

        private string GenerateCodeChallenge(string codeVerifier)
        {
            using (var sha256 = SHA256.Create())
            {
                var challengeBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(codeVerifier));
                return Convert.ToBase64String(challengeBytes)
                    .Replace("+", "-")
                    .Replace("/", "_")
                    .Replace("=", "");
            }
        }
    }
}
