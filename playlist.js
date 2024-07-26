window.onload = addElement()
tags = []
window.onload = localStorage.setItem("tags", JSON.stringify(tags))


// gestione delle playlist

function createPlaylist() {
    let users = JSON.parse(localStorage.getItem("users"));
    let actualUser = JSON.parse(localStorage.getItem("actualUser"));
    let playlists = JSON.parse(localStorage.getItem("playlists"));
    let name = document.getElementById("playlist-name").value;
    let description = document.getElementById("playlist-description").value;
    let getVisibility = document.getElementById("option-1");
    let visibility
    if (getVisibility.checked == true) {
        visibility = "pubblica"
    } else {
        visibility = "privata"
    }

    let newPlaylist = {
        "name": name,
        "description": description,
        "owner": actualUser.username,
        "visibility": visibility,
        "tag": JSON.parse(localStorage.getItem("tags")),
        "songs": [],
        "id": generateID(),
    }
    let modifiedPlaylists
    if (validatePlaylist(newPlaylist) == true) {
        if (actualUser.playlists.length == 0) {
            modifiedPlaylists = []
        } else {
            modifiedPlaylists = actualUser.playlists
        }
        modifiedPlaylists.push(newPlaylist)
        let modifiedUser = {
            "username": actualUser.username,
            "password": actualUser.password,
            "email": actualUser.email,
            "genrePref": actualUser.genrePref,
            "artistPref": actualUser.artistPref,
            "playlists": modifiedPlaylists,
        }
        playlists.push(newPlaylist)

        for (let i = 0; i < users.length; i++) {
            if (users[i].username == actualUser.username) {
                users.splice(i, 1, modifiedUser);
            }
        }
        localStorage.setItem("playlists", JSON.stringify(playlists))
        localStorage.setItem("actualUser", JSON.stringify(modifiedUser));
        localStorage.setItem("users", JSON.stringify(users))

        document.getElementById("create-playlist-form").reset()
        alert("Playlist creata con successo!")
        window.location.href = 'homepage.html'
    }
}

function setActivePlaylist() {
    let actualUser = JSON.parse(localStorage.getItem("actualUser"));
    let displayers = document.getElementsByClassName('.playlist-displayer');
    let buttonID = this.getAttribute("buttonID");
    let actualPlaylist
    for (let i = 0; i < actualUser.playlists.length; i++) {
        if (actualUser.playlists[i].id == buttonID) {
            actualPlaylist = actualUser.playlists[i]
        }
    }
    localStorage.setItem("actualPlaylist", JSON.stringify(actualPlaylist));
    for (let i = 0; i < displayers.length; i++) {
        if (displayers[i].getAttribute("buttonID") != actualPlaylist.id) {
            displayers[i].remove()
        }
    }
    
    setStorage()
    document.location.href = "myPlaylist.html"
}

function validatePlaylist(playlist) {
    let actualUser = JSON.parse(localStorage.getItem("actualUser"));
    for (let i = 0; i < actualUser.playlists.length; i++) {
        if (actualUser.playlists[i].name == playlist.name) {
            alert("Hai già una playlist con questo nome")
            return false
        }
    }
    return true
}

// display del form di creazione della playlist

function displayCreatePlaylist() {
    block("crea-playlist")
    hide("le-tue-playlist")
    flex("create-playlist-form")
    hide("crea-nuova-playlist")
    hideClass(".playlist-displayer")
    hide("playlist-creator-button")
    //let tags = []
    //localStorage.setItem("tags", JSON.stringify(tags))
}


// creazione ed eliminazione di elementi dinamici nell'html

function addElement() {
    let actualUser = JSON.parse(localStorage.getItem("actualUser"))
    let users = JSON.parse(localStorage.getItem("users"))
    if (actualUser.playlists.length > 0) {
        let displayers = document.getElementsByClassName(".playlist-displayer")
        for (let i = 0; i < displayers.length; i++) {
            displayers[i].remove();
        }
    }

    actualUser.playlists.forEach(playlist => {
        const newButton = document.createElement("button");
        newButton.classList.add("playlist-displayer");
        newButton.setAttribute("buttonID", playlist.id)
        newButton.addEventListener("click", setActivePlaylist)
        let info = "Titolo: " + playlist.name + "<br>Descrizione: " + playlist.description
        newButton.innerHTML = info
        document.getElementById("div1").appendChild(newButton);
    });

    localStorage.setItem("actualUser", JSON.stringify(actualUser));
    localStorage.setItem("users", JSON.stringify(users));
}

function addTagCreate() {
    let tags = JSON.parse(localStorage.getItem("tags"))
    if (tags.length == 0){
        let tags = []
    } 
    let addingTag = document.getElementById("tag-create").value
    if (addingTag != ""){
        tags.push(addingTag)
        alert("Tag aggiunto con successo")
    } else {
        alert("Tag vuoto!")
    }
    document.getElementById("tag-create").value = ""
    localStorage.setItem("tags", JSON.stringify(tags))
}

// generazione id alfanumerico per le playlist

function generateID() {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + '-' + s4() + '-' + s4();

}

// funzioni di supporto

function hide(element) {
    document.getElementById(element).style.display = "none"
}

function hideClass(element) {
    let elements = document.querySelectorAll(element)
    elements.forEach(element => {
        element.style.display = "none"
    });
}

function hideByClass(element){
    element.style.display = "none"
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
    localStorage.clear()
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("actualUser", JSON.stringify(actualUser));
    localStorage.setItem("actualPlaylist", JSON.stringify(actualPlaylist));
    localStorage.setItem("playlists", JSON.stringify(playlists));

}
