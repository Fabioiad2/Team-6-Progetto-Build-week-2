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

// audio muted
iconaVolume.addEventListener('click', () => {
  audio.muted = !audio.muted;

  iconaVolume.textContent = audio.muted ? '🔇' : '🔈';
});

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
    audio.play().catch(console.error);
  } else {
    audio.pause();
  }
});

function aggiornaPlay() {
  btnPlay.textContent = audio.paused ? '▶' : '⏸';
  btnPlay.setAttribute('aria-label', audio.paused ? 'Riproduci' : 'Pausa');
}

audio.addEventListener('play', aggiornaPlay);
audio.addEventListener('pause', aggiornaPlay);
audio.addEventListener('ended', aggiornaPlay);
aggiornaPlay();

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

// trascinando la barra salto a quel punto
progress.addEventListener('input', () => {
  if (!Number.isFinite(audio.duration)) return;
  audio.currentTime = (progress.value / 100) * audio.duration;
  aggiornaFill(progress);
});

// volume
volume.addEventListener('input', () => {
  audio.volume = volume.value / 100;
  aggiornaFill(volume);
  localStorage.setItem('volume', volume.value);
});

// stato iniziale
const volumeSalvato = localStorage.getItem('volume');
if (volumeSalvato !== null) {
  volume.value = volumeSalvato;
}
audio.volume = volume.value / 100;
aggiornaFill(volume);
aggiornaFill(progress);

// x partire il brano //
function playTrack(track) {
  audio.src = track.url;
  titolo.textContent = track.title;
  artista.textContent = track.artist;
  if (track.cover) {
    cover.src = track.cover;
  } else {
    cover.removeAttribute('src');
  }
  progress.value = 0;
  timeCurrent.textContent = '0:00';
  timeTotal.textContent = '0:00';
  aggiornaFill(progress);
  return audio.play().then(() => true, error => {
    console.error(error);
    return false;
  });
}
