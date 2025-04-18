import User from "../api/model/user.mjs";
import assert from "node:assert";
import { describe, it } from "node:test";

describe("User", () => {
  it("empty parameter", () => {
    assert.throws(
      () => new User({}),
      { name: "UserException" }
    );
  });

  const base = {
    country: "US",
    display_name: "Test User",
    email: "test@example.com",
    explicit_content: {},    // peut être { filter_enabled: false, filter_locked: false }
    external_urls: {},
    followers: {},            // peut être { total: 0 }
    href: "https://api.spotify.com/v1/me",
    id: "user123",
    images: [],               // liste de dicts d’images
    product: "premium",
    type: "user",
    uri: "spotify:user:user123"
  };

  let testObj;

  it("missing attribute", () => {
    Object.keys(base).forEach((key) => {
      testObj = { ...base };
      delete testObj[key];
      assert.throws(
        () => new User(testObj),
        { name: "UserException" }
      );
    });
  });

  it("wrong type attribute", () => {
    Object.keys(base).forEach((key) => {
      testObj = { ...base };
      testObj[key] = BigInt(0);
      assert.throws(
        () => new User(testObj),
        { name: "UserException" }
      );
    });
  });

  it("OK", () => {
    testObj = { ...base };
    assert.doesNotThrow(
      () => new User(testObj)
    );
    // L'objet source ne doit pas être modifié par le constructeur
    assert.deepEqual(testObj, base);
  });
});
