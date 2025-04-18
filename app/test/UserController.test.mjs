import express from 'express';
import request from 'supertest';
import sinon from 'sinon';
import { describe, it, beforeEach, afterEach } from 'node:test';

import userRouter from "../api/controller/UserController.mjs";
import UserFetchDAO from "../api/dao/UserFetchDAO.mjs";

describe("UserController", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    // Simule cookies et session
    app.use((req, res, next) => {
      req.cookies = { access_token: req.headers['x-cookie-token'] };
      req.session = { access_token: req.headers['x-session-token'] };
      next();
    });
    app.use('/user', userRouter);
    // Gestionnaire d'erreurs pour catch
    app.use((err, req, res, next) => {
      res.status(500).json({ error: err.message });
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it("GET /user/profile renvoie getUserProfile success", async () => {
    const fakeProfile = [{ id: 'U1' }];
    sinon.stub(UserFetchDAO, 'getUserProfile').resolves(fakeProfile);

    const res = await request(app)
      .get('/user/profile')
      .set('x-cookie-token', 'TK');

    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (JSON.stringify(res.body) !== JSON.stringify(fakeProfile)) {
      throw new Error('Corps de réponse invalide');
    }
  });

  it("GET /user/profile erreur DAO renvoie 500", async () => {
    sinon.stub(UserFetchDAO, 'getUserProfile').rejects(new Error('failProf'));

    const res = await request(app)
      .get('/user/profile')
      .set('x-cookie-token', 'TK');

    if (res.status !== 500) throw new Error(`Expected 500, got ${res.status}`);
    if (res.body.error !== 'failProf') throw new Error('Message inattendu');
  });

  it("GET /user/followed-artists renvoie findFollowedArtist success", async () => {
    const fake = [{ id: 'A1' }];
    sinon.stub(UserFetchDAO, 'findFollowedArtist').resolves(fake);

    const res = await request(app)
      .get('/user/followed-artists')
      .set('x-session-token', 'TK');

    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (JSON.stringify(res.body) !== JSON.stringify(fake)) {
      throw new Error('Corps de réponse invalide');
    }
  });

  it("GET /user/followed-artists erreur DAO renvoie 500", async () => {
    sinon.stub(UserFetchDAO, 'findFollowedArtist').rejects(new Error('failFollow'));

    const res = await request(app)
      .get('/user/followed-artists')
      .set('x-session-token', 'TK');

    if (res.status !== 500) throw new Error(`Expected 500, got ${res.status}`);
    if (res.body.error !== 'failFollow') throw new Error('Message inattendu');
  });
});
