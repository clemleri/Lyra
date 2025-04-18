import fetch from 'node-fetch';
import User from '../model/user.mjs'
import Artist from '../model/artist.mjs';

const userBaseUrl = "https://api.spotify.com/v1/me/"

const TrackFetchDAO = {
    getUserProfile : async (access_token) => {
        let response = await fetch(userBaseUrl, {method : 'GET', headers : {'Authorization' : 'Bearer' + access_token}})
        let json = await response.json()
        const data = json.items

        return data.map(userData => new User(userData))
    },
    findFollowedArtist : async (access_token) => {
        let response = await fetch(userBaseUrl+'/following', {method : 'GET', headers : {'Authorization' : 'Bearer' + access_token}})
        let json = await response.json()
        const data = json.items 

        return data.map(artistData => new Artist(artistData))
    }
}

export default TrackFetchDAO;