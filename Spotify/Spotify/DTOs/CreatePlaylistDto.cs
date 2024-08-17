namespace Spotify.DTOs
{
    public class CreatePlaylistDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public IFormFile Image { get; set; } // Для завантаження зображення
    }
}
