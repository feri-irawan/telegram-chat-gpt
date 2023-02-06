require("dotenv").config();

const { Bot, webhookCallback } = require("grammy");
const { ask } = require("./ai");
const express = require("express");

const { BOT_TOKEN, NODE_ENV, PORT } = process.env;

// Init bot
const bot = new Bot(BOT_TOKEN);

// On Message
bot.on("message", async (context) => {
  const { message } = context;
  const text = message.text;
  const type = message.chat.type;

  // Stop jika tipe chat bukan dm/private
  if (type !== "private") return;

  // Request ke AI
  const res = await ask(text);

  // Mengirim pesan balasan
  context.reply(res);
});

// Menjalankan server
if (NODE_ENV === "production") {
  // Meggunakan webhook untuk production
  const app = express();
  app.use(express.json());
  app.use(webhookCallback(bot, "express"));

  app.listen(PORT || 3000, () => {
    console.log(`Bot listening on port ${PORT}`);
  });
} else {
  // Menggunakan Long Polling untuk development
  bot.start();
}
