'use strict';
import dotenv from 'dotenv';
dotenv.config();
import app from './app.mjs';

const serverPort = process.env.PORT;

// Démarrage du serveur uniquement si ce module est exécuté directement
const server = app.listen(serverPort, '0.0.0.0', () => {
  console.log(`Example app listening on port ${serverPort}`);
});

// Gestion des interruptions pour fermer proprement le serveur et la connexion MongoDB
for (let signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, () => {
    console.info(`${signal} signal received.`);
    console.log("Closing http server.");
    server.close(async (err) => {
      console.log("Http server closed.");
      process.exit(err ? 1 : 0);
    });
  });
}

// Export optionnel du serveur, utile pour les tests d'intégration
export default server;
