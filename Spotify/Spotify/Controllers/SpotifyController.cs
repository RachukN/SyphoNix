using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace Spotify.Controllers
{
    [ApiController]
    [Route("api/spotify")]
    public class SpotifyController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        public SpotifyController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }
        
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories([FromQuery] string accessToken)
        {
            if (string.IsNullOrEmpty(accessToken))
            {
                return BadRequest("Access token is required.");
            }

            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

            var response = await _httpClient.GetAsync("https://api.spotify.com/v1/browse/categories?limit=20&locale=en_US");

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                return Ok(content);
            }
            else
            {
                return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
            }
        }
    }
}
