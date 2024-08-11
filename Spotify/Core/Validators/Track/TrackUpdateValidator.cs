using Core.DTOs.Track;
using Core.Services;
using FluentValidation;

namespace Core.Validators.TrackValidation
{
    public class TrackUpdateValidator : AbstractValidator<TrackUpdateDTO>
    {
        private readonly TrackServices _trackServices;
        public TrackUpdateValidator(TrackServices trackServices)
        {
            _trackServices = trackServices;

            RuleFor(track => track.Id)
                .NotEmpty().WithMessage("Id is required!")
                .GreaterThan(0).WithMessage("Id must be greater than zero!")
                .Must(IsExistTrack).WithMessage("Track with this ID does not exist!");

            RuleFor(track => track.Title)
                .NotEmpty().WithMessage("Title is required!")
                .MinimumLength(1).WithMessage("Title must be more than 1 character!")
                .MaximumLength(160).WithMessage("The maximum number of characters for title is 160!");

            RuleFor(track => track.Duration)
                .NotEmpty().WithMessage("Duration is required!")
                .GreaterThan(0).WithMessage("Duration must be greater than zero!");

            RuleFor(track => track.Image)
                .NotEmpty().WithMessage("Image is required!");
        }
        private bool IsExistTrack(int id) => _trackServices.IsExistTrack(id);
    }
}
