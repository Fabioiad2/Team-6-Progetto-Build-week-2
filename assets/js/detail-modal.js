(() => {
    const modale = document.querySelector('#detailModal')
    const immagine = document.querySelector('#modalImage')
    const titolo = document.querySelector('#modalTitle')
    const artista = document.querySelector('#modalArtistType')
    const genere = document.querySelector('#modalGenre')
    const dettagliAlbum = document.querySelector('#modalAlbumDetails')
    const stato = document.querySelector('#modalStatus')
    const sezioneBrani = document.querySelector('#modalTrackSection')
    const listaBrani = document.querySelector('#modalTracks')
    const audio = document.querySelector('#audio-element')
    let richiesta

    function mostraDettagliAlbum(album, brani) {
        const anno = album.releaseDate && new Date(album.releaseDate).getUTCFullYear()
        const numeroBrani = album.trackCount ?? brani.length
        const durataCompleta = brani.length > 0 && brani.length === numeroBrani
            && brani.every(brano => Number.isFinite(brano.trackTimeMillis))
        let durata = '—'
        if (durataCompleta) {
            const millisecondi = brani.reduce((totale, brano) => totale + brano.trackTimeMillis, 0)
            const secondi = Math.floor(millisecondi / 1000)
            durata = `${Math.floor(secondi / 60)}:${String(secondi % 60).padStart(2, '0')}`
        }

        dettagliAlbum.querySelector('#releaseDate').textContent = `Anno di uscita ${anno || '—'}`
        dettagliAlbum.querySelector('#trackCount').textContent = `${numeroBrani} ${numeroBrani === 1 ? 'brano' : 'brani'}`
        dettagliAlbum.querySelector('#AlbumDuration').textContent = `Durata totale ${durata}`
        dettagliAlbum.hidden = false
    }

    function aggiornaPreferiti() {
        const salvati = new Set(libreriaMusicale.leggiPreferiti().map(brano => String(brano.trackId)))
        for (const pulsante of listaBrani.querySelectorAll('button[data-track-id]')) {
            const preferito = salvati.has(pulsante.dataset.trackId)
            pulsante.className = preferito ? 'btn btn-danger btn-sm' : 'btn btn-outline-danger btn-sm'
            pulsante.textContent = preferito ? '♥' : '♡'
            pulsante.setAttribute('aria-pressed', String(preferito))
        }
    }

    function aggiornaRiproduzione() {
        for (const pulsante of listaBrani.querySelectorAll('button[data-preview-url]')) {
            const inRiproduzione = audio.src === pulsante.dataset.previewUrl && !audio.paused && !audio.ended
            pulsante.textContent = inRiproduzione ? '⏸' : '▶'
            const azione = inRiproduzione ? 'Metti in pausa' : 'Riproduci anteprima di'
            pulsante.setAttribute('aria-label', `${azione} ${pulsante.dataset.trackName}`)
        }
    }

    function creaRigaBrano(brano) {
        const riga = document.createElement('li')
        riga.className = 'list-group-item d-flex justify-content-between align-items-center gap-3'

        const nome = document.createElement('span')
        nome.textContent = brano.trackName

        const pulsanti = document.createElement('div')
        pulsanti.className = 'd-flex flex-shrink-0 gap-3'

        const riproduci = document.createElement('button')
        riproduci.type = 'button'
        riproduci.className = 'btn btn-sm'
        riproduci.textContent = '▶'
        riproduci.disabled = !brano.previewUrl
        if (brano.previewUrl) {
            riproduci.dataset.previewUrl = brano.previewUrl
            riproduci.dataset.trackName = brano.trackName
            riproduci.addEventListener('click', async () => {
                if (audio.src === brano.previewUrl && !audio.paused && !audio.ended) {
                    audio.pause()
                    return
                }

                const riprodotto = await playTrack({
                    url: brano.previewUrl,
                    title: brano.trackName,
                    artist: brano.artistName,
                    cover: brano.artworkUrl100,
                })
                if (riprodotto && brano.trackId != null) libreriaMusicale.aggiungiCronologia(brano)
            })
        } else {
            riproduci.setAttribute('aria-label', 'Anteprima non disponibile')
        }
        pulsanti.appendChild(riproduci)

        if (brano.trackId != null) {
            const preferito = document.createElement('button')
            preferito.type = 'button'
            preferito.dataset.trackId = brano.trackId
            preferito.setAttribute('aria-label', `${brano.trackName} tra i preferiti`)
            preferito.addEventListener('click', () => libreriaMusicale.cambiaPreferito(brano))
            pulsanti.appendChild(preferito)
        }

        riga.append(nome, pulsanti)
        return riga
    }

    async function caricaDettaglio(id, tipo) {
        richiesta?.abort()
        richiesta = new AbortController()
        const { signal } = richiesta
        const mostraAlbum = tipo === 'album'

        titolo.textContent = 'Dettaglio'
        immagine.hidden = true
        artista.hidden = true
        genere.hidden = true
        dettagliAlbum.hidden = true
        sezioneBrani.hidden = true
        listaBrani.replaceChildren()
        stato.textContent = 'Caricamento…'

        try {
            const query = new URLSearchParams({
                id,
                entity: 'song',
                country: 'IT',
                limit: mostraAlbum ? '200' : '15',
            })
            const risposta = await fetch(`https://itunes.apple.com/lookup?${query}`, { signal })
            if (!risposta.ok) throw new Error(`iTunes: HTTP ${risposta.status}`)

            const { results } = await risposta.json()
            if (signal.aborted) return
            const [dettaglio, ...risultati] = results
            if (!dettaglio) {
                stato.textContent = 'Nessun dettaglio disponibile.'
                return
            }

            const brani = risultati.filter(risultato => risultato.kind === 'song' && risultato.trackName)
            const copertina = dettaglio.artworkUrl100 || brani.find(brano => brano.artworkUrl100)?.artworkUrl100
            if (copertina) {
                immagine.src = copertina
                immagine.hidden = false
            }
            titolo.textContent = dettaglio.collectionName || dettaglio.artistName
            artista.textContent = (mostraAlbum ? dettaglio.artistName : dettaglio.artistType) || ''
            artista.hidden = !artista.textContent
            genere.textContent = dettaglio.primaryGenreName || ''
            genere.hidden = !genere.textContent
            if (mostraAlbum) mostraDettagliAlbum(dettaglio, brani)

            for (const brano of brani) listaBrani.appendChild(creaRigaBrano(brano))
            aggiornaPreferiti()
            aggiornaRiproduzione()
            sezioneBrani.hidden = brani.length === 0
            stato.textContent = brani.length ? '' : 'Nessun brano disponibile.'
        } catch (err) {
            if (signal.aborted) return
            stato.textContent = 'Impossibile caricare il dettaglio.'
            console.error(err)
        }
    }

    modale.addEventListener('show.bs.modal', event => {
        const { detailId, detailType } = event.relatedTarget?.dataset ?? {}
        if (detailId) caricaDettaglio(detailId, detailType)
    })
    modale.addEventListener('hidden.bs.modal', () => richiesta?.abort())
    for (const evento of ['play', 'pause', 'ended', 'emptied']) {
        audio.addEventListener(evento, aggiornaRiproduzione)
    }
    libreriaMusicale.osservaLista('preferiti', aggiornaPreferiti)
})()
