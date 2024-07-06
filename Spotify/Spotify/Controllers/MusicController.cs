using Microsoft.AspNetCore.Mvc;
using Spotify.Models;
using Spotify.Services;

[Route("api/[controller]")]
[ApiController]
public class MusicController : ControllerBase
{
    private readonly IMusicService _musicService;

    public MusicController(IMusicService musicService)
    {
        _musicService = musicService;
    }

    [HttpGet("tracks")]
    public async Task<IActionResult> GetTracks()
    {
        var tracks = await _musicService.GetTracksAsync();
        return Ok(tracks);
    }
}
