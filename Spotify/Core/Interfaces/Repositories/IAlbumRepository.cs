using Core.DTOs.Album;
using Core.Entities;

namespace Core.Interfaces.Repository
{
    public interface IAlbumRepository
    {
        Task AddAsync(Album album);
        Task UpdateAsync(Album album);
        Task DeleteAsync(Album album);
        Task DeleteAsync(int id);
        Task<AlbumItemDTO> GetByIdAsync(int id);
        Task<IEnumerable<AlbumItemDTO>> GetAllAsync();
        Task SaveAsync();
    }
}