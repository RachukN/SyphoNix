using System.Net;
using AutoMapper;
using Core.DTOs.Playlist;
using Core.Entities;
using Core.Helpers;
using Core.Interfaces;
using Core.Interfaces.Repository;

namespace Core.Services
{
    public class PlaylistServices : IPlaylistServices
    {
        private readonly IMapper _mapper;
        private readonly IRepository<PlaylistTracks> _playlistTracksRepository;
        private readonly IPlaylistRepository _repository;

        public PlaylistServices(IPlaylistRepository repository, IMapper mapper, IRepository<PlaylistTracks> playlistTrackRepository)
        {
            _mapper = mapper;
            _repository = repository;
            _playlistTracksRepository = playlistTrackRepository;
        }

        public async Task<int> CreateAsync(PlaylistCreateDTO playlistCreateDTO)
        {
            playlistCreateDTO.Image = await ImageWorker.SaveImageAsync(playlistCreateDTO.Image);
            playlistCreateDTO.DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
            playlistCreateDTO.IsDeleted = false;
            playlistCreateDTO.NormalizedTitle = playlistCreateDTO.Title.ToUpper();

            var createdPlaylist = _mapper.Map<Playlist>(playlistCreateDTO);
            await _repository.AddAsync(createdPlaylist);
            await _repository.SaveAsync();

            return createdPlaylist.Id;
        }

        public async Task UpdateAsync(PlaylistUpdateDTO playlistUpdateDTO)
        {
            var playlist = await _repository.GetByIdAsync(playlistUpdateDTO.Id) ?? throw new HttpExceptionWorker(HttpStatusCode.NotFound);
            
            await ImageWorker.RemoveImageAsync(playlist.Image);
            playlist.Image = await ImageWorker.SaveImageAsync(playlistUpdateDTO.Image);
            playlist.DateUpdated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
            playlist.NormalizedTitle = playlistUpdateDTO.Title.ToUpper();

            _mapper.Map(playlistUpdateDTO, playlist);
            //await _repository.UpdateAsync(playlist);
            await _repository.SaveAsync();
        }

        public async Task RecoveryAsync(int id)
        {
            await DataWorker.IsValidIdAsync(id);
            var playlist = await _repository.GetByIdAsync(id) ?? throw new HttpExceptionWorker(HttpStatusCode.NotFound);
            playlist.IsDeleted = false;
            await _repository.SaveAsync();
        }

        public async Task DeleteAsync(int id)
        {
            await DataWorker.IsValidIdAsync(id);
            var playlist = await _repository.GetByIdAsync(id) ?? throw new HttpExceptionWorker(HttpStatusCode.NotFound);
            playlist.IsDeleted = true;
            await _repository.SaveAsync();
        }

        public async Task<IEnumerable<PlaylistItemDTO>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<PlaylistItemDTO> GetByIdAsync(int id)
        {
            await DataWorker.IsValidIdAsync(id);
            var playlist = await _repository.GetByIdAsync(id) ?? throw new HttpExceptionWorker(HttpStatusCode.NotFound);
            if (playlist.IsDeleted == false)
                return _mapper.Map<PlaylistItemDTO>(playlist);

            return null;
        }

        public async Task<IEnumerable<PlaylistItemDTO>> GetAllByUserName(string userName)
        {
            var playlists = await _repository.GetAllAsync();
            return playlists.Where(p => p.UserName == userName)
                            .Where(p => p.IsDeleted == false);
        }

        public async Task<IEnumerable<PlaylistItemDTO>> GetAllPublicAsync()
        {
            var playlists = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<PlaylistItemDTO>>(playlists.Where(playlists => playlists.IsPublic == true)
                                                                      .Where(playlist => playlist.IsDeleted == false));
        }

        public async Task AddTrackToPlaylistAsync(int trackId, int playlistId)
        {
            PlaylistTracks connection = new PlaylistTracks()
            {
                PlaylistId = playlistId,
                TrackId = trackId,
            };

            await _playlistTracksRepository.AddAsync(connection);
            await _playlistTracksRepository.SaveAsync();
        }

        public async Task DeleteTrackFromPlaylistAsync(int trackId, int playlistId)
        {
            var connections = await _playlistTracksRepository.GetAllAsync();
            _playlistTracksRepository.DeleteByEntity(connections.Where(c => c.TrackId == trackId).First(c => c.PlaylistId == playlistId));
            await _playlistTracksRepository.SaveAsync();
        }

        public bool IsExistPlaylist(int id)
        {
            var result = _repository.GetByIdAsync(id);
            return result != null;
        }
    }
}