using Spotify.Models;
using Spotify.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Spotify.Services
{
    public class MusicService : IMusicService
    {
        private readonly ITrackRepository _trackRepository;

        public MusicService(ITrackRepository trackRepository)
        {
            _trackRepository = trackRepository;
        }

        public async Task<IEnumerable<Track>> GetTracksAsync()
        {
            return await _trackRepository.GetAllTracksAsync();
        }
    }
}