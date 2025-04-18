"use strict"

class ArtistException extends Error {
    constructor(message) {
        super(message);
        this.name = "ArtistException";
    }
}

const attributsNamesAndTypes = new Map([
    ["external_urls", "object"],
    ["followers", "object"],
    ["genres", "object"],    
    ["href", "string"],
    ["id", "string"],
    ["images", "object"],     
    ["name", "string"],
    ["popularity", "number"],
    ["type", "string"],
    ["uri", "string"]
]);

class Artist {
    external_urls;
    followers;
    genres;
    href;
    id;
    images;
    name;
    popularity;
    type;
    uri;

    constructor(obj) {
        // Vérifier que les attributs et leur type correspondent
        const objNamesAndTypes = new Map(Object.entries(obj).map(([key, value]) => [key, typeof value]));

        // Ici on vérifie que l'ensemble des clés et leur type correspondent exactement à ce qui est attendu
        if (!(attributsNamesAndTypes.size === objNamesAndTypes.size &&
              Array.from(attributsNamesAndTypes.keys()).every(key =>
                  attributsNamesAndTypes.get(key) === objNamesAndTypes.get(key)
              ))) {
            throw new ArtistException("Attributs invalides ou types incorrects");
        }

        Object.assign(this, obj);
    }
}

export default Artist;
