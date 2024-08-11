namespace Core.Resources.ConstRoutes
{
    public static class PlaylistRoutes
    {
        private const string BASE = "api/playlist/";

        public const string GET_ALL = BASE + "all";
        public const string GET_BY_ID = BASE + "get/{id}";
        public const string GET_ALL_BY_USERNAME = BASE + "allByUserName/{userName}";


        public const string CREATE = BASE + "create";
        public const string UPDATE = BASE + "update";
        public const string RECOVERY = BASE + "recovery/{id}";
        public const string DELETE = BASE + "delete/{id}";

        public const string ADD_TRACK_TO_PLAYLIST = BASE + "addTrackToPlaylist/{trackId}/{playlistId}";
        public const string DELETE_TRACK_FROM_PLAYLIST = BASE + "deleteTrackFromPlaylist/{trackId}/{playlistId}";
    }
}