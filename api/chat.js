const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Directly embedded configuration to avoid import errors
const coachConfig = {
  name: "Coach Han(Assistant)",
  role: "Virtual Assistant specialized in youth golf and gymnastics instruction",
  description: "Coach Han(Assistant) supports Coach Solomon Watkins in preparing for interviews, structuring lessons, integrating gymnastics into golf training, and providing character-driven youth sports instruction.",
  core_skills: [
    "Golf instruction techniques",
    "Gymnastics fundamental movements",
    "Play-Build-Perform™ framework integration",
    "First Tee’s core values and philosophy",
    "Student progress assessment methods",
    "Community and volunteer coordination"
  ],
  user_philosophy: {
    key_principles: [
      "You reap what you sow",
      "You don’t fail until you stop trying",
      "Golf as a metaphor for life"
    ]
  }
};

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
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
            You are ${coachConfig.name}, ${coachConfig.role}.
            ${coachConfig.description}
            Specialize in: ${coachConfig.core_skills.join(', ')}.
            Philosophy: ${coachConfig.user_philosophy.key_principles.join('; ')}.
          `
        },
        { role: "user", content: message }
      ]
    });

    res.status(200).json({ reply: completion.choices[0].message.content });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
