using static Core.Services.SearchServices;

namespace Core.Interfaces
{
    public interface ISearchServices
    {
        Task<List<SearchResult>> SearchAsync(string request);
    }
}
