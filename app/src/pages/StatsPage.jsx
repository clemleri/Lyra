import React from "react";
import { useState, useEffect } from "react";


// components
import TopTracks from "../components/TopTracks";
import TopArtists from "../components/TopArtists";
import Header from "../components/Header";
import ListeningHistory from "../components/ListeningHistory";

let loggedIn = false

// Appears when the user is logged in
const LoggedInContent = () => {
    // State variables to store the data fetched from the backend
    const [tracks, setTracks] = useState([]); // most listened tracks
    const [artists, setArtists] = useState([]); // most listened artists
    const [history, setHistory] = useState([]); // listening history
    const [timeRange, setTimeRange] = useState("short_term"); // time range for the stats

    const time_ranges = ["long_term", "medium_term", "short_term"]
    
    // Fetch data from the backend depending on the time range
    // TODO: fetch data from the backend with the timeRange parameter
    const fetchTracks = async () => {
        try {
            const res = await fetch(`/api/tracks/top/${timeRange}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) {
                return <p>HTTP error! Status: ${res.status}</p>;
            }
            const newTopTracks = await res.json();
            setTracks(newTopTracks);
        } catch (e) {
            console.error("Error while trying to fetch:", e);
            return <p>Error while trying to fetch: {e.message}</p>;
        }
    }
    const fetchArtists = async () => {
        try {
            const res = await fetch(`/api/artists/top`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) {
                return <p>HTTP error! Status: ${res.status}</p>;
            }
            const newTopArtists = await res.json();
            setArtists(newTopArtists);
        } catch (e) {
            console.error("Error while trying to fetch:", e);
            return <p>Error while trying to fetch: {e.message}</p>;
        }
    }

    const fetchHistory = async () => {
        try {
            const res = await fetch("/api/tracks/history", {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) {
                return <p>HTTP error! Status: ${res.status}</p>;
            }
            const newTrackHistory = await res.json();
            setHistory(newTrackHistory);
        } catch (e) {
            console.error("Error while trying to fetch:", e);
            return <p>Error while trying to fetch: {e.message}</p>;
        }
    }

    // Fetch data from the backend when the component is mounted or when the time range changes
    // Calls the fetch functions to get the data
    useEffect(() => {
        fetchTracks();
        fetchArtists();
        fetchHistory();
    }, [timeRange]);


    return (
        <div className="content">
            {/* Message de haut de page */}
            <h1 className="welcomeLabel">Welcome to your Spotify Stats!</h1>
            {/* Options */}
            <div className="settings">
                <select className="select" id="timeRange" name="timeRange" onChange={(e) => setTimeRange(e.target.value)} defaultValue={time_ranges[2]}>
                    <option value={time_ranges[2]}>4 semaines</option>
                    <option value={time_ranges[1]}>6 mois</option>
                    <option value={time_ranges[0]}>1 an</option>
                </select>
            </div>
            {/* Stats */}
            <TopTracks topTracks={tracks}/>
            <TopArtists topArtists={artists}/>
            <ListeningHistory recentlyPlayedTracks={history}/>
        </div>
    );
}

const RedirectComponent = () => {
    const handleRedirect = () => {
        window.location.href = '/api/login'
    }

    return (
        <button onClick={handleRedirect} className="loginButton">Login</button>
    );
}

// Appears when the user is not logged in
// Asks the user to log in to see their stats
const LoggedOutContent = () => {
    return (
        <div className="logged-out-page">
            <h2>Welcome to your favourite stats website for spotify</h2>
            <p>Login if you want to see your stats</p>
            <RedirectComponent />
        </div>
    );
}

// Main component 
const StatsPage = () => {
    const [status, setStatus] = useState(null); // null, 'logged_in', 'logged_out'

    useEffect(() => {
        const checkAccess = async () => {
            try {
                const res = await fetch('/api/access-token', { credentials: 'include' });
                if (res.status === 401) {
                    setStatus('logged_out');
                    loggedIn = false
                } else if (res.status === 200) {
                    setStatus('logged_in');
                    loggedIn = true
                }
            } catch (error) {
                console.error('Erreur lors de la vérification du token:', error);
                setStatus('logged_out');
            }
        };

        checkAccess();
    }, []);

    if (status === null) {
        return <p>Chargement...</p>;
    } else if (status === 'logged_out') {
        return <LoggedOutContent />;
    } else {
        return <LoggedInContent />;
    }
};

const MainPage = () => {
    return (
        <div>
            <Header isLoggedIn={loggedIn}/>
            <div className="pageBody">
                <StatsPage/>
            </div>
        </div>

    )
}

export default MainPage;