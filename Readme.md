


Funzionalità
Home con suggerimenti: tre righe di album (Pop, Rock e Hits), 10 album ciascuna, caricate in parallelo dall'API iTunes.
Ricerca: campo di ricerca che interroga l'API per brani, album e artisti e mostra i risultati in tre sezioni.
Collegamento delle card ai dettagli tramite id: ogni card della home porta con sé l'id dell'album (data-detail-id) e il tipo (data-detail-type). Al click la modale legge questi dati e li usa per chiedere il dettaglio all'API iTunes con lookup.
Dettaglio in modale: in index.html, il click su una card apre una modale Bootstrap con copertina, titolo, artista e genere. Per gli album aggiunge anno di uscita, numero di brani, durata totale (in m:ss) e l'elenco dei brani, fino a 200. Per gli artisti mostra tipo di artista e 15 brani. Mostra "Caricamento…" mentre aspetta l'API, un messaggio in caso di errore o se non ci sono brani, e annulla la richiesta in corso se la modale viene chiusa.
Riproduzione dal click su un brano: il pulsante ▶ accanto a ogni brano fa partire l'anteprima e aggiorna il player in fondo alla pagina con titolo, artista e copertina. Il pulsante diventa ⏸ mentre il brano è in riproduzione e permette di metterlo in pausa. Se un brano non ha l'anteprima, il pulsante è disabilitato.
Aggiunta e rimozione dei preferiti: ogni brano nella modale ha un pulsante ♡/♥. Un click aggiunge il brano ai preferiti, un secondo click lo rimuove. Il pulsante resta sempre sincronizzato, anche se i preferiti cambiano da un'altra parte dell'app. Lo stesso brano non può essere salvato due volte.
Cronologia dei brani riprodotti: ogni volta che parte un'anteprima, il brano viene aggiunto alla cronologia. Se ne tiene al massimo 5, con il più recente in cima, e un brano riascoltato non si duplica ma torna in prima posizione. La sezione "Riprodotti di recente" della home si aggiorna da sola.
Modulo libreriaMusicale per preferiti e cronologia: un modulo unico che gestisce la lettura e la scrittura nel localStorage. Ogni salvataggio emette un evento, così le pagine si aggiornano senza ricaricare, anche tra schede diverse del browser. Se i dati salvati sono corrotti o il localStorage è bloccato, l'app continua a funzionare con liste vuote. Legge ancora la vecchia chiave favorites per compatibilità.
Player: footer fisso con copertina, titolo e artista del brano, pulsante play/pausa, barra di avanzamento con tempo trascorso e durata totale, e cursore del volume.
Salvataggio del volume nel localStorage: il valore del cursore (0-100) viene salvato a ogni modifica con la chiave volume e ripristinato al caricamento della pagina. Se non c'è nulla di salvato, parte da 80.
Struttura del progetto
Pagina	File	Descrizione
Home	index.html	Suggerimenti, cronologia e preferiti, con sidebar e player
Cerca	search.html	Ricerca di brani, album e artisti
Album	album.html	Dettaglio di un album (si apre tramite id)
Artista	artist.html	Dettaglio di un artista (si apre tramite id)
Fonte dei dati

I dati arrivano dall'API di iTunes Search (https://itunes.apple.com/), con country=IT:

search: suggerimenti della home e ricerca
lookup: dettaglio di album e artisti (brani, anno, durata, genere)

Le anteprime audio sono quelle fornite dall'API (previewUrl). Se un brano non ne ha una, il pulsante Play è disabilitato.

Sidebar

Contiene:

Logo dell'app
Home: torna alla pagina principale
Cerca: apre search.html
I tuoi preferiti: elenco letto dal localStorage
Pagina Home (index.html)

Ogni sezione è un <section class="row"> con un titolo <h2> e una griglia di card, create via JavaScript.

Sezioni:

Riprodotti di recente: la cronologia (ultimi 5 brani), che si aggiorna da sola
I tuoi preferiti
Suggerimenti Pop: 10 album
Suggerimenti Rock: 10 album
Suggerimenti Hits: 10 album

I tre suggerimenti vengono caricati insieme con Promise.all.

Modale di dettaglio

Al click su una card si apre una modale (Bootstrap) con il dettaglio, caricato dall'API tramite l'id della card.

Per un album mostra:

Copertina, titolo, artista e genere
Anno di uscita, numero di brani e durata totale (m:ss, solo se i dati dei brani sono completi)
Elenco dei brani (fino a 200)

Per un artista mostra:

Copertina, nome, tipo di artista e genere
Elenco di 15 brani

Ogni brano ha due pulsanti:

▶ / ⏸: avvia o mette in pausa l'anteprima. Il player si aggiorna e il brano viene salvato nella cronologia
♡ / ♥: aggiunge o rimuove il brano dai preferiti

Durante il caricamento compare "Caricamento…". In caso di errore o di risultati vuoti viene mostrato un messaggio. Chiudendo la modale, la richiesta in corso viene annullata.

Pagina Cerca (search.html)

L'utente scrive il termine nel campo #search-input e conferma (Invio o uscita dal campo, evento change). Partono tre richieste in parallelo (Promise.all) all'API iTunes Search, con country=IT e al massimo 10 risultati ciascuna.

Sezione	Entità iTunes	Contenitore
Brani	song	#row-tracks
Album	album	#row-albums
Artisti	musicArtist	#row-artists

Ogni risultato viene mostrato in una card Bootstrap (col-md-4 col-12) con copertina (artworkUrl100), titolo, artista (artistName) e genere (primaryGenreName).

La pagina è ancora in lavorazione: i punti da completare sono elencati in Sviluppi futuri.

Pagina Album (album.html)

Si apre tramite l'id dell'album, valorizzato al click sulla card.

Copertina, titolo, autore, anno e durata totale (in minuti)
Bottone Play verde, posizionato a sinistra
Lista ordinata (<ol>) dei brani, ognuno in un <li>
Pagina Artista (artist.html)

Si apre tramite l'id dell'artista.

Immagine con bordo arrotondato (border-radius: 50%)
Nome, genere musicale e ascoltatori mensili
Bottone Play (identico a quello dell'album)
Lista (<ul>) delle canzoni, ordinate per popolarità, ognuna in un <li>
Player

Il player è il <footer class="player"> fisso in fondo alla pagina, riempito via JavaScript (common.js). Quando parte un brano mostra titolo, artista e copertina. L'audio è gestito da un unico elemento <audio id="audio-element">, e i pulsanti ▶/⏸ restano sincronizzati con lo stato della riproduzione.

Controlli disponibili:

Play / Pausa del brano corrente
Barra di avanzamento: mostra il tempo trascorso e la durata totale e permette di saltare a un punto del brano
Volume: il valore scelto viene salvato nel localStorage (chiave volume) e ripristinato al caricamento della pagina. Se non c'è nessun valore salvato, parte da 80

I pulsanti shuffle, precedente, successivo e ripeti sono presenti ma non ancora funzionanti.

Dati nel localStorage

Preferiti e cronologia sono gestiti dal modulo libreriaMusicale. Ogni lista è un array JSON di brani: viene salvato l'oggetto completo restituito dall'API iTunes (trackId, trackName, artistName, artworkUrl100, previewUrl, ecc.).

Chiave	Contenuto	Regole
preferiti	Brani salvati dall'utente	Il click su ♡/♥ aggiunge o rimuove il brano. Nessun duplicato (confronto per trackId)
history	Brani riprodotti di recente	Massimo 5 brani, dal più recente. Se un brano viene riascoltato, torna in cima
volume	Volume del player (0-100)	Salvato a ogni modifica e ripristinato all'apertura della pagina. Default 80

La vecchia chiave favorites viene ancora letta come alternativa, se preferiti non esiste.

API di libreriaMusicale
Funzione	Cosa fa
leggiPreferiti()	Restituisce l'array dei preferiti (vuoto se non ci sono dati validi)
cambiaPreferito(brano)	Aggiunge il brano ai preferiti o lo rimuove se già presente
leggiCronologia()	Restituisce l'array della cronologia
aggiungiCronologia(brano)	Inserisce il brano in cima alla cronologia (max 5)
osservaLista(chiave, callback)	Richiama la funzione quando la lista cambia
Aggiornamento automatico

Ad ogni salvataggio viene emesso l'evento <chiave>:aggiornata, così card, sidebar e pulsanti ♡/♥ si aggiornano senza ricaricare la pagina. osservaLista ascolta anche:

l'evento storage, per sincronizzare più schede aperte
l'evento pageshow, per aggiornare la pagina quando si torna indietro dalla cache del browser
Tecnologie
HTML5
CSS3
JavaScript (fetch, async/await, Promise.all)
Bootstrap (layout e modale)
API iTunes Search
localStorage per la persistenza, con il modulo libreriaMusicale
Come avviare
Clona la repository: git clone <URL-della-repo>
Apri index.html nel browser (meglio con un server locale, es. Live Server di VS Code)

Serve una connessione internet per le chiamate all'API.

Sviluppi futuri

Ricerca

Svuotare i risultati prima di una nuova ricerca
Card artisti: mostrare il nome dell'artista come titolo e gestire l'assenza di copertina
Card brani: mostrare il titolo del brano (trackName) al posto del nome dell'album
Collegare le card al dettaglio e al player, come nella home
Usare i contenitori #grid-* di search.html per le card
Codificare il termine di ricerca (encodeURIComponent) e gestire la ricerca vuota
Caricare common.js anche in search.html (sidebar e player)

Player

Implementare shuffle, brano precedente/successivo e ripeti
Pulsante per mostrare il testo (lyrics) del brano in riproduzione





---
Progetto Realizzato da:
Fabio Iadicicco - Team Leader git js
Carmine Ruggiero - Read me 
Adriano Sant'Angelo - CSS JS 
Francesco Zingarelli - js e css
Ziino Laura Nicoletta- js e css
Paolo Milan - 
















🎵 Music App - Web app di musica 
HTML5 CSS JavaScript ES6+ Bootstrap 5.3.9 Bootstrap Icons 1.13.2 iTunes Search API
Web app per ascoltare musica: cerca brani, artisti e album, consulta i dettagli, ascolta le anteprime e salva i tuoi preferiti nel browser.

Il progetto è stato sviluppato durante la build week del corso di Web Development.

## Descrizione

Questa repository contiene il codice sorgente di Music App, una web app che permette di cercare canzoni, artisti e album, ascoltarne le anteprime e salvare i propri brani preferiti. I dati arrivano in tempo reale dall'API pubblica di iTunes.

## Funzionalità

🖼️ Anteprima
Epify      su desktop con il tema scuro Desktop con il tema scuro (predefinito) 


📑 Indice
Anteprima
Funzionalità
Tecnologie Utilizzate
Come Eseguire il Progetto Locale
Struttura del progetto
Architettura, Responsive Design e Media Query
Albero del DOM
Validazione del campo di ricerca
Come funziona
Aspetto grafico
Extra e dettagli
Accessibilità
Convenzioni di codice
Aggiornamenti
Crediti
Realizzato da
✨ Funzionalità
L'applicazione è strutturata con Bootstrap 5 e resa dinamica con JavaScript nativo diviso in moduli ES:

Ricerca squadre: richiesta GET a searchteams.php con URL costruito da new URL() e searchParams; parte da sola dopo 400ms di pausa nella digitazione (debounce) e annulla la ricerca precedente con AbortController.
Caricamento ed errori: spinner durante le richieste, alert rosso in caso di errore, messaggio "Nessuna squadra trovata" se teams è null.
Filtro per sport: bottoni Tutti / Calcio / Basket / Football sul campo strSport.
Dettagli squadra: al click su una card si apre una modal con le informazioni della squadra; sotto, prossimi eventi e ultimi risultati caricati in parallelo con Promise.all.
Modal evento: il click su una partita apre i suoi dettagli (tabellone, competizione, data e ora, stadio, stato).
Squadre preferite: salvate in localStorage, con notifica a ogni aggiunta o rimozione; lista nascosta all'avvio e apribile con Mostra/Nascondi o dalla barra.
I tuoi prossimi appuntamenti: prossime partite di tutte le preferite con Promise.allSettled, ordinate per data, con ora e luogo.
Ultimi risultati: della Premier League e delle squadre preferite, in una striscia scorrevole di 9 partite con frecce, completata da partite di esempio segnate dal badge "Esempio".
Barra di navigazione: bottone Preferiti con contatore, modalità semplificata e tema scuro / chiaro (predefinito: scuro), con le scelte salvate.
Footer: pannelli "About us" e "Accessibilità" e copyright con l'anno automatico.
Pallone dell'app: entra rotolando, mostra "Scarica la nostra app!" e apre la modal di invito all'app.

🛠️ Tecnologie Utilizzate
HTML5: abbiamo due html con strutture semantiche (header, section, footer, audio, modale, template, aside) con attributi di accessibilità.

CSS3: variabili CSS per i temi, Flexbox, clamp(), linear-gradient, scroll-snap, transizioni, @keyframes e media query.

Bootstrap 5.3.8 (CDN): griglia, utility, form, navbar, spinner, alert, badge, modal, toast, collapse e tema con data-bs-theme. Si usa la 5.3.8 perché è l'ultima versione stabile riportata nella documentazione ufficiale (la 5.3.9 non lo è).
Bootstrap Icons 1.13.2 (CDN)

JavaScript (ES6+): moduli ES, (classi con campi static), fetch con async/await, Promise.all / (allSettled, AbortController, debounce), localStorage, Intl.DateTimeFormat, API JavaScript di Bootstrap e DOM senza innerHTML.

(TheSportsDB API v1 con la chiave gratuita 123 e foto da Pexels (vedi Crediti).
Shields.io: i badge delle tecnologie in cima a questo README, con i loghi della raccolta Simple Icons.)

⚠️ Limiti della chiave gratuita: abbiamo un limite dei cantanti e le canzoni restituiscono solo i 30 secondi del brano indicato, 
il limite è di 20 richieste al minuto (oltre, status 429). Fonte: documentazione ufficiale di iTunes Search API.

🚀 Come Eseguire il Progetto Locale
Clona il repository:

git clone https://github.com/Fabioiad2/Team-6-Progetto-Build-week-2

Apri l'applicazione con Live Server: Il progetto usa i moduli ES (<script type="module">), quindi non può essere aperto con un doppio clic su index.html, perché il browser bloccherebbe i moduli con un errore CORS. Usa un server locale, per esempio l'estensione Live Server di VS Code: tasto destro su index.html → Open with Live Server.

📁 Struttura del progetto
├── index.html            # Pagina principale
├── search/
│   └── search.html       # Pagina di ricerca
├── assets/
│   ├── css/
│   │   └── app.css       # Stili dell'applicazione
│   ├── js/
│   │   ├── components/   # detail-modal, media-card, player, sidebar
│   │   ├── pages/        # index, search
│   │   └── utilities/    # Funzioni di supporto
│   └── epicode-logo.png
├── Progettazione/        # Materiale di progettazione
├── todo.md
└── terminal.md




(📱 Architettura, Responsive Design e Media Query
Approccio One-page e Mobile-First, con il contenuto centrato in un contenitore largo al massimo 1100px e una barra di navigazione fissa in alto (sticky-top).

Mobile (<768px): hero con testo centrato, una card squadra per riga, una partita visibile nella striscia, dettagli su una colonna, footer su due righe.
Tablet (768px - 991px): hero con testo a destra della foto, due card per riga, due partite visibili, dettagli su due colonne.
PC (≥992px): tre card per riga e tre partite visibili.
Le card squadra usano flex: 1 1 280px, quindi si adattano da sole; le strisce di partite usano le media query min-width: 768px e 992px. prefers-reduced-motion disattiva le animazioni.)

🌳 Albero del DOM
<header class="barra">: navbar con marchio #link-marchio e bottoni #btn-vai-preferiti, #btn-semplificata, #btn-tema.
<main>:
Hero: titolo #titolo-hero e form #form-ricerca.
Squadre trovate: filtri #filtri-sport, #errore, #spinner, #lista-squadre e #dettagli.
Ultimi risultati – Premier League: #risultati-lega.
Squadre preferite: collapse #contenitore-preferiti con #lista-preferiti.
Prossimi appuntamenti: #lista-appuntamenti.
Ultimi risultati delle tue squadre: #risultati-preferite.
<footer>: bottoni About us / Accessibilità, pannelli #footer-pannelli, anno #anno-corrente.
Pallone dell'app #palla-app, notifica #notifica e modal #modale-squadra, #modale-evento, #modale-app.
✅ Validazione del campo di ricerca
Campo	Regola	Cosa controlla il browser
Nome della squadra	type="search" + required	Che non sia vuoto prima di inviare il form
Il valore viene ripulito con trim(): se resta vuoto la ricerca non parte e torna il messaggio iniziale.

Sequenza di ricerca:

Digitazione → 400ms di pausa (o subito con Cerca: campo svuotato e pagina che scende ai risultati) → trim() → ricerca precedente annullata con abort() → spinner → cercaSquadre() → card filtrate per sport, "Nessuna squadra trovata" o alert rosso → il finally nasconde lo spinner.

⚙️ Come funziona
Squadra.js ed Evento.js: classi che traducono i dati grezzi dell'API in proprietà chiare. Evento formatta data e ora in italiano con Intl.DateTimeFormat, traduce gli stati con static STATI e genera il punteggio.
api.js: getJSON() esegue la fetch e controlla response.ok; cercaSquadre(), caricaEventi() (con Promise.all), caricaProssimiEventi(), caricaUltimiEventi() e caricaUltimiEventiLega() restituiscono oggetti Squadra / Evento.
storage.js, tema.js, semplificata.js: leggono e salvano in localStorage preferiti, tema (predefinito: scuro) e modalità semplificata, con try/catch; tema e modalità sono attributi su <html> (data-bs-theme, data-semplificata).
segnaposto.js: completaConEsempi() porta le sezioni dei risultati a 9 partite con partite di esempio (esempio = true).
ui.js: crea tutti gli elementi con createElement e textContent (card, liste, strisce con frecce e scrollBy(), modal, notifiche).
main.js: collega gli eventi e tiene lo stato. Usa l'event delegation sulle liste, il debounce con AbortController per la ricerca, Promise.allSettled per appuntamenti e risultati delle preferite (con un contatore di versione contro i caricamenti superati) e l'API JavaScript di Bootstrap per modal, toast e collapse. Gestisce anche lo scorrimento (portaA(), comportamentoScorrimento()) e il pallone che si alza sopra le notifiche.
🎨 Aspetto grafico
Tema scuro (predefinito): sfondo blu notte (#10151f), card grigio-blu scuro (#1b2230) e accenti in azzurro #8fb0ff, molto leggibile sullo scuro. Tema chiaro: sfondo grigio chiarissimo (#f4f5f8), card bianche e accenti nel blu #1b3366. Tutti i colori sono variabili CSS, quindi il cambio di tema avviene in un punto solo.

Tipografia e icone: titoli in Oswald, maiuscolo e spaziato come sui tabelloni degli stadi; testo in Barlow. Icone a linea di Bootstrap Icons; l'unica emoji è il pallone ⚽ del marchio e del bottone dell'app.

Dettagli: hero a tutta larghezza con una foto specchiata e un velo blu; card partita come piccoli tabelloni con i loghi; badge verdi per i punteggi; filtri a pillola. L'azzurro #8fb0ff torna nell'alone delle card, nel bordo delle modal e nei link del footer.

Animazioni: card ed eventi si sollevano all'hover, la foto della hero entra da sinistra, il pallone dell'app rotola dentro, i link del footer hanno una sottolineatura che cresce e nella modal dell'app la foto sfuma nel contenuto.

💡 Extra e dettagli
Pulizia dell'input con trim() e messaggi di stato vuoto ("Nessun risultato disponibile", "Nessuna squadra trovata per questo sport"). Gestito da JS.
Logo opzionale e iniziali al posto del logo mancante. Gestito da JS.
Bottone "Già nei preferiti" disabilitato. Gestito da JS e CSS.
Appuntamenti: sempre aggiornati, senza doppioni, con ora e luogo e avviso per le squadre non caricate. Gestito da JS e CSS.
Modal info squadra e scorrimenti automatici (ai risultati dopo la ricerca, alle liste dopo la modal). Gestito da HTML e JS.
Notifiche sui preferiti con toast Bootstrap. Gestito da HTML, CSS e JS.
Barra di navigazione con tema, modalità semplificata e contatore preferiti, e mostra/nascondi dei preferiti. Gestito da HTML, CSS e JS.
Ultimi risultati della Premier League e delle preferite, con partite di esempio e striscia scorrevole. Gestito da HTML, CSS e JS.
Footer con pannelli e anno automatico. Gestito da HTML e JS.
Pallone e modal dell'app. Gestito da HTML, CSS e JS.
Stati e orari in italiano nella modal dell'evento. Gestito da JS.
♿ Accessibilità
Tastiera: card raggiungibili con Tab e apribili con Invio o Spazio, contorni di focus visibili, finestrella del pallone raggiungibile (:focus-within) e chiudibile con Esc.
Screen reader: label nascosta sull'input, aria-labelledby sulle sezioni, role="alert" sull'errore, role="status" e aria-live sulle notifiche, aria-pressed su filtri e modalità semplificata, aria-expanded sui collapse, aria-label sui bottoni con sole icone; immagini e icone decorative nascoste (alt="", aria-hidden).
Focus guidato: dopo la ricerca e alla chiusura della modal il focus passa al titolo dei risultati o dei dettagli.
Modalità semplificata: testo più grande, contrasto alto, font Atkinson Hyperlegible, niente animazioni, link sottolineati e focus più spesso, in entrambi i temi.
Riduci animazioni: con prefers-reduced-motion tutte le animazioni e gli scorrimenti fluidi vengono disattivati.
📝 Convenzioni di codice
camelCase per variabili, funzioni e riferimenti agli elementi DOM.
PascalCase per le classi e per i file che le contengono (Squadra.js, Evento.js).
UPPER_CASE per le costanti di configurazione (BASE_URL).
Un modulo, un compito: api.js non tocca il DOM, ui.js non esegue fetch, storage.js gestisce solo i preferiti in localStorage, tema.js solo il tema, semplificata.js solo la modalità semplificata e segnaposto.js solo le partite di esempio.
Variabili CSS con prefisso --sh- (SportsHub), per non confonderle con quelle di Bootstrap (--bs-).
CSS con indice: in cima a style.css c'è un indice delle 21 sezioni, numerate anche nelle intestazioni (per saltare a una sezione si cerca, per esempio, ===== 11.).
Intestazione nei moduli JS: ogni file inizia con un commento che spiega a cosa serve.
Commenti esplicativi presenti in HTML, CSS e JS per agevolare la lettura del codice.
🔄 Aggiornamenti
Versione	Descrizione
ver. 1.0	Struttura HTML semantica e stile CSS con Bootstrap 5
ver. 2.0	Versione base: ricerca squadre e dettagli eventi
└─ ver. 2.1	Versione avanzata: preferiti, appuntamenti, filtri e modal
ver. 3.0	Versione completa: nuova grafica, accessibilità e ultimi risultati
└─ ver. 3.1	Readme aggiornato
🙏 Crediti
Dati: TheSportsDB.
Foto della hero: Kampus Production su Pexels.
Foto della modal dell'app: Ferid Faiqoglu su Pexels.
Icone: Bootstrap Icons.
Font: Oswald, Barlow e Atkinson Hyperlegible da Google Fonts.
Badge: Shields.io, con i loghi di Simple Icons.
👩‍💻 Realizzato da
Persona	Ruolo
Lisa Irene Sciacca	README, HTML, CSS, JavaScript