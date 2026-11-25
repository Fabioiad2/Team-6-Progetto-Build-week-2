// const url = 'https://itunes.apple.com/lookup?id='
// const endpointAlbum = '&entity=album'
// const dati = []
// const baseUrl = 'https://itunes.apple.com/'
// const popEndpoint = 'search?term=pop&media=music&entity=album&country=IT&limit=10'
// async function get(){
//     try{
//         const response = await fetch(`${baseUrl}${popEndpoint}`)
//         const data = await response.json()
//         dati.push(data.results)
//         console.log(data)
//         dati.forEach(d=>{
//             d.forEach(a=>{
//                Card(a.artistName,a.artworkUrl100, a.collectionName)
//                console.log(a.artistViewUrl)
//             })
//         })
//     }catch(err){
//         console.error(err)
//     }
// }
// get()

// const popRow = document.querySelector('#popRow')



// function Card(nomeArtista, immagine, nomeCanzone){
//     const col = document.createElement('div')
//     col.classList.add('col')
//     const card = document.createElement('div')
//     card.classList.add('media-card')

//     const imgContainer = document.createElement('div')
//     imgContainer.classList.add('media-cover')

//     const canzone = document.createElement('h4')
//     canzone.classList.add('fs-6', 'fw-bold', 'text-truncate', 'mb-1')
//     canzone.textContent = nomeCanzone

//     const artista = document.createElement('p')
//     artista.classList.add('small', 'text-body-secondary', 'text-truncate', 'mb-0')
//     artista.textContent = nomeArtista

//     const img = document.createElement('img')
//     img.alt = ''
//     img.src = immagine

//     popRow.appendChild(col)
//     col.appendChild(card)
//     card.appendChild(imgContainer)
//     imgContainer.appendChild(img)
//     card.append(canzone, artista)
// }



const url = 'https://itunes.apple.com/lookup?id='
const endpointAlbum = '&entity=album'
const dati = [];
const baseUrl = 'https://itunes.apple.com/'
const popEndpoint = 'search?term=pop&media=music&entity=album&country=IT&limit=10'
const rockEndpoint = 'search?term=rock&media=music&entity=album&country=IT&limit=10'
const hitsEndpoint = 'search?term=hits&media=music&entity=album&country=IT&limit=10'
const endpointSong = '&entity=song'




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

//evento al click
const home = document.querySelector('.home')

home.addEventListener('click', (event) => {
    const card = event.target.closest('.card')
    if (!card) {
        return
    }
    const collectionId = card.dataset.collectionId
    // collection name serve per la modale, cosi possiamo mostrare il nome dell'album cliccato
    const collectionName = card.dataset.collectionName 
    const artistId = card.dataset.artistId
    brani(collectionId, collectionName, artistId)

})

//recupero i dati da artistId, filtro i risultati per selezionare solo quelli dell'album selezionato tramite il collectionId
//e infine mostro i brani (per ora solo in console)
async function brani(collectionId, collectionName, artistId) {
    try{
        const response = await fetch(`${url}${artistId}${endpointSong}&limit=300`)
        const data = await response.json()
        const braniAlbum = data.results.filter(brano => {
            return brano.collectionId == collectionId
        })

        console.log(braniAlbum)
    }catch(err){
        console.error(err)
    }
}

get();