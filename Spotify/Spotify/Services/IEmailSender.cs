using System.Threading.Tasks;

namespace Spotify.Services
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string email, string subject, string message);
    }
}