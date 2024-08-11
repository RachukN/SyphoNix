using System.Net;
using AutoMapper;
using Core.DTOs.Album;
using Core.Entities;
using Core.Entities.Identity;
using Core.Resources.ErrorMassages;
using Core.Helpers;
using Core.Interfaces;
using Microsoft.AspNetCore.Identity;
using Core.Interfaces.Repository;

namespace Core.Services
{
    public class AlbumServices : IAlbumServices
    {
        private readonly IMapper _mapper;
        private readonly IRepository<AlbumTracks> _albumTracksRepository;
        private readonly IAlbumRepository _repository;

        private readonly UserManager<UserEntity> _userManager;

        public AlbumServices(IAlbumRepository repository, IRepository<AlbumTracks> albumTracksRepository, IMapper mapper, UserManager<UserEntity> userManager)
        {
            _mapper = mapper;
            _repository = repository;
            _albumTracksRepository = albumTracksRepository;
            _userManager = userManager;
        }

        public async Task CreateAsync(AlbumCreateDTO albumCreateDTO)
        {
            var user = await _userManager.FindByNameAsync(albumCreateDTO.UserName) ?? throw new HttpExceptionWorker(albumCreateDTO.UserName + ErrorMassages.ItemNotFount, HttpStatusCode.NotFound);
            albumCreateDTO.UserName = user.UserName;
            albumCreateDTO.NormalizedTitle = albumCreateDTO.Title.ToUpper();
            albumCreateDTO.Image = await ImageWorker.SaveImageAsync(albumCreateDTO.Image);
            albumCreateDTO.DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);

            await _repository.AddAsync(_mapper.Map<Album>(albumCreateDTO));
            await _repository.SaveAsync();
        }

        public async Task UpdateAsync(AlbumUpdateDTO albumUpdateDTO)
        {
            var album = await _repository.GetByIdAsync(albumUpdateDTO.Id) ?? throw new HttpExceptionWorker(HttpStatusCode.NotFound);

            await ImageWorker.RemoveImageAsync(albumUpdateDTO.Image);
            album.Image = await ImageWorker.SaveImageAsync(albumUpdateDTO.Image);
            album.DateUpdated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
            album.NormalizedTitle = albumUpdateDTO.Title.ToUpper();

            _mapper.Map(albumUpdateDTO, album);
            //await _repository.UpdateAsync(album);
            await _repository.SaveAsync();
        }

        public async Task RecoveryAsync(int id)
        {
            await DataWorker.IsValidIdAsync(id);
            var album = await _repository.GetByIdAsync(id) ?? throw new HttpExceptionWorker(HttpStatusCode.NotFound);

            album.IsDeleted = false;
            await _repository.SaveAsync();
        }

        public async Task DeleteAsync(int id)
        {
            await DataWorker.IsValidIdAsync(id);
            var album = await _repository.GetByIdAsync(id) ?? throw new HttpExceptionWorker(HttpStatusCode.NotFound);
            album.IsDeleted = true;
            await _repository.SaveAsync();
        }

        public async Task<IEnumerable<AlbumItemDTO>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<AlbumItemDTO> GetByIdAsync(int id)
        {
            await DataWorker.IsValidIdAsync(id);
            var album = await _repository.GetByIdAsync(id) ?? throw new HttpExceptionWorker(HttpStatusCode.NotFound);
            if (album.IsDeleted == false)
                return album;

            return null;
        }

        public async Task<IEnumerable<AlbumItemDTO>> GetAllByGenreIdAsync(int genreId)
        {
            await DataWorker.IsValidIdAsync(genreId);
            var albums = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<AlbumItemDTO>>(albums.Where(album => album.GenreId == genreId)
                                                                .Where(album => album.IsDeleted == false));
        }

        public async Task<IEnumerable<AlbumItemDTO>> GetAllByUserNameAsync(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName) ?? throw new HttpExceptionWorker(userName + ErrorMassages.ItemNotFount, HttpStatusCode.NotFound);

            var albums = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<AlbumItemDTO>>(albums.Where(albom => albom.UserName == user.UserName)
                                                                .Where(album => album.IsDeleted == false));
        }

        public async Task AddTrackToAlbumAsync(int trackId, int albumId)
        {
            AlbumTracks connection = new AlbumTracks()
            {
                AlbumId = albumId,
                TrackId = trackId,
            };

            await _albumTracksRepository.AddAsync(connection);
            await _albumTracksRepository.SaveAsync();
        }

        public async Task DeleteTrackFromAlbumAsync(int trackId, int albumId)
        {
            var connections = await _albumTracksRepository.GetAllAsync();
            _albumTracksRepository.DeleteByEntity(connections.Where(c => c.AlbumId == albumId).First(c => c.TrackId == trackId));
            await _albumTracksRepository.SaveAsync();
        }

        public bool IsExistAlbum(int id)
        {
            var result = _repository.GetByIdAsync(id).Result;
            return result != null;
        }
    }
}