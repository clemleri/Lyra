import express from 'express';
import artistController from '../controller/artistController.mjs';

const router = express.Router();

// Route GET /artists
router.get('/top', async (req, res) => {
  try {
    // On récupère le token depuis l'en-tête Authorization (« Bearer token »)
    const access_token = req.session.access_token;
    if (!access_token) {
      return res.status(401).json({ error: "Accès non autorisé" });
    }
    const artists = await artistController.findAll(access_token);
    res.json(artists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /artists/top/popularity
// Récupère les top artistes et les trie par popularité décroissante
router.get('/top/popularity', async (req, res, next) => {
  try {
    const accessToken = req.session.access_token;
    const artists = await artistController.findAll(accessToken);
    artists.sort((a, b) => b.popularity - a.popularity);
    res.json(artists);
  } catch (error) {
    next(error);
  }
});

// GET /artists/top/genres
// Récupère les top artistes et les trie par le premier genre (ordre alphabétique)
router.get('/top/genres', async (req, res, next) => {
  try {
    const accessToken = req.session.access_token;
    const artists = await artistController.findAll(accessToken);
    artists.sort((a, b) => {
      const genreA = (a.genres[0] || '').toLowerCase();
      const genreB = (b.genres[0] || '').toLowerCase();
      return genreA.localeCompare(genreB);
    });
    res.json(artists);
  } catch (error) {
    next(error);
  }
});

// Route GET /artists/:artistId pour récupérer un artiste précis
router.get('/:artistId', async (req, res) => {
  try {
    const access_token = req.session.access_token;
    const artistId = req.params.artistId;
    // Ici, la méthode findArtist attend un tableau d’identifiants
    const artist = await artistController.findArtist([artistId], access_token);
    res.json(artist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route GET /artists/:artistId/albums pour récupérer les albums d’un artiste
router.get('/:artistId/albums', async (req, res) => {
  try {
    const access_token = req.session.access_token;
    const artistId = req.params.artistId;
    // Possibilité de préciser une limite via une query ?limit=...
    const limit = req.query.limit || 10;
    const albums = await artistController.findArtistAlbums(artistId, limit, access_token);
    res.json(albums);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route GET /artists/:artistId/top pour récupérer les meilleurs morceaux de l’artiste
router.get('/:artistId/top', async (req, res) => {
  try {
    const access_token = req.session.access_token;
    const artistId = req.params.artistId;
    const topTracks = await artistController.findTopArtist(artistId, access_token);
    res.json(topTracks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
