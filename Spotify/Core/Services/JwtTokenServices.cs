using Core.Entities.Identity;
using Core.Interfaces;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Core.Services
{
    public class JwtTokenServices : IJwtTokenServices
    {
        private readonly IConfiguration _configuration;
        private readonly UserManager<UserEntity> _userManager;
        public JwtTokenServices(IConfiguration configuration, UserManager<UserEntity> userManager)
        {
            _configuration = configuration;
            _userManager = userManager;
        }
 
        public async Task<string> CreateTokenAsync(UserEntity user)
        {
            IList<string> roles = await _userManager.GetRolesAsync(user);
            List<Claim> claims = new List<Claim>()
            {
                new Claim("id", user.Id.ToString()),
                new Claim("firstName", user.FirstName),
                new Claim("lastName", user.LastName),
                new Claim("userName", user.UserName),
                new Claim("publicPerformerNickName", user.PublicPerformerNickName),
                new Claim("email", user.Email),
                new Claim("image", user.Image),
                new Claim("aboutMe", user.AboutMe),
                new Claim("favoritePlaylistCode", user.FavoritePlaylistCode.ToString()),
                new Claim("dateCreated", user.DateCreated.ToString()),
                new Claim("dateUpdated", user.DateUpdated.ToString()),
                new Claim("isDeleted", user.IsDeleted.ToString()),
                new Claim("isBlocked", user.IsBloked.ToString()),
                new Claim("isVerified", user.IsVerified.ToString()),
            };
            foreach (var role in roles)
            {
                claims.Add(new Claim("roles", role));
            }
            var signinKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetValue<String>("JWTSecretKey")));
            var signinCredentials = new SigningCredentials(signinKey, SecurityAlgorithms.HmacSha256);

            var jwt = new JwtSecurityToken(
                signingCredentials: signinCredentials,
                expires: DateTime.Now.AddDays(10),
                claims: claims
            );
            return new JwtSecurityTokenHandler().WriteToken(jwt);
        }

        public async Task<GoogleJsonWebSignature.Payload> VerifyGoogleToken(string token)
        {
            string clientID = "450853129912-be1idmt0arpbii294s9nr13mgb3a3jf0.apps.googleusercontent.com";
            var settings = new GoogleJsonWebSignature.ValidationSettings()
            {
                Audience = new List<string>() { clientID }
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(token, settings);
            return payload;
        }
    }
}