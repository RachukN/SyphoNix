namespace Spotify.DTOs
{
    public class EditPlaylistDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public IFormFile Image { get; set; } // Для завантаження зображення (опціонально)
    }
}
