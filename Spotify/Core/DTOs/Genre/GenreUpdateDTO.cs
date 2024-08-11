namespace Core.DTOs.Genre
{
    public class GenreUpdateDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? NormalizedName { get; set; }
        public bool? IsDeleted { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
    }
}
