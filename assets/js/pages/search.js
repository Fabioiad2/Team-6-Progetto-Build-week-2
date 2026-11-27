const find = document.querySelector("#search-input")
const rowBrani = document.querySelector('#row-tracks')
const rowAlbums = document.querySelector('#row-albums')
const rowArtists = document.querySelector('#row-artists')

find.addEventListener('change', () => {
    FetchData(find.value)
})
const baseUrl = 'https://itunes.apple.com'
const endpoint = '/search?term='
const filterBrano = '&media=music&entity=song&country=IT&limit=10'
const filterArtist = '&media=music&entity=musicArtist&country=IT&limit=10'
const filterAlbum = '&media=music&entity=album&country=IT&limit=10'

const endpointDettaglio = '/lookup?id='

async function FetchData(query) {
    try {
        const [Brani, Artisti, Album] = await Promise.all([
            fetch(`${baseUrl}${endpoint}${query}${filterBrano}`).then((res) => res.json()),
            fetch(`${baseUrl}${endpoint}${query}${filterArtist}`).then(res => res.json()),
            fetch(`${baseUrl}${endpoint}${query}${filterAlbum}`).then((res) => res.json()),
        ])
        let resBrani = await Brani.results
        console.log(resBrani)
        mostraRisultati(rowBrani, resBrani, { riproduciAnteprima: playTrack })
        mostraRisultati(rowArtists, Artisti.results, { dettaglio: 'artist', caricaRitratto: immagineArtista })
        mostraRisultati(rowAlbums, Album.results, { dettaglio: 'album' })

        console.log(await Artisti.results, "Artisti")
        console.log(await Album.results, "album")
        console.log(await Brani.results, "brani")
    }
    catch (err) {
        console.error(err)
    }

    // return { Brani, Artisti, Album };
}

function mostraRisultati(sezione, risultati, opzioniCard) {
    const grid = sezione.querySelector('.row')
    grid.replaceChildren(...risultati.map(risultato => creaCardMedia(risultato, opzioniCard)))
    sezione.hidden = risultati.length === 0
}

async function immagineArtista(artistId, img) {
    try {
        const response = await fetch(`${baseUrl}${endpointDettaglio}${artistId}&entity=album&limit=1&country=IT`)
        const data = await response.json()
        const album = data.results.find(result => result.wrapperType === 'collection')
        if (album?.artworkUrl100) img.src = album.artworkUrl100
    } catch (err) {
        console.error(err)
    }
}
