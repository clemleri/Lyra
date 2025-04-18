import express from 'express';
import request from 'supertest';
import sinon from 'sinon';
import { describe, it, beforeEach, afterEach } from 'node:test';

import artistRouter from "../api/controller/ArtistController.mjs";
import ArtistsFetchDAO from '../api/dao/ArtistFetchDAO.mjs';

describe("ArtistController", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    // middleware pour simuler la session
    app.use((req, res, next) => {
      // on considère que si on envoie ce header, on est authentifié
      if (req.headers["x-has-token"] === "1") {
        req.session = { access_token: "FAKE_TOKEN" };
      } else {
        req.session = {};
      }
      next();
    });
    app.use('/artists', artistRouter);
    // error handler pour les routes qui appellent next(error)
    app.use((err, req, res, next) => {
      res.status(500).json({ error: err.message });
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  // --- /artists/top ---

  it("GET /artists/top sans token renvoie 401", async () => {
    const res = await request(app).get('/artists/top');
    if (res.status !== 401) throw new Error(`Attendu 401, got ${res.status}`);
    if (!res.body.error.includes("Accès non autorisé")) {
      throw new Error("Message d'erreur inattendu");
    }
  });

  it("GET /artists/top avec token renvoie findAll", async () => {
    const fake = [{ id: 'A'}];
    sinon.stub(ArtistsFetchDAO, 'findAll').resolves(fake);

    const res = await request(app)
      .get('/artists/top')
      .set('x-has-token', '1');

    if (res.status !== 200) throw new Error(`Attendu 200, got ${res.status}`);
    if (JSON.stringify(res.body) !== JSON.stringify(fake)) {
      throw new Error("Corps de réponse invalide");
    }
  });

  it("GET /artists/top en cas d'erreur DAO renvoie 500", async () => {
    sinon.stub(ArtistsFetchDAO, 'findAll').rejects(new Error("failAll"));

    const res = await request(app)
      .get('/artists/top')
      .set('x-has-token', '1');

    if (res.status !== 500) throw new Error(`Attendu 500, got ${res.status}`);
    if (res.body.error !== "failAll") {
      throw new Error("Message d'erreur inattendu");
    }
  });

  // --- /artists/top/popularity ---

  it("GET /artists/top/popularity trie par popularité", async () => {
    const fake = [
      { name: 'A', popularity: 10, genres: [] },
      { name: 'B', popularity: 50, genres: [] },
      { name: 'C', popularity: 30, genres: [] },
    ];
    sinon.stub(ArtistsFetchDAO, 'findAll').resolves(fake);

    const res = await request(app)
      .get('/artists/top/popularity')
      .set('x-has-token', '1');

    const names = res.body.map(a => a.name);
    if (JSON.stringify(names) !== JSON.stringify(['B','C','A'])) {
      throw new Error("Tri par popularité incorrect");
    }
  });

  it("GET /artists/top/popularity en cas d'erreur renvoie 500", async () => {
    sinon.stub(ArtistsFetchDAO, 'findAll').rejects(new Error("failPop"));

    const res = await request(app)
      .get('/artists/top/popularity')
      .set('x-has-token', '1');

    if (res.status !== 500) throw new Error(`Attendu 500, got ${res.status}`);
    if (res.body.error !== "failPop") {
      throw new Error("Message d'erreur inattendu");
    }
  });

  // --- /artists/top/genres ---

  it("GET /artists/top/genres trie par genre alphabétique", async () => {
    const fake = [
      { name: 'X', popularity:0, genres: ['rock'] },
      { name: 'Y', popularity:0, genres: ['blues'] },
      { name: 'Z', popularity:0, genres: ['jazz'] },
    ];
    sinon.stub(ArtistsFetchDAO, 'findAll').resolves(fake);

    const res = await request(app)
      .get('/artists/top/genres')
      .set('x-has-token', '1');

    const genres = res.body.map(a => a.genres[0]);
    if (JSON.stringify(genres) !== JSON.stringify(['blues','jazz','rock'])) {
      throw new Error("Tri par genres incorrect");
    }
  });

  it("GET /artists/top/genres en cas d'erreur renvoie 500", async () => {
    sinon.stub(ArtistsFetchDAO, 'findAll').rejects(new Error("failGen"));

    const res = await request(app)
      .get('/artists/top/genres')
      .set('x-has-token', '1');

    if (res.status !== 500) throw new Error(`Attendu 500, got ${res.status}`);
    if (res.body.error !== "failGen") {
      throw new Error("Message d'erreur inattendu");
    }
  });

  // --- /artists/:artistId ---

  it("GET /artists/:id renvoie findArtist", async () => {
    const fake = [{ id: '42' }];
    sinon.stub(ArtistsFetchDAO, 'findArtist').resolves(fake);

    const res = await request(app)
      .get('/artists/42')
      .set('x-has-token', '1');

    if (res.status !== 200) throw new Error(`Attendu 200, got ${res.status}`);
    if (JSON.stringify(res.body) !== JSON.stringify(fake)) {
      throw new Error("Artiste non retourné");
    }
  });

  it("GET /artists/:id en cas d'erreur renvoie 500", async () => {
    sinon.stub(ArtistsFetchDAO, 'findArtist').rejects(new Error("failOne"));

    const res = await request(app)
      .get('/artists/42')
      .set('x-has-token', '1');

    if (res.status !== 500) throw new Error(`Attendu 500, got ${res.status}`);
    if (res.body.error !== "failOne") {
      throw new Error("Message d'erreur inattendu");
    }
  });

  // --- /artists/:artistId/albums ---

  it("GET /artists/:id/albums renvoie findArtistAlbums avec limite par défaut", async () => {
    const fake = [{ name: 'ALB' }];
    sinon.stub(ArtistsFetchDAO, 'findArtistAlbums').resolves(fake);

    const res = await request(app)
      .get('/artists/99/albums')
      .set('x-has-token', '1');

    if (res.status !== 200) throw new Error(`Attendu 200, got ${res.status}`);
    if (JSON.stringify(res.body) !== JSON.stringify(fake)) {
      throw new Error("Albums non retournés");
    }
  });

  it("GET /artists/:id/albums avec ?limit=5", async () => {
    const fake = [{ name: 'ALB' }];
    // on vérifie simplement le stub, l'argument limit est lu côté controller
    const stub = sinon.stub(ArtistsFetchDAO, 'findArtistAlbums').resolves(fake);

    const res = await request(app)
      .get('/artists/77/albums?limit=5')
      .set('x-has-token', '1');

    if (res.status !== 200) throw new Error(`Attendu 200, got ${res.status}`);
    // vérifier que la DAO a bien été appelée avec limit=5
    const [artistId, limitArg] = stub.firstCall.args;
    if (artistId !== '77' || limitArg !== '5') {
      throw new Error("Limit non transmis en query");
    }
  });

  it("GET /artists/:id/albums en cas d'erreur renvoie 500", async () => {
    sinon.stub(ArtistsFetchDAO, 'findArtistAlbums').rejects(new Error("failAlb"));

    const res = await request(app)
      .get('/artists/99/albums')
      .set('x-has-token', '1');

    if (res.status !== 500) throw new Error(`Attendu 500, got ${res.status}`);
    if (res.body.error !== "failAlb") {
      throw new Error("Message d'erreur inattendu");
    }
  });

  // --- /artists/:artistId/top ---

  it("GET /artists/:id/top renvoie findTopArtist", async () => {
    const fake = [{ id: 'T' }];
    sinon.stub(ArtistsFetchDAO, 'findTopArtist').resolves(fake);

    const res = await request(app)
      .get('/artists/5/top')
      .set('x-has-token', '1');

    if (res.status !== 200) throw new Error(`Attendu 200, got ${res.status}`);
    if (JSON.stringify(res.body) !== JSON.stringify(fake)) {
      throw new Error("Top tracks non retournés");
    }
  });

  it("GET /artists/:id/top en cas d'erreur renvoie 500", async () => {
    sinon.stub(ArtistsFetchDAO, 'findTopArtist').rejects(new Error("failTopArt"));

    const res = await request(app)
      .get('/artists/5/top')
      .set('x-has-token', '1');

    if (res.status !== 500) throw new Error(`Attendu 500, got ${res.status}`);
    if (res.body.error !== "failTopArt") {
      throw new Error("Message d'erreur inattendu");
    }
  });
});
