/* ============================================================
   index.html — Home
   - "Riprodotti di recente" (localStorage)
   - "I tuoi preferiti" (localStorage)
   - Suggerimenti pop / rock / italian pop (API search)
   ============================================================ */

const SUGGESTIONS = [
  { id: "pop", title: "Suggerimenti pop", term: "pop" },
  { id: "rock", title: "Suggerimenti rock", term: "rock" },
  { id: "italian", title: "Suggerimenti italian pop", term: "pop italiano" },
];

const home = document.getElementById("home");

home.append(
  createSection("recent", "Riprodotti di recente"),
  createSection("favs", "I tuoi preferiti"),
  ...SUGGESTIONS.map((s) => createSection(s.id, s.title))
);

// Sezione da localStorage: se è vuota la nascondiamo
function renderLocalSection(id, tracks) {
  document.getElementById(id).hidden = tracks.length === 0;
  renderTrackCards(document.getElementById(`${id}-grid`), tracks);
}

async function loadSuggestion({ id, term }) {
  const grid = document.getElementById(`${id}-grid`);
  try {
    const results = await searchItunes(term, "song", 15);
    renderTrackCards(grid, toTracks(results).slice(0, 10));
  } catch (err) {
    console.error(err);
    grid.replaceChildren(createError("Impossibile caricare i suggerimenti. Riprova più tardi."));
  }
}

renderLocalSection("recent", getHistory().slice(0, 10));
renderLocalSection("favs", getFavs().slice(0, 10));
SUGGESTIONS.forEach(loadSuggestion); // partono tutte in parallelo

// Se aggiungo/tolgo un preferito, aggiorno la sezione
document.addEventListener("favs:change", () => renderLocalSection("favs", getFavs().slice(0, 10)));
