const express = require('express');
const fetch = require('node-fetch');
const { createCanvas, loadImage } = require('canvas');

const app = express();
app.use(express.json({ limit: '10mb' }));

app.post('/pad', async (req, res) => {
  try {
    const imageUrl = req.body.imageUrl;
    if (!imageUrl) return res.status(400).json({ error: 'Missing imageUrl' });

    const img = await loadImage(imageUrl);
    const size = 1600;
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // White background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);

    // Calculate image position & scale (centered, no stretch)
    const scale = Math.min(size / img.width, size / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (size - w) / 2;
    const y = (size - h) / 2;

    ctx.drawImage(img, x, y, w, h);

    // Return base64 PNG string
    const base64Image = canvas.toDataURL('image/png');
    res.json({ base64Image });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Use PORT environment variable or 3000 fallback
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Padding API running on port ${PORT}`));
