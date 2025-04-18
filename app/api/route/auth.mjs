"use strict"
import express from 'express'
import dotenv from 'dotenv'
import querystring from 'querystring';
import fetch from 'node-fetch' 

// Pour pouvoir lire le fichier de configuration .env
dotenv.config()


const router = express.Router()

// Variables de configuration Spotify
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI; 


console.log("CLIENT ID : ", CLIENT_ID)
console.log("CLIENT SECRET : ", CLIENT_SECRET)
console.log("REDIRECT URI : ", REDIRECT_URI)

router
  .route('/login')
  .get((req, res) => {
    // #swagger.summary = 'Connexion à spotify'
    // #swagger.description = 'Cette route redirige vers la page de connexion de spotify'

    const scope = 'user-top-read user-read-private user-read-email user-read-recently-played';
    const authUrl = 'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: REDIRECT_URI,
        state: '12345'
      });
    console.log("Redirection vers Spotify :", authUrl);
    res.redirect(authUrl);
  });

  router.get('/callback', async (req, res) => {
    // #swagger.summary = 'Retour au site'
    // #swagger.description = 'Cette route permet la redirection notre site après la connexion à spotify'
    const code = req.query.code || null;
  
    const authString = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    const params = new URLSearchParams();
    params.append('code', code);
    params.append('redirect_uri', REDIRECT_URI);
    params.append('grant_type', 'authorization_code');
  
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + authString,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      });
  
      if (!response.ok) {
        const text = await response.text();
        console.error("Erreur d’échange :", text);
        return res.status(400).send('Erreur lors de l’échange du token');
      }
  
      const data = await response.json();
  
      req.session.access_token = data.access_token;
  
      res.redirect('http://172.21.45.12:4000/')
    } catch (err) {
      console.error("Erreur réseau :", err);
      res.status(500).send('Erreur réseau');
    }
  });
  
  router.get('/access-token', (req, res) => {
    // #swagger.summary = 'Récupération de l acces token'
    // #swagger.description = 'Cette route renvoie l acces token si celui ci existe, sinon une erreur'
    const token = req.session.access_token;
    if (!token) return res.status(401).json({ error: 'Token manquant' });
    console.log('token dans /access-token : ', token)
    res.status(200).json({ access_token: token });
  });
  
export default router



