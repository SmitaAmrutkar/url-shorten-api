// controllers/urlController.js
const shortid = require('shortid');
const Url = require('../models/Url');

// POST /api/shorten
exports.shortenUrl = async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: 'Original URL is required' });
  }

  try {
    const existing = await Url.findOne({ originalUrl });
    if (existing) {
      return res.json(existing);
    }

    const shortId = shortid.generate();
    const shortUrl = `${req.protocol}://${req.get('host')}/${shortId}`;

    const newUrl = await Url.create({
      originalUrl,
      shortId,
      shortUrl,
    });

    res.status(201).json(newUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};

// GET /:shortId
exports.redirectUrl = async (req, res) => {
  const { shortId } = req.params;

  try {
    const url = await Url.findOne({ shortId });

    if (url) {
      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).json({ error: 'Short URL not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};
