using Core.DTOs.Playlist;

namespace Core.Interfaces
{
    public interface IPlaylistServices
    {
        Task<PlaylistItemDTO> GetByIdAsync(int id);
        Task<IEnumerable<PlaylistItemDTO>> GetAllAsync();
        Task<IEnumerable<PlaylistItemDTO>> GetAllByUserName(string userName);

        Task<int> CreateAsync(PlaylistCreateDTO playlistCreateDTO);
        Task UpdateAsync(PlaylistUpdateDTO playlistUpdateDTO);
        Task RecoveryAsync(int id);
        Task DeleteAsync(int id);

        Task AddTrackToPlaylistAsync(int trackId, int playlistId);
        Task DeleteTrackFromPlaylistAsync(int trackId, int playlistId);
    }
}