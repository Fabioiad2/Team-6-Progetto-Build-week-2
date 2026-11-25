const url = 'https://itunes.apple.com/lookup?id='
const endpointAlbum = '&entity=album'
const dati = [];
const baseUrl = 'https://itunes.apple.com/'
const popEndpoint = 'search?term=pop&media=music&entity=album&country=IT&limit=10'
const rockEndpoint = 'search?term=rock&media=music&entity=album&country=IT&limit=10'
const hitsEndpoint = 'search?term=hits&media=music&entity=album&country=IT&limit=10'
const endpointSong = '&entity=song'

//costanti per bootstrap
const detailModal = document.querySelector('#detailModal')
const modalImage = document.querySelector('#modalImage')
const modalTitle = document.querySelector('#modalTitle')
const modalArtistType = document.querySelector('#modalArtistType')
const modalGenre = document.querySelector('#modalGenre')
const modalStatus = document.querySelector('#modalStatus')
const modalTrackSection = document.querySelector('#modalTrackSection')
const modalTracks = document.querySelector('#modalTracks')


//per la riproduzione dell'audio degli album
const audioPlayer = new Audio()
const preferiti = JSON.parse(localStorage.getItem('preferiti')) || []
const cronologia = JSON.parse(localStorage.getItem('history')) || []

function Card(artist, section) {
    artist.forEach(a => {
        const card = document.createElement('div')
        card.classList.add('card', 'p-3', 'col-md-4', 'col-12', 'align-items-center', 'text-dark')
        const imgContainer = document.createElement('div')
        const canzone = document.createElement('h4')
        canzone.textContent = a.collectionName
        const artista = document.createElement('p')
        artista.textContent = a.artistName
        const img = document.createElement('img')
        const genereMusicale = document.createElement('p')
        genereMusicale.textContent = a.primaryGenreName
        img.classList.add('img-fluid')
        img.src = a.artworkUrl100
        section.appendChild(card)
        card.appendChild(imgContainer)
        imgContainer.appendChild(img)
        card.append(canzone, artista, genereMusicale)

        // Memorizzo le informazioni dell'album nella card
        card.dataset.collectionId = a.collectionId //id dell'album
        card.dataset.collectionName = a.collectionName //nome dell'album
        card.dataset.artistId = a.artistId //id dell'artista

        //per aprire la modale di bootstrap
        card.dataset.bsToggle = 'modal'
        card.dataset.bsTarget = '#detailModal'

    })
}


async function get() {
    let arrayAlbumRock = [];
    let arrayAlbumPop = [];
    let arrayAlbumHits = [];
    try {
        // promiseAll dei tre suggerimenti iniziali pop,rock e hits
        const [rock, pop, hits] = await Promise.all([
            fetch(`${baseUrl}${rockEndpoint}`),
            fetch(`${baseUrl}${popEndpoint}`),
            fetch(`${baseUrl}${hitsEndpoint}`)
        ])
        // converto il json in un formato javascript
        const [dataRock, dataPop, dataHits] = await Promise.all([
            rock.json(),
            pop.json(),
            hits.json()
        ])

        // creo un array per ogni risultato delle caterogie
        arrayAlbumRock = [...dataRock.results];
        arrayAlbumPop = [...dataPop.results];
        arrayAlbumHits = [...dataHits.results];

        //creo una funzione per scorrere l'array e creare una card per ogni album
        cardSuggerimenti(arrayAlbumRock, "rock");
        cardSuggerimenti(arrayAlbumPop, "pop");
        cardSuggerimenti(arrayAlbumHits, "hits");

    } catch (err) {
        console.error(err);
    }
}


function cardSuggerimenti(array, tipo) {
    const contenitore = document.querySelector(`#${tipo}Row`)
    Card(array, contenitore)
}


//recupero i dati da artistId, filtro i risultati per selezionare solo quelli dell'album selezionato tramite il collectionId
//e infine mostro i brani (per ora solo in console)
async function brani(collectionId, collectionName, artistId) {
    try {
        modalTitle.textContent = collectionName

        modalImage.hidden = true
        modalArtistType.hidden = true
        modalGenre.hidden = true
        modalTrackSection.hidden = true

        modalTracks.replaceChildren()

        modalStatus.textContent = 'Caricamento…'

        const response = await fetch(`${url}${artistId}${endpointSong}&limit=300&country=IT`)
        const data = await response.json()
        const braniAlbum = data.results.filter(brano => {
            return brano.collectionId == collectionId
        })
        if (braniAlbum.length === 0) {
            modalStatus.textContent = 'Nessun brano disponibile.'
            return
        }

        const primoBrano = braniAlbum[0]

        modalImage.src = primoBrano.artworkUrl100
        modalImage.hidden = false

        modalArtistType.textContent = primoBrano.artistName
        modalArtistType.hidden = false

        modalGenre.textContent = primoBrano.primaryGenreName
        modalGenre.hidden = false

        braniAlbum.forEach(brano => {
            //aggiungo le classi bootstrap per il display flex in modo da allineare gli elementi al centro, a destra e a sinistra
            const item = document.createElement('li')
            item.className = ' d-flex list-group-item justify-content-between align-items-center gap-3'

            const nomeBrano = document.createElement('span')
            nomeBrano.textContent = brano.trackName
            //creo un div per i pulsanti
            const pulsanti = document.createElement('div')
            pulsanti.className = 'd-flex gap-3'

            // Pulsante riproduci
            const playButton = document.createElement('button')
            playButton.type = 'button'
            playButton.className = 'btn  btn-sm'
            playButton.textContent = '▶'

            playButton.addEventListener('click', () => {

                //controllo per verificare se il brano possiede un url
                if (!brano.previewUrl) return
                // Se questo brano è già in riproduzione, lo fermo altrimenti parte il brano
                //preview.url mi da il link url della canzone, aggiungo un controllo
                if (audioPlayer.src === brano.previewUrl && !audioPlayer.paused) {
                    audioPlayer.pause()
                    playButton.textContent = '⏸'
                    return
                } else {
                    audioPlayer.pause()
                    audioPlayer.src = brano.previewUrl
                    audioPlayer.play()
                    playButton.textContent = '▶'

                }
                aggiungiCronologia(brano)


                console.log(preferiti)


            })

            // Pulsante preferiti
            const preferitiButton = document.createElement('button')
            preferitiButton.type = 'button'
            preferitiButton.className = 'btn btn-outline-danger btn-sm'
            preferitiButton.textContent = '♡'

            preferitiButton.addEventListener('click', () => {
                //gestione dei preferiti:
                // mi serve una funzione che controlli se il brano aggiunto ai preferiti è già presente nell'array preferiti
                //utilizzo findex (è un metodo degli array che scorre l'array e mi restituisce l'indice di quello che sto cercando, 
                // se non trova niente restituisce -1), se restituisce -1 significa che il brano non è presente nell'album preferiti 
                // e cambia l'icona, se invece mi restituisce un indice lo tolgo dai preferiti con splice indicando indice e il numero di 
                //elementi da rimuovere
                const indice = preferiti.findIndex(p => p.trackId === brano.trackId)

                if (indice === -1) {
                    preferiti.push(brano)
                    preferitiButton.textContent = '♥'
                    preferitiButton.className = 'btn btn-danger btn-sm'

                } else {
                    preferiti.splice(indice, 1)
                    preferitiButton.textContent = '♡'
                    preferitiButton.className = 'btn btn-outline-danger btn-sm'
                }
                localStorage.setItem('preferiti', JSON.stringify(preferiti))
                console.log(preferiti)
            })

            pulsanti.append(playButton, preferitiButton)

            item.append(nomeBrano, pulsanti)

            modalTracks.appendChild(item)
            
        })

        modalTrackSection.hidden = false
        modalStatus.textContent = ''

        console.log(braniAlbum)
    } catch (err) {
        console.error(err)
    }
}




detailModal.addEventListener('show.bs.modal', event => {
    const card = event.relatedTarget

    const collectionId = card.dataset.collectionId
    const collectionName = card.dataset.collectionName
    const artistId = card.dataset.artistId

    brani(collectionId, collectionName, artistId)
})

//funzioni per la sezione cronologia
function cardCronologia() {
    const historyRow = document.querySelector('#historyRow')
     // svuoto il contenitore prima di ridisegnare, altrimenti le card si duplicano
    historyRow.replaceChildren()
    Card(cronologia, historyRow)
}

function aggiungiCronologia(brano) {
     const indice = cronologia.findIndex(a => a.trackId === brano.trackId)
     if (indice === -1)
     {
        //  unshift per aggiungere il brano in prima posizione, se faccio push il brano viene mostrato in ultima posizione
         cronologia.unshift(brano)
     }else{
         return
     }

     if(cronologia.length > 5){
        // cronologia.pop mi serve per eliminare l'ultimo elemento dell'array cosi l'array conterrà sempre 5 elementi
        cronologia.pop()
     }
     localStorage.setItem('history', JSON.stringify(cronologia))
    cardCronologia()
    
}


cardCronologia()
get();