(() => {
  const sidebar = document.querySelector('#sidebar');

  sidebar.innerHTML = `
    <div class="brand">
      <span class="brand-mark" aria-hidden="true">♫</span>
      <span class="brand-text">EpiTunes</span>
    </div>
    <nav class="sidebar-nav" aria-label="Navigazione principale">
      <a href="index.html" data-page="home" aria-label="Home">
        <i class="bi bi-house-door-fill" aria-hidden="true"></i>
        <span>Home</span>
      </a>
      <a href="search.html" data-page="search" aria-label="Cerca">
        <i class="bi bi-search" aria-hidden="true"></i>
        <span>Cerca</span>
      </a>
    </nav>
    <h2 class="sidebar-section-title" id="favorites-title">I tuoi preferiti</h2>
    <ul class="sidebar-list" aria-labelledby="favorites-title"></ul>
  `;

  const currentLink = sidebar.querySelector(`[data-page="${document.body.dataset.page}"]`);
  currentLink.classList.add('active');
  currentLink.setAttribute('aria-current', 'page');

  document.querySelector('#btn-back').addEventListener('click', () => history.back());
  document.querySelector('#btn-forward').addEventListener('click', () => history.forward());

  const list = sidebar.querySelector('.sidebar-list');
  function mostraPreferiti() {
    list.replaceChildren();
    for (const favorite of libreriaMusicale.leggiPreferiti()) {
      const title = favorite.trackName || favorite.title;
      if (typeof title !== 'string' || !title.trim()) continue;

      const item = document.createElement('li');
      item.textContent = title;
      list.appendChild(item);
    }

    if (!list.children.length) {
      const emptyItem = document.createElement('li');
      emptyItem.textContent = 'Nessun preferito';
      list.appendChild(emptyItem);
    }
  }

  libreriaMusicale.osservaLista('preferiti', mostraPreferiti);
  mostraPreferiti();
})();
