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

    // const formattaDurata = millisecondi => {
    //     if (!Number.isFinite(millisecondi)) return ''
    //     const secondi = Math.round(millisecondi / 1000)
    //     return `${Math.floor(secondi / 60)}:${String(secondi % 60).padStart(2, '0')}`
    // }

    // ".../100x100bb.jpg" → ".../600x600bb.jpg" per una copertina nitida
    const copertinaHD = url => url.replace(/\/\d+x\d+bb(?=\.\w+$)/, '/600x600bb')

    function icona(nome) {
        const i = document.createElement('i')
        i.className = `bi ${nome}`
        i.setAttribute('aria-hidden', 'true')
        return i
    }

    function convertims(ms){
            const secondi = Math.floor(ms / 1000)
            const durata = `${Math.floor(secondi / 60)}:${String(secondi % 60).padStart(2, '0')}`
            return `${durata}m`
    }

    function mostraDettagliAlbum(album, brani) {
        const anno = album.releaseDate && new Date(album.releaseDate).getUTCFullYear()
        const numeroBrani = album.trackCount ?? brani.length
        const durataCompleta = brani.length > 0 && brani.length === numeroBrani
            && brani.every(brano => Number.isFinite(brano.trackTimeMillis))
        let durata = '—'
        if (durataCompleta) {
            // durata = formattaDurata(brani.reduce((totale, brano) => totale + brano.trackTimeMillis, 0))
            const millisecondi = brani.reduce((totale, brano) => totale + brano.trackTimeMillis, 0)
            durata = convertims(millisecondi)
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
            const nome = pulsante.dataset.trackName
            pulsante.classList.toggle('is-fav', preferito)
            pulsante.firstElementChild.className = preferito ? 'bi bi-heart-fill' : 'bi bi-heart'
            pulsante.setAttribute('aria-pressed', String(preferito))
            pulsante.setAttribute('aria-label', `${preferito ? 'Rimuovi' : 'Aggiungi'} ${nome} ${preferito ? 'dai' : 'ai'} preferiti`)
        }
    }

    function aggiornaRiproduzione() {
        for (const pulsante of listaBrani.querySelectorAll('button[data-preview-url]')) {
            const inRiproduzione = audio.src === pulsante.dataset.previewUrl && !audio.paused && !audio.ended
            pulsante.classList.toggle('is-playing', inRiproduzione)
            pulsante.closest('li')?.classList.toggle('is-playing', inRiproduzione)
            pulsante.firstElementChild.className = inRiproduzione ? 'bi bi-pause-fill' : 'bi bi-play-fill'
            const azione = inRiproduzione ? 'Metti in pausa' : 'Riproduci anteprima di'
            pulsante.setAttribute('aria-label', `${azione} ${pulsante.dataset.trackName}`)
        }
    }

    function creaRigaBrano(brano) {
        // il numero arriva dal ::before di .list-group-numbered;
        // .me-auto sul blocco info lo tiene attaccato al numero e spinge a destra durata e pulsanti
        const riga = document.createElement('li')
        riga.className = 'list-group-item track-item d-flex align-items-center gap-3'

        const info = document.createElement('div')
        info.className = 'track-info me-auto'

        const nome = document.createElement('span')
        nome.className = 'track-name d-block text-truncate'
        nome.textContent = brano.trackName
        nome.title = brano.trackName

        const sottotitolo = document.createElement('span')
        sottotitolo.className = 'track-artist d-block text-truncate'
        sottotitolo.textContent = brano.artistName || ''
        info.append(nome, sottotitolo)

        const durata = document.createElement('span')
        durata.className = 'track-duration d-none d-sm-inline'
        // durata.textContent = formattaDurata(brano.trackTimeMillis)

        const durataSingola = document.createElement('span')
        durataSingola.textContent = convertims(brano.trackTimeMillis)
        console.log(durataSingola)
        const pulsanti = document.createElement('div')
        pulsanti.className = 'd-flex flex-shrink-0 align-items-center gap-2'

        const riproduci = document.createElement('button')
        riproduci.type = 'button'
        riproduci.className = 'btn-track btn-track-play'
        riproduci.appendChild(icona('bi-play-fill'))
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
        pulsanti.append(durataSingola,riproduci)

        if (brano.trackId != null) {
            const preferito = document.createElement('button')
            preferito.type = 'button'
            preferito.className = 'btn-track btn-track-fav'
            preferito.dataset.trackId = brano.trackId
            preferito.dataset.trackName = brano.trackName
            preferito.appendChild(icona('bi-heart'))
            preferito.addEventListener('click', () => libreriaMusicale.cambiaPreferito(brano))
            pulsanti.appendChild(preferito)
        }

        riga.append(info, durata, pulsanti)
        return riga
    }

    async function caricaDettaglio(id, tipo) {
        richiesta?.abort()
        richiesta = new AbortController()
        const { signal } = richiesta
        const mostraAlbum = tipo === 'album'

        titolo.textContent = 'Dettaglio'
        immagine.hidden = true
        immagine.classList.toggle('rounded-circle', !mostraAlbum)
        artista.hidden = true
        genere.hidden = true
        dettagliAlbum.hidden = true
        sezioneBrani.hidden = true
        listaBrani.replaceChildren()
        stato.textContent = 'Caricamento…'
        stato.dataset.loading = ''

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
                immagine.src = copertinaHD(copertina)
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
        } finally {
            if (!signal.aborted) delete stato.dataset.loading
        }
    }

    modale.addEventListener('show.bs.modal', event => {
        const { detailId, detailType } = event.relatedTarget?.dataset ?? {}
        if (detailId) caricaDettaglio(detailId, detailType)
    })
    modale.addEventListener('hidden.bs.modal', () => {
        richiesta?.abort()
        delete stato.dataset.loading
    })
    for (const evento of ['play', 'pause', 'ended', 'emptied']) {
        audio.addEventListener(evento, aggiornaRiproduzione)
    }
    libreriaMusicale.osservaLista('preferiti', aggiornaPreferiti)
})()