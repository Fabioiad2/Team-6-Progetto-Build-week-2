(() => {
  const sidebar = document.querySelector('#sidebar');
  const sidebarTemplate = document.querySelector('#sidebar-template');
  const itemTemplate = document.querySelector('#sidebar-item-template');
  if (!sidebar || !sidebarTemplate || !itemTemplate) return;

  // clono il contenuto del <template>
  sidebar.replaceChildren(sidebarTemplate.content.cloneNode(true));

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
