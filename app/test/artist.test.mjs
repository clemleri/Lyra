import Artist from "../api/model/artist.mjs";
import assert from "node:assert";
import { describe, it } from "node:test";

describe("Artist", () => {
  it("empty parameter", () => {
    assert.throws(
      () => new Artist({}),
      { name: "ArtistException" }
    );
  });

  const base = {
    external_urls: {},
    followers: {},
    genres: [],
    href: "https://api.spotify.com/v1/artists/1",
    id: "1",
    images: [],
    name: "Test Artist",
    popularity: 42,
    type: "artist",
    uri: "spotify:artist:1"
  };

  let testObj;

  it("missing attribute", () => {
    Object.keys(base).forEach((key) => {
      testObj = { ...base };
      delete testObj[key];
      assert.throws(
        () => new Artist(testObj),
        { name: "ArtistException" }
      );
    });
  });

  it("wrong type attribute", () => {
    Object.keys(base).forEach((key) => {
      testObj = { ...base };
      testObj[key] = BigInt(0);
      assert.throws(
        () => new Artist(testObj),
        { name: "ArtistException" }
      );
    });
  });

  it("OK", () => {
    testObj = { ...base };
    assert.doesNotThrow(
      () => new Artist(testObj)
    );
    // On vérifie que l'objet passé n'a pas été modifié
    assert.deepEqual(testObj, base);
  });
});
