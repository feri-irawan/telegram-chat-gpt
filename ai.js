const { OpenAIApi, Configuration } = require("openai");

// Init AI
const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_KEY,
  })
);

let prompt = "";

// Fungsi tanya sederhana
async function ask(question) {
  prompt += `Q:${question}\nA:`;

  // Batasi panjang prompt hingga 2048 (ini adalah maskimal yang sudah ditentukan Open AI untuk Chat GPT 3)
  if (prompt.length > 2048) prompt = prompt.slice(-2048);

  // Request ke AI
  const res = await openai.createCompletion({
    model: "text-davinci-002",
    max_tokens: 200,
    prompt,
  });

  // Parsing respon AI, ambil text-nya saja
  const reply = res.data.choices.map(({ text }) => text).join("\n");

  // Menambah prompt
  prompt += reply + "\n";

  return reply;
}

module.exports = {
  ask,
};
