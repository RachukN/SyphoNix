using FluentValidation;
using Core.DTOs.Playlist;

namespace Core.Validators.PlaylistValidation
{
    public class PlaylistCreateValidator : AbstractValidator<PlaylistCreateDTO>
    {
        public PlaylistCreateValidator()
        {
            RuleFor(playlist => playlist.Title)
                .NotEmpty().WithMessage("Title is required!")
                .MinimumLength(1).WithMessage("Title must be more than 1 character!")
                .MaximumLength(160).WithMessage("The maximum number of characters for title is 160!");

            RuleFor(playlist => playlist.Description)
                .MinimumLength(5).WithMessage("Description must be more than 5 character!")
                .MaximumLength(240).WithMessage("The maximum number of characters for description is 240!");

            RuleFor(playlist => playlist.GenreId)
                .GreaterThan(0).WithMessage("Id cannot be negative or zero!");
        }
    }
}
