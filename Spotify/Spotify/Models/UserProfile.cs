namespace Spotify.Models
{
    public class UserProfile
    {
        public string Id { get; set; }
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public string Gender { get; set; }
        public int? BirthDay { get; set; }
        public string BirthMonth { get; set; }
        public int? BirthYear { get; set; }
        public string Country { get; set; }
        public string Region { get; set; }
        // Вкладений об'єкт для external_urls
        public ExternalUrls ExternalUrls { get; set; }
        public Followers Followers { get; set; }
        public List<Image> Images { get; set; }
    }
}
