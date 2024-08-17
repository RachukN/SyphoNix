using System.Net;
using Core.Helpers;
using Core.Interfaces;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Core.Resources.ErrorMassages;
using Core.Resources.Constants;
using AutoMapper;
using Core.DTOs.Account;
using Core.DTOs.Identity;
using Core.DTOs.AccountUser;
using Core.DTOs.Playlist;
using Core.Interfaces.Repository;

namespace Core.Services
{
    public class AccountUserServices : IAccountUserServices
    {
        private readonly IMapper _mapper;
        private readonly IJwtTokenServices _jwtTokenService;
        private readonly IRepository<UserEntity> _repository;
        private readonly UserManager<UserEntity> _userManager;
        private readonly SignInManager<UserEntity> _signInManager;

        private readonly ITrackServices _trackServices;
        private readonly IAlbumServices _albumServices;
        private readonly IPlaylistServices _playlistServices;

        public AccountUserServices(IRepository<UserEntity> repository, UserManager<UserEntity> userManager, SignInManager<UserEntity> signInManager, IJwtTokenServices jwtTokenServices, IMapper mapper,
                                IAlbumServices albumServices, ITrackServices trackServices, IPlaylistServices playlistServices)
        {
            _mapper = mapper;
            _jwtTokenService = jwtTokenServices;
            _repository = repository;
            _userManager = userManager;
            _signInManager = signInManager;

            _trackServices = trackServices;
            _albumServices = albumServices;
            _playlistServices = playlistServices;
        }

        public async Task<TokenResponseDTO> SignUpAsync(SignUpItemDTO signUpItemDTO)
        {
            string uniqueVerifiacationCode = Guid.NewGuid().ToString();

            UserEntity user = new UserEntity()
            {
                FirstName=" ",
                LastName=" ",
                UserName = signUpItemDTO.UserName,
                PublicPerformerNickName = signUpItemDTO.UserName,
                Email = signUpItemDTO.Email,
                Image = "1.default-user-icon.jpg",
                AboutMe=" ",
                IsDeleted = false,
                IsBloked = false,
                IsVerified = false,
                UniqueVerifiacationCode = uniqueVerifiacationCode,
                DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                DateUpdated = null,
            };

            var result = await _userManager.CreateAsync(user, signUpItemDTO.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, Roles.User);
                await EmailWorker.SendWelcomeEmail(signUpItemDTO.Email);
                await EmailWorker.SendVerifyEmail(signUpItemDTO.Email, uniqueVerifiacationCode);

                PlaylistCreateDTO favoritePlaylist = new PlaylistCreateDTO()
                {
                    Title = "Пісні, що сподобались",
                    Image = "liked.jpg",
                    DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                    IsDeleted = false,
                    IsPublic = false,
                    IsExplicit = false,
                    UserName = user.UserName,
                };
                user.FavoritePlaylistCode = await _playlistServices.CreateAsync(favoritePlaylist);
                await _repository.SaveAsync();

            }
            else if (!result.Succeeded) {
                string errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new HttpExceptionWorker(errors, HttpStatusCode.BadRequest);
            }

            TokenResponseDTO response = new TokenResponseDTO()
            {
                Token = await _jwtTokenService.CreateTokenAsync(user)
            };

            return _mapper.Map<TokenResponseDTO>(response);
        }

        public async Task<TokenResponseDTO> SignUpViaGoogleAsync(string token)
        {
            var payload = await _jwtTokenService.VerifyGoogleToken(token);
            UserEntity user = await _userManager.FindByEmailAsync(payload.Email);

            if (user == null)
            {
                string uniqueVerifiacationCode = Guid.NewGuid().ToString();

                user = new UserEntity()
                {
                    FirstName = payload.GivenName,
                    LastName = payload.FamilyName,
                    UserName = payload.Email,
                    PublicPerformerNickName = payload.Name,
                    Email = payload.Email,
                    Image = payload.Picture ?? "1.default-user-icon.jpg",
                    AboutMe = payload.GivenName,
                    IsDeleted = false,
                    IsBloked = false,
                    IsVerified = payload.EmailVerified,
                    EmailConfirmed = payload.EmailVerified,
                    UniqueVerifiacationCode = uniqueVerifiacationCode,
                    DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                    DateUpdated = null,
                };

                var result = await _userManager.CreateAsync(user, uniqueVerifiacationCode);

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, Roles.User);
                    await EmailWorker.SendWelcomeEmail(payload.Email);

                    PlaylistCreateDTO favoritePlaylist = new PlaylistCreateDTO()
                    {
                        Title = "Пісні, що сподобались",
                        Image = "liked.jpg",
                        DateCreated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc),
                        IsDeleted = false,
                        IsPublic = false,
                        IsExplicit = false,
                        UserName = user.UserName,
                    };
                    user.FavoritePlaylistCode = await _playlistServices.CreateAsync(favoritePlaylist);
                    await _repository.SaveAsync();
                }
                else if (!result.Succeeded)
                {
                    string errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    throw new HttpExceptionWorker(errors, HttpStatusCode.BadRequest);
                }

                TokenResponseDTO response = new TokenResponseDTO()
                {
                    Token = await _jwtTokenService.CreateTokenAsync(user)
                };

                return _mapper.Map<TokenResponseDTO>(response);
            }
            else
            {
                if (!await _userManager.CheckPasswordAsync(user, user.UniqueVerifiacationCode))
                    throw new HttpExceptionWorker(HttpStatusCode.BadRequest);

                await _signInManager.SignInAsync(user, true);

                TokenResponseDTO response = new TokenResponseDTO()
                {
                    Token = await _jwtTokenService.CreateTokenAsync(user)
                };

                return _mapper.Map<TokenResponseDTO>(response);
            }
        }

        public async Task<TokenResponseDTO> SignInAsync(SignInItemDTO signInItemDTO)
        {
            UserEntity user = await _userManager.FindByEmailAsync(signInItemDTO.Email);
            if (user == null)
                 user = await _userManager.FindByNameAsync(signInItemDTO.Email) ?? throw new HttpExceptionWorker(signInItemDTO.Email + ErrorMassages.ItemNotFount, HttpStatusCode.NotFound);

            if (user == null || !await _userManager.CheckPasswordAsync(user, signInItemDTO.Password))
                throw new HttpExceptionWorker(HttpStatusCode.BadRequest);

            await _signInManager.SignInAsync(user, true);

            TokenResponseDTO response = new TokenResponseDTO()
            {
                Token = await _jwtTokenService.CreateTokenAsync(user)
            };

            return _mapper.Map<TokenResponseDTO>(response);
        }

        public async Task SignOutAsync()
        {
            await _signInManager.SignOutAsync();
        }

        public async Task SendResetPasswordEmailAsync(string userEmail)
        {
            UserEntity user = await _userManager.FindByEmailAsync(userEmail) ?? throw new HttpExceptionWorker(userEmail + ErrorMassages.ItemNotFount, HttpStatusCode.NotFound);
            if(user != null) await EmailWorker.SendResetPasswordEmailAsync(userEmail, user.UniqueVerifiacationCode);
        }

        public async Task ResetPasswordAsync(UpdateUserPassworditemDTO updateUserPassworditemDTO)
        {
            UserEntity user = await _userManager.FindByEmailAsync(updateUserPassworditemDTO.Email) ?? throw new HttpExceptionWorker(updateUserPassworditemDTO.Email + ErrorMassages.ItemNotFount, HttpStatusCode.NotFound);
            if (user.UniqueVerifiacationCode == updateUserPassworditemDTO.UniqueVerificationCode)
            {
                string resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
                IdentityResult resetResult = await _userManager.ResetPasswordAsync(user, resetToken, updateUserPassworditemDTO.NewPassword);
                if (!resetResult.Succeeded)
                    throw new HttpExceptionWorker(HttpStatusCode.BadRequest);
            }
        }

        public async Task ChangePasswordAsync(ChangePasswordDTO changePasswordDTO)
        {
            UserEntity user = await _userManager.FindByEmailAsync(changePasswordDTO.Email) ?? throw new HttpExceptionWorker(changePasswordDTO.Email + ErrorMassages.ItemNotFount, HttpStatusCode.NotFound);

            IdentityResult resetResult = await _userManager.ChangePasswordAsync(user, changePasswordDTO.OldPassword, changePasswordDTO.NewPassword);
            await _repository.SaveAsync();

            if (!resetResult.Succeeded)
               throw new HttpExceptionWorker(HttpStatusCode.BadRequest);
        }

        public async Task<bool> ConfirmUserEmailAsync(string userEmail, string userUniqueVerificationCode)
        {
            UserEntity user = await _userManager.FindByEmailAsync(userEmail) ?? throw new HttpExceptionWorker(userEmail + ErrorMassages.ItemNotFount, HttpStatusCode.NotFound);
            if (user.UniqueVerifiacationCode == userUniqueVerificationCode && user.EmailConfirmed != true)
            {
                user.EmailConfirmed = true;
                user.IsVerified = true;
                await _repository.SaveAsync();
                return true;
            }
            return false;
        }

        public async Task<TokenResponseDTO> UpdateUserAsync(UserUpdateDTO updateUserDTO)
        {
            await DataWorker.IsValidIdAsync(updateUserDTO.Id);
            UserEntity user = await _userManager.FindByIdAsync(Convert.ToString(updateUserDTO.Id)) ?? throw new HttpExceptionWorker(updateUserDTO.Email + ErrorMassages.ItemNotFount, HttpStatusCode.NotFound);

            user.Email = updateUserDTO.Email;
            user.NormalizedUserName = updateUserDTO.Email ?? string.Empty.ToUpper();
            user.FirstName = updateUserDTO.FirstName ?? string.Empty;
            user.LastName = updateUserDTO.LastName ?? string.Empty;
            user.UserName = updateUserDTO.UserName ?? string.Empty;
            user.AboutMe = updateUserDTO.AboutMe ?? string.Empty;
            user.PublicPerformerNickName = updateUserDTO.PublicPerformerNickName ?? string.Empty;
            user.DateUpdated = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
            if(user.Image != updateUserDTO.Image)
            {
                if(user.Image != "1.default-user-icon.jpg")
                    await ImageWorker.RemoveImageAsync(user.Image);

                user.Image = await ImageWorker.SaveImageAsync(updateUserDTO.Image);
            }

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                string errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new HttpExceptionWorker(errors, HttpStatusCode.BadRequest);
            }

            TokenResponseDTO response = new TokenResponseDTO()
            {
                Token = await _jwtTokenService.CreateTokenAsync(user)
            };

            return _mapper.Map<TokenResponseDTO>(response);
        }

        public async Task DeleteUserAsync(string userEmail, string userPassword)
        {
            UserEntity user = await _userManager.FindByEmailAsync(userEmail) ?? throw new HttpExceptionWorker(userEmail + ErrorMassages.ItemNotFount, HttpStatusCode.NotFound);
            if (user == null || !await _userManager.CheckPasswordAsync(user, userPassword)) throw new HttpExceptionWorker(ErrorMassages.BadCredentialsError, HttpStatusCode.BadRequest);

            var allTracks = await _trackServices.GetAllAsync();
            foreach (var track in allTracks.Where(track => track.PerformerUserName == user.UserName))
                await _trackServices.DeleteAsync(track.Id);

            var allAlbum = await _albumServices.GetAllAsync();
            foreach (var album in allAlbum.Where(album => album.UserName == user.UserName))
                await _albumServices.DeleteAsync(album.Id);

            var allPlaylists = await _playlistServices.GetAllAsync();
            foreach (var playlist in allPlaylists.Where(playlist => playlist.UserName == user.UserName))
                await _trackServices.DeleteAsync(playlist.Id);

            user.IsDeleted = true;

            await _repository.SaveAsync();
        }

        public async Task DeleteUserWithoutRecoveryAsync(string userEmail, string userPassword)
        {
            UserEntity user = await _userManager.FindByEmailAsync(userEmail) ?? throw new HttpExceptionWorker(userEmail + ErrorMassages.ItemNotFount, HttpStatusCode.NotFound);
            if (user == null || !await _userManager.CheckPasswordAsync(user, userPassword)) throw new HttpExceptionWorker(HttpStatusCode.BadRequest); // user must write his password in order to delete his account

            // Deleting all data which user uploaded, without the possibility of recovery
            // Deleting all tracks, which user uploaded
            var allTracks = await _trackServices.GetAllAsync();
            foreach (var track in allTracks.Where(track => track.PerformerUserName == user.UserName))
                await _trackServices.DeleteWithoutRecoveryAsync(track.Id);

            // Deleting all playlists, which users created (uploaded)
            var allPlaylists = await _playlistServices.GetAllAsync();
            foreach (var playlist in allPlaylists.Where(playlist => playlist.UserName == user.UserName))
                await _trackServices.DeleteWithoutRecoveryAsync(playlist.Id);

            // Deleting user's image
            await ImageWorker.RemoveImageAsync(user.Image);

            var result = await _userManager.DeleteAsync(user);

            if (!result.Succeeded)
            {
                string errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new HttpExceptionWorker(errors, HttpStatusCode.BadRequest);
            }
        }

        public async Task RecoveryUserAsync(string userEmail, string userPassword)
        {
            UserEntity user = await _userManager.FindByEmailAsync(userEmail) ?? throw new HttpExceptionWorker(userEmail + ErrorMassages.ItemNotFount, HttpStatusCode.NotFound);
            if (user == null || !await _userManager.CheckPasswordAsync(user, userPassword)) throw new HttpExceptionWorker(HttpStatusCode.BadRequest);

            var allTracks = await _trackServices.GetAllAsync();
            foreach (var track in allTracks.Where(track => track.PerformerUserName == user.UserName))
                await _trackServices.RecoveryAsync(track.Id);

            var allAlbum = await _albumServices.GetAllAsync();
            foreach (var album in allAlbum.Where(album => album.UserName == user.UserName))
                await _albumServices.RecoveryAsync(album.Id);

            var allPlaylists = await _playlistServices.GetAllAsync();
            foreach (var playlist in allPlaylists.Where(playlist => playlist.UserName == user.UserName))
                await _trackServices.RecoveryAsync(playlist.Id);

            user.IsDeleted = false;
            await _repository.SaveAsync();
        }

        public async Task<IEnumerable<UserEntity>> GetAllUsersAsync()
        {
            return _mapper.Map<IEnumerable<UserEntity>>(await _repository.GetAllAsync());
        }

        public async Task<UserEntity> GetUserByEmailAsync(string userEmail)
        {
            return _mapper.Map<UserEntity>(await _userManager.FindByEmailAsync(userEmail) ?? throw new HttpExceptionWorker(userEmail + ErrorMassages.ItemNotFount, HttpStatusCode.NotFound));
        }

        public async Task<UserEntity> GetUserByUsernameAsync(string userName)
        {
            return _mapper.Map<UserEntity>(await _userManager.FindByNameAsync(userName) ?? throw new HttpExceptionWorker(userName + ErrorMassages.ItemNotFount, HttpStatusCode.NotFound));
        }

        public async Task<UserEntity> GetUserByIdAsync(int userId)
        {
            await DataWorker.IsValidIdAsync(userId);

            return _mapper.Map<UserEntity>(await _repository.GetByIdAsync(userId) ?? throw new HttpExceptionWorker(userId + ErrorMassages.ItemNotFount, HttpStatusCode.NotFound));
        }
    }
}