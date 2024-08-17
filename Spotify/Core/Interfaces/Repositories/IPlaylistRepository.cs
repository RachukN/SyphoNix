using Core.DTOs.Playlist;
using Core.Entities;

namespace Core.Interfaces.Repository
{
    public interface IPlaylistRepository
    {
        Task AddAsync(Playlist playlist);
        Task UpdateAsync(Playlist playlist);
        Task DeleteAsync(Playlist playlist);
        Task DeleteAsync(int id);
        Task<PlaylistItemDTO> GetByIdAsync(int id);
        Task<IEnumerable<PlaylistItemDTO>> GetAllAsync();
        Task SaveAsync();
    }
}