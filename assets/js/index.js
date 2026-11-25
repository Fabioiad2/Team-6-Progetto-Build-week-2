const baseUrl = 'https://itunes.apple.com/'
const popEndpoint = 'search?term=pop&media=music&entity=album&country=IT&limit=10'
const rockEndpoint = 'search?term=rock&media=music&entity=album&country=IT&limit=10'
const hitsEndpoint = 'search?term=hits&media=music&entity=album&country=IT&limit=10'

function aggiungiCardHome(riga, elementi) {
    for (const elemento of elementi) {
        riga.appendChild(creaCardMedia(elemento, { dettaglio: 'album' }))
    }
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
    aggiungiCardHome(contenitore, array)
}


function cardCronologia() {
    const historyRow = document.querySelector('#historyRow')
    historyRow.replaceChildren()
    aggiungiCardHome(historyRow, libreriaMusicale.leggiCronologia())
}

libreriaMusicale.osservaLista('history', cardCronologia)
cardCronologia()
get();
