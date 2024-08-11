using FluentValidation;
using Core.DTOs.Album;
using Core.Services;

namespace Core.Validators.Album
{
    public class AlbumUpdateValidator : AbstractValidator<AlbumUpdateDTO>
    {
        private readonly AlbumServices _albumServices;
        public AlbumUpdateValidator(AlbumServices albumServices)
        {
            _albumServices = albumServices;

            RuleFor(album => album.Id)
                .NotEmpty().WithMessage("Id is required!")
                .GreaterThan(0).WithMessage("Id cannot be negative or zero!")
                .Must(IsExistAlbum).WithMessage("Album with this ID does not exist!");

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
        private bool IsExistAlbum(int id) => _albumServices.IsExistAlbum(id);
    }
}
