namespace Core.DTOs.Genre
{
    public class GenreItemDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? NormalizedTitle { get; set; }
        public bool? IsDeleted { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
    }
}
