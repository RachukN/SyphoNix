namespace Core.Resources.ConstRoutes
{
    public static class TrackRoutes
    {
        private const string BASE = "api/track/";

        public const string GET_ALL = BASE + "all";
        public const string GET_BY_ID = BASE + "get/{id}";
        public const string GET_ALL_BY_GENRE_ID = BASE + "allByGenre/{genreId}";
        public const string GET_ALL_BY_USER = BASE + "allByUser/{username}";

        public const string CREATE = BASE + "create";
        public const string UPADATE = BASE + "update";
        public const string RECOVERY = BASE + "recovery/{id}";
        public const string DELETE = BASE + "delete/{id}";
        public const string DELETE_WITHOUT_RECOVERY = BASE + "deleteWithOutRecovery/{id}";
    }
}