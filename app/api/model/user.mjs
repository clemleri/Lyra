"use strict"

class UserException extends Error {
    constructor(message) {
        super(message);
        this.name = "UserException";
    }
}

function getType(value) {
    if (Array.isArray(value)) return 'array';
    if (value === null) return 'null';
    return typeof value;
}


const attributsNamesAndTypes = new Map([
    ["country", "string"],
    ["display_name", "string"],
    ["email", "string"],
    ["explicit_content", "object"],  
    ["external_urls", "object"],     
    ["followers", "object"],         
    ["href", "string"],
    ["id", "string"],
    ["images", "array"],            
    ["product", "string"],
    ["type", "string"],
    ["uri", "string"]
]);

class User {
    country;
    display_name;
    email;
    explicit_content;
    external_urls;
    followers;
    href;
    id;
    images;
    product;
    type;
    uri;

    constructor(obj) {

        // Vérifier que les attributs et leur type correspondent
        const objNamesAndTypes = new Map(Object.entries(obj).map(([key, value]) => [key, getType(value)])); // avec getType plus robuste
        // Chercher les erreurs
        for (let [key, expectedType] of attributsNamesAndTypes.entries()) {
            const actualType = objNamesAndTypes.get(key);
            if (!actualType) {
                throw new UserException(`Attribut manquant : "${key}"`);
            }
            if (actualType !== expectedType) {
                throw new UserException(`Type incorrect pour l'attribut "${key}" : attendu "${expectedType}", reçu "${actualType}"`);
            }
        }

        Object.assign(this, obj);
    }
}

export default User;
