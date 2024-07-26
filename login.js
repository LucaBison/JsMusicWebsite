window.onload = getApi()

// funzioni di log-in/log-out/sign-up

function login() {
    window.location.href = "Homepage.html";
}

function signIn() {
    let found = false;
    let users = JSON.parse(localStorage.getItem("users"));
    let userID = document.getElementById("user").value;
    let passID = document.getElementById("pass").value;
    if (validateUsername(userID) != false) {
        for (let i = 0; i < users.length; i++) {
            if (userID == users[i].username && passID == users[i].password) {   //verifico le combinazioni password/username
                found = true;
                actualUser = {
                    "username": users[i].username,
                    "password": users[i].password,
                    "email": users[i].email,
                    "genrePref": users[i].genrePref,
                    "artistPref": users[i].artistPref,
                    "playlists": users[i].playlists,
                }
                localStorage.setItem("actualUser", JSON.stringify(actualUser));
                window.location.href = "Homepage.html"
                break
            }
            if (userID == users[i].username && passID != users[i].password) {
                found = true;
                alert("Password errata");
            }
        }
        if (found == false) {
            alert("Utente non trovato");
        }
    }
}

function signUp() {
    let users = JSON.parse(localStorage.getItem("users"));
    if (users == null) {
        users = [];
    }
    let playlists = JSON.parse(localStorage.getItem("playlists"));
    if (playlists == null) {
        playlists = [];
    }
    localStorage.setItem("playlists", JSON.stringify(playlists))
    let valid = true;
    let found = false;
    let userID = document.getElementById("new-user").value;
    let passID = document.getElementById("new-pass").value;
    let email = document.getElementById("new-email").value;
    let selectGenre1 = document.getElementById("select-genres1").value;
    let selectGenre2 = document.getElementById("select-genres2").value;
    let selectGenre3 = document.getElementById("select-genres3").value;
    let selectArtist1 = document.getElementById("select-artist1").value;
    let selectArtist2 = document.getElementById("select-artist2").value;
    let selectArtist3 = document.getElementById("select-artist3").value;
    let actualUser = {
        "username": userID,
        "password": passID,
        "email": email,
        "genrePref": [selectGenre1, selectGenre2, selectGenre3],
        "artistPref": [selectArtist1, selectArtist2, selectArtist3],
        "playlists": [],
    }

    // verifica delle condizioni dei dati inseriti

    if (validateUsername(userID) == false) {
        valid = false;
    }
    if (validatePassword(passID) == false) {
        valid = false;
    }

    if (validateEmail(email) == false) {
        valid = false;
    }

    if (validateArtist(selectArtist1, selectArtist2, selectArtist3) == false) {
        valid = false;
    }

    if (validateGenre(selectGenre1, selectGenre2, selectGenre3) == false) {
        valid = false;
    }


    // aggiunge lo user creato alla lista di users

    if (valid == true) {
        if (users.length == 0) {        // gestisco il caso base senza utenti
            users.push(actualUser)
            localStorage.setItem("users", JSON.stringify(users));
            alert("Registrato con successo")
            displaySignIn()
            document.getElementById("sign-up-form").reset(); // reset del form

        } else {                        // verifico se l'id sia presente nel database
            for (let i = 0; i < users.length; i++) {
                if (userID == users[i].username || email == users[i].email) {
                    found = true;
                    alert("Già registrato, prova nel login");
                }
            }
            if (found == false) {       // se non trovo l'id o la email, registro l'utente
                users.push(actualUser)
                localStorage.setItem("users", JSON.stringify(users));
                alert("Registrato con successo")
                document.getElementById("sign-up-form").reset();
                displaySignIn()
            }
        }
    }
}

function logOut() {
    let users = JSON.parse(localStorage.getItem("users"));
    let actualUser = JSON.parse(localStorage.getItem("actualUser"));

    modifiedUser = actualUser
    for (let i = 0; i < users.length; i++) {
        if (users[i].username == actualUser.username) {
            users.splice(i, 1, modifiedUser)
        }
    }
    if (actualUser.playlists.length > 0) {
        document.querySelectorAll('.playlist-displayer').forEach(e => e.remove());
    }
    alert("Log Out!")
    localStorage.setItem("users", JSON.stringify(users))
    localStorage.setItem("actualPlaylist", JSON.stringify(null));
    localStorage.setItem("actualUser", JSON.stringify(null));
    window.location.href = 'login.html';
}

function displaySignUp() {
    flex("sign-up-form")
    block("display-sign-in")
    hide("sign-in-form")
    hide("display-sign-up")
}

function displaySignIn() {
    flex("sign-in-form")
    block("display-sign-up")
    hide("sign-up-form")
    hide("display-sign-in")
}

// funzioni di modifica/eliminazione del profilo
function modifyCredentials() {
    let users = JSON.parse(localStorage.getItem("users"));
    let actualUser = JSON.parse(localStorage.getItem("actualUser"));
    let playlists = JSON.parse(localStorage.getItem("playlists"));
    let modifiedUsername = document.getElementById("modify-user").value;
    let modifiedPassword = document.getElementById("modify-pass").value;
    let modifiedEmail = document.getElementById("modify-email").value
    let modifiedGenre1 = document.getElementById("modify-genres1").value;
    let modifiedGenre2 = document.getElementById("modify-genres2").value;
    let modifiedGenre3 = document.getElementById("modify-genres3").value;
    let modifiedArtist1 = document.getElementById("modify-artist1").value;
    let modifiedArtist2 = document.getElementById("modify-artist2").value;
    let modifiedArtist3 = document.getElementById("modify-artist3").value;
    if (modifiedGenre1 == ""){
        modifiedGenre1 = actualUser.genrePref[0]
    }
    if (modifiedGenre2 == ""){
        modifiedGenre2 = actualUser.genrePref[1]
    }
    if (modifiedGenre3 == ""){
        modifiedGenre3 = actualUser.genrePref[2]
    }
    if (modifiedArtist1 == ""){
        modifiedArtist1 = actualUser.artistPref[0]
    }
    if (modifiedArtist2 == ""){
        modifiedArtist2 = actualUser.artistPref[1]
    }
    if (modifiedArtist3 == ""){
        modifiedArtist3 = actualUser.artistPref[2]
    }
    if ((validateGenre(modifiedGenre1, modifiedGenre2, modifiedGenre3) != false)
        && (validateArtist(modifiedArtist1, modifiedArtist2, modifiedArtist3) != false)) {

        let modifiedPlaylists = actualUser.playlists
        modifiedPlaylists.forEach(playlist => {
            playlist.owner = modifiedUsername
        });

        if (modifiedPassword == ""){
            modifiedPassword = actualUser.password
        }
        if (modifiedUsername == ""){
            modifiedUsername = actualUser.username
        }
        if (modifiedEmail == ""){
            modifiedEmail = actualUser.email
        }
        let modifiedUser = {
            "username": modifiedUsername,
            "password": modifiedPassword,
            "email": modifiedEmail,
            "genrePref": [modifiedGenre1, modifiedGenre2, modifiedGenre3],
            "artistPref": [modifiedArtist1, modifiedArtist2, modifiedArtist3],
            "playlists": modifiedPlaylists
        }

        playlists.forEach(playlist => {
            for (let j = 0; j < modifiedPlaylists.length; j++) {
                if (playlist.id == modifiedPlaylists[j].id) {
                    playlist.owner = modifiedPlaylists[j].owner
                }
            }

        });


        for (let i = 0; i < users.length; i++) {
            if (users[i].username === actualUser.username) {
                users.splice(i, 1, modifiedUser);
            }
        }

        localStorage.setItem("actualPlaylist", null)
        localStorage.setItem("playlists", JSON.stringify(playlists))
        localStorage.setItem("actualUser", JSON.stringify(modifiedUser));
        localStorage.setItem("users", JSON.stringify(users));
        alert("Credenziali cambiate con successo!")
        document.getElementById("modify-credencials-form").reset()
        window.location.href = 'Homepage.html'
    }

}

function deleteProfile() {
    block("cancel-confirm-button")
}

function deleteConfirm() {
    let users = JSON.parse(localStorage.getItem("users"));
    let actualUser = JSON.parse(localStorage.getItem("actualUser"));

    for (let i = 0; i < users.length; i++) {
        if (users[i].username === actualUser.username) {
            users.splice(i, 1);
        }
    }
    localStorage.setItem("actualPlaylist", null)
    localStorage.setItem("actualUser", null)
    localStorage.setItem("users", JSON.stringify(users));
    alert("Profilo eliminato")
    window.location.href = 'login.html'
}

function validateUsername(user) {
    if (user.length < 5 || user.length > 12) {
        alert("Lo username dev'essere compreso tra i 5 e i 12 caratteri");
        return false;
    }
}

function validatePassword(pass) {
    if (pass.length < 6 || pass.length > 12) {
        alert("La password dev'essere compresa tra i 6 e i 12 caratteri");
        return false;
    }
}

function validateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {          //uso una regex per controllare la email
        return (true)
    }
    alert("Inserisci una email valida");
    return (false)
}

function validateArtist(artist1, artist2, artist3) {
    if (artist1 == artist2 || artist1 == artist3 || artist2 == artist3) {
        alert("Scegliere artisti diversi tra loro")
        return false;
    }
}

function validateGenre(genre1, genre2, genre3) {
    if (genre1 == genre2 || genre1 == genre3 || genre2 == genre3) {
        alert("Scegliere generi musicali diversi tra loro")
        return false;
    }
}

// funzioni di utilizzo dell'API

function getApi() {
    const client_id = "cd32aa8768f94a5282adbbdb05e4541d"
    const client_secret = "b275f313c139452e999232bc9f7f0c2b"
    var url = "https://accounts.spotify.com/api/token"
    fetch(url, {
        method: "POST",
        headers: {
            Authorization: "Basic " +
                btoa(`${client_id}:${client_secret}`),
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ grant_type: "client_credentials" }),
    })
        .then((response) => response.json())
        .then((tokenResponse) => {
            sessionStorage.setItem("token", tokenResponse.access_token)
        }
        )

}

function getGenres(id) {
    var selectGenres = document.getElementById(id);
    var token = sessionStorage.getItem("token");
    var url = "https://api.spotify.com/v1/recommendations/available-genre-seeds"
    fetch(url, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((searchResults) => {
            searchResults.genres.forEach(element => {
                selectGenres.innerHTML += "<option>" + element + "</option>"
            });
        });
}

function getArtists(id, datalist) {
    var datalist = document.getElementById(datalist);
    datalist.innerHTML = "";
    var token = sessionStorage.getItem("token");
    var input = document.getElementById(id).value;
    if (input.length > 2) {
        var url = "https://api.spotify.com/v1/search?q=" + input + "&type=artist";
        fetch(url, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((searchResults) => {
                searchResults.artists.items.forEach(element => {
                    datalist.innerHTML += "<option value='" + element.name + "'>"
                });
            }
            );
    }
};

// funzioni di supporto

function hide(element){
    document.getElementById(element).style.display = "none"
}

function block(element){
    document.getElementById(element).style.display = "block"
}

function flex(element){
    document.getElementById(element).style.display = "flex"
}

function setStorage(){
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
