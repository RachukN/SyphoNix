using FluentValidation;
using Core.DTOs.Album;

namespace Core.Validators.Album
{
    public class AlbumCreateValidator : AbstractValidator<AlbumCreateDTO>
    {
        public AlbumCreateValidator()
        {
            RuleFor(album => album.Title)
                .NotEmpty().WithMessage("Title is required!")
                .MinimumLength(1).WithMessage("Title must be more than 1 character!")
                .MaximumLength(160).WithMessage("The maximum number of characters for title is 160!");

            RuleFor(album => album.GenreId)
                .GreaterThan(0).WithMessage("Genre ID cannot be negative or zero!");

            RuleFor(album => album.Description)
                .MinimumLength(5).WithMessage("Description must be more than 5 character!")
                .MaximumLength(240).WithMessage("The maximum number of characters for description is 240!");
        }
    }
}
