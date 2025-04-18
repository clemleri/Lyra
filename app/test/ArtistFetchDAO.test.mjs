import nock from 'nock';
import assert from 'node:assert';
import { describe, it, afterEach } from 'node:test';

import ArtistFetchDAO from '../api/dao/ArtistFetchDAO.mjs';
import Artist from '../api/model/artist.mjs';

describe('ArtistFetchDAO', () => {
  const API = 'https://api.spotify.com';

  afterEach(() => {
    nock.cleanAll();
  });

  it('findAll maps JSON items to Artist instances', async () => {
    // Préparer une réponse Spotify factice
    const fakeData = {
      items: [
        {
          external_urls: {},
          followers: {},
          genres: [],
          href: 'https://api.spotify.com/v1/artists/1',
          id: '1',
          images: [],
          name: 'Artist 1',
          popularity: 10,
          type: 'artist',
          uri: 'spotify:artist:1'
        }
      ]
    };

    // Mocker l'appel HTTP
    nock(API)
      .get('/v1/me/top/artists')
      .matchHeader('Authorization', 'Bearer TOKEN')
      .reply(200, fakeData);

    const artists = await ArtistFetchDAO.findAll('TOKEN');
    assert.equal(artists.length, 1);
    assert(artists[0] instanceof Artist);
    assert.equal(artists[0].id, '1');
    assert.equal(artists[0].name, 'Artist 1');
  });

  it('findAll throws if response JSON lacks items', async () => {
    // Réponse sans items
    nock(API)
      .get('/v1/me/top/artists')
      .reply(200, {});

    await assert.rejects(
      async () => { await ArtistFetchDAO.findAll('TOKEN'); },
      { name: 'TypeError' }
    );
  });

  it('findAll throws on HTTP error status', async () => {
    // Réponse 500
    nock(API)
      .get('/v1/me/top/artists')
      .reply(500, { error: 'server error' });

    await assert.rejects(
      async () => { await ArtistFetchDAO.findAll('TOKEN'); },
      { name: 'TypeError' }
    );
  });
});