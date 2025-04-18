import express from 'express';
import trackController from '../controller/trackController.mjs';

const router = express.Router();

// Route GET /tracks/top/:time_range? pour récupérer les pistes les plus écoutées
router.get('/top/:time_range?', async (req, res) => {
  try {
    const access_token = req.session.access_token;;
    const time_range = req.params.time_range || 'medium_term';
    const limit = 50;
    const topTracks = await trackController.findTopTracks(access_token, time_range, limit);
    res.json(topTracks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route GET /tracks pour récupérer plusieurs pistes (en passant des IDs en query string, par exemple ?spotifyIDs=id1,id2,...)
router.get('/', async (req, res) => {
  try {
    const access_token = req.session.access_token;
    const spotifyIDs = req.query.spotifyIDs ? req.query.spotifyIDs.split(',') : [];
    if (spotifyIDs.length === 0) {
      return res.status(400).json({ error: "Aucun identifiant de piste fourni." });
    }
    const tracks = await trackController.findTracks(access_token, spotifyIDs);
    res.json(tracks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route GET /tracks/history pour récupérer l'historiques d'écoutes de l'utilisateur 
router.get('/history', async (req, res) => {
  try {
    const access_token = req.session.access_token;
    const allTracks = await trackController.findTrackHistory(access_token);

    console.log("routes tracks/history appelée")

    res.json(allTracks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route GET /tracks/:spotifyID pour récupérer les détails d'une piste
router.get('/:spotifyID', async (req, res) => {
  try {
    const access_token = req.session.access_token;
    const spotifyID = req.params.spotifyID;
    const track = await trackController.findTrack(access_token, spotifyID);
    res.json(track);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route GET /tracks/:spotifyID/audio-features pour récupérer les caractéristiques audio d'une piste
router.get('/:spotifyID/audio-features', async (req, res) => {
  try {
    const access_token = req.session.access_token;
    const spotifyID = req.params.spotifyID;
    const audioFeatures = await trackController.findTrackAudioFeatures(access_token, spotifyID);
    res.json(audioFeatures);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
