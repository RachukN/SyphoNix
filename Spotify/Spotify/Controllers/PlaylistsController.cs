using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Spotify.Models;
using Spotify.DTOs; // Змінити на правильний простір імен для ваших DTO
using Spotify.Data;

namespace Spotify.Controllers
{

    [ApiController]
        [Route("api/[controller]")]
        public class PlaylistsController : ControllerBase
        {
            private readonly ApplicationDbContext _context;

            public PlaylistsController(ApplicationDbContext context)
            {
                _context = context;
            }

        [HttpPost]
        public async Task<IActionResult> CreatePlaylist([FromForm] CreatePlaylistDto dto)
        {
            var playlist = new Playlist
            {
                Name = dto.Name,
                Description = dto.Description,
            };

            if (dto.Image != null)
            {
                var imagePath = Path.Combine("Images", dto.Image.FileName);
                 Directory.CreateDirectory(Path.GetDirectoryName(imagePath));
                using (var stream = new FileStream(imagePath, FileMode.Create))
                {
                    await dto.Image.CopyToAsync(stream);
                }
                playlist.ImagePath = imagePath;
            }

            _context.Playlists.Add(playlist);
            await _context.SaveChangesAsync();

            return Ok(playlist);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditPlaylist(int id, [FromForm] EditPlaylistDto dto)
        {
            var playlist = await _context.Playlists.FindAsync(id);
            if (playlist == null)
            {
                return NotFound();
            }

            playlist.Name = dto.Name;
            playlist.Description = dto.Description;

            if (dto.Image != null)
            {
                var imagePath = Path.Combine("Images", dto.Image.FileName);
                Directory.CreateDirectory(Path.GetDirectoryName(imagePath));
                using (var stream = new FileStream(imagePath, FileMode.Create))
                {
                    await dto.Image.CopyToAsync(stream);
                }
                playlist.ImagePath = imagePath;
            }

            _context.Playlists.Update(playlist);
            await _context.SaveChangesAsync();

            return Ok(playlist);
        }

        [HttpPost("{id}/favorite")]
        public async Task<IActionResult> ToggleFavorite(int id)
        {
            var playlist = await _context.Playlists.FindAsync(id);
            if (playlist == null)
            {
                return NotFound();
            }

            playlist.IsFavorite = !playlist.IsFavorite;

            _context.Playlists.Update(playlist);
            await _context.SaveChangesAsync();

            return Ok(playlist);
        }


    }

}

