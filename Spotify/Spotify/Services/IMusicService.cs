using Spotify.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Spotify.Services
{
    public interface IMusicService
    {
        Task<IEnumerable<Track>> GetTracksAsync();
    }
}
