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

- [F ] Album - durata singola canzone 

- [F ] Style - Rivedere il tutto 

- [F] Redmi 

- [F] aggiungere player ad album e ad artist (nella modale dettaglio)

- [F] aggiungere la sidebar nei dettagli

- [V] Extra Rendere la modale un componente che viene chiamato da index e search (controllare)

- [F] Extra far esplodere il codice 

- [F] Extra la Lirica (occhiolino, c'è la vediamo io e Te (Carminuzzo)) 

- [F] nei Album bisogna far partire le canzoni una dopo l'altra 

- [F] stilizzare i pref nella sidebar   

- [F] Extra far funzionare tutta il footer con dei bottoni, riproduzione casuale, skip song, restart song e muta audio 

- [F] i preferiti nella sidebar devono essere click => song 

- [F] ascoltatori mensili  (dobbiamo capire. nella api non c'è)


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




[] -  quando stoppiamo il brano dalla modale e lo mandiamo in play il brano ricomincia da capo
[DA FARE OPZIONALE] - dentro il dettaglio nella modale album al click dell'artista potrebbe aprire il dettaglio artista

[DA FARE] local storage volume

[DA FARE] funzionalità tasti in basso

[DA FARE] tasto mute

[DA FARE] nel dettaglio quando un play finisce il brano passa al successivo