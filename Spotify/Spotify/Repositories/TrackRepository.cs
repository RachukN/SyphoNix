using Microsoft.EntityFrameworkCore;
using Spotify.Data;
using Spotify.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Spotify.Repositories
{
    public class TrackRepository : ITrackRepository
    {
        private readonly ApplicationDbContext _context;

        public TrackRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Track>> GetAllTracksAsync()
        {
            return await _context.Tracks.ToListAsync();
        }
    }
}