const ytdl = require("ytdl-core");

// @ts-check
module.exports = function play(message, song) {
  const queue = message.client.queue;
  const guild = message.guild;
  const serverQueue = queue.get(message.guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(message, serverQueue.songs[0]);
    })
    .on("error", (error) => {
      serverQueue.songs.shift();
      serverQueue.textChannel.send(
        `Error playing: **${song.title}**, skipping`
      );
      console.error(error);
    });
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
};
