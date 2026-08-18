let songs = [];
const songBox =
    document.getElementById("songs");
const title =
    document.getElementById("title");

fetch("data/tabs.json")
    .then(res => res.json())
    .then(data => {
        songs = data;
        loadFromURL();
    });

function displaySongs(list) {
    songBox.innerHTML = "";
    if (list.length === 0) {
        songBox.innerHTML =
            "<p>No tabs found.</p>";
        return;
    }
    list.forEach(song => {
        let links = "";
        if (song.youtube) {
            links += `
                <a class="icon-link"
                href="${song.youtube}"
                title="Watch video on YouTube"
                target="_blank"
                onclick="event.stopPropagation();">
                    <img src="assets/20260805_logo_youtube.png" alt="YouTube logo">
                </a>
                `;
        }
        if (song.colab) {
            links += `
                <a class="icon-link"
                href="${song.colab}"
                title="Open notebook in Google Colab"
                target="_blank"
                onclick="event.stopPropagation();">
                    <img src="assets/20260805_logo_colab.png" alt="Google Colab logo">
                </a>
                `;
        }
        let tags = "";
        song.tags.forEach(t => {
            tags += `
                <span class="tag">${t}</span>
                `;
        });
        songBox.innerHTML += `
            <div class="card"onclick="openPDF('${song.pdf}')">
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
                <div>${tags}</div>
                <div class="links">${links}</div>
            </div>
            `;
    });
}

function filterTag(tag) {
    let url = new URL(window.location);
    url.searchParams.set("tag", tag);
    history.pushState({}, "", url);
    let result =
        songs.filter(song =>
            song.tags.includes(tag)
        );
    title.innerHTML = tag + " Tabs";
    displaySongs(result);
}

function showAll() {
    history.pushState({}, "", window.location.pathname);
    title.innerHTML = "All Tabs";
    displaySongs(songs);
}

document
    .getElementById("search")
    .addEventListener(
        "input",
        function () {
            let keyword =
                this.value.toLowerCase();
            let result =
                songs.filter(song =>
                    song.title
                        .toLowerCase()
                        .includes(keyword)
                    ||
                    song.artist
                        .toLowerCase()
                        .includes(keyword)
                );
            displaySongs(result);
        });

function loadFromURL() {
    let params =
        new URLSearchParams(
            window.location.search
        );
    let tag =
        params.get("tag");
    if (tag) {
        filterTag(tag);
    }
    else {
        displaySongs(songs);
    }
}

function openPDF(pdf) {
    window.open(pdf, "_blank");
}

const amazonBox = document.getElementById("amazon-box");
const amazonClose = document.getElementById("amazon-close");

amazonClose.onclick = function () {
    amazonBox.style.display = "none";
};

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

amazonBox.addEventListener("mousedown", (e) => {
    if (
        e.target.closest("a") ||
        e.target.closest("button")
    ) {
        return;
    }
    isDragging = true;
    const rect = amazonBox.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    amazonBox.style.right = "auto";
    amazonBox.style.bottom = "auto";
    amazonBox.style.left = rect.left + "px";
    amazonBox.style.top = rect.top + "px";
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    amazonBox.style.left =
        e.clientX - offsetX + "px";
    amazonBox.style.top =
        e.clientY - offsetY + "px";
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});