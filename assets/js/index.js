const url = 'https://itunes.apple.com/lookup?id='
const endpointAlbum = '&entity=album'
const dati = []
const baseUrl = 'https://itunes.apple.com/'
const popEndpoint = 'search?term=pop&media=music&entity=album&country=IT&limit=10'
async function get(){
    try{
        const response = await fetch(`${baseUrl}${popEndpoint}`)
        const data = await response.json()
        dati.push(data.results)
        console.log(data)
        dati.forEach(d=>{
            d.forEach(a=>{
               Card(a.artistName,a.artworkUrl100, a.collectionName)
               console.log(a.artistViewUrl)
            })
        })
    }catch(err){
        console.error(err)
    }
}
get()

const popRow = document.querySelector('#popRow')



function Card(nomeArtista, immagine, nomeCanzone){
    const col = document.createElement('div')
    col.classList.add('col')
    const card = document.createElement('div')
    card.classList.add('media-card')

    const imgContainer = document.createElement('div')
    imgContainer.classList.add('media-cover')

    const canzone = document.createElement('h4')
    canzone.classList.add('fs-6', 'fw-bold', 'text-truncate', 'mb-1')
    canzone.textContent = nomeCanzone

    const artista = document.createElement('p')
    artista.classList.add('small', 'text-body-secondary', 'text-truncate', 'mb-0')
    artista.textContent = nomeArtista

    const img = document.createElement('img')
    img.alt = ''
    img.src = immagine

    popRow.appendChild(col)
    col.appendChild(card)
    card.appendChild(imgContainer)
    imgContainer.appendChild(img)
    card.append(canzone, artista)
}

