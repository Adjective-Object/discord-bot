const ytdl = require("ytdl-core");
const ytpl = require("ytpl");
const play = require("../util/playNow");

module.exports = {
  name: "play",
  description: "Play a song in your channel!",
  async execute(message) {
    try {
      const args = message.content.split(" ");
      const queue = message.client.queue;

      async function queueSong(song) {
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue) {
          const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 1.2,
            playing: true,
          };

          queue.set(message.guild.id, queueConstruct);

          queueConstruct.songs.push(song);

          try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(message, queueConstruct.songs[0]);
          } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
          }
        } else {
          serverQueue.songs.push(song);
          return message.channel.send(
            `${song.title} has been added to the queue!`
          );
        }
      }

      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel)
        return message.channel.send(
          "You need to be in a voice channel to play music!"
        );
      const permissions = voiceChannel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
          "I need the permissions to join and speak in your voice channel!"
        );
      }

      const youTubeUrl = args[1];
      if (youTubeUrl.indexOf("list") !== -1) {
        message.channel.send("fetching playlist");
        // playlist
        const playlist = await ytpl(await ytpl.getPlaylistID(youTubeUrl));
        message.channel.send(
          `adding ${playlist.items.length} songs from ${playlist.title}`
        );

        const songs = playlist.items.map((playlistItem) => ({
          title: playlistItem.title,
          url: playlistItem.url,
        }));

        return await Promise.all(songs.map(queueSong));
      } else {
        const songInfo = await ytdl.getInfo(args[1]);
        const song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
        };

        return await queueSong(song);
      }
    } catch (error) {
      console.log(error);
      message.channel.send(error.message);
    }
  },
};
