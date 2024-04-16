const { PlaylistPodcastModel } = require("../schema");

module.exports = {
  AddPodcastToPlaylistService: async function (Request, Response) {
    const { userId, playlistId, podcastId } = Request?.request;

    const podcastExistInPlaylist = await PlaylistPodcastModel.findOne(
      {
        $and: [
          {
            userId: userId,
            podcastId: podcastId,
            playlistId: playlistId,
          },
        ],
      },
      {
        userId: userId,
        podcastId: podcastId,
        playlistId: playlistId,
      }
    );

    if (Boolean(podcastExistInPlaylist)) {
      Response(null, {
        error: false,
        message: "Podcast has already in this playlist",
        status: 0,
      });

      return;
    }

    const addedPodcast = new PlaylistPodcastModel({
      userId,
      podcastId,
      playlistId,
    });

    addedPodcast.save();

    Response(null, {
      error: false,
      message: "This podcast is added this the playlist.",
      status: 1,
    });

    return;
  },
  RemovePodcastFromPlaylistService: async function (Request, Response) {
    const { userId, playlistId, podcastId } = Request?.request;

    const podcastExistInPlaylist = await PlaylistPodcastModel.findOne(
      {
        $and: [
          {
            userId: userId,
            podcastId: podcastId,
            playlistId: playlistId,
          },
        ],
      },
      {
        userId: userId,
        podcastId: podcastId,
        playlistId: playlistId,
      }
    );

    if (!Boolean(podcastExistInPlaylist)) {
      Response(null, {
        error: false,
        message: "There is no podcast to be deleted.",
        status: 2,
      });
      return;
    }

    await PlaylistPodcastModel.deleteOne({
      $and: [
        {
          userId: { $eq: userId },
          playlistId: { $eq: playlistId },
          podcastId: { $eq: podcastId },
        },
      ],
    });

    Response(null, {
      error: false,
      message: "This podcast is removed",
      status: 1,
    });

    return;
  },
  RetrievePodcastsFromPlaylistsService: async function (Request, Response) {
    const { userId, playlistId } = Request?.request;

    const data = (
      await PlaylistPodcastModel.find({
        $and: [
          {
            userId,
            playlistId,
          },
        ],
      })
    ).map((x) => ({
      userId: x.userId,
      playlistId: x.playlistId,
      podcastId: x.podcastId,
      createdAt: x.createdAt.toISOString(),
      updatedAt: x.updatedAt.toISOString(),
    }));

    Response(null, {
      error: false,
      message: "Request Accept",
      status: 1,
      data,
    });

    return;
  },
};
