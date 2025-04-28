// api/receive-emotion.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { emotion, telegram_id } = req.body;

    // Пока просто консоль лог
    console.log('New emotion received:', emotion, 'from Telegram ID:', telegram_id);

    res.status(200).json({ message: 'Emotion received successfully!' });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

