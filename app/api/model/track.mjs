"use strict"

class TrackExecption extends Error {
    constructor(message) {
        super(message);
        this.name = "TrackExecption";
    }
}

function getType(value) {
    if (Array.isArray(value)) return 'array';
    if (value === null) return 'null';
    return typeof value;
}


const attributsNamesAndTypes = new Map([
    ["album", "object"],
    ["artists", "array"],
    ["available_markets", "array"],    
    ["disc_number", "number"],
    ["duration_ms", "number"],
    ["explicit", "boolean"],     
    ["external_ids", "object"],
    ["external_urls", "object"],
    ["href", "string"],
    ["id", "string"],
    ["is_playable","boolean"],
    ["linked_from", "object"],
    ["restrictions", "object"],
    ["name", "string"],
    ["popularity", "number"],
    ["preview_url", "string"],
    ["track_number", "number"],
    ["type", "string"],
    ["uri", "string"],
    ["is_local", "boolean"]
]);

class Track {
    album;
    artists;
    available_markets;
    disc_number;
    duration_ms;
    explicit;
    external_ids;
    external_urls;
    href;
    id;
    is_playable = null;
    linked_from = null;
    restrictions = null;
    name;
    popularity;
    preview_url = null;
    track_number;
    type;
    uri;
    is_local;

    constructor(obj) {
    
        // Vérifier que les attributs et leur type correspondent
        const objNamesAndTypes = new Map(Object.entries(obj).map(([key, value]) => [key, getType(value)])); // avec getType plus robuste
        // Chercher les erreurs
        for (let [key, expectedType] of attributsNamesAndTypes.entries()) {
            const actualType = objNamesAndTypes.get(key);
            if (!actualType) {
                throw new TrackExecption(`Attribut manquant : "${key}"`);
            }
            if (actualType !== expectedType) {
                throw new TrackExecption(`Type incorrect pour l'attribut "${key}" : attendu "${expectedType}", reçu "${actualType}"`);
            }
        }

        Object.assign(this, obj);
    }
}

export default Track;
