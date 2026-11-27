// Le URL di iTunes contengono la dimensione (".../100x100bb.jpg"):
// cambiandola si ottiene la stessa copertina in alta risoluzione.
function copertinaGrande(url, lato = 400) {
    if (!url) return ''
    return url.replace(/\/\d+x\d+bb(?=\.\w+$)/, `/${lato}x${lato}bb`)
}

const creaCardMedia = (() => {
    const audio = document.querySelector('#audio-element')
    const etichette = { track: 'Brano', collection: 'Album', artist: 'Artista' }

    function icona(nome) {
        const i = document.createElement('i')
        i.className = `bi ${nome}`
        i.setAttribute('aria-hidden', 'true')
        return i
    }

    function inRiproduzione(url) {
        return Boolean(audio && url && audio.src === url && !audio.paused && !audio.ended)
    }

    function idPreferiti() {
        return new Set(libreriaMusicale.leggiPreferiti().map(brano => String(brano.trackId)))
    }

    function statoPlay(pulsante) {
        const attivo = inRiproduzione(pulsante.dataset.previewUrl)
        pulsante.classList.toggle('is-playing', attivo)
        pulsante.closest('.media-card')?.classList.toggle('is-playing', attivo)
        pulsante.firstElementChild.className = attivo ? 'bi bi-pause-fill' : 'bi bi-play-fill'
        pulsante.setAttribute('aria-label', `${attivo ? 'Metti in pausa' : 'Riproduci anteprima di'} ${pulsante.dataset.titolo}`)
    }

    function statoPreferito(pulsante, salvati) {
        const attivo = salvati.has(pulsante.dataset.trackId)
        pulsante.classList.toggle('is-fav', attivo)
        pulsante.firstElementChild.className = attivo ? 'bi bi-heart-fill' : 'bi bi-heart'
        pulsante.setAttribute('aria-pressed', String(attivo))
        pulsante.setAttribute('aria-label', `${attivo ? 'Rimuovi' : 'Aggiungi'} ${pulsante.dataset.titolo} ${attivo ? 'dai' : 'ai'} preferiti`)
    }

    function aggiornaPlayTutte() {
        document.querySelectorAll('.card-play[data-preview-url]').forEach(statoPlay)
    }

    function aggiornaPreferitiTutte() {
        const salvati = idPreferiti()
        document.querySelectorAll('.card-fav[data-track-id]').forEach(p => statoPreferito(p, salvati))
    }

    function creaCardMedia(dato, { dettaglio, riproduciAnteprima, caricaRitratto, preferito = true } = {}) {
        const idDettaglio = dettaglio === 'artist' ? dato.artistId : dato.collectionId
        const apreModale = Boolean(dettaglio) && idDettaglio != null
        const tipo = dettaglio === 'artist' || dato.wrapperType === 'artist'
            ? 'artist'
            : dato.wrapperType === 'collection' ? 'collection' : 'track'
        const testoTitolo = dato.trackName || dato.collectionName || dato.artistName || ''
        const anno = dato.releaseDate ? new Date(dato.releaseDate).getUTCFullYear() : null

        const colonna = document.createElement('div')
        const card = document.createElement('article')
        const copertina = document.createElement('div')
        const iniziale = document.createElement('span')
        const immagine = document.createElement('img')
        const badge = document.createElement('span')
        const corpo = document.createElement('div')
        const titolo = document.createElement('h3')
        const artista = document.createElement('p')
        const meta = document.createElement('div')

        colonna.className = 'col'
        card.className = 'media-card'
        card.dataset.type = tipo
        copertina.className = 'media-cover'
        iniziale.className = 'media-initial'
        badge.className = 'media-badge'
        corpo.className = 'media-body'
        titolo.className = 'media-title text-truncate mb-1'
        artista.className = 'media-subtitle text-truncate mb-0'
        meta.className = 'media-meta'

        // ---------- copertina ----------
        iniziale.textContent = testoTitolo.trim().charAt(0) || '♫'
        iniziale.setAttribute('aria-hidden', 'true')
        badge.textContent = etichette[tipo]
        immagine.alt = ''
        immagine.loading = 'lazy'
        immagine.decoding = 'async'
        // listener prima di assegnare src, così non perdo il "load"
        immagine.addEventListener('load', () => copertina.classList.add('is-loaded'))
        immagine.addEventListener('error', () => copertina.classList.add('is-error'))
        copertina.append(iniziale, immagine, badge)

        if (tipo === 'artist') {
            copertina.classList.add('rounded-circle')
            if (dato.artistId != null && caricaRitratto) {
                Promise.resolve(caricaRitratto(dato.artistId, immagine))
                    .finally(() => { if (!immagine.getAttribute('src')) copertina.classList.add('is-error') })
            } else {
                copertina.classList.add('is-error')
            }
        } else if (dato.artworkUrl100) {
            immagine.src = copertinaGrande(dato.artworkUrl100, 400)
        } else {
            copertina.classList.add('is-error')
        }

        // ---------- titolo (link che apre la modale e copre tutta la card) ----------
        if (apreModale) {
            const link = document.createElement('a')
            link.className = 'stretched-link'
            link.href = '#detailModal'
            link.dataset.bsToggle = 'modal'
            link.dataset.bsTarget = '#detailModal'
            link.dataset.detailId = idDettaglio
            link.dataset.detailType = dettaglio
            link.textContent = testoTitolo
            titolo.appendChild(link)
        } else {
            titolo.textContent = testoTitolo
        }
        titolo.title = testoTitolo

        artista.textContent = tipo === 'artist' ? 'Artista' : (dato.artistName || '')

        if (dato.primaryGenreName) {
            const genere = document.createElement('span')
            genere.className = 'media-genre'
            genere.textContent = dato.primaryGenreName
            meta.appendChild(genere)
        }
        if (anno && tipo !== 'artist') {
            const annoEl = document.createElement('span')
            annoEl.className = 'media-year'
            annoEl.textContent = anno
            meta.appendChild(annoEl)
        }

        // ---------- pulsante preferiti (solo per i brani: i preferiti sono tracce) ----------
        if (preferito && tipo === 'track' && dato.trackId != null) {
            const cuore = document.createElement('button')
            cuore.type = 'button'
            cuore.className = 'card-fav'
            cuore.dataset.trackId = dato.trackId
            cuore.dataset.titolo = testoTitolo
            cuore.appendChild(icona('bi-heart'))
            cuore.addEventListener('click', () => {
                libreriaMusicale.cambiaPreferito(dato)
                aggiornaPreferitiTutte()
            })
            statoPreferito(cuore, idPreferiti())
            copertina.appendChild(cuore)
        }

        // ---------- pulsante play / pausa ----------
        if (riproduciAnteprima && dato.previewUrl) {
            const play = document.createElement('button')
            play.type = 'button'
            play.className = 'card-play'
            play.dataset.previewUrl = dato.previewUrl
            play.dataset.titolo = testoTitolo
            play.appendChild(icona('bi-play-fill'))
            play.addEventListener('click', async () => {
                if (inRiproduzione(dato.previewUrl)) {
                    audio.pause()
                    return
                }
                const riprodotto = await riproduciAnteprima({
                    url: dato.previewUrl,
                    title: testoTitolo,
                    artist: dato.artistName,
                    cover: dato.artworkUrl100,
                })
                if (riprodotto && dato.trackId != null) libreriaMusicale.aggiungiCronologia(dato)
            })
            copertina.appendChild(play)
            card.appendChild(copertina) // serve per closest('.media-card') in statoPlay
            statoPlay(play)
        }

        corpo.append(titolo, artista)
        if (meta.children.length) corpo.appendChild(meta)
        card.append(copertina, corpo)
        colonna.appendChild(card)
        return colonna
    }

    // un solo set di listener per tutte le card della pagina
    for (const evento of ['play', 'pause', 'ended', 'emptied']) {
        audio?.addEventListener(evento, aggiornaPlayTutte)
    }
    libreriaMusicale.osservaLista('preferiti', aggiornaPreferitiTutte)

    return creaCardMedia
})()