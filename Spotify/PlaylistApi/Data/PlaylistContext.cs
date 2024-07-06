using Microsoft.EntityFrameworkCore;
using PlaylistApi.Models;

namespace PlaylistApi.Data
{
    // Data/PlaylistContext.cs
    public class PlaylistContext : DbContext
    {
        public PlaylistContext(DbContextOptions<PlaylistContext> options)
            : base(options)
        {
        }

        public DbSet<Playlist> Playlists { get; set; }
        public DbSet<Song> Songs { get; set; }
    }

}
