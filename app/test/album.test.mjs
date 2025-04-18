import Album from "../api/model/album.mjs";
import assert from "node:assert";
import { describe, it } from "node:test";

describe("Album", () => {
  it("empty parameter", () => {
    assert.throws(
      () => new Album({}),
      { name: "AlbumException" }
    );
  });

  const base = {
    album_type: "album",
    total_tracks: 10,
    available_markets: [],
    external_urls: {},
    href: "https://api.spotify.com/v1/albums/1",
    id: "1",
    images: [],
    name: "Test Album",
    release_date: "2025-04-17",
    release_date_precision: "day",
    restrictions: {},
    type: "album",
    uri: "spotify:album:1",
    artists: [],
    tracks: {},
    copyrights: [],
    external_ids: {},
    genres: [],
    label: "Test Label",
    popularity: 50
  };

  let testObj;

  it("missing attribute", () => {
    Object.keys(base).forEach((key) => {
      testObj = { ...base };
      delete testObj[key];
      assert.throws(
        () => new Album(testObj),
        { name: "AlbumException" }
      );
    });
  });

  it("wrong type attribute", () => {
    Object.keys(base).forEach((key) => {
      testObj = { ...base };
      testObj[key] = BigInt(0);
      assert.throws(
        () => new Album(testObj),
        { name: "AlbumException" }
      );
    });
  });

  it("OK", () => {
    testObj = { ...base };
    assert.doesNotThrow(
      () => new Album(testObj)
    );
    // L'objet de test ne doit pas être modifié par le constructeur
    assert.deepEqual(testObj, base);
  });
});
