namespace Core.DTOs.Album
{
    public class AlbumCreateDTO
    {
        public string Title { get; set; }
        public string? NormalizedTitle { get; set; }
        public int? GenreId { get; set; }
        public string? UserName { get; set; }
        public int? Duration { get; set; }
        public DateTime? DateCreated { get; set; }
        public string Image { get; set; }
        public string? Description { get; set; }
        public bool? IsDeleted { get; set; }
        public bool IsExplicit { get; set; }
        public bool IsPublic { get; set; }
    }
}
