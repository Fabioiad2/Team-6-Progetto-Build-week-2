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

function Card(nomeArtista,immagine,nomeCanzone){
    const card = document.createElement('div')
    card.classList.add('card','p-3','col-md-4','col-12','text-white','align-items-center')
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

async function get() {
    let arrayAlbumRock = [];
    let arrayAlbumPop = [];
    let arrayAlbumHits = [];
    try{
        // promiseAll dei tre suggerimenti iniziali pop,rock e hits
        const [rock, pop, hits]= await Promise.all([
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
        arrayAlbumRock= [...dataRock.results];
        arrayAlbumPop=[...dataPop.results];
        arrayAlbumHits=[...dataHits.results];
        
        //creo una funzione per scorrere l'array e creare una card per ogni album
        cardSuggerimenti(arrayAlbumRock);
        cardSuggerimenti(arrayAlbumPop);
        cardSuggerimenti(arrayAlbumHits);
        
    }catch(err){
        console.error(err)
    }
}

function cardSuggerimenti(array){
    array.forEach(a=>{
            Card(a.artistName, a.artworkUrl100, a.collectionName)
            console.log(a.artistViewUrl)
        })
}









//  footer & audio //
const player = document.querySelector('.player');
const audio = document.querySelector('#audio-element');

//  info brano //
const info = document.createElement('div');
info.classList.add('player-info');

const cover = document.createElement('img');
cover.classList.add('player-cover');
cover.alt = '';

const testi = document.createElement('div');

const titolo = document.createElement('p');
titolo.classList.add('player-title');
titolo.textContent = 'Seleziona un brano';

const artista = document.createElement('p');
artista.classList.add('player-artist');
artista.textContent = '—';

testi.appendChild(titolo);
testi.appendChild(artista);
info.appendChild(cover);
info.appendChild(testi);

// controlli al centro //
const controls = document.createElement('div');
controls.classList.add('player-controls');

const buttons = document.createElement('div');
buttons.classList.add('player-buttons');

const btnShuffle = document.createElement('button');
btnShuffle.textContent = '⇄';

const btnPrev = document.createElement('button');
btnPrev.textContent = '⏮';

const btnPlay = document.createElement('button');
btnPlay.classList.add('btn-play');
btnPlay.textContent = '▶';

const btnNext = document.createElement('button');
btnNext.textContent = '⏭';

const btnRepeat = document.createElement('button');
btnRepeat.textContent = '↻';

buttons.appendChild(btnShuffle);
buttons.appendChild(btnPrev);
buttons.appendChild(btnPlay);
buttons.appendChild(btnNext);
buttons.appendChild(btnRepeat);

const progressBox = document.createElement('div');
progressBox.classList.add('player-progress');

const timeCurrent = document.createElement('span');
timeCurrent.textContent = '0:00';

const progress = document.createElement('input');
progress.type = 'range';
progress.min = 0;
progress.max = 100;
progress.value = 0;

const timeTotal = document.createElement('span');
timeTotal.textContent = '0:00';

progressBox.appendChild(timeCurrent);
progressBox.appendChild(progress);
progressBox.appendChild(timeTotal);

controls.appendChild(buttons);
controls.appendChild(progressBox);

//     DESTRA: volume //
const volumeBox = document.createElement('div');
volumeBox.classList.add('player-volume');

const iconaVolume = document.createElement('span');
iconaVolume.textContent = '🔈';

const volume = document.createElement('input');
volume.type = 'range';
volume.min = 0;
volume.max = 100;
volume.value = 80;

volumeBox.appendChild(iconaVolume);
volumeBox.appendChild(volume);

//  Monto tutto nel footer //
player.appendChild(info);
player.appendChild(controls);
player.appendChild(volumeBox);

//  funzioni di aiuto //
function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// devo riempire la parte sinistra dello slider (usata dal CSS)
function aggiornaFill(slider) {
  const percento = (slider.value - slider.min) / (slider.max - slider.min) * 100;
  slider.style.setProperty('--fill', percento + '%');
}

// ---------- logica ----------
// play / pausa
btnPlay.addEventListener('click', () => {
  if (!audio.src) return; // nessun brano scelto
  if (audio.paused) {
    audio.play();
    btnPlay.textContent = '⏸';
  } else {
    audio.pause();
    btnPlay.textContent = '▶';
  }
});

// avanzamento del brano
audio.addEventListener('timeupdate', () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
  timeCurrent.textContent = formatTime(audio.currentTime);
  aggiornaFill(progress);
});

// durata totale
audio.addEventListener('loadedmetadata', () => {
  timeTotal.textContent = formatTime(audio.duration);
});

// a fine brano il bottone torna su play
audio.addEventListener('ended', () => {
  btnPlay.textContent = '▶';
});

// trascinando la barra salto a quel punto
progress.addEventListener('input', () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
  aggiornaFill(progress);
});

// volume
volume.addEventListener('input', () => {
  audio.volume = volume.value / 100;
  aggiornaFill(volume);
});

// stato iniziale
audio.volume = 0.8;
aggiornaFill(volume);
aggiornaFill(progress);

// x partire il brano //
function playTrack(track) {
  audio.src = track.url;
  titolo.textContent = track.title;
  artista.textContent = track.artist;
  cover.src = track.cover;
  audio.play();
  btnPlay.textContent = '⏸';
}