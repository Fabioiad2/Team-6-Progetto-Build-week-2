const find = document.querySelector("#search-input")
const rowBrani = document.querySelector('#row-tracks')
const rowAlbums = document.querySelector('#row-albums')
const rowArtists = document.querySelector('#row-artists')
const modalImage = document.querySelector('#modalImage')
const modalTitle = document.querySelector('#modalTitle')
const modalArtistType = document.querySelector('#modalArtistType')
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

// artistId
let idArtisti;
let idAlbum; 

async function artistDetail(id,query){
    try{
        const response = await fetch(`${baseUrl}${endpointDettaglio}${id}${query}`)
        const data = await response.json()
        const obj = data.results[0]
        console.log(obj)
        modalTitle.textContent = obj.artistName
        modalTitle.textContent = obj.primaryGenreName
        modalArtistType.textContent = obj.artistType
        console.log(modalArtistType)
        // artistName, artistType primaryGenreName
    }catch(err){
        console.error(err)
    }
}


function Card(artist, section) {
    artist.forEach(a => {
        const card = document.createElement('div')
        card.addEventListener('click',()=>{
            if(section == rowArtists){
                idArtisti = a.artistId
                console.log(idArtisti,"id artista")
                artistDetail(idArtisti,queryArtistDetail)
            }
            else if(section == rowAlbums){
                idAlbum = a.collectionId
                artistDetail(idArtisti,queryAlbum)
                console.log(idAlbum,"album id")
            }
        })
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
