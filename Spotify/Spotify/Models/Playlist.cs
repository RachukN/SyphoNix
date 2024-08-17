namespace Spotify.Models;
public class Playlist
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string ImagePath { get; set; }  // шлях до зображення
    public bool IsFavorite { get; set; } = false;  // Вказує, чи є плейлист улюбленим

    public ICollection<Track> Tracks { get; set; }
}