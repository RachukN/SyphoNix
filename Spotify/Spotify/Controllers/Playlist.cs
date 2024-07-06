using Microsoft.AspNetCore.Mvc;

namespace Spotify.Controllers
{
    public class Playlist : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
