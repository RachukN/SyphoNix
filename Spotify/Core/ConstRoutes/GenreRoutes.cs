namespace Core.Resources.ConstRoutes
{
    public static class GenreRoutes
    {
        private const string BASE = "api/genre/";

        public const string GET_ALL = BASE + "all";
        public const string GET_BY_ID = BASE + "get/{id}";

        public const string CREATE = BASE + "create";
        public const string UPDATE = BASE + "update";
        public const string RECOVERY = BASE + "recovery/{id}";
        public const string DELETE = BASE + "delete/{id}";
        public const string DELETE_WITHOUT_RECOVERY = BASE + "deleteWithoutRecovery/{id}";
    }
}