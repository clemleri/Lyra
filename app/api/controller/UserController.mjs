import express from 'express';
import UserFetchDAO from '../dao/UserFetchDAO.mjs';

const router = express.Router();

// Route GET /user/profile pour récupérer le profil de l'utilisateur
router.get('/profile', async (req, res) => {
  try {
    const access_token = req.cookies.access_token
    const userProfile = await UserFetchDAO.getUserProfile(access_token);
    res.json(userProfile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route GET /user/followed-artists pour récupérer les artistes suivis par l'utilisateur
router.get('/followed-artists', async (req, res) => {
  try {
    const access_token = req.session.access_token;
    const artists = await UserFetchDAO.findFollowedArtist(access_token);
    res.json(artists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
