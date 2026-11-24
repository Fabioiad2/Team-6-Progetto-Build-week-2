/* ============================================================
   EpiTunes — common.js  (caricato da TUTTE le pagine)
   Niente innerHTML: solo createElement + getElementById.

   1. API iTunes (search / lookup)
   2. Utility + normalizzazione dati
   3. Helper DOM (creazione elementi)
   4. localStorage (preferiti, cronologia, ultima query...)
   5. Componenti (card, righe tracklist, stati)
   6. Sidebar
   7. Player
   8. Avvio
   ============================================================ */

/* ---------- 1. API ---------- */

const API_BASE = "https://itunes.apple.com";
const COUNTRY = "IT";

async function callItunes(endpoint, params) {
  const url = new URL(`${API_BASE}/${endpoint}`);
  const query = { country: COUNTRY, ...params };
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) url.searchParams.set(key, value);
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Errore API (${res.status})`);
  const data = await res.json();
  return data.results;
}

// entity: "song" | "album" | "musicArtist"
function searchItunes(term, entity, limit = 12) {
  return callItunes("search", { term, entity, limit, media: "music" });
}

// lookup?id=NNN&entity=song  (il primo risultato è l'album/artista stesso)
function lookupItunes(id, entity, limit) {
  return callItunes("lookup", { id, entity, limit });
}

/* ---------- 2. Utility + normalizzazione ---------- */

// L'API restituisce cover 100x100: chiediamo una versione più grande
function coverUrl(url, size = 600) {
  return url ? url.replace(/\d+x\d+bb/, `${size}x${size}bb`) : "";
}

function formatTime(ms = 0) {
  const sec = Math.floor(ms / 1000);
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}

function formatTotal(ms = 0) {
  const min = Math.round(ms / 60000);
  return min >= 60 ? `${Math.floor(min / 60)} h ${min % 60} min` : `${min} min`;
}

function toTrack(r) {
  return {
    id: r.trackId,
    title: r.trackName,
    artist: r.artistName,
    artistId: r.artistId,
    album: r.collectionName,
    albumId: r.collectionId,
    cover: coverUrl(r.artworkUrl100),
    preview: r.previewUrl,
    duration: r.trackTimeMillis,
  };
}

// Tiene solo i brani con anteprima audio (altrimenti non si possono suonare)
function toTracks(results) {
  return results
    .filter((r) => r.wrapperType === "track" && r.kind === "song" && r.previewUrl)
    .map(toTrack);
}

function toAlbum(r) {
  return {
    id: r.collectionId,
    title: r.collectionName,
    artist: r.artistName,
    artistId: r.artistId,
    cover: coverUrl(r.artworkUrl100),
    year: r.releaseDate ? r.releaseDate.slice(0, 4) : "",
    count: r.trackCount,
  };
}

function toArtist(r) {
  return {
    id: r.artistId,
    name: r.artistName,
    genre: r.primaryGenreName || "",
  };
}

/* ---------- 3. Helper DOM ---------- */

// Crea un elemento con classe e testo. textContent NON interpreta l'HTML,
// quindi i testi dell'API sono sempre sicuri.
function el(tag, className = "", text = "") {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== "") node.textContent = text;
  return node;
}

function icon(name) {
  return el("i", `bi ${name}`);
}

function link(href, className, text) {
  const a = el("a", className, text);
  a.href = href;
  return a;
}

function img(src, alt = "") {
  const image = el("img");
  image.src = src;
  image.alt = alt;
  image.loading = "lazy";
  return image;
}

function createButton(className, iconName, label) {
  const btn = el("button", className);
  btn.type = "button";
  btn.setAttribute("aria-label", label);
  btn.append(icon(iconName));
  return btn;
}

function createRange(className, min, max, step, label) {
  const range = el("input", className);
  range.type = "range";
  range.min = min;
  range.max = max;
  range.step = step;
  range.setAttribute("aria-label", label);
  return range;
}

// I link dentro una card cliccabile non devono far partire anche il brano
function stopClick(node) {
  node.addEventListener("click", (e) => e.stopPropagation());
  return node;
}

/* ---------- 4. localStorage ---------- */

const KEYS = {
  favs: "epitunes:favs",
  history: "epitunes:history",
  query: "epitunes:query",
  last: "epitunes:last",
  volume: "epitunes:volume",
};

const Store = {
  get(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage pieno o disabilitato: ignoriamo */
    }
  },
};

const getFavs = () => Store.get(KEYS.favs, []);
const getHistory = () => Store.get(KEYS.history, []);
const isFav = (id) => getFavs().some((t) => t.id === id);

function addToHistory(track) {
  const history = [track, ...getHistory().filter((t) => t.id !== track.id)].slice(0, 20);
  Store.set(KEYS.history, history);
}

/* Teniamo un elenco di tutti i cuori creati, così quando un brano
   diventa preferito li aggiorniamo tutti (card, riga, ecc.). */
let favButtons = [];

function setFavButton(btn, fav) {
  btn.classList.toggle("is-fav", fav);
  btn.setAttribute("aria-pressed", fav);
  btn.replaceChildren(icon(fav ? "bi-heart-fill" : "bi-heart"));
}

function createFavButton(track, className) {
  const btn = createButton(className, "bi-heart", "Aggiungi ai preferiti");
  setFavButton(btn, isFav(track.id));
  btn.addEventListener("click", (e) => {
    e.stopPropagation(); // non far partire il brano
    toggleFav(track);
  });
  favButtons.push({ id: track.id, btn });
  return btn;
}

function toggleFav(track) {
  let favs = getFavs();
  const fav = !favs.some((t) => t.id === track.id);
  favs = fav ? [track, ...favs] : favs.filter((t) => t.id !== track.id);
  Store.set(KEYS.favs, favs);

  // eliminiamo dall'elenco i cuori non più presenti nella pagina
  favButtons = favButtons.filter((f) => f.btn.isConnected);
  favButtons.forEach((f) => {
    if (f.id === track.id) setFavButton(f.btn, fav);
  });

  Player.updateFav();
  renderSidebarFavs();
  document.dispatchEvent(new CustomEvent("favs:change"));
}

/* ---------- 5. Componenti ---------- */

// Classi Bootstrap per le griglie di card (2 colonne su mobile → 5 su schermi grandi)
const GRID_CLASS = "row row-cols-2 row-cols-sm-3 row-cols-lg-4 row-cols-xxl-5 g-3";

function createLoader() {
  const wrap = el("div", "w-100 d-flex justify-content-center py-5");
  const spinner = el("div", "spinner-border text-body-secondary");
  spinner.setAttribute("role", "status");
  spinner.append(el("span", "visually-hidden", "Caricamento..."));
  wrap.append(spinner);
  return wrap;
}

function createError(msg) {
  const wrap = el("div", "w-100");
  wrap.append(el("div", "alert alert-danger my-3", msg));
  return wrap;
}

function createEmpty(msg) {
  return el("p", "w-100 text-body-secondary text-center py-4 mb-0", msg);
}

// <section> con titolo e griglia vuota (con spinner)
function createSection(id, title) {
  const section = el("section", "section");
  section.id = id;
  const grid = el("div", GRID_CLASS);
  grid.id = `${id}-grid`;
  grid.append(createLoader());
  section.append(el("h2", "section-title", title), grid);
  return section;
}

/* Elementi che rappresentano un brano: servono per evidenziare
   in verde quello in riproduzione. */
let playables = [];
function registerPlayable(id, node) {
  playables.push({ id, node });
}

// Card di un brano: click = play, titolo → album, artista → artista
function createTrackCard(track, queue, index) {
  const col = el("div", "col");
  const card = el("article", "media-card");

  const cover = el("div", "media-cover");
  const playBtn = createButton("card-play", "bi-play-fill", "Riproduci");
  cover.append(img(track.cover), createFavButton(track, "card-fav"), playBtn);

  const title = stopClick(link(`album.html?id=${track.albumId}`, "d-block fw-bold text-truncate link-hover", track.title));
  const artist = stopClick(link(`artist.html?id=${track.artistId}`, "d-block small text-body-secondary text-truncate link-hover", track.artist));

  card.append(cover, title, artist);
  card.addEventListener("click", () => Player.playQueue(queue, index));
  registerPlayable(track.id, card);

  col.append(card);
  return col;
}

function createAlbumCard(album) {
  const col = el("div", "col");
  const card = link(`album.html?id=${album.id}`, "media-card");
  const cover = el("div", "media-cover");
  cover.append(img(album.cover));
  card.append(
    cover,
    el("p", "fw-bold text-truncate mb-1", album.title),
    el("p", "small text-body-secondary text-truncate mb-0", `${album.year} · ${album.artist}`)
  );
  col.append(card);
  return col;
}

function createArtistCard(artist) {
  const col = el("div", "col");
  const card = link(`artist.html?id=${artist.id}`, "media-card");
  const cover = el("div", "media-cover rounded-circle");
  cover.append(el("div", "media-initial", artist.name.charAt(0)));
  const sub = artist.genre ? `Artista · ${artist.genre}` : "Artista";
  card.append(
    cover,
    el("p", "fw-bold text-truncate mb-1", artist.name),
    el("p", "small text-body-secondary text-truncate mb-0", sub)
  );
  col.append(card);
  return col;
}

// Riga della tracklist: numero | titolo + artista | durata | cuore
function createTrackRow(track, queue, index) {
  const row = el("div", "track-row");

  const info = el("div");
  const artist = stopClick(link(`artist.html?id=${track.artistId}`, "small text-body-secondary link-hover", track.artist));
  info.append(el("div", "track-title fw-semibold text-truncate", track.title), artist);

  row.append(
    el("span", "track-num", index + 1),
    info,
    el("span", "track-time", formatTime(track.duration)),
    createFavButton(track, "track-fav")
  );
  row.addEventListener("click", () => Player.playQueue(queue, index));
  registerPlayable(track.id, row);
  return row;
}

// Pulsante verde grande (album / artista)
function createPlayBigButton(label, onClick) {
  const btn = createButton("btn-play-big", "bi-play-fill", label);
  btn.addEventListener("click", onClick);
  return btn;
}

// replaceChildren svuota il contenitore e inserisce i nuovi elementi
function renderTrackCards(container, tracks, emptyMsg = "Nessun brano trovato.") {
  if (!tracks.length) {
    container.replaceChildren(createEmpty(emptyMsg));
    return;
  }
  container.replaceChildren(...tracks.map((t, i) => createTrackCard(t, tracks, i)));
  Player.highlight();
}

function renderTrackRows(container, tracks, emptyMsg = "Nessun brano trovato.") {
  if (!tracks.length) {
    container.replaceChildren(createEmpty(emptyMsg));
    return;
  }
  container.replaceChildren(...tracks.map((t, i) => createTrackRow(t, tracks, i)));
  Player.highlight();
}

/* ---------- 6. Sidebar ---------- */

function renderSidebar() {
  const sidebar = document.getElementById("sidebar");
  const page = document.body.dataset.page;

  // logo
  const brand = link("index.html", "brand");
  brand.append(el("span", "brand-mark", "E"), el("span", "brand-text", "EpiTunes"));

  // menu
  const nav = el("nav", "sidebar-nav");
  const home = link("index.html", page === "home" ? "active" : "");
  home.append(icon("bi-house-door-fill"), el("span", "", "Home"));
  const search = link("search.html", page === "search" ? "active" : "");
  search.append(icon("bi-search"), el("span", "", "Cerca"));
  nav.append(home, search);

  // preferiti
  const favList = el("ul", "sidebar-list");
  favList.id = "sidebar-favs";

  sidebar.append(brand, nav, el("h3", "sidebar-section-title", "I tuoi preferiti"), favList);
  renderSidebarFavs();
}

function renderSidebarFavs() {
  const list = document.getElementById("sidebar-favs");
  const favs = getFavs();

  if (!favs.length) {
    list.replaceChildren(el("li", "fst-italic", "Nessuno ancora"));
    return;
  }

  const items = favs.map((track, index) => {
    const li = el("li", "", `${track.title} · ${track.artist}`);
    li.dataset.trackId = track.id; // usato dal CSS per il cursore
    li.title = track.title;
    li.addEventListener("click", () => Player.playQueue(favs, index));
    return li;
  });
  list.replaceChildren(...items);
}

/* ---------- 7. Player ---------- */

const setFill = (range, pct) => range.style.setProperty("--fill", `${pct}%`);

const Player = {
  audio: document.getElementById("audio-element"),
  queue: [],
  index: -1,
  shuffle: false,
  repeat: false,
  seeking: false,

  get current() {
    return this.queue[this.index] ?? null;
  },

  init() {
    const root = document.getElementById("player");

    // --- Sinistra: cover, titolo, artista, cuore
    const left = el("div", "player-track d-flex align-items-center gap-3 overflow-hidden");
    const coverBox = el("div", "player-cover");
    const cover = el("img");
    cover.alt = "";
    cover.hidden = true;
    coverBox.append(cover);

    const meta = el("div", "overflow-hidden");
    const title = el("p", "fw-semibold small text-truncate mb-0", "Seleziona un brano");
    const artist = el("a", "d-block text-body-secondary text-truncate link-hover", "—");
    artist.style.fontSize = "11px";
    meta.append(title, artist);

    const fav = createButton("btn-ctrl", "bi-heart", "Aggiungi ai preferiti");
    fav.hidden = true;
    left.append(coverBox, meta, fav);

    // --- Centro: controlli + barra di avanzamento
    const center = el("div", "d-flex flex-column align-items-center gap-1");
    const controls = el("div", "d-flex align-items-center gap-3");
    const shuffle = createButton("btn-ctrl", "bi-shuffle", "Riproduzione casuale");
    const prev = createButton("btn-ctrl", "bi-skip-start-fill", "Precedente");
    const play = createButton("btn-play", "bi-play-fill", "Play/Pausa");
    const next = createButton("btn-ctrl", "bi-skip-end-fill", "Successivo");
    const repeat = createButton("btn-ctrl", "bi-repeat", "Ripeti");
    controls.append(shuffle, prev, play, next, repeat);

    const progressBox = el("div", "player-progress d-flex align-items-center gap-2");
    const now = el("span", "", "0:00");
    const progress = createRange("form-range", 0, 100, 0.1, "Avanzamento");
    progress.value = 0;
    const total = el("span", "", "0:00");
    progressBox.append(now, progress, total);
    center.append(controls, progressBox);

    // --- Destra: volume
    const right = el("div", "player-right d-flex align-items-center justify-content-end gap-2");
    const volume = createRange("form-range player-volume", 0, 1, 0.01, "Volume");
    right.append(icon("bi-volume-up-fill text-body-secondary"), volume);

    root.append(left, center, right);

    this.el = { cover, title, artist, fav, play, prev, next, shuffle, repeat, progress, now, total, volume };
    this.bindEvents();

    // volume salvato
    const savedVolume = Store.get(KEYS.volume, 0.8);
    this.audio.volume = savedVolume;
    volume.value = savedVolume;
    setFill(volume, savedVolume * 100);

    // ultimo brano ascoltato (mostrato in pausa: i browser bloccano l'autoplay)
    const last = Store.get(KEYS.last, null);
    if (last) {
      this.queue = [last];
      this.load(0, { autoplay: false, record: false });
    }
  },

  bindEvents() {
    const { audio, el: ui } = this;

    ui.play.addEventListener("click", () => this.toggle());
    ui.next.addEventListener("click", () => this.next());
    ui.prev.addEventListener("click", () => this.prev());
    ui.fav.addEventListener("click", () => {
      if (this.current) toggleFav(this.current);
    });
    ui.shuffle.addEventListener("click", () => {
      this.shuffle = !this.shuffle;
      ui.shuffle.classList.toggle("is-active", this.shuffle);
    });
    ui.repeat.addEventListener("click", () => {
      this.repeat = !this.repeat;
      ui.repeat.classList.toggle("is-active", this.repeat);
    });

    audio.addEventListener("play", () => ui.play.replaceChildren(icon("bi-pause-fill")));
    audio.addEventListener("pause", () => ui.play.replaceChildren(icon("bi-play-fill")));
    audio.addEventListener("ended", () => this.next());
    audio.addEventListener("loadedmetadata", () => {
      ui.total.textContent = formatTime(audio.duration * 1000);
    });
    audio.addEventListener("timeupdate", () => {
      if (this.seeking || !audio.duration) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      ui.progress.value = pct;
      setFill(ui.progress, pct);
      ui.now.textContent = formatTime(audio.currentTime * 1000);
    });

    // trascinamento barra di avanzamento
    ui.progress.addEventListener("input", () => {
      this.seeking = true;
      setFill(ui.progress, ui.progress.value);
    });
    ui.progress.addEventListener("change", () => {
      if (audio.duration) audio.currentTime = (ui.progress.value / 100) * audio.duration;
      this.seeking = false;
    });

    ui.volume.addEventListener("input", () => {
      const value = Number(ui.volume.value);
      audio.volume = value;
      setFill(ui.volume, value * 100);
      Store.set(KEYS.volume, value);
    });
  },

  // Chiamato al click su un brano: imposta la coda e parte da "index"
  playQueue(queue, index) {
    if (this.current && queue[index]?.id === this.current.id) {
      this.toggle(); // click sul brano già in riproduzione = play/pausa
      return;
    }
    this.queue = queue;
    this.load(index);
  },

  load(index, { autoplay = true, record = true } = {}) {
    const track = this.queue[index];
    if (!track) return;
    this.index = index;
    this.audio.src = track.preview;

    const ui = this.el;
    ui.cover.src = track.cover;
    ui.cover.hidden = false;
    ui.title.textContent = track.title;
    ui.artist.textContent = track.artist;
    ui.artist.href = `artist.html?id=${track.artistId}`;
    ui.fav.hidden = false;
    this.updateFav();
    ui.progress.value = 0;
    setFill(ui.progress, 0);
    ui.now.textContent = "0:00";

    Store.set(KEYS.last, track);
    if (record) addToHistory(track);
    if (autoplay) this.audio.play().catch(() => {});
    this.highlight();
  },

  toggle() {
    if (!this.current) return;
    if (this.audio.paused) this.audio.play().catch(() => {});
    else this.audio.pause();
  },

  next() {
    if (!this.queue.length) return;
    let i = this.index + 1;
    if (this.shuffle && this.queue.length > 1) {
      do {
        i = Math.floor(Math.random() * this.queue.length);
      } while (i === this.index);
    }
    if (i >= this.queue.length) {
      if (!this.repeat) return; // fine coda: ci fermiamo
      i = 0;
    }
    this.load(i);
  },

  prev() {
    // come Spotify: dopo 3 secondi "indietro" riavvia il brano
    if (this.audio.currentTime > 3 || this.index <= 0) {
      this.audio.currentTime = 0;
      return;
    }
    this.load(this.index - 1);
  },

  // Aggiorna il cuore del player
  updateFav() {
    if (this.current) setFavButton(this.el.fav, isFav(this.current.id));
  },

  // Evidenzia in verde il brano in riproduzione
  highlight() {
    const id = this.current?.id;
    playables = playables.filter((p) => p.node.isConnected);
    playables.forEach((p) => p.node.classList.toggle("is-playing", p.id === id));
  },
};

/* ---------- 8. Avvio ---------- */

document.getElementById("btn-back").addEventListener("click", () => history.back());
document.getElementById("btn-forward").addEventListener("click", () => history.forward());

renderSidebar();
Player.init();