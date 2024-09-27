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
}

