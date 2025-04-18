"use strict"

class AlbumException extends Error {
    constructor(message) {
        super(message);
        this.name = "AlbumException";
    }
}

function getType(value) {
    if (Array.isArray(value)) return 'array';
    if (value === null) return 'null';
    return typeof value;
  }

const attributsNamesAndTypes = new Map([
    ["album_type", "string"],
    ["total_tracks", "number"],
    ["available_markets", "array"],    
    ["external_urls", "object"],
    ["href", "string"],
    ["id", "string"],     
    ["images", "array"],
    ["name", "string"],
    ["release_date", "string"],
    ["release_date_precision", "string"],
    ["restrictions", "object"],
    ["type", "string"],
    ["uri", "string"],
    ["artists","array"],
    ["tracks","object"],
    ["copyrights", "array"],
    ["external_ids", "object"],
    ["genres", "array"],
    ["label", "string"],
    ["popularity", "number"]
]);

class Album {
    album_type;
    total_tracks;
    available_markets;
    external_urls;
    href;
    id;
    images;
    name;
    release_date;
    release_date_precision;
    restrictions;
    uri;
    artists;
    tracks;
    copyrights;
    external_ids;
    genres;
    label;
    popularity;

    constructor(obj) {
        const objNamesAndTypes = new Map(
            Object.entries(obj).map(([key, value]) => [key, getType(value)])
          );

        if (!(attributsNamesAndTypes.size === objNamesAndTypes.size &&
              Array.from(attributsNamesAndTypes.keys()).every(key =>
                  attributsNamesAndTypes.get(key) === objNamesAndTypes.get(key)
              ))) {
            throw new AlbumException("Attributs invalides ou types incorrects");
        }

        Object.assign(this, obj);
    }
}

export default Album;

