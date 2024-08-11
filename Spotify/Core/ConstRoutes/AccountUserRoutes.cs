namespace Core.Resources.ConstRoutes
{
    public static class AccountUserRoutes
    {
        private const string BASE = "api/user/";

        public const string GET_ALL_USERS = BASE + "all";
        public const string GET_USER_BY_ID = BASE + "getById/{userId}";
        public const string GET_USER_BY_EMAIL = BASE + "getByEmail/{userEmail}";
        public const string GET_USER_BY_USERNAME = BASE + "getByUserName/{username}";
      
        public const string FACEBOOK_AUTH = BASE + "facebook-login";
        public const string GOOGLE_AUTH = BASE + "signup/google/{token}";
        public const string SIGN_UP = BASE + "signUp";
        public const string SIGN_IN = BASE + "signIn";
        public const string SIGN_OUT = BASE + "signOut";

        public const string UPDATE_USER_ACCOUNT = BASE + "update";
        public const string GET_RESET_PASSWORD_EMAIL = BASE + "getResetPasswordEmail/{userEmail}";
        public const string RESET_FORTGOT_PASSWORD = BASE + "resetPassword";
        public const string CHANGE_PASSWORD = BASE + "changePassword";
        public const string CONFIRM_EMAIL = BASE + "confirm/{userEmail}/{userUniqueVerificationCode}";
        public const string RECOVERY_USER_ACCOUNT = BASE + "recovery";
        public const string DELETE_USER_ACCOUNT = BASE + "delete";
        public const string DELETE_WITHOUT_RECOVERY_USER_ACCOUNT = BASE + "deleteWithoutRecovery";
    }
}