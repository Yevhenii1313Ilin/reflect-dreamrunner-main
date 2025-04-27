
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

app.post('/receive-emotion', async (req, res) => {
  const { emotion, telegram_id } = req.body;

  try {
    const completion = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o',
      messages: [{ role: 'user', content: `На основе текста создай короткий эмоциональный ответ: "${emotion}"` }],
      temperature: 0.7,
      max_tokens: 100
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const aiAnswer = completion.data.choices[0].message.content;

    await axios.post(`${process.env.SUPABASE_URL}/rest/v1/ReflectLog`, {
      emotion,
      telegram_id,
      ai_answer: aiAnswer,
      created_at: new Date().toISOString()
    }, {
      headers: {
        'apikey': process.env.SUPABASE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }
    });

    res.status(200).json({ message: 'Emotion recorded successfully', aiAnswer });

  } catch (error) {
    console.error('Error processing emotion:', error.response?.data || error.message);
    res.status(500).json({ message: 'Something went wrong', error: error.response?.data || error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Reflect DreamRunner 2.0 server running on port ${PORT}`));


