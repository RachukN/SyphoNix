using System.Net;
using AutoMapper;
using Core.DTOs.Track;
using Core.Entities;
using Core.Entities.Identity;
using Core.Helpers;
using Core.Interfaces;
using Core.Interfaces.Repository;
using Core.Resources.ErrorMassages;
using Microsoft.AspNetCore.Identity;

namespace Core.Services
{
    public class TrackServices : ITrackServices
    {
        private readonly IMapper _mapper;
        private readonly IRepository<Track> _repository;
        private readonly UserManager<UserEntity> _userManager;

        public TrackServices(IRepository<Track> repository, IMapper mapper, UserManager<UserEntity> userManager)
        {
            _mapper = mapper;
            _repository = repository;
            _userManager = userManager;
        }

        public async Task CreateAsync(TrackCreateDTO trackCreateDTO)
        {
            var user = await _userManager.FindByNameAsync(trackCreateDTO.PerformerUserName) ?? throw new HttpExceptionWorker(trackCreateDTO.PerformerUserName + ErrorMassages.ItemNotFount, HttpStatusCode.NotFound);
            
            var nameSavedImage = await ImageWorker.SaveImageAsync(trackCreateDTO.Image);
            var infoSavedTrack = await TrackWorker.SaveTrackAsync(trackCreateDTO.Track);

            trackCreateDTO.NormalizedTitle = trackCreateDTO.Title.ToUpper();
            trackCreateDTO.PerformerUserName = user.UserName;
            trackCreateDTO.Image = nameSavedImage;
            trackCreateDTO.Path = infoSavedTrack.FileName;
            trackCreateDTO.Duration = infoSavedTrack.Duration;
            trackCreateDTO.PublicPerformerNickName = user.PublicPerformerNickName;
            trackCreateDTO.DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);

            await _repository.AddAsync(_mapper.Map<Track>(trackCreateDTO));
            await _repository.SaveAsync();
        }

        public async Task UpdateTrackDataAsync(TrackUpdateDTO trackUpdateDTO)
        {
            var track = await _repository.GetByIdAsync(trackUpdateDTO.Id) ?? throw new HttpExceptionWorker(ErrorMassages.IdValueError, HttpStatusCode.NotFound);

            await ImageWorker.RemoveImageAsync(track.Image);
            track.NormalizedTitle = trackUpdateDTO.Title.ToUpper();
            track.Image = await ImageWorker.SaveImageAsync(trackUpdateDTO.Image);
            track.DateUpdated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);

            _mapper.Map(trackUpdateDTO, track);
            await _repository.UpdateAsync(track);
            await _repository.SaveAsync();
        }

        public async Task RecoveryAsync(int id)
        {
            await DataWorker.IsValidIdAsync(id);
            var track = await _repository.GetByIdAsync(id) ?? throw new HttpExceptionWorker(HttpStatusCode.NotFound);
            track.IsDeleted = false;
            await _repository.SaveAsync();
        }

        public async Task DeleteAsync(int id)
        {
            await DataWorker.IsValidIdAsync(id);
            var track = await _repository.GetByIdAsync(id) ?? throw new HttpExceptionWorker(HttpStatusCode.NotFound);
            track.IsDeleted = true;
            await _repository.SaveAsync();
        }

        public async Task DeleteWithoutRecoveryAsync(int id)
        {
            await DataWorker.IsValidIdAsync(id);
            var track = await _repository.GetByIdAsync(id) ?? throw new HttpExceptionWorker(HttpStatusCode.NotFound);

            await ImageWorker.RemoveImageAsync(track.Image);
            await TrackWorker.RemoveTrackAsync(track.Path);
            _repository.DeleteByEntity(track);

            await _repository.SaveAsync();
        }

        public async Task<TrackItemDTO> GetByIdAsync(int id)
        {
            await DataWorker.IsValidIdAsync(id);

            var track = await _repository.GetByIdAsync(id) ?? throw new HttpExceptionWorker(HttpStatusCode.NotFound);
            if (track.IsDeleted == false)
                return _mapper.Map<TrackItemDTO>(track);

            return null;
        }

        public async Task<IEnumerable<TrackItemDTO>> GetAllAsync()
        {
            return _mapper.Map<IEnumerable<TrackItemDTO>>(await _repository.GetAllAsync());
        }

        public async Task<IEnumerable<TrackItemDTO>> GetAllByGenreIdAsync(int genreId)
        {
            var tracks = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<TrackItemDTO>>(tracks.Where(track => track.GenreId == genreId)
                                                                .Where(track => track.IsDeleted == false));
        }

        public async Task<IEnumerable<TrackItemDTO>> GetAllByUserAsync(string username)
        {
            var user = await _userManager.FindByNameAsync(username) ?? throw new HttpExceptionWorker(username + ErrorMassages.ItemNotFount, HttpStatusCode.NotFound);

            var tracks = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<TrackItemDTO>>(tracks.Where(track => track.PerformerUserName == user.UserName)
                                                                .Where(track => track.IsDeleted == false));
        }

        public bool IsExistTrack(int id)
        {
            var result = _repository.GetByIdAsync(id).Result;
            return result != null;
        }
    }
}