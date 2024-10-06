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
        private readonly string clientId = "643893a26f2546f8b9c41161d476bdc5";  // Замініть на свій реальний Client ID
        private readonly string clientSecret = "a1cc5561cdce41a0900f1e420cf141d6";  // Тримайте це в безпеці
        private readonly string redirectUri = "http://localhost:5059/Auth/callback";
        private readonly string spotifyAuthUrl = "https://accounts.spotify.com/authorize";
        private readonly string spotifyTokenUrl = "https://accounts.spotify.com/api/token";
        private readonly UserService _userService;
        private static string codeVerifier;  // Зберігання code_verifier між запитами
        private readonly ApplicationDbContext _context;

        public AuthController(UserService userService, ApplicationDbContext context)
        {
            _userService = userService;
            _context = context;
        }

        // Авторизація через Spotify
        [HttpGet("login")]
        public IActionResult Login()
        {
            codeVerifier = GenerateCodeVerifier();  // Генеруємо унікальний code_verifier
            string codeChallenge = GenerateCodeChallenge(codeVerifier);  // Створюємо code_challenge на основі code_verifier
            string state = GenerateRandomString(16);  // Генерація унікального стану (state)

            // Spotify scopes
            string scope = " user-top-read user-read-currently-playing playlist-read-collaborative ugc-image-upload playlist-modify-public playlist-modify-private user-read-private user-library-read user-library-modify user-follow-read user-follow-modify user-read-email user-modify-playback-state user-read-playback-state streaming";

            // Параметри запиту
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

            // Створюємо повний URL для авторизації
            string fullAuthUrl = QueryHelpers.AddQueryString(spotifyAuthUrl, queryParams);

            return Redirect(fullAuthUrl);
        }

        // Метод зворотного виклику після авторизації
        [HttpGet("callback")]
        public async Task<IActionResult> Callback(string code, string state)
        {
            if (string.IsNullOrEmpty(code) || string.IsNullOrEmpty(state))
            {
                return BadRequest("Invalid request: Missing code or state.");
            }

            try
            {
                // Обмін отриманого коду на токен
                var tokenResponse = await ExchangeCodeForToken(code, codeVerifier);
                if (tokenResponse == null)
                {
                    return BadRequest("Failed to obtain access token.");
                }

                var tokenData = JsonConvert.DeserializeObject<Dictionary<string, string>>(tokenResponse);
                if (!tokenData.TryGetValue("access_token", out string accessToken) || !tokenData.TryGetValue("refresh_token", out string refreshToken))
                {
                    return BadRequest("Access or refresh token not found in response.");
                }

                // Отримуємо профіль користувача Spotify
                var spotifyProfile = await GetSpotifyProfile(accessToken);
                if (spotifyProfile == null)
                {
                    return Redirect($"http://localhost:1573/premium-required");
                }

                // Додаємо або оновлюємо користувача в базі даних
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == spotifyProfile.Email);
                if (user == null)
                {
                    // Якщо користувач не знайдений, додаємо нового
                    user = new ApplicationUser
                    {
                        Email = spotifyProfile.Email,
                        UserName = spotifyProfile.DisplayName,
                        AccessToken = accessToken,
                        RefreshToken = refreshToken,
                        TokenExpiration = DateTime.UtcNow.AddSeconds(int.Parse(tokenData["expires_in"]))
                    };

                    _context.Users.Add(user);
                }
                else
                {
                    // Якщо користувач існує, оновлюємо токени
                    user.AccessToken = accessToken;
                    user.RefreshToken = refreshToken;
                    user.TokenExpiration = DateTime.UtcNow.AddSeconds(int.Parse(tokenData["expires_in"]));
                    _context.Users.Update(user);
                }

                // Зберігаємо зміни в базу
                await _context.SaveChangesAsync();

                // Перенаправляємо до профілю
                return Redirect($"http://localhost:1573/profile?userId={user.Id}&access_token={accessToken}");
            }
            catch (Exception ex)
            {
                // Логування помилки з повним повідомленням про помилку та трасуванням стека
                Console.WriteLine($"Error processing user data: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                return StatusCode(500, $"An error occurred while processing the request: {ex.Message}");
            }
        }

        // Отримання профілю користувача з Spotify
        private async Task<SpotifyProfile> GetSpotifyProfile(string accessToken)
        {
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var response = await client.GetAsync("https://api.spotify.com/v1/me");
            var responseContent = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Profile request response: {responseContent}");

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Failed to fetch profile data. Status Code: {response.StatusCode}, Error: {errorContent}");

                if (response.StatusCode == System.Net.HttpStatusCode.Forbidden)
                {
                    Console.WriteLine("User does not have a premium account or lacks required permissions.");
                    return null;
                }
                return null;
            }

            var profileData = JsonConvert.DeserializeObject<dynamic>(responseContent);

            var profile = new SpotifyProfile
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

        // Метод для оновлення Access Token за допомогою Refresh Token
        private async Task<string> RefreshAccessToken(string refreshToken)
        {
            using var client = new HttpClient();
            var postData = new Dictionary<string, string>
            {
                ["grant_type"] = "refresh_token",
                ["refresh_token"] = refreshToken,
                ["client_id"] = clientId,
                ["client_secret"] = clientSecret
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
                    Console.WriteLine($"Failed to refresh access token. Status Code: {response.StatusCode}, Error: {errorContent}");
                    return null;
                }

                var json = await response.Content.ReadAsStringAsync();
                var tokenData = JsonConvert.DeserializeObject<Dictionary<string, string>>(json);

                if (tokenData.TryGetValue("access_token", out string newAccessToken))
                {
                    return newAccessToken;
                }
                else
                {
                    Console.WriteLine("New access token not found in response.");
                    return null;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception occurred while refreshing access token: {ex.Message}");
                return null;
            }
        }

        // Обмін отриманого коду на токен
        private async Task<string> ExchangeCodeForToken(string code, string codeVerifier)
        {
            using var client = new HttpClient();
            var postData = new Dictionary<string, string>
            {
                ["grant_type"] = "authorization_code",
                ["code"] = code,
                ["redirect_uri"] = redirectUri,
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
                var json = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Token exchange response: {json}");

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Failed to obtain access token. Status Code: {response.StatusCode}, Error: {json}");
                    return null;
                }

                return json;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception during token exchange: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                return null;
            }
        }

        // Генерація випадкових рядків для state та інших параметрів
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
