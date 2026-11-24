/* ============================================================
   search.html — Cerca
   - Debounce 400ms sull'input
   - Promise.all: brani, album, artisti
   - Ultima query salvata in localStorage e ripresa al caricamento
   ============================================================ */

const input = document.getElementById("search-input");
const statusEl = document.getElementById("search-status");

const rows = {
  tracks: document.getElementById("row-tracks"),
  albums: document.getElementById("row-albums"),
  artists: document.getElementById("row-artists"),
};
const grids = {
  tracks: document.getElementById("grid-tracks"),
  albums: document.getElementById("grid-albums"),
  artists: document.getElementById("grid-artists"),
};

let debounceTimer;
let lastRequest = 0; // per ignorare risposte arrivate "in ritardo"

function hideResults() {
  rows.tracks.hidden = true;
  rows.albums.hidden = true;
  rows.artists.hidden = true;
}

async function runSearch(query) {
  Store.set(KEYS.query, query);
  const requestId = ++lastRequest;

  if (!query) {
    hideResults();
    statusEl.replaceChildren();
    return;
  }

  statusEl.replaceChildren(createLoader());

  try {
    const [songs, albums, artists] = await Promise.all([
      searchItunes(query, "song", 15),
      searchItunes(query, "album", 10),
      searchItunes(query, "musicArtist", 10),
    ]);
    if (requestId !== lastRequest) return; // nel frattempo l'utente ha scritto altro

    const tracks = toTracks(songs);
    const albumList = albums.filter((r) => r.wrapperType === "collection").map(toAlbum);
    const artistList = artists.filter((r) => r.wrapperType === "artist").map(toArtist);

    renderTrackCards(grids.tracks, tracks);
    grids.albums.replaceChildren(...albumList.map(createAlbumCard));
    grids.artists.replaceChildren(...artistList.map(createArtistCard));

    rows.tracks.hidden = !tracks.length;
    rows.albums.hidden = !albumList.length;
    rows.artists.hidden = !artistList.length;

    const nothing = !tracks.length && !albumList.length && !artistList.length;
    if (nothing) statusEl.replaceChildren(createEmpty(`Nessun risultato per "${query}".`));
    else statusEl.replaceChildren();
  } catch (err) {
    console.error(err);
    if (requestId !== lastRequest) return;
    hideResults();
    statusEl.replaceChildren(createError("Ricerca non riuscita. Controlla la connessione e riprova."));
  }
}

input.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => runSearch(input.value.trim()), 400);
});

// Riprende l'ultima ricerca
const savedQuery = Store.get(KEYS.query, "");
if (savedQuery) {
  input.value = savedQuery;
  runSearch(savedQuery);
}
input.focus();