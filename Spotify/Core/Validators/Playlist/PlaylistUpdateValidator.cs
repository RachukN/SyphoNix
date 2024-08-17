using FluentValidation;
using Core.DTOs.Playlist;
using Core.Services;

namespace Core.Validators.PlaylistValidation
{
    public class PlaylistUpdateValidator : AbstractValidator<PlaylistUpdateDTO>
    {
        private readonly PlaylistServices _playlistServices;

        public PlaylistUpdateValidator(PlaylistServices playlistServices)
        {
            _playlistServices = playlistServices;

            RuleFor(playlist => playlist.Id)
                .NotNull().WithMessage("Id is required!")
                .GreaterThan(0).WithMessage("Id must be greater than zero!")
                .Must(IsExistPlaylist).WithMessage("Genre with this ID does not exist!");

            RuleFor(playlist => playlist.Title)
                .NotEmpty().WithMessage("Title is required!")
                .MinimumLength(1).WithMessage("Title must be more than 1 character!")
                .MaximumLength(160).WithMessage("The maximum number of characters for title is 160!");

            RuleFor(playlist => playlist.Description)
                .MinimumLength(5).WithMessage("Description must be more than 5 character!")
                .MaximumLength(240).WithMessage("The maximum number of characters for description is 240!");

            RuleFor(playlist => playlist.Duration)
                .NotEmpty().WithMessage("Duration is required!")
                .GreaterThan(0).WithMessage("Duration must be greater than zero!");

            RuleFor(playlist => playlist.GenreId)
                .GreaterThan(0).WithMessage("Genre ID must be greater than zero!");
        }
        private bool IsExistPlaylist(int id) => _playlistServices.IsExistPlaylist(id);
    }
}
