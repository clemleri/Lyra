// test/controller/trackController.test.mjs
import express from 'express';
import request from 'supertest';
import sinon from 'sinon';
import { describe, it, beforeEach, afterEach } from 'node:test';

import trackRouter from "../api/controller/TrackController.mjs";
import TrackFetchDAO from '../api/dao/TrackFetchDAO.mjs';

describe("TrackController", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    // Simule une session authentifiée
    app.use((req, res, next) => {
      req.session = { access_token: "FAKE_TOKEN" };
      next();
    });
    app.use('/tracks', trackRouter);
  });

  afterEach(() => {
    sinon.restore();
  });

  // --- Flux normaux ---

  it("GET /tracks/top sans param renvoie findTopTracks avec time_range par défaut", async () => {
    const fake = [{ id: 'X' }];
    sinon.stub(TrackFetchDAO, 'findTopTracks').resolves(fake);

    const res = await request(app).get('/tracks/top');
    if (res.status !== 200) throw new Error(`Attendu 200, got ${res.status}`);
    if (JSON.stringify(res.body) !== JSON.stringify(fake)) {
      throw new Error("Corps de réponse invalide");
    }
  });

  it("GET /tracks/top/:time_range renvoie findTopTracks avec le time_range donné", async () => {
    const fake = [{ id: 'Y' }];
    sinon.stub(TrackFetchDAO, 'findTopTracks').resolves(fake);

    const res = await request(app).get('/tracks/top/short_term');
    if (res.status !== 200) throw new Error(`Attendu 200, got ${res.status}`);
    if (JSON.stringify(res.body) !== JSON.stringify(fake)) {
      throw new Error("Corps de réponse invalide");
    }
  });

  it("GET /tracks sans spotifyIDs renvoie 400", async () => {
    const res = await request(app).get('/tracks');
    if (res.status !== 400) throw new Error(`Attendu 400, got ${res.status}`);
  });

  it("GET /tracks?spotifyIDs=1,2 renvoie findTracks", async () => {
    const fake = [{ id: '1' }, { id: '2' }];
    sinon.stub(TrackFetchDAO, 'findTracks').resolves(fake);

    const res = await request(app)
      .get('/tracks')
      .query({ spotifyIDs: '1,2' });
    if (res.status !== 200) throw new Error(`Attendu 200, got ${res.status}`);
    if (JSON.stringify(res.body) !== JSON.stringify(fake)) {
      throw new Error("Corps de réponse invalide");
    }
  });

  it("GET /tracks/history renvoie findTrackHistory", async () => {
    const fake = [{ id: 'H' }];
    sinon.stub(TrackFetchDAO, 'findTrackHistory').resolves(fake);

    const res = await request(app).get('/tracks/history');
    if (res.status !== 200) throw new Error(`Attendu 200, got ${res.status}`);
    if (JSON.stringify(res.body) !== JSON.stringify(fake)) {
      throw new Error("Corps de réponse invalide");
    }
  });

  it("GET /tracks/:id renvoie findTrack", async () => {
    const fake = [{ id: 'Z' }];
    sinon.stub(TrackFetchDAO, 'findTrack').resolves(fake);

    const res = await request(app).get('/tracks/ZZZ');
    if (res.status !== 200) throw new Error(`Attendu 200, got ${res.status}`);
    if (JSON.stringify(res.body) !== JSON.stringify(fake)) {
      throw new Error("Corps de réponse invalide");
    }
  });

  it("GET /tracks/:id/audio-features renvoie findTrackAudioFeatures", async () => {
    const fake = [{ feature: 'f' }];
    sinon.stub(TrackFetchDAO, 'findTrackAudioFeatures').resolves(fake);

    const res = await request(app).get('/tracks/AAA/audio-features');
    if (res.status !== 200) throw new Error(`Attendu 200, got ${res.status}`);
    if (JSON.stringify(res.body) !== JSON.stringify(fake)) {
      throw new Error("Corps de réponse invalide");
    }
  });

  // --- Flux d'erreur (branches catch) ---

  it("GET /tracks/top/:time_range en cas d'exception renvoie 500", async () => {
    sinon.stub(TrackFetchDAO, 'findTopTracks').rejects(new Error("failTop"));

    const res = await request(app).get('/tracks/top/any');
    if (res.status !== 500) throw new Error(`Attendu 500, got ${res.status}`);
    if (res.body.error !== "failTop") {
      throw new Error("Message d'erreur inattendu");
    }
  });

  it("GET /tracks?spotifyIDs=1 déclenche erreur DAO -> 500", async () => {
    sinon.stub(TrackFetchDAO, 'findTracks').rejects(new Error("failFind"));

    const res = await request(app)
      .get('/tracks')
      .query({ spotifyIDs: '1' });
    if (res.status !== 500) throw new Error(`Attendu 500, got ${res.status}`);
    if (res.body.error !== "failFind") {
      throw new Error("Message d'erreur inattendu");
    }
  });

  it("GET /tracks/history en cas d'exception renvoie 500", async () => {
    sinon.stub(TrackFetchDAO, 'findTrackHistory').rejects(new Error("failHist"));

    const res = await request(app).get('/tracks/history');
    if (res.status !== 500) throw new Error(`Attendu 500, got ${res.status}`);
    if (res.body.error !== "failHist") {
      throw new Error("Message d'erreur inattendu");
    }
  });

  it("GET /tracks/:id en cas d'exception renvoie 500", async () => {
    sinon.stub(TrackFetchDAO, 'findTrack').rejects(new Error("failOne"));

    const res = await request(app).get('/tracks/123');
    if (res.status !== 500) throw new Error(`Attendu 500, got ${res.status}`);
    if (res.body.error !== "failOne") {
      throw new Error("Message d'erreur inattendu");
    }
  });

  it("GET /tracks/:id/audio-features en cas d'exception renvoie 500", async () => {
    sinon.stub(TrackFetchDAO, 'findTrackAudioFeatures').rejects(new Error("failAF"));

    const res = await request(app).get('/tracks/123/audio-features');
    if (res.status !== 500) throw new Error(`Attendu 500, got ${res.status}`);
    if (res.body.error !== "failAF") {
      throw new Error("Message d'erreur inattendu");
    }
  });
});
