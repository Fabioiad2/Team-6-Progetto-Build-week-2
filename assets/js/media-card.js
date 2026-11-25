function creaCardMedia(dato, { dettaglio, riproduciAnteprima, caricaRitratto } = {}) {
    const idDettaglio = dettaglio === 'artist' ? dato.artistId : dato.collectionId
    const apreModale = dettaglio && idDettaglio != null
    const colonna = document.createElement('div')
    const card = document.createElement(apreModale ? 'a' : 'div')
    const copertina = document.createElement('div')
    const immagine = document.createElement('img')
    const titolo = document.createElement('h4')
    const artista = document.createElement('p')
    const genere = document.createElement('p')

    colonna.classList.add('col')
    card.classList.add('media-card')
    copertina.classList.add('media-cover')
    titolo.classList.add('fs-6', 'fw-bold', 'text-truncate', 'mb-1')
    artista.classList.add('small', 'text-truncate', 'mb-0')
    genere.classList.add('small', 'text-body-secondary', 'mb-0')

    if (apreModale) {
        card.href = '#detailModal'
        card.dataset.bsToggle = 'modal'
        card.dataset.bsTarget = '#detailModal'
        card.dataset.detailId = idDettaglio
        card.dataset.detailType = dettaglio
    }

    titolo.textContent = dato.trackName || dato.collectionName || dato.artistName || ''
    artista.textContent = dato.artistName || ''
    genere.textContent = dato.primaryGenreName || ''
    immagine.alt = ''
    if (dettaglio === 'artist') {
        copertina.classList.add('rounded-circle')
        artista.textContent = 'Artista'
        if (dato.artistId != null) caricaRitratto?.(dato.artistId, immagine)
    } else if (dato.artworkUrl100) {
        immagine.src = dato.artworkUrl100
    }
    copertina.appendChild(immagine)

    if (!apreModale && riproduciAnteprima && dato.previewUrl) {
        const pulsante = document.createElement('button')
        pulsante.type = 'button'
        pulsante.classList.add('card-play')
        pulsante.textContent = '▶'
        pulsante.setAttribute('aria-label', `Riproduci anteprima di ${titolo.textContent}`)
        pulsante.addEventListener('click', () => riproduciAnteprima({
            url: dato.previewUrl,
            title: titolo.textContent,
            artist: dato.artistName,
            cover: dato.artworkUrl100,
        }))
        copertina.appendChild(pulsante)
    }

    card.append(copertina, titolo, artista, genere)
    colonna.appendChild(card)
    return colonna
}
