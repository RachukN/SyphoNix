using Core.DTOs.AccountUser;
using FluentValidation;

namespace Core.Validators.AccountUser
{
    public class UpdateUserPasswordValidator : AbstractValidator<UpdateUserPassworditemDTO>
    {
        public UpdateUserPasswordValidator()
        {
            RuleFor(updatePassword => updatePassword.Email)
                .NotEmpty().WithMessage("Email is required!")
                .EmailAddress().WithMessage("Email not valid!");

            RuleFor(updatePassword => updatePassword.NewPassword)
                .NotEmpty().WithName("Password").WithMessage("Password is required !")
                .MinimumLength(8).WithName("Password").WithMessage("Password must contain at least 8 characters!")
                .Matches("[A-Z]").WithName("Password").WithMessage("Password must contain one or more capital letters!")
                .Matches("[a-z]").WithName("Password").WithMessage("Password must contain one or more lowercase letters!")
                .Matches(@"\d").WithName("Password").WithMessage("Password must contain one or more digits!")
                .Matches(@"[][""!@$%^&*(){}:;<>,.?/+_=|'~\\-]").WithName("Password").WithMessage("Password must contain one or more special characters!");

            RuleFor(updatePassword => updatePassword.ConfirmNewPassword)
                .NotEmpty().WithMessage("Confirming password is required!")
                .Equal(updatePassword => updatePassword.NewPassword).WithMessage("Passwords do not match!");

            RuleFor(updatePassword => updatePassword.UniqueVerificationCode)
                .NotEmpty().WithMessage("Unique verification code is required!");
        }
    }
}
