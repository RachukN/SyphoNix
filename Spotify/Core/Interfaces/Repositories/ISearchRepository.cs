using Core.Entities;
using Core.Entities.Identity;

namespace Core.Interfaces.Repositories
{
    public interface ISearchRepository
    {
        Task<List<UserEntity>> SearchUsers(string request);
        Task<List<Album>> SearchAlbums(string request);
        Task<List<Playlist>> SearchPlaylists(string request);
        Task<List<Track>> SearchTracks(string request);
        Task<List<Genre>> SearchGenres(string request);
    }
}