"use strict"
import express from "express";
import session from 'express-session';
import cors from 'cors';
import artistController from './api/controller/ArtistController.mjs';
import trackController from './api/controller/TrackController.mjs';
import userController from './api/controller/UserController.mjs';
import dotenv from 'dotenv';
import swaggerUi from "swagger-ui-express";
import swaggerJson from "swagger-json"

dotenv.config();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.URL_FRONTEND, // URL du frontend
    credentials: true,              // Autorise l'envoi des cookies (session)
  })
);

// Pour traiter le body en JSON
app.use(express.json());

// chargement du middleware de session 
app.use(session({
  secret: 'some secret', 
  resave: false,        
  saveUninitialized: false, 
  cookie: { secure: false } 
}));


// chargement des routes des controllers 
app.use('/artists', artistController);
app.use('/tracks', trackController);
app.use('/user', userController);

// Middleware de log
app.use((req, res, next) => {
  console.log(`Requête reçue: ${req.method} ${req.url}`);
  next();
});

// Chargement des routes d'authentification
const { default: routes } = await import('./api/route/auth.mjs');
app.use(routes);

// Gestion des erreurs
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

// Affichage des routes enregistrées
app._router.stack.forEach((r) => {
  if (r.route) {
    console.log(`Route enregistrée: ${Object.keys(r.route.methods)} ${r.route.path}`);
  }
});

//route pour swagger
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerJson))


export default app;
