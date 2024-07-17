const CLIENT_ID = '76ca608f33884c65912133846d5a046a';
const CLIENT_SECRET = 'c7567cfd97cf4eb0a354ddb12268ad90';
const REDIRECT_URI = 'http://localhost:8888/callback';
let accessToken = '';

async function getAccessToken() {
    const authUrl = `https://accounts.spotify.com/api/token`;
    const response = await fetch(authUrl, {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    accessToken = data.access_token;
}

// Call this function to get the token
getAccessToken();

const audio = document.getElementById("audio");
const trackTitle = document.getElementById("track-title");
const trackArtist = document.getElementById("track-artist");
const albumCover = document.getElementById("album-cover");
const searchInput = document.getElementById("search-input");
const trackListDiv = document.getElementById("track-list");

searchInput.addEventListener("input", async () => {
    const query = searchInput.value;
    if (query) {
        const tracks = await searchSongs(query);
        displayTracks(tracks);
    } else {
        trackListDiv.innerHTML = ''; // Clear results
    }
});

async function searchSongs(query) {
    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`;
    const response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    const data = await response.json();
    return data.tracks.items; // Return the list of tracks
}

function displayTracks(tracks) {
    trackListDiv.innerHTML = ''; // Clear previous results
    tracks.forEach(track => {
        const trackElement = document.createElement("div");
        trackElement.textContent = `${track.name} - ${track.artists.map(artist => artist.name).join(", ")}`;
        trackElement.classList.add("track-item");
        trackElement.addEventListener("click", () => {
            trackTitle.textContent = track.name;
            trackArtist.textContent = track.artists.map(artist => artist.name).join(", ");
            albumCover.src = track.album.images[0]?.url || ''; // Use the first image
            audio.src = track.preview_url || ''; // Use preview URL or handle as needed
            audio.play();
        });
        trackListDiv.appendChild(trackElement);
    });
}
