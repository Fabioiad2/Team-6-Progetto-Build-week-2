(() => {
  const sidebar = document.querySelector('#sidebar');
  const sidebarTemplate = document.querySelector('#sidebar-template');
  const itemTemplate = document.querySelector('#sidebar-item-template');
  if (!sidebar || !sidebarTemplate || !itemTemplate) return;
  const row = document.querySelector('main')
  const player = document.querySelector('#player')

  // Percorsi dei file in assets/extra calcolati partendo da questo script
  // (assets/js/components/sidebar.js → ../../extra/): così funzionano sia da
  // index.html sia da search/search.html, che sta in una sottocartella.
  const cartellaExtra = new URL('../../extra/', document.currentScript.src)
  const fileExtra = nome => new URL(nome, cartellaExtra).href

  const audio = new Audio(fileExtra('Rick Astley - Never Gonna Give You Up (Official Video) (4K Remaster)_128k.mp3'));

  // clono il contenuto del <template>
  sidebar.replaceChildren(sidebarTemplate.content.cloneNode(true));

  // il pulsante Premium ora è nel template HTML: lo cerco DOPO averlo clonato
  const freePremium = sidebar.querySelector('#btn-premium')
  freePremium?.addEventListener('click', () => {
    audio.play();
    row.textContent = '';
    player.textContent = '';

    // Centra il box del vinile in mezzo alla pagina rosa
    row.classList.add('contenitoreRosa', 'd-flex', 'justify-content-center', 'align-items-center');
    const cit = document.createElement('h2')
    const accettazione = document.createElement('button')
    accettazione.type = 'button'
    accettazione.className = 'btn-accetta' // stile nel CSS (facoltativo)
    accettazione.textContent = 'Lo accetto'
    accettazione.addEventListener('click', () => {
      window.location.href = ''
    })
    cit.classList.add('d-block')
    cit.textContent = 'Niente è gratuito nella vita'
    const contenitore = document.createElement('div');
    contenitore.classList.add('contenitoreMeme');

    const vinile = document.createElement('img');
    vinile.src = fileExtra('Vinile-semplice.webp');
    vinile.alt = '';
    vinile.classList.add('vinile-bg');

    const img = document.createElement('img');
    img.src = fileExtra('images.jpg');
    img.alt = '';
    img.classList.add('img-rotonda');

    contenitore.append(vinile, img);
    row.append(cit, accettazione, contenitore);
  });

  const currentLink = sidebar.querySelector(`.sidebar-nav [data-page="${document.body.dataset.page}"]`);
  currentLink?.classList.add('active');
  currentLink?.setAttribute('aria-current', 'page');

  document.querySelector('#btn-back')?.addEventListener('click', () => history.back());
  document.querySelector('#btn-forward')?.addEventListener('click', () => history.forward());

  const list = sidebar.querySelector('.sidebar-list');

  function creaVocePreferito(favorite, title) {
    const item = itemTemplate.content.firstElementChild.cloneNode(true);
    const button = item.querySelector('button');
    const label = item.querySelector('.sidebar-fav-title');

    label.textContent = title; // textContent: il titolo resta testo, mai HTML
    button.title = favorite.artistName ? `${title} — ${favorite.artistName}` : title;

    if (favorite.trackId != null && favorite.previewUrl) {
      item.dataset.trackId = favorite.trackId;
      button.setAttribute('aria-label', `Riproduci ${title}`);
    } else {
      button.disabled = true;
    }
    return item;
  }

  function mostraPreferiti() {
    list.replaceChildren();
    for (const favorite of libreriaMusicale.leggiPreferiti()) {
      const title = favorite.trackName || favorite.title;
      if (typeof title !== 'string' || !title.trim()) continue;
      list.appendChild(creaVocePreferito(favorite, title));
    }

    if (!list.children.length) {
      const emptyItem = document.createElement('li');
      emptyItem.className = 'sidebar-empty';
      emptyItem.textContent = 'Nessun preferito';
      list.appendChild(emptyItem);
    }
  }

  // un solo listener per tutta la lista (event delegation)
  list.addEventListener('click', async event => {
    const item = event.target.closest('li[data-track-id]');
    if (!item) return;
    const brano = libreriaMusicale.leggiPreferiti()
      .find(favorite => String(favorite.trackId) === item.dataset.trackId);
    if (!brano?.previewUrl) return;

    const riprodotto = await playTrack({
      url: brano.previewUrl,
      title: brano.trackName || brano.title,
      artist: brano.artistName,
      cover: brano.artworkUrl100,
    });
    if (riprodotto) libreriaMusicale.aggiungiCronologia(brano);
  });

  libreriaMusicale.osservaLista('preferiti', mostraPreferiti);
  mostraPreferiti();
})();