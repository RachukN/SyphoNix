using System.Net;
using AutoMapper;
using Core.DTOs.Genre;
using Core.Entities;
using Core.Helpers;
using Core.Interfaces;
using Core.Interfaces.Repository;

namespace Core.Services
{
    public class GenreServices : IGenreServices
    {
        private readonly IMapper _mapper;
        private readonly IRepository<Genre> _repository;

        public GenreServices(IRepository<Genre> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task CreateAsync(GenreCreateDTO genreCreateDTO)
        {
            genreCreateDTO.DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
            genreCreateDTO.NormalizedName = genreCreateDTO.Name.ToUpper();
            await _repository.AddAsync(_mapper.Map<Genre>(genreCreateDTO));
            await _repository.SaveAsync();
        }

        public async Task UpdateAsync(GenreUpdateDTO genreUpdateDTO)
        {
            var genre = await _repository.GetByIdAsync(genreUpdateDTO.Id) ?? throw new HttpExceptionWorker(HttpStatusCode.NotFound);

            genreUpdateDTO.DateUpdated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
            genreUpdateDTO.NormalizedName = genreUpdateDTO.NormalizedName.ToUpper();

            _mapper.Map(genreUpdateDTO, genre);
            await _repository.UpdateAsync(genre);
            await _repository.SaveAsync();
        }

        public async Task RecoveryAsync(int id)
        {
            await DataWorker.IsValidIdAsync(id);
            var genre = await _repository.GetByIdAsync(id) ?? throw new HttpExceptionWorker(HttpStatusCode.NotFound);
            genre.IsDeleted = false;
            await _repository.SaveAsync();
        }

        public async Task DeleteAsync(int id)
        {
            await DataWorker.IsValidIdAsync(id);
            var genre = await _repository.GetByIdAsync(id) ?? throw new HttpExceptionWorker(HttpStatusCode.NotFound);
            genre.IsDeleted = true;
            await _repository.SaveAsync();
        }

        public async Task DeleteWithoutRecoveryAsync(int id)
        {
            await DataWorker.IsValidIdAsync(id);
            _repository.DeleteByEntity(await _repository.GetByIdAsync(id) ?? throw new HttpExceptionWorker(HttpStatusCode.NotFound));
            await _repository.SaveAsync();
        }

        public async Task<IEnumerable<GenreItemDTO>> GetAllAsync()
        {
            return _mapper.Map<IEnumerable<GenreItemDTO>>(await _repository.GetAllAsync());
        }

        public async Task<GenreItemDTO> GetByIdAsync(int id)
        {
            await DataWorker.IsValidIdAsync(id);
            var genre = await _repository.GetByIdAsync(id) ?? throw new HttpExceptionWorker(HttpStatusCode.NotFound);
            if (genre.IsDeleted == false)
                return _mapper.Map<GenreItemDTO>(genre);

            return null;
        }

        public bool IsExistGenre(int id)
        {
            var result = _repository.GetByIdAsync(id).Result;
            return result != null;
        }
    }
}