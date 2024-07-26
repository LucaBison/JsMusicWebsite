window.onload = addSongDisplayer()
window.onload = checkUser()

function checkUser() {
    let actualUser = JSON.parse(localStorage.getItem("actualUser"));
    let actualPlaylist = JSON.parse(localStorage.getItem("actualPlaylist"));
    let found
    actualUser.playlists.forEach(playlist => {
        if (playlist.id == actualPlaylist.id) {
            found = true
        }
    });
    if (actualPlaylist.owner != actualUser.username) {
        hide('add-song-container')
        hide('remove-song-container')
        hide('playlist-modifier-button')
        if (found == true) {
            block('remove-playlist-button')
        } else {
            block('add-playlist-button')
        }
    }
}

function modifyPlaylist() {
    let users = JSON.parse(localStorage.getItem("users"));
    let actualUser = JSON.parse(localStorage.getItem("actualUser"));
    let playlists = JSON.parse(localStorage.getItem("playlists"));
    let actualPlaylist = JSON.parse(localStorage.getItem("actualPlaylist"));
    let newname = document.getElementById("playlist-newname").value;
    let emptyName = false
    if (newname == "") {
        newname = actualPlaylist.name
        emptyName = true
    }
    let newdescription = document.getElementById("playlist-newdescription").value;
    if (newdescription == "") {
        newdescription = actualPlaylist.description
    }
    let getVisibility = document.getElementById("newoption-1");
    let newvisibility
    if (getVisibility.checked == true) {
        newvisibility = "pubblica"
    } else {
        newvisibility = "privata"
    }
    let modifiedPlaylist = {
        "name": newname,
        "description": newdescription,
        "owner": actualUser.username,
        "visibility": newvisibility,
        "tag": actualPlaylist.tag,
        "songs": actualPlaylist.songs,
        "id": actualPlaylist.id,
    }

    if (validatePlaylist(modifiedPlaylist, emptyName)) {
        for (let i = 0; i < actualUser.playlists.length; i++) {
            if (actualPlaylist.id == actualUser.playlists[i].id) {
                actualUser.playlists.splice(i, 1, modifiedPlaylist)
            }
        }

        playlists.forEach((playlist, i) => {
            if (playlist.id == modifiedPlaylist.id && actualUser.username == actualPlaylist.owner) {
                playlists.splice(i, 1, modifiedPlaylist);
            } else {
                playlists.push(modifiedPlaylist)
            }
        });

        let modifiedUser = actualUser
        for (let i = 0; i < users.length; i++) {
            if (users[i].username == modifiedUser.username) {
                users.splice(i, 1, modifiedUser);
            }
        }

        localStorage.setItem("playlists", JSON.stringify(playlists))
        localStorage.setItem("actualPlaylist", JSON.stringify(modifiedPlaylist))
        localStorage.setItem("actualUser", JSON.stringify(modifiedUser));
        localStorage.setItem("users", JSON.stringify(users))
        document.getElementById("modify-playlist-form").reset()
        alert("Playlist modificata con successo!")
        document.location.href = "homepage.html"
    }
}

function validatePlaylist(playlist, name) {
    let actualUser = JSON.parse(localStorage.getItem("actualUser"));
    for (let i = 0; i < actualUser.playlists.length; i++) {
        if (actualUser.playlists[i].name == playlist.name && name != true) {
            alert("Hai già una playlist con questo nome")
            return false
        }
    }
    return true
}

function addPlaylist() {
    let actualPlaylist = JSON.parse(localStorage.getItem("actualPlaylist"))
    let actualUser = JSON.parse(localStorage.getItem("actualUser"))
    let users = JSON.parse(localStorage.getItem("users"))
    let found
    actualUser.playlists.forEach(playlist => {
        if (playlist.id == actualPlaylist.id) {
            found = true
        }
    });
    if (found == true) {
        alert("Hai già questa playlist!")
    } else {
        actualUser.playlists.push(actualPlaylist)
        alert("Playlist aggiunta con successo!")
    }
    localStorage.setItem("actualUser", JSON.stringify(actualUser));
    localStorage.setItem("users", JSON.stringify(users));
    document.location.href = "Homepage.html"
}

function removePlaylist() {
    let actualPlaylist = JSON.parse(localStorage.getItem("actualPlaylist"));
    let actualUser = JSON.parse(localStorage.getItem("actualUser"));
    let users = JSON.parse(localStorage.getItem("users"))
    for (let i = 0; i < actualUser.playlists.length; i++) {
        if (actualUser.playlists[i].id == actualPlaylist.id) {
            actualUser.playlists.splice(i, 1);
        }
    }
    localStorage.setItem("actualUser", JSON.stringify(actualUser));
    localStorage.setItem("users", JSON.stringify(users));
    alert("Playlist rimossa con successo")
    document.location.href = "Homepage.html"

}

function deletePlaylist() {
    let users = JSON.parse(localStorage.getItem("users"));
    let actualUser = JSON.parse(localStorage.getItem("actualUser"));
    let actualPlaylist = JSON.parse(localStorage.getItem("actualPlaylist"));
    let playlists = JSON.parse(localStorage.getItem("playlists"));

    for (let i = 0; i < actualUser.playlists.length; i++) {
        if (actualUser.playlists[i].id == actualPlaylist.id) {
            actualUser.playlists.splice(i, 1);
        }
    }

    let modifiedUser = actualUser
    for (let i = 0; i < users.length; i++) {
        if (users[i].username == modifiedUser.username) {
            users.splice(i, 1, modifiedUser);
        }
    }

    playlists.forEach((playlist, i) => {
        if (playlist.id == actualPlaylist.id && playlist.owner == actualUser.username) {
            playlists.splice(i, 1)
        }
    });

    if (actualUser.playlists.length == 0) {
        let displayers = document.querySelectorAll('.playlist-displayer');
        displayers.forEach(element => {
            element.style.display = "none"
        });
    }
    localStorage.setItem("playlists", JSON.stringify(playlists));
    localStorage.setItem("tags", JSON.stringify([]));
    localStorage.setItem("actualPlaylist", null);
    localStorage.setItem("actualUser", JSON.stringify(modifiedUser));
    localStorage.setItem("users", JSON.stringify(users));
    alert("playlist eliminata con successo")
    document.location.href = "homepage.html"
}

// creazione ed eliminazione di elementi dinamici nell'html

function addSongDisplayer() {
    let actualPlaylist = JSON.parse(localStorage.getItem("actualPlaylist"))
    actualPlaylist.songs.forEach(song => {
        const newDiv = document.createElement("div");
        newDiv.classList.add("song-displayer");
        newDiv.setAttribute("divID", song.id)
        const imageDiv = document.createElement("image");
        let url = song.image[1].url
        imageDiv.classList.add("image-displayer");
        newBackGround(imageDiv, url)
        let info = "Nome: " + song.name + "<br>Cantante: " + song.artist + "<br>Genere: " + song.genre + "<br>Pubblicazione: " + song.release
        newDiv.innerHTML = info

        const container = document.createElement("div");
        container.classList.add("songs-displayer")
        container.appendChild(imageDiv)
        container.appendChild(newDiv)
        document.getElementById("div2").appendChild(container);
    });

    localStorage.setItem("actualPlaylist", JSON.stringify(actualPlaylist));
}

function newBackGround(element, background) {
    element.style.backgroundImage = "url(" + background + ")";
}

// display del form di modifica della playlist

function displayModifyPlaylist() {
    flex("modify-playlist-form")
    let addSongDisplayers = document.querySelectorAll(".song-displayer")
    addSongDisplayers.forEach(displayer => {
        displayer.remove()
    });
    let imageDisplayers = document.querySelectorAll(".image-displayer")
    imageDisplayers.forEach(displayer => {
        displayer.remove()
    });
    hide("add-song-container")
    hide("remove-song-container")
    hide("playlist-modifier-button")
}

// funzioni di aggiunta o rimozione delle canzoni e tags dalla playlist

function addSong() {
    let users = JSON.parse(localStorage.getItem("users"));
    let actualUser = JSON.parse(localStorage.getItem("actualUser"));
    let actualPlaylist = JSON.parse(localStorage.getItem("actualPlaylist"));
    let playlists = JSON.parse(localStorage.getItem("playlists"));
    let newSong = JSON.parse(localStorage.getItem("actualSong"));
    let found
    actualPlaylist.songs.forEach(song => {
        if (song.id == newSong.id){
            found = true
            alert("Hai già questa canzone")
        }
    });
    if (newSong != "" && found != true) {
        let songs = actualPlaylist.songs
        songs.push(newSong)
        let modifiedPlaylist = {
            "name": actualPlaylist.name,
            "description": actualPlaylist.description,
            "owner": actualUser.username,
            "visibility": actualPlaylist.visibility,
            "tag": actualPlaylist.tag,
            "songs": songs,
            "id": actualPlaylist.id,
        }
        for (let i = 0; i < actualUser.playlists.length; i++) {
            if (actualUser.playlists[i].id == actualPlaylist.id) {
                actualUser.playlists.splice(i, 1, modifiedPlaylist);
            }
        }
        let modifiedPlaylists = actualUser.playlists
        for (let i = 0; i < modifiedPlaylists.length; i++) {
            playlists.forEach((playlist, j) => {
                if (playlist.id == modifiedPlaylists[i].id && actualUser.username == actualPlaylist.owner) {
                    playlists.splice(j, 1, modifiedPlaylists[i])
                } 
            });
        }
        let modifiedUser = actualUser
        for (let i = 0; i < users.length; i++) {
            if (users[i].username == modifiedUser.username) {
                users.splice(i, 1, modifiedUser);
            }
        }
        localStorage.setItem("tags", JSON.stringify(actualPlaylist.tag));
        localStorage.setItem("playlists", JSON.stringify(playlists));
        localStorage.setItem("actualPlaylist", JSON.stringify(actualPlaylist));
        localStorage.setItem("actualUser", JSON.stringify(modifiedUser));
        localStorage.setItem("users", JSON.stringify(users));
        document.getElementById("add-track").value = ""
        alert("canzone aggiunta con successo")
    } 
    setStorage()
    location.reload()
}

function addTagModify() {
    let actualPlaylist = JSON.parse(localStorage.getItem("actualPlaylist"))
    let tag = document.getElementById("tag-modify").value;
    if (tag != ""){
        actualPlaylist.tag.push(tag)
        alert("Tag aggiunto con successo")
    } else {
        alert("Tag vuoto!")
    }
    document.getElementById("tag-modify").value = ""
    localStorage.setItem("actualPlaylist", JSON.stringify(actualPlaylist))
}

function removeTag() {
    let removetag = document.getElementById("removetag").value;
    let found = false;
    let actualPlaylist = JSON.parse(localStorage.getItem("actualPlaylist"));
    for (let i = 0; i < actualPlaylist.tag.length; i++) {
        if (actualPlaylist.tag[i] == removetag) {
            actualPlaylist.tag.splice(i, 1)
            found = true
            alert("Tag rimosso con successo")
        }
    }
    if (found == false) {
        alert("Impossibile rimuovere, non trovo questo tag")
    }
    document.getElementById("removetag").value = ""
    localStorage.setItem("actualPlaylist", JSON.stringify(actualPlaylist))
}

function removeSong() {
    let users = JSON.parse(localStorage.getItem("users"));
    let actualUser = JSON.parse(localStorage.getItem("actualUser"));
    let actualPlaylist = JSON.parse(localStorage.getItem("actualPlaylist"));
    let playlists = JSON.parse(localStorage.getItem("playlists"));
    let removeSong = document.getElementById("remove-track").value;
    let songs = actualPlaylist.songs
    for (let i = 0; i < songs.length; i++) {
        if (songs[i].name == removeSong) {
            songs.splice(i, 1)
        }
    }
    let modifiedPlaylist = {
        "name": actualPlaylist.name,
        "description": actualPlaylist.description,
        "owner": actualUser.username,
        "visibility": actualPlaylist.visibility,
        "tag": actualPlaylist.tag,
        "songs": songs,
        "id": actualPlaylist.id,
    }

    for (let i = 0; i < actualUser.playlists.length; i++) {
        if (actualUser.playlists[i].id == actualPlaylist.id) {
            actualUser.playlists.splice(i, 1, modifiedPlaylist);
        }
    }

    let modifiedPlaylists = actualUser.playlists
    for (let i = 0; i < modifiedPlaylists.length; i++) {
        playlists.forEach((playlist, j) => {
            if (playlist.id == modifiedPlaylists[i].id) {
                playlists.splice(j, 1, modifiedPlaylists[i])
            }
        });
    }

    let modifiedUser = actualUser
    for (let i = 0; i < users.length; i++) {
        if (users[i].username == modifiedUser.username) {
            users.splice(i, 1, modifiedUser);
        }
    }

    localStorage.setItem("playlists", JSON.stringify(playlists));
    localStorage.setItem("actualPlaylist", JSON.stringify(modifiedPlaylist));
    localStorage.setItem("actualUser", JSON.stringify(modifiedUser));
    localStorage.setItem("users", JSON.stringify(users));
    document.getElementById("remove-track").value = ""
    alert("canzone rimossa con successo")
    setStorage()
    location.reload()
}


// acquisizione delle canzoni dall' API 

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

function getSongPlaylist(datalist) {
    let actualPlaylist = JSON.parse(localStorage.getItem("actualPlaylist"));
    var datalist = document.getElementById(datalist);
    datalist.innerHTML = "";
    var songs = actualPlaylist.songs
    for (let i = 0; i < songs.length; i++) {
        datalist.innerHTML += '<option value="' + songs[i].name + '" />'
    }
}
// funzioni di supporto

function hide(element) {
    document.getElementById(element).style.display = "none"
}

function block(element) {
    document.getElementById(element).style.display = "block"
}

function flex(element) {
    document.getElementById(element).style.display = "flex"
}

function setStorage() {
    let users = JSON.parse(localStorage.getItem("users"));
    let actualUser = JSON.parse(localStorage.getItem("actualUser"));
    let actualPlaylist = JSON.parse(localStorage.getItem("actualPlaylist"));
    let playlists = JSON.parse(localStorage.getItem("playlists"));
    //let tags = JSON.parse(localStorage.getItem("tags"));
    localStorage.clear()
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("actualUser", JSON.stringify(actualUser));
    localStorage.setItem("actualPlaylist", JSON.stringify(actualPlaylist));
    localStorage.setItem("playlists", JSON.stringify(playlists));
    //localStorage.setItem("tags", JSON.stringify(tags));

}