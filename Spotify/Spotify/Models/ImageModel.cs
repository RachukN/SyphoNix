namespace Spotify.Models
{
    public class ImageModel
    {
        public int Id { get; set; }
        public string ImageName { get; set; }
        public string ImageUrl { get; set; }
        public byte[] ImageData { get; set; }
        public string Category { get; set; } // Нова властивість для категорії
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }





}
