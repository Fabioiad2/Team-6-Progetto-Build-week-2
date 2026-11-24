const find = document.querySelector("#search-input")
const rowBrani = document.querySelector('#row-tracks')
const rowAlbums = document.querySelector('#row-albums')
const rowArtists = document.querySelector('#row-artists')
const detailModal = document.querySelector('#detailModal')
const modalImage = document.querySelector('#modalImage')
const modalTitle = document.querySelector('#modalTitle')
const modalArtistType = document.querySelector('#modalArtistType')
const modalGenre = document.querySelector('#modalGenre')
const modalStatus = document.querySelector('#modalStatus')
const modalTrackSection = document.querySelector('#modalTrackSection')
const modalTracks = document.querySelector('#modalTracks')
let detailRequest

detailModal.addEventListener('show.bs.modal', event => {
    const { detailId, detailType } = event.relatedTarget?.dataset ?? {}
    if (detailId) artistDetail(detailId, detailType === 'album' ? queryAlbum : queryArtistDetail)
})
detailModal.addEventListener('hidden.bs.modal', () => detailRequest?.abort())

find.addEventListener('change', () => {
    FetchData(find.value)
})
const baseUrl = 'https://itunes.apple.com'
const endpoint = '/search?term='
const filterBrano = '&media=music&entity=song&country=IT&limit=10'
const filterArtist = '&media=music&entity=musicArtist&country=IT&limit=10'
const filterAlbum = '&media=music&entity=album&country=IT&limit=10'

//  endpoint per il dettaglio Artista e query per "popolarità"
// endpointDettaglio valido sia per artisti che album
const endpointDettaglio = '/lookup?id='
const queryArtistDetail = '&entity=song&country=IT&limit=15'
const queryAlbum = '&entity=song&country=IT'


async function FetchData(query) {
    try {
        const [Brani, Artisti, Album] = await Promise.all([
            fetch(`${baseUrl}${endpoint}${query}${filterBrano}`).then((res) => res.json()),
            fetch(`${baseUrl}${endpoint}${query}${filterArtist}`).then(res => res.json()),
            fetch(`${baseUrl}${endpoint}${query}${filterAlbum}`).then((res) => res.json()),
        ])
        let resBrani = await Brani.results
        console.log(resBrani)
        Card(resBrani, rowBrani)
        Card(await Artisti.results, rowArtists)
        Card(await Album.results, rowAlbums)

        console.log(await Artisti.results,"Artisti")
        console.log(await Album.results,"album")
        console.log(await Brani.results,"brani")
    }
    catch (err) {
        console.error(err)
    }

    // return { Brani, Artisti, Album };
}

async function artistDetail(id, query) {
    detailRequest?.abort()
    detailRequest = new AbortController()
    const { signal } = detailRequest

    modalTitle.textContent = 'Dettaglio'
    modalImage.hidden = true
    modalArtistType.hidden = true
    modalGenre.hidden = true
    modalTrackSection.hidden = true
    modalTracks.replaceChildren()
    modalStatus.textContent = 'Caricamento…'

    try {
        const response = await fetch(`${baseUrl}${endpointDettaglio}${id}${query}`, { signal })
        if (!response.ok) throw new Error(`iTunes: HTTP ${response.status}`)

        const { results } = await response.json()
        const [detail, ...entries] = results
        if (signal.aborted) return
        if (!detail) {
            modalStatus.textContent = 'Nessun dettaglio disponibile.'
            return
        }

        const tracks = entries.filter(entry => entry.kind === 'song' && entry.trackName)
        const cover = detail.artworkUrl100 || tracks.find(track => track.artworkUrl100)?.artworkUrl100
        if (cover) {
            modalImage.src = cover
            modalImage.hidden = false
        }

        modalTitle.textContent = detail.collectionName || detail.artistName
        const artistInfo = detail.collectionName ? detail.artistName : detail.artistType
        modalArtistType.textContent = artistInfo || ''
        modalArtistType.hidden = !artistInfo
        modalGenre.textContent = detail.primaryGenreName || ''
        modalGenre.hidden = !detail.primaryGenreName

        for (const track of tracks) {
            const item = document.createElement('li')
            item.className = 'list-group-item'
            item.textContent = track.trackName
            modalTracks.appendChild(item)
        }
        modalTrackSection.hidden = tracks.length === 0
        modalStatus.textContent = tracks.length ? '' : 'Nessun brano disponibile.'
    } catch (err) {
        if (signal.aborted) return
        modalStatus.textContent = 'Impossibile caricare il dettaglio.'
        console.error(err)
    }
}


function Card(artist, section) {
    const grid = section.querySelector('.row')
    grid.replaceChildren()
    section.hidden = artist.length === 0

    artist.forEach(a => {
        const col = document.createElement('div')
        col.classList.add('col')
        let detailId
        if (section === rowArtists) detailId = a.artistId
        if (section === rowAlbums) detailId = a.collectionId

        const card = document.createElement(detailId ? 'a' : 'div')
        card.classList.add('media-card')
        if (detailId) {
            card.href = '#detailModal'
            card.dataset.bsToggle = 'modal'
            card.dataset.bsTarget = '#detailModal'
            card.dataset.detailId = detailId
            card.dataset.detailType = section === rowArtists ? 'artist' : 'album'
        }

        const imgContainer = document.createElement('div')
        imgContainer.classList.add('media-cover')
        const img = document.createElement('img')
        img.alt = ''

        const canzone = document.createElement('h4')
        canzone.classList.add('fs-6', 'fw-bold', 'text-truncate', 'mb-1')
        canzone.textContent = a.trackName || a.collectionName || a.artistName

        const artista = document.createElement('p')
        artista.classList.add('small', 'text-truncate', 'mb-0')
        artista.textContent = a.artistName

        const genereMusicale = document.createElement('p')
        genereMusicale.classList.add('small', 'text-body-secondary', 'mb-0')
        genereMusicale.textContent = a.primaryGenreName

        if (a.wrapperType === 'artist') {
            imgContainer.classList.add('rounded-circle')
            artista.textContent = 'Artista'
            immagineArtista(a.artistId, img)
        } else if (a.artworkUrl100) {
            img.src = a.artworkUrl100
        }

        grid.appendChild(col)
        col.appendChild(card)
        imgContainer.appendChild(img)
        card.append(imgContainer, canzone, artista, genereMusicale)
    })
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
