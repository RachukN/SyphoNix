using FluentValidation;
using Core.DTOs.Genre;
using Core.Services;

namespace Core.Validators.GenreValidation
{
    public class GenreUpdateValidator : AbstractValidator<GenreUpdateDTO>
    {
        private readonly GenreServices _genreServices;

        public GenreUpdateValidator(GenreServices genreServices)
        {
            _genreServices = genreServices;

            RuleFor(genre => genre.Id)
                .NotEmpty().WithMessage("Id is required!")
                .GreaterThan(0).WithMessage("Id cannot be negative or zero!")
                .Must(IsExistGenre).WithMessage("Genre with this ID does not exist!");

            RuleFor(genre => genre.Name)
                .NotEmpty().WithMessage("Name is required!")
                .MinimumLength(1).WithMessage("Name must be more than 1 character!")
                .MaximumLength(160).WithMessage("The maximum number of characters for name is 160!");
        }
        private bool IsExistGenre(int id) => _genreServices.IsExistGenre(id);
    }
}
