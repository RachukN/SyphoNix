using Core.Interfaces;
using Core.Interfaces.Repositories;

namespace Core.Services
{
    public class SearchServices : ISearchServices
    {
        private readonly ISearchRepository _repository;
        public SearchServices(ISearchRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<SearchResult>> SearchAsync(string request)
        {
            var results = new List<SearchResult>();

            request = request.ToUpper();
            var users = await _repository.SearchUsers(request);
            results.AddRange(users.Select(user => new SearchResult { Entity = user, EntityType = "User" }));

            var albums = await _repository.SearchAlbums(request);
            results.AddRange(albums.Select(album => new SearchResult { Entity = album, EntityType = "Album" }));

            var playlists = await _repository.SearchPlaylists(request);
            results.AddRange(playlists.Select(playlist => new SearchResult { Entity = playlist, EntityType = "Playlist" }));

            var tracks = await _repository.SearchTracks(request);
            results.AddRange(tracks.Select(track => new SearchResult { Entity = track, EntityType = "Track" }));

            var genres = await _repository.SearchGenres(request);
            results.AddRange(genres.Select(genre => new SearchResult { Entity = genre, EntityType = "Genre" }));

            return results;
        }

        public class SearchResult
        {
            public object Entity { get; set; }
            public string EntityType { get; set; }
        }
    }
}
