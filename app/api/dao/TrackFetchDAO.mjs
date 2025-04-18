import fetch from 'node-fetch';
import Track from "../model/track.mjs";
import Album from '../model/album.mjs';

const topBaseUrl = "https://api.spotify.com/v1/me/top/tracks"
const trackBaseUrl = "https://api.spotify.com/v1/"
const trackHistoricBaseUrl = "https://api.spotify.com/v1/me/player/recently-played"

const TrackFetchDAO = {
    findTrack : async (access_token, spotifyID) => {
        let response = await fetch(trackBaseUrl+"tracks/"+spotifyID, {method : 'GET', headers : {'Authorization' : 'Bearer' + access_token}})
        let json = await response.json()
        const data = json.items

        data.album.map(albumData => new Album(albumData))
        return data.map(trackData => new Track(trackData))
    },
    findTracks : async (access_token, spotifyIDs) => {
        // ici on suppose que spotifyIDs est un array de string 
        let response = await fetch(trackBaseUrl + "tracks/" + spotifyIDs.join(), {method: 'GET', headers : {'Authorization' : 'Bearer' + access_token}})
        let json = await response.json()

        const data = json.items

        return data.map(tracksData => Track(tracksData))
    },
    findTopTracks: async (access_token, time_range = "medium_term", limit = 10) => {
        let url = topBaseUrl+"?limit="+String(limit)+"&time_range="+time_range
        let response = await fetch(url, { method: 'GET', headers: {'Authorization' : 'Bearer ' + access_token}})
        let json = await response.json();

        const data = json.items; 

        // Transformation de chaque objet en instance de Track
        return data.map(trackData => new Track(trackData));
    },
    findTrackHistory: async (access_token) => {
        const limit = 20;
        const url = `${trackHistoricBaseUrl}?limit=${limit}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + access_token
            }
        });

        const json = await response.json();
        const data = json.items;
        console.log("ce que l'on récupère de tracks/history : ", data)
        const trackHistoric = data.map(item => new Track(item.track));
        return trackHistoric;
    }
    
}

export default TrackFetchDAO;