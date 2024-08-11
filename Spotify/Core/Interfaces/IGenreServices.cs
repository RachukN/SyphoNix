using Core.DTOs.Genre;

namespace Core.Interfaces
{
    public interface IGenreServices
    {
        Task<GenreItemDTO> GetByIdAsync(int id);
        Task<IEnumerable<GenreItemDTO>> GetAllAsync();

        Task CreateAsync(GenreCreateDTO genreCreateDTO);
        Task UpdateAsync(GenreUpdateDTO genreUpdaateDTO);
        Task RecoveryAsync(int id);
        Task DeleteAsync(int id);
        Task DeleteWithoutRecoveryAsync(int id);
    }
}