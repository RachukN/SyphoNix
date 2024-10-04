using Microsoft.AspNetCore.Identity;

public class ApplicationUser : IdentityUser
{
    public int? BirthDay { get; set; }
    public string? BirthMonth { get; set; }
    public int? BirthYear { get; set; }
    public string? Country { get; set; }
    public string? Region { get; set; }
    public string? Gender { get; set; }
    public string? FullName { get; set; }
    public string AccessToken { get; set; } // Поле для збереження AccessToken
    public string RefreshToken { get; set; } // Поле для збереження RefreshToken, якщо потрібно
    public DateTime TokenExpiration { get; set; } // Поле для збереження часу закінчення токена
}

