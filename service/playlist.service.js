const { PlaylistModel } = require("../schema");

module.exports = {
  CreatePlaylistService: async function (Request, Response) {
    const requestPayload = Request.request;

    const playlistExist = await PlaylistModel.findOne({
      playlistName: requestPayload?.playlistName,
    });

    if (Boolean(playlistExist)) {
      Response(null, {
        error: false,
        status: 0,
        message: `${requestPayload?.playlistName} is already existed.`,
      });

      return;
    }

    //--- if no playlist
    const newPlaylist = new PlaylistModel({
      userId: requestPayload?.userId,
      playlistName: requestPayload?.playlistName,
    });

    newPlaylist.save();

    const { _id, userId, playlistName, createdAt, updatedAt } = newPlaylist;

    Response(null, {
      error: false,
      status: 1,
      message: `${requestPayload?.playlistName} created successfully.`,
      data: {
        playlistId: _id,
        userId,
        playlistName,
        createAt: createdAt.toISOString(),
        updateAt: updatedAt.toISOString(),
      },
    });

    return;
  },
  UpdatePlaylistService: async function (Request, Response) {
    const requestPayload = Request.request;

    const findPlaylist = await PlaylistModel.findOne({
      _id: requestPayload?.playlistId,
    });

    console.log(findPlaylist);

    if (!Boolean(findPlaylist)) {
      Response(null, {
        error: false,
        status: 2,
        message: "Not found this playlist.",
      });
      return;
    }

    await PlaylistModel.updateOne(
      { _id: { $eq: requestPayload?.playlistId } },
      { $set: { playlistName: requestPayload?.playlistName } }
    );

    Response(null, {
      error: false,
      status: 1,
      message: `${requestPayload?.playlistName} is updated successfully.`,
    });

    return;
  },
  DeletePlaylistService: async function (Request, Response) {
    const requestPayload = Request.request;

    const findPlaylist = await PlaylistModel.findOne({
      _id: { $eq: requestPayload?.playlistId },
    });

    if (!Boolean(findPlaylist)) {
      Response(null, {
        error: false,
        status: 2,
        message: "Not found this playlist.",
      });
      return;
    }

    await PlaylistModel.deleteOne({ _id: { $eq: requestPayload?.playlistId } });

    Response(null, {
      error: false,
      status: 1,
      message: `${requestPayload?.playlistName} is deleted successfully.`,
    });
  },
  RetrievePlaylistService: async function (__, Response) {
    const data = (await PlaylistModel.find({})).map((x) => ({
      playlistId: x._id,
      playlistName: x.playlistName,
      userId: x.userId,
      updatedAt: x.updatedAt.toISOString(),
      createdAt: x.createdAt.toISOString(),
    }));

    Response(null, {
      error: false,
      status: 1,
      message: "Request Accept",
      data,
    });
  },
};
