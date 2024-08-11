using FluentValidation;
using Core.DTOs.AccountUser;

namespace Core.Validators.Account
{
    public class SignInValidator : AbstractValidator<SignInItemDTO>
    {
        public SignInValidator()
        {
            RuleFor(signIn => signIn.Email)
                .NotEmpty().WithMessage("Email or Username is required !");

            RuleFor(signIn => signIn.Password)
                .NotEmpty().WithName("Password").WithMessage("Password is required !")
                .MinimumLength(8).WithName("Password").WithMessage("Password must contain at least 8 characters!")
                .Matches("[A-Z]").WithName("Password").WithMessage("Password must contain one or more capital letters!")
                .Matches("[a-z]").WithName("Password").WithMessage("Password must contain one or more lowercase letters!")
                .Matches(@"\d").WithName("Password").WithMessage("Password must contain one or more digits!")
                .Matches(@"[][""!@$%^&*(){}:;<>,.?/+_=|'~\\-]").WithName("Password").WithMessage("Password must contain one or more special characters!");
        }
    }
}