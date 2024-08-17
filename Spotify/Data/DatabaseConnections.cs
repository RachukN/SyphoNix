using Core.Entities.Identity;
using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infastructure
{
    public class DatabaseConnections
    {
        public static void SetDbConnections(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserRoleEntity>(user =>
            {
                user.HasKey(user => new { user.UserId, user.RoleId });

                user.HasOne(user => user.Role)
                        .WithMany(role => role.UserRoles)
                        .HasForeignKey(role => role.RoleId)
                        .IsRequired();

                user.HasOne(user => user.User)
                        .WithMany(role => role.UserRoles)
                        .HasForeignKey(user => user.UserId)
                        .IsRequired();
            });

            #region Album
            modelBuilder.Entity<Album>()
                        .HasMany(a => a.AlbumTracks)
                        .WithOne(t => t.Album)
                        .HasForeignKey(t => t.AlbumId);
            #endregion

            #region AlbumTracks
            modelBuilder.Entity<AlbumTracks>()
                        .HasKey(albumTrack => albumTrack.Id);

            modelBuilder.Entity<AlbumTracks>()
                        .HasKey(albumTrack => new { albumTrack.AlbumId, albumTrack.TrackId });

            modelBuilder.Entity<AlbumTracks>()
                        .HasOne(albyTrack => albyTrack.Album)
                        .WithMany(albyTrack => albyTrack.AlbumTracks)
                        .HasForeignKey(albyTrack => albyTrack.AlbumId);

            modelBuilder.Entity<AlbumTracks>()
                       .HasOne(albyTrack => albyTrack.Track)
                       .WithMany(albyTrack => albyTrack.AlbumTracks)
                       .HasForeignKey(albyTrack => albyTrack.TrackId);

            #endregion

            #region PlaylistTracks
            modelBuilder.Entity<PlaylistTracks>()
                        .HasKey(pt => pt.Id);

            modelBuilder.Entity<PlaylistTracks>()
                        .HasOne(pt => pt.Playlist)
                        .WithMany(p => p.PlaylistTracks)
                        .HasForeignKey(pt => pt.PlaylistId);

            modelBuilder.Entity<PlaylistTracks>()
                        .HasOne(pt => pt.Track)
                        .WithMany(t => t.PlaylistTracks)
                        .HasForeignKey(pt => pt.TrackId);
            #endregion
        }
    }
}