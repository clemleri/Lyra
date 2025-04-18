import nock from 'nock';
import assert from 'node:assert';
import { describe, it, afterEach } from 'node:test';

import TrackFetchDAO from '../api/dao/TrackFetchDAO.mjs';
import Track from '../api/model/track.mjs';

const API = 'https://api.spotify.com';

describe('TrackFetchDAO', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  const baseTrack = {
    album: {},
    artists: [],
    available_markets: [],
    disc_number: 1,
    duration_ms: 100,
    explicit: false,
    external_ids: {},
    external_urls: {},
    href: 'https://api.spotify.com/v1/tracks/1',
    id: '1',
    is_playable: false,
    linked_from: {},
    restrictions: {},
    name: 'Test Track',
    popularity: 42,
    preview_url: '',
    track_number: 1,
    type: 'track',
    uri: 'spotify:track:1',
    is_local: false
  };

  it('findTopTracks maps JSON items to Track instances', async () => {
    const fakeData = { items: [ baseTrack ] };
    nock(API)
      .get('/v1/me/top/tracks')
      .query({ limit: '10', time_range: 'short_term' })
      .matchHeader('Authorization', 'Bearer TOKEN')
      .reply(200, fakeData);

    const tracks = await TrackFetchDAO.findTopTracks('TOKEN', 'short_term', 10);
    assert.equal(tracks.length, 1);
    assert(tracks[0] instanceof Track);
    assert.equal(tracks[0].id, '1');
  });

  it('findTopTracks throws on HTTP error', async () => {
    nock(API)
      .get(/\/v1\/me\/top\/tracks.*/)
      .reply(500);

    await assert.rejects(
      () => TrackFetchDAO.findTopTracks('TOKEN'),
      Error
    );
  });

  it('findTrack maps response to Track array', async () => {
    const fakeData = { items: [ baseTrack ] };
    nock(API)
      .get('/v1/tracks/xyz')
      .matchHeader('Authorization', 'BearerTOKEN')
      .reply(200, fakeData);

    const result = await TrackFetchDAO.findTrack('TOKEN', 'xyz');
    assert.equal(result.length, 1);
    assert(result[0] instanceof Track);
    assert.equal(result[0].name, 'Test Track');
  });

  it('findTrackHistory maps items.track to Track instances', async () => {
    const fakeData = { items: [ { track: baseTrack } ] };
    nock(API)
      .get('/v1/me/player/recently-played')
      .query({ limit: '20' })
      .matchHeader('Authorization', 'Bearer TOKEN')
      .reply(200, fakeData);

    const history = await TrackFetchDAO.findTrackHistory('TOKEN');
    assert.equal(history.length, 1);
    assert(history[0] instanceof Track);
  });

  it('findTrackAudioFeatures rejects due to invalid URL', async () => {
    await assert.rejects(
      () => TrackFetchDAO.findTrackAudioFeatures('TOKEN', '1'),
      TypeError
    );
  });
});
