"use strict"

import TrackFetchDAO from "../dao/trackFetchDAO.mjs"

// Controller pour les tracks
const trackController = {
    findTrack: async (accessToken, spotifyID) => {
        return await TrackFetchDAO.findTrack(accessToken, spotifyID);
    },

    findTracks: async (accessToken, spotifyIDs) => {
        return await TrackFetchDAO.findTracks(accessToken, spotifyIDs);
    },

    findTopTracks: async (accessToken, time_range = "medium_term", limit = 10) => {
        return await TrackFetchDAO.findTopTracks(accessToken, time_range, limit);
    },

    findTrackHistory: async (accessToken) => {
        return await TrackFetchDAO.findTrackHistory(accessToken);
    },
};

export default trackController;
