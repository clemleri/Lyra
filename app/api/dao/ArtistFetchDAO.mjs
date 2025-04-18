import fetch from 'node-fetch';
import Artist from "../model/artist.mjs";
import Album from '../model/album.mjs';


const url = "https://api.spotify.com/v1/me/top/artists"

const ArtistsFetchDAO = {
    findAll: async (access_token) => {
        let response = await fetch(url, { method: 'GET', headers: {'Authorization' : 'Bearer ' + access_token}})
        let json = await response.json();

        const data = json.items;

        // Transformation de chaque objet en instance de Artist
        return data.map(artistData => new Artist(artistData));
    },
    findArtist:async (artistsID,access_token)=>{
        let response = await fetch(trackBaseUrl + "artists/" + artistsID.join(), {method: 'GET', headers : {'Authorization' : 'Bearer' + access_token}})
        let json = await response.json()
        const data = json.items
        return data.map(artistData => Artist(artistData))
    },
    findArtistAlbums:async (artistID,limit=10,access_token)=>{
        let response = await fetch(trackBaseUrl+"artists/"+artistID+"/albums?limit="+limit, {method: 'GET',headers: { 'Authorization': 'Bearer ' + access_token }});        
        let json = await response.json()
        const data = json.items
        return data.map(artistData => new Album(artistData))
    },
    findTopArtist:async (artistID,access_token)=>{
        let response = await fetch(trackBaseUrl+"artists/"+artistID+"/top-tracks/", {method: 'GET',headers: { 'Authorization': 'Bearer ' + access_token }});
        let json = await response.json();
        const data = json.tracks;
        return data.map(trackData => new Track(trackData));
    }
}

export default ArtistsFetchDAO;