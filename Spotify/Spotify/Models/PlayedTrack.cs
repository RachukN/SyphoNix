namespace Spotify.Models
{
    public class PlayedTrack
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string TrackId { get; set; }
        public string TrackName { get; set; }
        public DateTime PlayedAt { get; set; }
    }

}
