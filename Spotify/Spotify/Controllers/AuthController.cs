using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Spotify.Data;
using Spotify.Models;
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
        private readonly string clientId = "32a1d43f4fa647679d7cc61420bf6aaf";  // Replace with your actual Client ID
        private readonly string clientSecret = "c9bf5dc65c83448b98afc451d2754f0e";  // Keep this secure
        private readonly string redirectUri = "http://localhost:5059/Auth/callback";  
        private readonly string spotifyAuthUrl = "https://accounts.spotify.com/authorize";
        private readonly string spotifyTokenUrl = "https://accounts.spotify.com/api/token";
        private readonly UserService _userService;
        // Store code_verifier in a way that is accessible between requests
        private static string codeVerifier;
        private readonly ApplicationDbContext _context;
        public AuthController(UserService userService, ApplicationDbContext context)
        {
            _userService = userService; 
            _context = context;

        }

        [HttpGet("login")]
        public IActionResult Login()
        {
            codeVerifier = GenerateCodeVerifier();
            string codeChallenge = GenerateCodeChallenge(codeVerifier);
            string state = GenerateRandomString(16);
            // Include all required scopes

            string scope = " playlist-read-collaborative ugc-image-upload playlist-modify-public playlist-modify-private user-read-private user-library-read user-library-modify user-follow-read user-follow-modify user-read-email user-modify-playback-state user-read-playback-state streaming";


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

            // Fetch Spotify profile
            var spotifyProfile = await GetSpotifyProfile(accessToken);
            if (spotifyProfile == null)
            {
                return BadRequest("Failed to fetch Spotify profile.");
            }

            // Check if user already exists in the database
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == spotifyProfile.Email);
            if (user == null)
            {
                // If user doesn't exist, create a new user
                user = new ApplicationUser
                {
                    Email = spotifyProfile.Email,
                    UserName = spotifyProfile.DisplayName,
                    // Other profile details
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }

            // Redirect to frontend with both userId and access token
            return Redirect($"http://localhost:1573/profile?userId={user.Id}&access_token={accessToken}");
        }



        private async Task<SpotifyProfile> GetSpotifyProfile(string accessToken)
        {
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var response = await client.GetAsync("https://api.spotify.com/v1/me");
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Failed to fetch profile data. Status Code: {response.StatusCode}, Error: {errorContent}");
                return null;
            }

            var jsonResponse = await response.Content.ReadAsStringAsync();
            var profileData = JsonConvert.DeserializeObject<dynamic>(jsonResponse);

            // Map the Spotify API response to the SpotifyProfile class
            SpotifyProfile profile = new SpotifyProfile
            {
                DisplayName = profileData.display_name,
                Email = profileData.email,
                Country = profileData.country,
                Product = profileData.product,
                SpotifyUrl = profileData.external_urls.spotify,
                Followers = profileData.followers.total,
                ImageUrl = profileData.images != null && profileData.images.Count > 0 ? profileData.images[0].url : null
            };

            return profile;
        }

        private async Task<string> GetAccessToken(string code)
        {
            // Your logic to exchange the code for an access token
            return "YourAccessToken";
        }



        private async Task<UserProfile> GetUserProfile(string accessToken)
        {
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var response = await client.GetAsync("https://api.spotify.com/v1/me");

            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"Failed to get user profile. Status Code: {response.StatusCode}");
                return null;
            }

            var json = await response.Content.ReadAsStringAsync();
            var userProfile = JsonConvert.DeserializeObject<UserProfile>(json);
            return userProfile;
        }


        private async Task<string> ExchangeCodeForToken(string code, string codeVerifier)
        {
            using var client = new HttpClient();
            var postData = new Dictionary<string, string>
            {
                ["grant_type"] = "authorization_code",
                ["code"] = code,
                ["redirect_uri"] = redirectUri,  // Замість цього URL використовуйте той, що зареєстрований
                ["client_id"] = clientId,
                ["client_secret"] = clientSecret,
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
