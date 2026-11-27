Cose fatte

- Ricerca iTunes con tre griglie responsive per Brani, Album e Artisti.
- Modale Bootstrap a schermo intero per album e artisti, con pulsante Chiudi, copertina,informazioni principali e lista dei brani.
- Caricamento dei suggerimenti Pop e generazione delle card in Home.
- Player in Home con play/pausa, barra di avanzamento, tempi e volume.
- Sidebar — aggiungere logo EpiTunes, link Home e Cerca ed elenco dei preferiti.

Cose da fare

- [ ] Home — rendere visibile la griglia Pop e aggiungere i suggerimenti Rock e Italian. (fatto)

- [ ] Preferiti e cronologia — salvare e mostrare i preferiti e i brani riprodotti di recente con localStorage. (fatto)

- [ ] Riproduzione — montare il player anche in Cerca e avviare il brano al clic dalla griglia o dalla modale. (fatto)

- [ ] Controlli del player — collegare precedente, successivo, shuffle e ripeti. (non fatto)

- [ ] Modale Album — aggiungere anno, durata totale, durata dei singoli brani e pulsante Play. (fatto)

- [ ] Modale Artista — aggiungere immagine circolare, ascoltatori mensili, ordinamento dei brani per popolarità e pulsante Play. (no)

- [ ] Ricerca — avviarla durante la digitazione con debounce e ripristinare l’ultima ricerca. (no)

Da Fare e finita la giornata

- [V] Artist - ascoltatori mensili, durata singola canzone / si apre solo qaundo sei in search e clicci sulla card

- [V] Album - durata singola canzone

- [F ] Style - Rivedere il tutto

- [F] Redmi

- [V] aggiungere player ad album e ad artist (nella modale dettaglio)

- [V] aggiungere la sidebar nei dettagli

- [V] Extra Rendere la modale un componente che viene chiamato da index e search (controllare)

- [F] Extra far esplodere il codice

- [F] Extra la Lirica (occhiolino, c'è la vediamo io e Te (Carminuzzo))

- [F] nei Album bisogna far partire le canzoni una dopo l'altra

- [F] stilizzare i pref nella sidebar

- [F] Extra far funzionare tutta il footer con dei bottoni, riproduzione casuale, skip song, restart song e muta audio

- [F] i preferiti nella sidebar devono essere click => song

- [F] ascoltatori mensili (dobbiamo capire. nella api non c'è)

Cosa abbiamo fatto oggi (Mercoledi 25)

- reso più modulare il codice con card e modali (che usiamo per le pagine di dettaglio) riutilizzabili sia per la search che per la index
- local storage per preferiti e cronologia
- merge di tutti i componenti dei vari branch
- abbiamo fatto funzionare il player
- abbiamo usato il metodo reduce per sommare la durata dei brani -> che vengono forniti in millisecondi li abbiamo converiti in minuti

Cosa facciamo domani (giovedi 26) ?
puntiamo a chiudere il progetto per sera
iniziamo a fare gli extra

Venderdi 26
Progetto chiuso
Testare e finire gli extra
astrarre il codice e pulirlo
Contrallare se ci sono bug

[] - quando stoppiamo il brano dalla modale e lo mandiamo in play il brano ricomincia da capo
[Fatto] - dentro il dettaglio nella modale album al click dell'artista potrebbe aprire il dettaglio artista

[Fatto] local storage volume

[DA FARE] funzionalità tasti in basso

[Fatto]tasto mute

[DA FARE] nel dettaglio quando un play finisce il brano passa al successivo

Ultimo Giorno:
Cose da fare:

scaffolding -> organizzazione di file e cartelle -> durante lo scaffolding segnamo tutte le principali funzioni della nostra app che poi inseriremo nel readme
verifica funzionamento delle funzionalità principali
Fare il readme -> Partire da quello esistente
finire gli extra ->
Extra rickrollare tutta la classe -> lo pensa Laura
definire la presentazione

!! EXTRA MOLTO EXTRA!!
PRESENTAZIONE

PER READMI:
[V]- dobbiamo spiegare come funziona la reindirizzazione delle card
[V]- come funziona la reindirizzazione della modale dettaglio
[V] - come funziona search
[V]- sidebar e player sono componenti utilizzabili e sempre visibili
[V]- local storage preferiti e ultimi ascolti

Per le card abbiamo 3 funzioni di render:

- abbiamo aggiungiCardHome() che accetta come parametro riga e elementi, elementi è l'array che contiene la lista brani/album.
  Questa funzione viene usata per aggiungere delle nuove tipologie di card, è la nostra card astratta per il render delle card per la Home page.

- Tipi di card "che eridatano aggiungiCardHome":
  1 - CardSuggerimenti()
  2 - CardCronologia()

- Tutte le card vengono chiamate nel file index.js [card delle 3 categorie in evidenza più la card cronologia]

- Al click su una card, Bootstrap apre la modale #detailModal grazie agli attributi data-bs-toggle e data-bs-target, 
  impostati dinamicamente tramite JavaScript.

  Al momento dell'apertura, viene intercettato l'evento show.bs.modal, che recupera dalla card l'ID e il tipo di contenuto selezionato. Questi dati vengono passati alla funzione caricaDettaglio(), che effettua una richiesta all'API di iTunes per recuperare e visualizzare le informazioni relative all'album o all'artista selezionato.

- la search funziona grazie a una promiseall che fa la fetch di 3 endpoint diversi della stessa api, endpoint brano, endpoint
  artist e endpoint album.
  La search viene fatta con un parametro query, la query è il valore dell'input (barra di ricerca) dell'utente, poi abbiamo il filter per comporre l'url della fetch

- mostraRisultati si occupa di mostrare a schermo i risultati della fetch, accetta come parameto(sezione, risultati e 
  opzionicard) e si occupa di fare map dei risultati, mostraRisultati infine chiama la funzione creaMediaCard che crea le card dei singoli risultati di ricerca

- sidebar e player sono componenti che riutilizziamo in index e search, nel player viene salvata la canzone che viene al 
  momento

- LocalStorage salviamo:
  - stato del volume
  - preferiti in un array che viene mostrato nella sidebar
  - salviamo gli ultimi 5 ascolti in un array che viene mostarto nella home page nella sezioni ultimi brani ascoltati
    Chiavi del local storage:
    volume
    preferiti
    history


