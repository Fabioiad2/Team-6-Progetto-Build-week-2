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


function Card(artist, section) {
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
}
