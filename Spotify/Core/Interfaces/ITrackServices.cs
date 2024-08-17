using Core.DTOs.Track;

namespace Core.Interfaces
{
    public interface ITrackServices
    {
        Task<TrackItemDTO> GetByIdAsync(int id);
        Task<IEnumerable<TrackItemDTO>> GetAllAsync();
        Task<IEnumerable<TrackItemDTO>> GetAllByGenreIdAsync(int genreId);
        Task<IEnumerable<TrackItemDTO>> GetAllByUserAsync(string username);

        Task CreateAsync(TrackCreateDTO trackCreateDTO);
        Task UpdateTrackDataAsync(TrackUpdateDTO trackUpdateDTO);
        Task RecoveryAsync(int id);
        Task DeleteAsync(int id);
        Task DeleteWithoutRecoveryAsync(int id);
    }
}