🎵 Music App

Web app per esplorare musica: cerca brani, artisti e album, consulta i dettagli, ascolta le anteprime e salva i tuoi preferiti nel browser.

---
Progetto Realizzato da:
Fabio Iadicicco - Team Leader git js
Carmine Ruggiero - Read me 
Adriano Sant'Angelo - CSS JS 
Francesco Zingarelli - js e css
Ziino Laura Nicoletta- js e css






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