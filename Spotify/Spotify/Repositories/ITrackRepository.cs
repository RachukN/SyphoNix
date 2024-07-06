using Spotify.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Spotify.Repositories
{
    public interface ITrackRepository
    {
        Task<IEnumerable<Track>> GetAllTracksAsync();
    }
}
