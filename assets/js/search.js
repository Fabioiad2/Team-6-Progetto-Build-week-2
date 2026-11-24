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

async function FetchData(query) {
    // campo vuoto → nascondo tutto e mi fermo
    if (!query) {
        rowBrani.hidden = true
        rowArtists.hidden = true
        rowAlbums.hidden = true
        return
    }
    // codifico la ricerca (spazi, &, accenti...)
    query = encodeURIComponent(query)
    try {
        const [Brani, Artisti, Album] = await Promise.all([
            fetch(`${baseUrl}${endpoint}${query}${filterBrano}`).then((res) => res.json()),
            fetch(`${baseUrl}${endpoint}${query}${filterArtist}`).then(res => res.json()),
            fetch(`${baseUrl}${endpoint}${query}${filterAlbum}`).then((res) => res.json()),
        ])
        let resBrani = Brani.results
        console.log(resBrani)
        Card(resBrani, rowBrani)
        Card(Artisti.results, rowArtists)
        Card(Album.results, rowAlbums)

        console.log(Artisti.results,"Artisti")
        console.log(Album.results,"album")
        console.log(Brani.results,"brani")
    }
    catch (err) {
        console.error(err)
    }

    // return { Brani, Artisti, Album };
}


/*function Card(artist, section) {
    artist.forEach(a => {
        const card = document.createElement('div')
        card.classList.add('card', 'p-3', 'col-md-4', 'col-12','align-items-center','text-dark')
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
    })
}*/



/* Per lo style */

function Card(artist, section) {
    const grid = section.querySelector('.row')
    grid.replaceChildren()
    section.hidden = artist.length === 0

    artist.forEach(a => {
        // la colonna Bootstrap è un div esterno, la card sta dentro
        const col = document.createElement('div')
        col.classList.add('col')
        const card = document.createElement('div')
        card.classList.add('media-card')

        const imgContainer = document.createElement('div')
        imgContainer.classList.add('media-cover')

        const canzone = document.createElement('h4')
        canzone.classList.add('fs-6', 'fw-bold', 'text-truncate', 'mb-1')
        // ogni tipo ha il titolo in un campo diverso
        //      brano → trackName, album → collectionName, artista → artistName
        canzone.textContent = a.trackName || a.collectionName || a.artistName

        const artista = document.createElement('p')
        artista.classList.add('small', 'text-truncate', 'mb-0')
        artista.textContent = a.artistName

        const img = document.createElement('img')
        img.alt = ''

        const genereMusicale = document.createElement('p')
        genereMusicale.classList.add('small', 'text-body-secondary', 'mb-0')
        genereMusicale.textContent = a.primaryGenreName

        // gli artisti non hanno artworkUrl100 → prendo la cover del loro primo album
        if (a.wrapperType === 'artist') {
            imgContainer.classList.add('rounded-circle')
            artista.textContent = 'Artista'
            immagineArtista(a.artistId, img)
        } else {
            img.src = a.artworkUrl100
        }

        grid.appendChild(col)
        col.appendChild(card)
        card.appendChild(imgContainer)
        imgContainer.appendChild(img)
        card.append(canzone, artista, genereMusicale)
    })
}

// nuova funzione → lookup?id=ID_ARTISTA&entity=album&limit=1
async function immagineArtista(artistId, img) {
    try {
        const response = await fetch(`${baseUrl}/lookup?id=${artistId}&entity=album&limit=1&country=IT`)
        const data = await response.json()
        // il primo risultato è l'artista, l'album ha wrapperType "collection"
        const album = data.results.find(r => r.wrapperType === 'collection')
        if (album) img.src = album.artworkUrl100
    } catch (err) {
        console.error(err)
    }
}