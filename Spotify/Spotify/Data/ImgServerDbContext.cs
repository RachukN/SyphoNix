using Microsoft.EntityFrameworkCore;
using Spotify.Models;

namespace Spotify.Data
{
    public class ImgServerDbContext : DbContext
    {
        public ImgServerDbContext(DbContextOptions<ImgServerDbContext> options)
            : base(options)
        {
        }

        public DbSet<ImageModel> Images { get; set; }
    }

}
