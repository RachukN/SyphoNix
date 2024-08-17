using FluentValidation;
using Core.DTOs.Account;

namespace Core.Validators.Account
{
    public class UpdateUserValidator : AbstractValidator<UserUpdateDTO>
    {
        public UpdateUserValidator()
        {
            RuleFor(user => user.Id)
                .NotEmpty().WithMessage("Id is required!")
                .GreaterThan(0).WithMessage("Id must be greater than zero!");

            RuleFor(updateUser => updateUser.FirstName)
                .MinimumLength(1).WithName("FirstName").WithMessage("FirsName must to be more than 1 symbols")
                .MaximumLength(160).WithName("FirstName").WithMessage("FirstName cannot be more than 160 symbols");

            RuleFor(updateUser => updateUser.LastName)
                .MinimumLength(1).WithName("LastName").WithMessage("LastName must to be more than 1 symbols")
                .MaximumLength(160).WithName("LastName").WithMessage("LastName cannot be more than 160 symbols");

            RuleFor(updateUser => updateUser.PublicPerformerNickName)
                .MinimumLength(1).WithName("PublicPerformerNickName").WithMessage("PublicPerformerNickName must to be more than 1 symbols")
                .MaximumLength(160).WithName("PublicPerformerNickName").WithMessage("PublicPerformerNickName cannot be more than 160 symbols");

            RuleFor(updateUser => updateUser.UserName)
                .NotEmpty().WithName("UserName").WithMessage("UserName is required!")
                .MinimumLength(1).WithName("UserName").WithMessage("UserName must to be more than 1 symbols")
                .MaximumLength(160).WithName("UserName").WithMessage("UserName cannot be more than 160 symbols");
            
            RuleFor(updateUser => updateUser.AboutMe)
                .MinimumLength(1).WithName("AboutMe").WithMessage("AboutMe must to be more than 5 symbols")
                .MaximumLength(240).WithName("AboutMe").WithMessage("AboutMe cannot be more than 240 symbols");

            RuleFor(updateUser => updateUser.Email)
                .NotEmpty().WithMessage("Email is required !")
                .EmailAddress().WithMessage("Email not valid!");

            RuleFor(updateUser => updateUser.Image)
                .NotEmpty().WithMessage("Image is required!");
        }
    }
}