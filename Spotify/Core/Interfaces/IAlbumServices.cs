using Core.DTOs.Album;

namespace Core.Interfaces
{
    public interface IAlbumServices
    {
        Task<IEnumerable<AlbumItemDTO>> GetAllAsync();
        Task<AlbumItemDTO> GetByIdAsync(int id);
        Task<IEnumerable<AlbumItemDTO>> GetAllByGenreIdAsync(int genreId);
        Task<IEnumerable<AlbumItemDTO>> GetAllByUserNameAsync(string userName);

        Task CreateAsync(AlbumCreateDTO albumCreateDTO);
        Task UpdateAsync(AlbumUpdateDTO albumUpdateDTO);
        Task RecoveryAsync(int id);
        Task DeleteAsync(int id);

        Task AddTrackToAlbumAsync(int trackId, int albumId);
        Task DeleteTrackFromAlbumAsync(int trackId, int albumId);
    }
}