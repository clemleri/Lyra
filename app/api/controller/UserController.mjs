"use strict"

import userFetchDAO from "../dao/userFetchDAO.mjs"

// Controller pour les utilisateurs
const userController = {
    getUserProfile: async (accessToken) => {
        return await userFetchDAO.getUserProfile(accessToken);
    },

    findFollowedArtist: async (accessToken) => {
        return await userFetchDAO.findFollowedArtist(accessToken);
    },
};

export default userController
