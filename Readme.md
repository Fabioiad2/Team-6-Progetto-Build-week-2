

# 🎵 EpiTunes - Web app di musica

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.9-7952B3?logo=bootstrap&logoColor=white)
![Bootstrap Icons](https://img.shields.io/badge/Bootstrap_Icons-1.11.3-7952B3?logo=bootstrap&logoColor=white)
![iTunes Search API](https://img.shields.io/badge/iTunes_Search_API-000000?logo=apple&logoColor=white)

Web app per ascoltare musica in stile Spotify: cerca brani, artisti e album, consulta i dettagli, ascolta le anteprime e salva i tuoi preferiti nel browser.

Il progetto è stato sviluppato durante la **build week** del corso di Web Development di **Epicode**.

---

## 🖼️ Anteprima

<!-- Sostituisci con i vostri screenshot -->
![EpiTunes su desktop](docs/anteprima-desktop.png)

---

## 📑 Indice

- [Descrizione](#-descrizione)
- [Funzionalità](#-funzionalità)
- [Tecnologie utilizzate](#️-tecnologie-utilizzate)
- [Come eseguire il progetto in locale](#-come-eseguire-il-progetto-in-locale)
- [Struttura del progetto](#-struttura-del-progetto)
- [Architettura, responsive design e media query](#-architettura-responsive-design-e-media-query)
- [Albero del DOM](#-albero-del-dom)
- [Campo di ricerca](#-campo-di-ricerca)
- [Come funziona](#️-come-funziona)
- [Dati nel localStorage](#-dati-nel-localstorage)
- [Aspetto grafico](#-aspetto-grafico)
- [Extra e dettagli](#-extra-e-dettagli)
- [Accessibilità](#-accessibilità)
- [Convenzioni di codice](#-convenzioni-di-codice)
- [Sviluppi futuri](#-sviluppi-futuri)
- [Aggiornamenti](#-aggiornamenti)
- [Crediti](#-crediti)
- [Realizzato da](#-realizzato-da)

---

## 📝 Descrizione

Questa repository contiene il codice sorgente di **EpiTunes**, una web app che permette di cercare canzoni, artisti e album, ascoltarne le anteprime e salvare i propri brani preferiti. I dati arrivano in tempo reale dall'**API pubblica di iTunes Search**.

L'app ha due pagine (**Home** e **Search**) che condividono gli stessi componenti: sidebar, player, card e modale di dettaglio.

---

## ✨ Funzionalità

L'applicazione è strutturata con **Bootstrap 5.3.9** e resa dinamica con **JavaScript nativo**, diviso in componenti, pagine e utility.

- **Home con suggerimenti**: tre righe di album (Pop, Rock e Hits), 10 album ciascuna, caricate in parallelo con `Promise.all`.
- **Ultimi brani ascoltati**: gli ultimi 5 brani riprodotti, dal più recente. La riga si aggiorna da sola ogni volta che parte un'anteprima.
- **Ricerca**: tre richieste in parallelo (`Promise.all`) per **brani**, **album** e **artisti**, con i risultati divisi in tre sezioni.
- **Card**: copertina in alta risoluzione, badge con il tipo (Brano / Album / Artista), genere, anno, effetto "skeleton" durante il caricamento e iniziale del titolo se manca l'immagine.
- **Modale di dettaglio**: al click su un album o un artista si apre una modale Bootstrap con copertina, titolo, artista e genere.
  - **Album**: anno di uscita, numero di brani, durata totale ed elenco dei brani (fino a 200).
  - **Artista**: tipo di artista e 15 brani.
  - Dalla modale di un album, il nome dell'artista porta alla modale dell'**artista**.
  - Mostra "Caricamento…" con uno spinner, un messaggio in caso di errore o di risultati vuoti, e annulla la richiesta in corso se la modale viene chiusa (`AbortController`).
- **Riproduzione delle anteprime**: il pulsante ▶ fa partire l'anteprima e aggiorna il player con titolo, artista e copertina. Diventa ⏸ mentre il brano suona; se un brano non ha l'anteprima, il pulsante è disabilitato.
- **Preferiti**: il pulsante ♡/♥ su card e tracklist aggiunge o rimuove il brano. I preferiti compaiono nella **sidebar**, da cui si possono riprodurre. Lo stesso brano non può essere salvato due volte.
- **Player**: footer fisso con copertina, titolo e artista, play/pausa, barra di avanzamento (con salto a un punto del brano), volume e muto cliccando l'icona dell'altoparlante.
- **Volume salvato**: il valore del cursore viene salvato a ogni modifica e ripristinato al caricamento (predefinito: 80).
- **Aggiornamento automatico**: card, sidebar e pulsanti ♡/♥ si aggiornano senza ricaricare la pagina, anche tra schede diverse del browser.

---

## 🛠️ Tecnologie utilizzate

**HTML5**: due pagine con strutture semantiche (`aside`, `main`, `header`, `section`, `footer`, `audio`, `template`) e attributi di accessibilità.

**CSS3**: layout a griglia (CSS Grid), Flexbox, variabili CSS, `clamp()`, container queries (`container-type`, unità `cqi`), `:has()`, `color-mix()`, `linear-gradient` / `radial-gradient`, transizioni, `@keyframes` e media query.

**Bootstrap 5.3.9 (CDN)**: griglia delle card (`row-cols-*`), utility, modale, list group numerato e `stretched-link`, tema scuro con `data-bs-theme`.

**Bootstrap Icons 1.11.3 (CDN)**: icone di play, pausa, cuore, home, ricerca e personaggio.

**JavaScript (ES6+)**: `fetch` con `async/await`, `Promise.all`, `AbortController`, `URLSearchParams`, `ResizeObserver`, `matchMedia`, `localStorage`, eventi personalizzati, API JavaScript di Bootstrap, DOM creato con `createElement` / `cloneNode` senza `innerHTML`.

**iTunes Search API**: endpoint `search` e `lookup` (`https://itunes.apple.com`), con `country=IT`.

> ⚠️ **Limiti dell'API**: le canzoni hanno solo un'anteprima di circa 30 secondi e l'API accetta circa **20 richieste al minuto** (oltre si riceve l'errore 403/429). Fonte: [documentazione ufficiale di iTunes Search API](https://performance-partners.apple.com/search-api).

---

## 🚀 Come eseguire il progetto in locale

1. **Clona il repository:**

   ```bash
   git clone https://github.com/Fabioiad2/Team-6-Progetto-Build-week-2
   ```

2. **Apri l'applicazione con Live Server**: in VS Code, tasto destro su `index.html` → **Open with Live Server**.

> Serve una connessione a internet: Bootstrap e le icone vengono caricati da CDN e i dati arrivano dall'API di iTunes.

---

## 📁 Struttura del progetto

```
├── index.html                  # Home
├── search/
│   └── search.html             # Pagina di ricerca
├── assets/
│   ├── css/
│   │   └── app.css             # Stili di tutta l'app (layout, card, modale, player)
│   ├── js/
│   │   ├── components/
│   │   │   ├── detail-modal.js # Modale di dettaglio album/artista
│   │   │   ├── media-card.js   # Crea le card (creaCardMedia)
│   │   │   ├── player.js       # Player audio (playTrack)
│   │   │   └── sidebar.js      # Sidebar clonata dal <template> + preferiti
│   │   ├── pages/
│   │   │   ├── index.js        # Logica della Home
│   │   │   └── search.js       # Logica della ricerca
│   │   └── utilities/
│   │       └── music-library.js# Preferiti e cronologia (libreriaMusicale)
│   └── epicode-logo.png
├── Progettazione/              # Materiale di progettazione
├── todo.md
└── terminal.md
```

**Ordine di caricamento degli script** (uguale nelle due pagine): Bootstrap → `player.js` → `music-library.js` → `sidebar.js` → `detail-modal.js` → `media-card.js` → script della pagina (`index.js` o `search.js`).

---

## 📱 Architettura, responsive design e media query

Layout a **3 zone** costruito con CSS Grid: **sidebar** a sinistra, **contenuto** al centro e **player** fisso in basso. L'approccio è **desktop-first**, con media query `max-width`.

| Schermo | Sidebar | Card per riga |
|---|---|---|
| **Desktop** (> 800px) | colonna da 240px con logo, menu e preferiti | da 4 a 5 (`row-cols-lg-4`, `row-cols-xxl-5`) |
| **Tablet** (≤ 800px) | colonna da 80px con le sole icone | 3 (`row-cols-sm-3`) |
| **Mobile** (≤ 540px) | barra orizzontale in alto | 2 (`row-cols-2`) |

- Le misure del layout sono **variabili CSS** (`--sidebar-w`, `--sidebar-h`, `--player-h`) usate sia dalla griglia sia dalla modale.
- La **modale** occupa solo l'area centrale, tra sidebar e player: un `ResizeObserver` misura l'altezza della sidebar su mobile e del player, e le passa al CSS.
- Su mobile il **player** si dispone su due righe (info + volume sopra, controlli sotto).
- Su schermi touch (`hover: none`) i pulsanti ▶ e ♥ delle card sono sempre visibili.
- `prefers-reduced-motion` disattiva animazioni e transizioni.

---

## 🌳 Albero del DOM

`<aside class="sidebar" #sidebar>`: vuota nell'HTML, riempita clonando `<template #sidebar-template>` (logo, link Home/Cerca, lista preferiti). Ogni preferito è un clone di `<template #sidebar-item-template>`.

`<main class="main">`:
- `<header class="topbar">`: pulsanti `#btn-back` e `#btn-forward`, pillola utente.
- **Home** (`index.html`): `#home-sections` con le righe `#popRow`, `#rockRow`, `#hitsRow` e `#historyRow`.
- **Cerca** (`search.html`): campo `#search-input`, `#search-status` e le sezioni `#row-tracks`, `#row-albums`, `#row-artists`, con le griglie `#grid-tracks`, `#grid-albums`, `#grid-artists`.

`<footer class="player" #player>`: vuoto nell'HTML, costruito da `player.js`.

`<audio #audio-element>`: unico elemento audio di tutta la pagina.

**Modale** `#detailModal`: `#modalImage`, `#modalTitle`, `#modalArtistType`, `#modalGenre`, `#modalAlbumDetails` (`#releaseDate`, `#trackCount`, `#AlbumDuration`), `#modalStatus` e `#modalTrackSection` con la lista `#modalTracks`.

---

## 🔍 Campo di ricerca

| Campo | Regola | Cosa fa |
|---|---|---|
| `#search-input` | `type="search"`, `autocomplete="off"` | La ricerca parte all'evento `change` (Invio o uscita dal campo) |

**Sequenza di ricerca:**

Digitazione → Invio o uscita dal campo (`change`) → `FetchData(valore)` → 3 `fetch` in parallelo con `Promise.all` (song, musicArtist, album) → `mostraRisultati()` per ogni sezione → card create con `creaCardMedia()` → le sezioni senza risultati restano nascoste (`hidden`).

---

## ⚙️ Come funziona

**`music-library.js`** → modulo `libreriaMusicale`: unico punto che legge e scrive preferiti e cronologia nel `localStorage`. Ogni salvataggio emette l'evento `<chiave>:aggiornata`; con `osservaLista()` le altre parti dell'app si "iscrivono" ai cambiamenti. Ascolta anche l'evento `storage` (più schede aperte) e `pageshow` (ritorno alla pagina dalla cache del browser). Se i dati salvati sono corrotti o il `localStorage` è bloccato, restituisce liste vuote senza rompere l'app.

| Funzione | Cosa fa |
|---|---|
| `leggiPreferiti()` | Restituisce l'array dei preferiti |
| `cambiaPreferito(brano)` | Aggiunge il brano o lo rimuove se già presente (confronto per `trackId`) |
| `leggiCronologia()` | Restituisce l'array della cronologia |
| `aggiungiCronologia(brano)` | Mette il brano in cima alla cronologia (massimo 5, senza doppioni) |
| `osservaLista(chiave, callback)` | Richiama la funzione quando la lista cambia |

**`player.js`** → costruisce il footer con `createElement` ed espone **`playTrack({ url, title, artist, cover })`**, usata da card, modale e sidebar. Restituisce una Promise che vale `true` se la riproduzione parte: solo in quel caso il brano viene aggiunto alla cronologia.

**`media-card.js`** → **`creaCardMedia(dato, opzioni)`** crea una card per brano, album o artista. Le opzioni decidono cosa fa la card:
- `dettaglio: 'album' | 'artist'` → al click si apre la modale;
- `riproduciAnteprima` → compare il pulsante ▶;
- `caricaRitratto` → funzione che carica l'immagine dell'artista.

Il titolo della card è un link con `.stretched-link` di Bootstrap che porta gli attributi `data-bs-toggle`, `data-bs-target`, `data-detail-id` e `data-detail-type`: così tutta la card apre la modale. Il ♥ compare solo sulle card dei brani, perché i preferiti sono tracce.

**`detail-modal.js`** → all'evento `show.bs.modal` legge dalla card l'id e il tipo, e chiama **`caricaDettaglio(id, tipo)`**, che interroga l'endpoint `lookup` e riempie la modale. Ogni brano della lista ha i pulsanti ▶/⏸ e ♡/♥, sempre sincronizzati con l'audio e con i preferiti.

**`sidebar.js`** → clona il `<template>` della sidebar, evidenzia il link della pagina attuale (`aria-current="page"`) e mostra i preferiti. Un solo listener sulla lista (**event delegation**) fa partire il brano cliccato.

**`index.js`** (Home):
- `aggiungiCardHome(riga, elementi)` → funzione di base che, per ogni elemento dell'array, crea una card con `creaCardMedia` e la aggiunge alla riga.
- `cardSuggerimenti(array, tipo)` → usa `aggiungiCardHome` per le righe Pop, Rock e Hits.
- `cardCronologia()` → usa `aggiungiCardHome` per gli ultimi brani ascoltati; viene richiamata da `osservaLista('history', …)` a ogni nuovo ascolto.
- `get()` → carica i tre suggerimenti in parallelo con `Promise.all`.

**`search.js`** (Cerca):
- `FetchData(query)` → compone l'URL con il valore dell'input e i filtri (`entity`, `country`, `limit`) e lancia le tre `fetch` in parallelo.
- `mostraRisultati(sezione, risultati, opzioniCard)` → fa il `map` dei risultati in card con `creaCardMedia` e nasconde la sezione se è vuota.
- `immagineArtista(artistId, img)` → l'API non fornisce la foto degli artisti, quindi si usa la copertina del loro primo album (`lookup?id=…&entity=album&limit=1`).

---

## 💾 Dati nel localStorage

| Chiave | Contenuto | Regole |
|---|---|---|
| `preferiti` | Array dei brani preferiti (oggetto completo dell'API) | Nessun duplicato, confronto per `trackId` |
| `history` | Array degli ultimi brani riprodotti | Massimo 5, dal più recente; un brano riascoltato torna in cima |
| `volume` | Volume del player (0-100) | Salvato a ogni modifica, predefinito 80 |

La vecchia chiave `favorites` viene ancora letta come alternativa, se `preferiti` non esiste.

---

## 🎨 Aspetto grafico

**Tema scuro in stile Spotify**: sfondo `#121212`, card `#181818` (`#282828` all'hover) e sidebar nera. Tutti i colori sono variabili CSS.

| Colore | Uso |
|---|---|
| 🟡 `#f7d800` giallo Epicode | logo, genere, iniziali delle card, contorni del focus, alone della modale |
| 🟢 `#1ed760` verde | pulsanti play e brano in riproduzione |
| 🔴 `#e25555` rosso | cuore dei preferiti |
| 🩷 `#ff5fa2` rosa | pillola dell'artista nella modale |

**Card**: copertina quadrata (tonda per gli artisti), badge del tipo, velo sfumato all'hover, pulsante ▶ verde che sale dal basso e ♥ in alto a destra.

**Modale**: copertina grande con ombra, titolo in grassetto pesante, genere in una pillola gialla, dettagli dell'album su una riga separati da "•", tracklist numerata con durata.

**Animazioni**: le card si sollevano all'hover e la copertina si ingrandisce, effetto "shimmer" mentre le immagini caricano, il cuore fa un piccolo "battito" quando diventa preferito, la copertina della modale entra dal basso, spinner durante il caricamento.

---

## 💡 Extra e dettagli

- **Copertine in alta risoluzione**: l'API restituisce immagini diifea 100×100; nell'URL `100x100bb` viene sostituito con `400x400bb` (card) o `600x600bb` (modale). Gestito da JS.
- **Immagine mancante**: al posto della copertina compare l'iniziale del titolo. Gestito da JS e CSS.
- **Foto degli artisti** ricavate dalla copertina del loro primo album. Gestito da JS.
- **Stato di riproduzione sincronizzato** tra card, tracklist della modale e player. Gestito da JS e CSS.
- **Richieste annullate**: aprendo un'altra modale o chiudendola, la richiesta precedente viene interrotta. Gestito da JS.
- **Muto** cliccando l'icona del volume si muta. Gestito da JS.
- **Pillola dell'artista** cliccabile nella modale dell'album, riconosciuta grazie a CSS con `:has()` e una piccola funzione in Js. Gestito da JS e CSS.

---

## ♿ Accessibilità

- **Screen reader**: `aria-label` sui pulsanti con sole icone (▶, ♥, frecce di navigazione), `aria-pressed` sui cuori, `aria-current="page"` sul link attivo, `role="status"` sul messaggio di caricamento della modale, `aria-labelledby` su modale e sezioni.
- **Elementi decorativi nascosti**: icone con `aria-hidden="true"` e immagini decorative con `alt=""`.
- **Tastiera**: card e pulsanti raggiungibili con Tab, contorni di focus gialli ben visibili (`:focus-visible`), modale chiudibile con Esc.
- **Testi sicuri**: tutti i dati dell'API vengono inseriti con `textContent`, mai come HTML.
- **Riduci animazioni**: con `prefers-reduced-motion` animazioni e transizioni vengono disattivate.

---

## 📝 Convenzioni di codice

- **camelCase** per variabili, funzioni e riferimenti agli elementi DOM, con nomi in italiano (`caricaDettaglio`, `aggiornaPreferiti`).
- **Un file, un compito**: `music-library.js` gestisce solo i dati nel `localStorage`, `player.js` solo l'audio, `media-card.js` solo le card, `detail-modal.js` solo la modale.
- **Componenti isolati**: sidebar e modale sono racchiuse in una IIFE (Immediately Invoked Function Expression, cioè "funzione che si esegue subito") `(() => { … })()`, così le loro variabili non finiscono nello scope globale.
- **Niente `innerHTML`**: il DOM si crea con `createElement`, `cloneNode` e `textContent`.
- **CSS diviso in sezioni** con intestazioni del tipo `/* ===== Card ===== */`.
- **Commenti esplicativi** in HTML, CSS e JS per agevolare la lettura del codice.

---

## 🔮 Sviluppi futuri

**Ricerca**
- [ ] Ricerca "mentre scrivi" con debounce di 400 ms
- [ ] Codificare il termine di ricerca con `encodeURIComponent` e gestire la ricerca vuota

**Player**
- [ ] Shuffle, brano precedente/successivo e ripeti (i pulsanti ci sono ma non sono ancora attivi)
- [ ] Testo (lyrics) del brano in riproduzione

---

## 🙏 Crediti

- **Dati**: [iTunes Search API](https://performance-partners.apple.com/search-api)
- **Framework**: [Bootstrap](https://getbootstrap.com/)
- **Icone**: [Bootstrap Icons](https://icons.getbootstrap.com/)
- **Badge**: [Shields.io](https://shields.io/), con i loghi di Simple Icons

---

## 👩‍💻 Realizzato da

| Persona | Ruolo |
|---|---|
| Fabio Iadicicco | Team Leader, Git, JavaScript |
| Carmine Ruggiero | README, Javascript |
| Adriano Sant'Angelo | CSS, JavaScript |
| Francesco Zingarelli | JavaScript, CSS |
| Laura Nicoletta Ziino | JavaScript, CSS |
| Paolo Milan | Collaboratore |