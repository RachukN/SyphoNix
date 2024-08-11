namespace Core.DTOs.AccountUser
{
    public class ChangePasswordDTO
    {
        public string Email { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }

    }
}
