using FluentValidation;
using Core.DTOs.Genre;

namespace Core.Validators.GenreValidation
{
    public class GenreCreateValidator : AbstractValidator<GenreCreateDTO>
    {
        public GenreCreateValidator()
        {
            RuleFor(genre => genre.Name)
                .NotEmpty().WithMessage("Name is required!")
                .MinimumLength(1).WithMessage("Name must be more than 1 character!")
                .MaximumLength(160).WithMessage("The maximum number of characters for name is 160!");
        }
    }
}
