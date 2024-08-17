namespace Core.Resources.ConstRoutes
{
    public static class AlbumRoutes
    {
        private const string BASE = "api/album/";

        public const string GET_ALL = BASE + "all";
        public const string GET_BY_ID = BASE + "get/{id}";
        public const string GET_ALL_BY_PERFORMER_USERNAME = BASE + "allByUserName/{userName}";
        public const string GET_ALL_BY_GENRE_ID = BASE + "allByGenre/{genreId}";

        public const string CREATE = BASE + "create";
        public const string UPDATE = BASE + "update";
        public const string RECOVERY = BASE + "recovery/{id}";
        public const string DELETE = BASE + "delete/{id}";

        public const string ADD_TRACK_TO_ALBUM = BASE + "addTrackToAlbum/{trackId}/{albumId}";
        public const string DELETE_TRACK_TO_FROM_ALBUM = BASE + "deleteTrackFromAlbum/{trackId}/{albumId}";
    }
}