/* ============================================================
   album.html?id=NNN — Dettaglio album
   lookup?id=NNN&entity=song → primo risultato = album, poi i brani
   ============================================================ */

const albumId = new URLSearchParams(location.search).get("id");
const heroEl = document.getElementById("album-hero");
const actionsEl = document.getElementById("album-actions");
const tracklistEl = document.getElementById("tracklist");

async function loadAlbum() {
  if (!albumId) {
    tracklistEl.replaceChildren(createError("Nessun album selezionato."));
    return;
  }
  tracklistEl.replaceChildren(createLoader());

  try {
    const results = await lookupItunes(albumId, "song");
    const info = results.find((r) => r.wrapperType === "collection");
    if (!info) throw new Error("Album non trovato");

    const album = toAlbum(info);
    const tracks = toTracks(results);
    const totalMs = tracks.reduce((sum, t) => sum + (t.duration || 0), 0);

    document.title = `${album.title} — EpiTunes`;

    // --- Hero: cover + testi
    const coverBox = el("div", "hero-cover");
    coverBox.append(img(album.cover, `Copertina di ${album.title}`));

    const sub = el("p", "text-body-secondary mb-0");
    sub.append(
      link(`artist.html?id=${album.artistId}`, "fw-bold text-white link-hover", album.artist),
      ` · ${album.year} · ${album.count} brani · ${formatTotal(totalMs)}`
    );

    const meta = el("div", "overflow-hidden");
    meta.append(el("span", "hero-kicker", "Album"), el("h1", "hero-title", album.title), sub);

    heroEl.replaceChildren(coverBox, meta);

    // --- Pulsante play grande
    actionsEl.replaceChildren(
      createPlayBigButton("Riproduci album", () => {
        if (tracks.length) Player.playQueue(tracks, 0);
      })
    );

    // --- Tracklist
    renderTrackRows(tracklistEl, tracks, "Nessuna anteprima disponibile per questo album.");
  } catch (err) {
    console.error(err);
    tracklistEl.replaceChildren(createError("Impossibile caricare l'album."));
  }
}

loadAlbum();