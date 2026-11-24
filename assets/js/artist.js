/* ============================================================
   artist.html?id=NNN — Dettaglio artista
   lookup?id=NNN&entity=song  → artista + brani popolari
   lookup?id=NNN&entity=album → discografia
   ============================================================ */

const artistId = new URLSearchParams(location.search).get("id");
const heroEl = document.getElementById("artist-hero");
const actionsEl = document.getElementById("artist-actions");
const topTracksEl = document.getElementById("top-tracks");
const albumsSection = document.getElementById("artist-albums");
const albumsGrid = document.getElementById("artist-albums-grid");

// Ascoltatori "inventati" ma sempre uguali per lo stesso artista
function fakeListeners(id) {
  return ((Number(id) * 9301 + 49297) % 5_000_000) + 100_000;
}

async function loadArtist() {
  if (!artistId) {
    topTracksEl.replaceChildren(createError("Nessun artista selezionato."));
    return;
  }
  topTracksEl.replaceChildren(createLoader());

  try {
    const [songResults, albumResults] = await Promise.all([
      lookupItunes(artistId, "song", 15),
      lookupItunes(artistId, "album", 12),
    ]);

    const info = songResults.find((r) => r.wrapperType === "artist");
    if (!info) throw new Error("Artista non trovato");

    const artist = toArtist(info);
    const tracks = toTracks(songResults);
    const albums = albumResults.filter((r) => r.wrapperType === "collection").map(toAlbum);

    document.title = `${artist.name} — EpiTunes`;

    // --- Hero: iTunes non fornisce foto degli artisti, usiamo la cover del primo brano
    const coverBox = el("div", "hero-cover rounded-circle");
    if (tracks[0]) coverBox.append(img(tracks[0].cover));
    else coverBox.append(el("div", "media-initial", artist.name.charAt(0)));

    const listeners = fakeListeners(artist.id).toLocaleString("it-IT");
    const meta = el("div", "overflow-hidden");
    meta.append(
      el("span", "hero-kicker", "Artista"),
      el("h1", "hero-title", artist.name),
      el("p", "text-body-secondary mb-0", `${artist.genre} · ${listeners} ascoltatori mensili`)
    );

    heroEl.replaceChildren(coverBox, meta);

    // --- Pulsante play grande
    actionsEl.replaceChildren(
      createPlayBigButton("Riproduci brani popolari", () => {
        if (tracks.length) Player.playQueue(tracks, 0);
      })
    );

    // --- Brani popolari + discografia
    renderTrackRows(topTracksEl, tracks, "Nessun brano disponibile.");
    albumsSection.hidden = !albums.length;
    albumsGrid.replaceChildren(...albums.map(createAlbumCard));
  } catch (err) {
    console.error(err);
    topTracksEl.replaceChildren(createError("Impossibile caricare l'artista."));
  }
}

loadArtist();