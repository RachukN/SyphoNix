using FluentValidation;
using Core.DTOs.Track;

namespace Core.Validators.TrackValidation
{
    public class TrackCreateValidator : AbstractValidator<TrackCreateDTO>
    {
        public TrackCreateValidator()
        {
            RuleFor(track => track.Title)
                .NotEmpty().WithMessage("Title is required!")
                .MinimumLength(1).WithMessage("Title must be more than 1 character!")
                .MaximumLength(160).WithMessage("The maximum number of characters for title is 160!");

            RuleFor(track => track.Track)
               .NotEmpty().WithMessage("Track or another music file is required!");

            RuleFor(track => track.Image)
                .NotEmpty().WithMessage("Image is required!");

            RuleFor(track => track.GenreId)
                .GreaterThan(0).WithMessage("Genre ID must be greater than zero!");
        }
    }
}
