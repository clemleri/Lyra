"use strict"
import User from "../api/model/user.mjs";

import {describe, it, before, beforeEach, after} from "node:test"


describe ("Test du DAO fech User",function (){
    beforeEach(async () => {
        userTest = await User.create({  
            country: "FR", 
            display_name: "SAE401CompteTeste",
            email: "lerouleyclement@gmail.com", 
            explicit_content: {filter_enabled: false, filter_locked: false },
            external_urls: {    
                spotify: "https://open.spotify.com/user/31oyuvqauf7bw6ojpg52wlpjdbmm"},
                followers: {href: null,total: 0  }, 
                href: "https://api.spotify.com/v1/users/31oyuvqauf7bw6ojpg52wlpjdbmm", 
                id: "31oyuvqauf7bw6ojpg52wlpjdbmm", 
                images: [], 
                product: "free", 
                type: "user",
                uri: "spotify:user:31oyuvqauf7bw6ojpg52wlpjdbmm"
            });
    });
})