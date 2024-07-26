function searchSong() {
    let actualUser = JSON.parse(localStorage.getItem("actualUser"));
    let playlists = JSON.parse(localStorage.getItem("playlists"));
    let searchSong = JSON.parse(localStorage.getItem("actualSong"));
    let found
    playlists.forEach(playlist => {
        if (playlist.owner != actualUser.username && playlist.visibility == "pubblica") {
            playlist.songs.forEach(song => {
                if (song.id == searchSong.id) {
                    addElement(playlist)
                    found = true;
                }
            });
        }
    });
    if (found != true) {
        alert("Non ci sono playlist contenenti questa canzone")
    }
}

function searchTag() {
    let actualUser = JSON.parse(localStorage.getItem("actualUser"))
    let playlists = JSON.parse(localStorage.getItem("playlists"))
    let searchTag = document.getElementById("search-tag").value
    let found
    playlists.forEach(playlist => {
        if (playlist.owner != actualUser.username && playlist.visibility == "pubblica") {
            playlist.tag.forEach(tag => {
                if (tag == searchTag) {
                    addElement(playlist)
                    found = true;
                }
            });
        }
    });
    if (found != true) {
        alert("Non ci sono playlist contenenti questo tag")
    }
}

function addElement(playlist) {
    let displayers = document.querySelectorAll(".playlist-displayer");
    displayers.forEach(element => {
        element.remove()
    });
    const newButton = document.createElement("button");
    newButton.classList.add("playlist-displayer");
    newButton.setAttribute("buttonID", playlist.id)
    newButton.addEventListener("click", setActivePlaylist)
    let info = "Titolo: " + playlist.name + "<br>Descrizione: " + playlist.description
    newButton.innerHTML = info
    document.getElementById("div1").appendChild(newButton);
}


function setActivePlaylist() {
    let playlists = JSON.parse(localStorage.getItem("playlists"));

    let displayers = document.getElementsByClassName('.playlist-displayer');
    let buttonID = this.getAttribute("buttonID");
    let actualPlaylist
    playlists.forEach(playlist => {
        if (playlist.id == buttonID) {
            actualPlaylist = playlist
        }
    });
    for (let i = 0; i < displayers.length; i++) {
        if (displayers[i].getAttribute("buttonID") != actualPlaylist.id) {
            displayers[i].remove()
        }
    }
    localStorage.setItem("actualPlaylist", JSON.stringify(actualPlaylist));
    setStorage()
    document.location.href = "myPlaylist.html"
}

function getSongAPI(id, datalist) {
    var datalist = document.getElementById(datalist);
    datalist.innerHTML = "";
    var token = sessionStorage.getItem("token");
    var input = document.getElementById(id).value;
    if (input.length > 2) {
        var url = "https://api.spotify.com/v1/search?q=" + input + "&type=track";
        fetch(url, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((searchResults) => {
                let found = false
                searchResults.tracks.items.forEach(element => {
                    datalist.innerHTML += "<option value='" + element.name + "'>"
                    if (found == false) {
                        let artists = []
                        element.album.artists.forEach(artist => {
                            artists.push(artist.name)
                        });
                        /*  non riesce ad accedere al campo genre dentro a artists
                        let genres = []
                        element.artists.genres.forEach(genre => {
                            genres.push(genre)
                        });
                        */
                        var song = {
                            "id": element.id,
                            "name": element.name,
                            "image": element.album.images,
                            "artist": artists,
                            "genre": "not avaiable",
                            "duration": element.duration_ms,
                            "release": element.album.release_date
                        }
                        localStorage.setItem("actualSong", JSON.stringify(song));
                        found = true
                    }

                });
            }
            );
    }
};

function hide(element) {
    document.getElementById(element).style.display = "none"
}

function block(element) {
    document.getElementById(element).style.display = "block"
}

function setStorage() {
    let users = JSON.parse(localStorage.getItem("users"));
    let actualUser = JSON.parse(localStorage.getItem("actualUser"));
    let actualPlaylist = JSON.parse(localStorage.getItem("actualPlaylist"));
    let playlists = JSON.parse(localStorage.getItem("playlists"));
    localStorage.clear()
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("actualUser", JSON.stringify(actualUser));
    localStorage.setItem("actualPlaylist", JSON.stringify(actualPlaylist));
    localStorage.setItem("playlists", JSON.stringify(playlists));

}
