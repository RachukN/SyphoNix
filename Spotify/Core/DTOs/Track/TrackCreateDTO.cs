using Microsoft.AspNetCore.Http;

namespace Core.DTOs.Track
{
    public class TrackCreateDTO
    {
        public string? Title { get; set; }
        public string? NormalizedTitle { get; set; }
        public string? Image { get; set; }
        public IFormFile? Track { get; set; }
        public int? GenreId { get; set; }
        public int? CountListened { get; set; }
        public int? Duration { get; set; }
        public bool? IsExplicit { get; set; }
        public bool? IsPublic { get; set; }
        public bool? IsDeleted { get; set; }
        public string? Path { get; set; }
        public string? PerformerUserName { get; set; }
        public string? PublicPerformerNickName { get; set; }
        public DateTime? DateCreated { get; set; }
    }
}