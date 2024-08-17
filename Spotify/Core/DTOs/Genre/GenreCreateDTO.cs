namespace Core.DTOs.Genre
{
    public class GenreCreateDTO
    {
        public string? Name { get; set; }
        public string? NormalizedName { get; set; }
        public bool? IsDeleted { get; set; }
        public DateTime? DateCreated { get; set; }
    }
}
