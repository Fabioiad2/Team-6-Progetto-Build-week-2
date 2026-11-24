ToDo -> cose da fare
in todo.md

---
Progetto Realizzato da:
Fabio Iadicicco - Team Leader git js
Carmine Ruggiero - Read me 
Adriano Sant'Angelo - CSS JS 
Francesco Zingarelli - js e css
Ziino Laura Nicoletta- js e css




🎵 Music App

Web app per esplorare musica: cerca brani, artisti e album, consulta le pagine di dettaglio e salva i tuoi preferiti nel browser.

Struttura del progetto
Pagina	File	Descrizione
Home	index.html	Pagina principale con sidebar e suggerimenti
Cerca	search.html	Ricerca di brani, artisti e album
Album	album.html	Dettaglio di un album (apre tramite id)
Artista	artist.html	Dettaglio di un artista (apre tramite id)
Sidebar

Presente in index.html, contiene una lista con:

Logo dell'app
Home: torna alla pagina principale
Cerca: apre search.html
I tuoi preferiti: elenco letto dal localStorage
Pagina Home (index.html)

Ogni sezione è un <section class="row"> con un titolo <h2> e una griglia di .card.

Sezioni previste:

Riprodotti di recente: letti dal localStorage (struttura dati da definire)
I tuoi preferiti: array salvato nel localStorage
Suggerimenti Pop
Suggerimenti Rock
Suggerimenti Italian
Pagina Cerca (search.html)

I risultati sono divisi in tre <section class="row">, ognuna con le proprie card:

Brani
Artisti
Album

Tutte le sezioni sono collegate al termine di ricerca inserito: ogni card mostra i valori corrispondenti al risultato.

Pagina Album

Pagina di dettaglio, si apre tramite l'id dell'album, valorizzato al click sulla card corrispondente.

Contenuto:

Immagine di copertina
Titolo dell'album
Autore, anno e durata totale (in minuti)
Bottone Play verde, posizionato a sinistra
Lista ordinata (<ol>) con i brani, ognuno in un <li>
Pagina Artista

Pagina di dettaglio, si apre tramite l'id dell'artista.

Contenuto:

Immagine con bordo arrotondato (border-radius: 50%)
Nome dell'artista
Genere musicale
Ascoltatori mensili
Bottone Play (identico a quello dell'album)
Lista (<ul>) con le canzoni dell'artista, ordinate per popolarità, ognuna in un <li>
Dati nel localStorage
Chiave	Tipo	Uso
favorites	Array	Preferiti dell'utente
recent	Da definire	Brani riprodotti di recente

⚠️ Nomi delle chiavi e struttura degli oggetti sono indicativi: da confermare durante lo sviluppo.

Tecnologie
HTML5
CSS3
JavaScript
localStorage per la persistenza
Come avviare
Clona la repository
Apri index.html nel browser (meglio con un server locale, es. Live Server di VS Code)
Da fare
[ ] Definire la struttura dei dati per "riprodotti di recente"
[ ] Collegare le card alle pagine di dettaglio tramite id
[ ] Implementare l'aggiunta/rimozione dei preferiti


## Extra

Oltre alle funzionalità base, il team vuole aggiungere queste funzionalità extra:

- [ ] **Testo della canzone**: nel player, un pulsante per mostrare il testo (lyrics) del brano in riproduzione
- [ ] **Dettaglio album in modale**: in `index.html`, al click su una card album si apre una finestra modale con il dettaglio dell'album (copertina, titolo, autore, anno, durata e lista dei brani)
- [ ] **Riproduzione dal click su un brano**: al click su un brano parte la canzone selezionata e il player in fondo alla pagina si aggiorna con titolo, artista e copertina

> ⚠️ L'elenco è indicativo: gli extra verranno confermati dal team in base al tempo a disposizione.

Visto che in index.html l'album si apre in una modale, ti consiglio di precisare anche questo nella sezione "Pagina Home" del README, così non si confonde con album.html:

markdown
Al click su una card album, il dettaglio si apre in una **modale** (extra). La pagina `album.html` resta disponibile per aprire l'album tramite id.