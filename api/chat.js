const OpenAI = require("openai");
const coachConfig = require('../coachgpt-config.json');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.status(200).send('ok');
    return;
  }

  const { message } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: `
          You are ${coachConfig.name}, ${coachConfig.role}.
          ${coachConfig.description}.
          Specialize in: ${coachConfig.core_skills.join(', ')}.
          Philosophy: ${coachConfig.user_philosophy.key_principles.join('; ')}.
        `},
        { role: "user", content: message }
      ],
      model: "gpt-3.5-turbo",
    });

    res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
