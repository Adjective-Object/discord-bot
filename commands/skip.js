const play = require("../util/playNow");

module.exports = {
  name: "skip",
  description: "Skip a song!",
  execute(message) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );
    if (!serverQueue)
      return message.channel.send("There is no song that I could skip!");
    if (!serverQueue.connection.dispatcher) {
      message.channel.send(
        "There was no connection to close early. Trying to play next song."
      );
      serverQueue.songs.shift();
      play(message, serverQueue.songs[0]);
    } else {
      serverQueue.connection.dispatcher.end();
    }
  },
};
