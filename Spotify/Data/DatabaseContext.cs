using Core.Entities;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Infastructure
{
    public class DatabaseContext : IdentityDbContext<UserEntity, RoleEntity, int, IdentityUserClaim<int>, UserRoleEntity, IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DatabaseContext(DbContextOptions options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            DatabaseConnections.SetDbConnections(modelBuilder);
        }

        public virtual DbSet<Track> Tracks { get; set; }
        public virtual DbSet<Album> Albums { get; set; }
        public virtual DbSet<Genre> Genres { get; set; }
        public virtual DbSet<Playlist> Playlists { get; set; }
        public virtual DbSet<PlaylistTracks> PlaylistTracks { get; set; }
        public virtual DbSet<AlbumTracks> AlbumTracks { get; set; }
    }
}