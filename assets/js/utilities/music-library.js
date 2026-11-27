const libreriaMusicale = (() => {
    function leggiLista(chiave) {
        try {
            const brani = JSON.parse(localStorage.getItem(chiave))
            return Array.isArray(brani) ? brani.filter(brano => brano && typeof brano === 'object') : null
        } catch {
            return null
        }
    }

    function salvaLista(chiave, brani) {
        try {
            localStorage.setItem(chiave, JSON.stringify(brani))
        } catch (err) {
            console.error(err)
            return
        }
        window.dispatchEvent(new Event(`${chiave}:aggiornata`))
    }

    function osservaLista(chiave, aggiorna) {
        window.addEventListener(`${chiave}:aggiornata`, aggiorna)
        window.addEventListener('storage', event => {
            if (event.key === chiave || event.key === null || (chiave === 'preferiti' && event.key === 'favorites')) {
                aggiorna()
            }
        })
        window.addEventListener('pageshow', event => {
            if (event.persisted) aggiorna()
        })
    }

    function leggiPreferiti() {
        return leggiLista('preferiti') ?? leggiLista('favorites') ?? []
    }

    function cambiaPreferito(brano) {
        const preferiti = leggiPreferiti()
        const giaSalvato = preferiti.some(preferito => String(preferito.trackId) === String(brano.trackId))
        const aggiornati = giaSalvato
            ? preferiti.filter(preferito => String(preferito.trackId) !== String(brano.trackId))
            : [...preferiti, brano]
        salvaLista('preferiti', aggiornati)
    }

    function leggiCronologia() {
        return leggiLista('history') ?? []
    }

    function aggiungiCronologia(brano) {
        const altriBrani = leggiCronologia().filter(ascoltato => String(ascoltato.trackId) !== String(brano.trackId))
        salvaLista('history', [brano, ...altriBrani].slice(0, 5))
    }

    return { osservaLista, leggiPreferiti, cambiaPreferito, leggiCronologia, aggiungiCronologia }
})()
