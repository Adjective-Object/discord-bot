const { spawn } = require("child_process");

module.exports = {
  name: "restart",
  description: "restart the bot.",
  execute(message) {
    message.channel.send(`Restarting...`);
    spawn(process.argv0, process.argv.slice(1), { stdio: "inherit" });
    setTimeout(() => {
      process.exit(0);
    });
  },
};
