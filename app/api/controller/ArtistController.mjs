"use default"

import ArtistsFetchDAO from "../dao/ArtistFetchDAO.mjs";

// Controller pour les artistes
const artistController = {
    findAll: async (accessToken) => {
        return await ArtistsFetchDAO.findAll(accessToken);
    },

    findArtist: async (artistsID, accessToken) => {
        return await ArtistsFetchDAO.findArtist(artistsID, accessToken);
    },

    findArtistAlbums: async (artistID, limit = 10, accessToken) => {
        return await ArtistsFetchDAO.findArtistAlbums(artistID, limit, accessToken);
    },

    findTopArtist: async (artistID, accessToken) => {
        return await ArtistsFetchDAO.findTopArtist(artistID, accessToken);
    },
};

export default artistController