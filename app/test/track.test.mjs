import Track from "../api/model/track.mjs";
import assert from "node:assert";
import { describe, it } from "node:test";

describe("Track", () => {
  it("empty parameter", () => {
    assert.throws(
      () => new Track({}),
      { name: "TrackExecption" }
    );
  });

  const base = {
    album: {},
    artists: [],
    available_markets: [],
    disc_number: 1,
    duration_ms: 200000,
    explicit: false,
    external_ids: {},
    external_urls: {},
    href: "https://api.spotify.com/v1/tracks/1",
    id: "1",
    is_playable: true,
    linked_from: {},
    restrictions: {},
    name: "Test Track",
    popularity: 50,
    preview_url: "https://p.scdn.co/mp3-preview/abcdef",
    track_number: 1,
    type: "track",
    uri: "spotify:track:1",
    is_local: false
  };

  let testObj = null;

  it("missing attribute", () => {
    Object.keys(base).forEach((key) => {
      testObj = { ...base };
      delete testObj[key];
      assert.throws(
        () => new Track(testObj),
        { name: "TrackExecption" }
      );
    });
  });

  it("wrong type attribute", () => {
    Object.keys(base).forEach((key) => {
      testObj = { ...base };
      testObj[key] = BigInt(0);
      assert.throws(
        () => new Track(testObj),
        { name: "TrackExecption" }
      );
    });
  });

  it("OK", () => {
    testObj = { ...base };
    assert.doesNotThrow(
      () => new Track(testObj)
    );
    // L'objet de test ne doit pas être modifié par le constructeur
    assert.deepEqual(testObj, base);
  });
});
