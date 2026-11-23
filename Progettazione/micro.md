BaseURLAPI = https://itunes.apple.com/
endpointPop = search?term=pop&media=music&entity=album&country=IT&limit=10
endpointRock = search?term=rock&media=music&entity=album&country=IT&limit=10
endpointItalian = search?term=italian+pop&media=music&entity=album&country=IT&limit=10

indext.html la prima griglia che mostriamo a chermo e POP 
{BaseURLAPI} ${endpointPop}

Griglia Rock 
{BaseURLAPI} ${endpointRock}

Griglia Italian 
{BaseURLAPI} ${endpointItalian}

Da capire può servire per i preferiti e la cronologia 


const url = 'https://itunes.apple.com/lookup?id='
const endpointAlbum = '&entity=album'
const dati = []
async function get(){
    try{
        const resoponse = await fetch(`https://itunes.apple.com/search?term=pop&media=music&entity=album&country=IT&limit=10`)
        const data = await resoponse.json()
        dati.push(data.results)
        console.log(data)
        dati.forEach(d=>{
            d.forEach(a=>{
               Card(a.artistName,a.artworkUrl60, a.collectionName)
               console.log(a.artistViewUrl)
            })
        })
    }catch(err){
        console.error(err)
    }
}
get()

const popRow = document.querySelector('#popRow')

function Card(nomeArtista,immagine,nomeCanzone){
    const card = document.createElement('div')
    card.classList.add('card','p-3','col-md-4','col-12','text-white')
    const imgContainer = document.createElement('div')
    const canzone = document.createElement('h4')
    canzone.textContent = nomeCanzone
    const artista = document.createElement('p')
    artista.textContent = nomeArtista
    const img = document.createElement('img')
    img.classList.add('img-fluid')
    img.src = immagine
    popRow.appendChild(card)
    card.appendChild(imgContainer)
    imgContainer.appendChild(img)
    card.append(nomeCanzone,nomeArtista)
}

