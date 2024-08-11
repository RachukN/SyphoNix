namespace Core.DTOs.AccountUser
{
    public class UpdateUserPassworditemDTO
    {
        public string Email { get; set; }
        public string UniqueVerificationCode { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmNewPassword { get; set; }
    }
}