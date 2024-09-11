// Extensions/AuthenticationConfig.cs
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Security.Cryptography;
using System.Text;

namespace Spotify.Extensions
{
    public static class AuthenticationConfig
    {
        public static IServiceCollection AddSpotifyAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = "Spotify"; // Вказуємо схему для OAuth
            })
            .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddOAuth("Spotify", options =>
            {
                options.ClientId = configuration["Spotify:ClientId"];
                options.ClientSecret = configuration["Spotify:ClientSecret"];
                options.CallbackPath = new PathString("/callback");

                options.AuthorizationEndpoint = "https://accounts.spotify.com/authorize";
                options.TokenEndpoint = "https://accounts.spotify.com/api/token";
                options.UserInformationEndpoint = "https://api.spotify.com/v1/me";

                options.SaveTokens = true;

                options.Scope.Add("user-read-email");
                options.Scope.Add("user-read-private");
                options.Scope.Add("playlist-read-private");
                options.Scope.Add("playlist-modify-public");
                options.Scope.Add("offline_access"); // Це обов'язково для отримання refresh_token

                options.UsePkce = true;

                options.Events = new OAuthEvents
                {
                    OnCreatingTicket = async context =>
                    {
                        var request = new HttpRequestMessage(HttpMethod.Get, context.Options.UserInformationEndpoint);
                        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", context.AccessToken);

                        var response = await context.Backchannel.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, context.HttpContext.RequestAborted);
                        response.EnsureSuccessStatusCode();

                        var user = System.Text.Json.JsonDocument.Parse(await response.Content.ReadAsStringAsync());

                        context.RunClaimActions(user.RootElement);
                    },
                    OnRedirectToAuthorizationEndpoint = context =>
                    {
                        // Генерація code_verifier і code_challenge
                        var codeVerifier = GeneratePkceVerifier();
                        var codeChallenge = GeneratePkceChallenge(codeVerifier);

                        // Додавання параметрів в RedirectUri
                        var redirectUri = context.RedirectUri;
                        redirectUri = QueryHelpers.AddQueryString(redirectUri, "code_challenge", codeChallenge);
                        redirectUri = QueryHelpers.AddQueryString(redirectUri, "code_challenge_method", "S256");

                        // Збереження code_verifier в Items для подальшого використання
                        context.Properties.Items["code_verifier"] = codeVerifier;

                        // Встановлення нового RedirectUri з PKCE параметрами
                        context.RedirectUri = redirectUri;

                        return Task.CompletedTask;
                    }
                };
            });

            return services;
        }

        // Функція для генерації PKCE verifier
        private static string GeneratePkceVerifier()
        {
            var bytes = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(bytes);
            return Convert.ToBase64String(bytes)
                .TrimEnd('=')
                .Replace('+', '-')
                .Replace('/', '_');
        }

        // Функція для генерації PKCE challenge з verifier
        private static string GeneratePkceChallenge(string codeVerifier)
        {
            using var sha256 = SHA256.Create();
            var challengeBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(codeVerifier));
            return Convert.ToBase64String(challengeBytes)
                .TrimEnd('=')
                .Replace('+', '-')
                .Replace('/', '_');
        }
    }
}
