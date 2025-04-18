"use strict"

class audioFeaturesException extends Error {
    constructor(message) {
        super(message);
        this.name = "audioFeaturesException";
    }
}

function getType(value) {
    if (Array.isArray(value)) return 'array';
    if (value === null) return 'null';
    return typeof value;
}


const attributsNamesAndTypes = new Map([
    ["acousticness", "number"],
    ["analysis_url", "string"],
    ["danceability", "number"],
    ["duration_ms", "number"],
    ["energy", "number"],
    ["id", "string"],
    ["instrumentalness", "number"],
    ["key", "number"],
    ["liveness", "number"],
    ["loudness", "number"],
    ["mode", "number"],
    ["speechiness", "number"],
    ["tempo", "number"],
    ["time_signature", "number"],
    ["track_href", "string"],
    ["type", "string"],
    ["uri", "string"],
    ["valence", "string"]
]);

class AudioFeatures {
    acousticness;
    analysis_url;
    danceability;
    duration_ms;
    energy;
    id;
    instrumentalness;
    key;
    liveness;
    loudness;
    mode;
    speechiness;
    tempo;
    time_signature;
    track_href;
    type;
    uri;
    valence;

    constructor(obj) {

        // Vérifier que les attributs et leur type correspondent
        const objNamesAndTypes = new Map(Object.entries(obj).map(([key, value]) => [key, getType(value)])); // avec getType plus robuste
        // Chercher les erreurs
        for (let [key, expectedType] of attributsNamesAndTypes.entries()) {
            const actualType = objNamesAndTypes.get(key);
            if (!actualType) {
                throw new audioFeaturesException(`Attribut manquant : "${key}"`);
            }
            if (actualType !== expectedType) {
                throw new audioFeaturesException(`Type incorrect pour l'attribut "${key}" : attendu "${expectedType}", reçu "${actualType}"`);
            }
        }

        Object.assign(this, obj);
    }
}

export default AudioFeatures;
