using FluentValidation;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Core.DTOs.Identity;

namespace Core.Validators
{
    public class SignUpValidator : AbstractValidator<SignUpItemDTO>
    {
        private readonly UserManager<UserEntity> _userManager;

        public SignUpValidator(UserManager<UserEntity> userManager)
        {
            _userManager = userManager;
            RuleFor(signUp => signUp.UserName)
                .NotEmpty().WithMessage("UserName is required!")
                .Matches(@"^[a-zA-Z0-9_.]+$").WithMessage("Username can contain only digits, Latin letters, dots, and underscores.");

            RuleFor(signUp => signUp.Email)
                .NotEmpty().WithMessage("Email is required!")
                .EmailAddress().WithMessage("Email not valid!")
                .DependentRules(() => { RuleFor(signUp => signUp.Email).Must(BeUniqueEmail).WithMessage("The email is alredy taken!"); });

            RuleFor(signUp => signUp.Password)
                .NotEmpty().WithName("Password").WithMessage("Password is required !")
                .MinimumLength(8).WithName("Password").WithMessage("Password must contain at least 8 characters!")
                .Matches("[A-Z]").WithName("Password").WithMessage("Password must contain one or more capital letters!")
                .Matches("[a-z]").WithName("Password").WithMessage("Password must contain one or more lowercase letters!")
                .Matches(@"\d").WithName("Password").WithMessage("Password must contain one or more digits!")
                .Matches(@"[][""!@$%^&*(){}:;<>,.?/+_=|'~\\-]").WithName("Password").WithMessage("Password must contain one or more special characters!");
        }
        private bool BeUniqueEmail(string email) => _userManager.FindByEmailAsync(email).Result == null;
    }
}