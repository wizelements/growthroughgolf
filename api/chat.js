// api/chat.js
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.status(200).send('ok');
    return;
  }

  const { message } = req.body;

  if (!message) {
    res.status(400).json({ error: "No message provided" });
    return;
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You're CoachGPT, a helpful sports coach assistant specializing in youth golf, gymnastics instruction, and character development." },
                 { role: "user", content: message }],
      model: "gpt-3.5-turbo",
    });

    res.status(200).json({ reply: completion.choices[0].message.content });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
