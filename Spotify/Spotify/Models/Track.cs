namespace Spotify.Models;
public class Track
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Artist { get; set; }
    public TimeSpan Duration { get; set; }

    public int PlaylistId { get; set; }
    public Playlist Playlist { get; set; }
}