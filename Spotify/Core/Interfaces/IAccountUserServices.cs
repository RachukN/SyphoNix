using Core.DTOs.Account;
using Core.DTOs.AccountUser;
using Core.DTOs.Identity;
using Core.Entities.Identity;

namespace Core.Interfaces
{
    public interface IAccountUserServices
    {
        Task<IEnumerable<UserEntity>> GetAllUsersAsync();
        Task<UserEntity> GetUserByEmailAsync(string userEmail);
        Task<UserEntity> GetUserByUsernameAsync(string userName);
        Task<UserEntity> GetUserByIdAsync(int userId);

        Task<TokenResponseDTO> SignUpAsync(SignUpItemDTO signUpItemDTO);
        Task<TokenResponseDTO> SignInAsync(SignInItemDTO signInItemDTO);
        Task SignOutAsync();

        Task<TokenResponseDTO> SignUpViaGoogleAsync(string token);

        Task SendResetPasswordEmailAsync(string userEmail);
        Task ResetPasswordAsync(UpdateUserPassworditemDTO updateUserPassworditemDTO);
        Task ChangePasswordAsync(ChangePasswordDTO changePasswordDTO);
        Task<bool> ConfirmUserEmailAsync(string userEmail, string userUniqueVerificationCode);

        Task RecoveryUserAsync(string userEmail, string userPassword);
        Task<TokenResponseDTO> UpdateUserAsync(UserUpdateDTO userUpdateDTO);
        Task DeleteUserAsync(string userEmail, string userPassword);
        Task DeleteUserWithoutRecoveryAsync(string userEmail, string userPassword);
    }
}