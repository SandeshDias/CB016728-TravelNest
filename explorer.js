let explorerPage = 1;
const PER_PAGE = 12;
let filterdestination = [...destinations];
let explorerInited = false;

function explorer() {
    if (!explorerInited) {
        explorerInited = true;
    }
    const pending = localStorage.getItem('pending_search');
    if (pending && document.getElementById('searchDestination')) {
        document.getElementById ('searchDestination').value = pending;
        localStorage.removeItem('pending_search');
    }
    filterDestinations();
}

function filterDestinations() {
    const q = (document.getElementById('searchDestination')?.value || '').toLowerCase();
    const cont = document.getElementById('continentFilter')?.value ||'';
    filterDestination = destinations.filter(d => {
        const matchQ = !q || d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q);
        const matchC = !cont || d.continent === cont;
        return matchQ && matchC;
    });
    explorerPage = 1;
    renderExplorer();
}

function resetFilter () {
    document.getElementById('searchDestination').value = '';
    document.getElementById('continentFilter').value = '';
    filterDestinations();
}

function renderExplorer() {
    const start = (explorerPage - 1) * PER_PAGE;
    const paged = filterDestination.slice(start, start + PER_PAGE);
    const grid = document.getElementById('destinationGrid');
    const noResult = document.getElementById('noResult');

    if (!paged.length) {
        grid.innerHTML ='';
        noResult.style.display = 'block';
    } else {
        noResult.style.display = 'none';
        grid.innerHTML = paged.map(d => `
            <div class="destination-explorer-card card" onclick="openModal(${d.id})">
                <img src="${d.img}" alt="${d.name}, ${d.country}">
                 <div class="destination-explorer-card-body">
                    <div class="destination-explorer-card-name">${d.name}</div>
                    <div class="destination-explorer-card-country">${d.country} · ${d.type}</div>
                </div>
        </div>`).join('');
        setTimeout(100);
    }
    renderPagination();
}

function renderPagination() {
    const total = Math.ceil(filterDestination.length / PER_PAGE);
    const pg = document.getElementById('pagination');
    if (total <= 1) { pg.innerHTML = ''; return;}
    let html = '';
    if (explorerPage > 1) html += `<button class="page-button" onclick="gotoPage(${explorerPage - 1})">‹</button>`;
    for (let i = 1; i <= total; i++) {
        html += `<button class="page-button${i === explorerPage ? ' active' : ''}" onclick="gotoPage(${i})">${i}</button>`;
    }
    if (explorerPage < total) html += `<button class="page-button" onclick="gotoPage(${explorerPage + 1})">›</button>`;
    pg.innerHTML = html;
}

function gotoPage(n) {
    explorerPage = n;
    renderExplorer();
    window.scrollTo({ top: 300, behavior: 'smooth'});
}

// Modal
let modalDest = null;

function openModal(id) {
    modalDest = destinations.find(d => d.id === id);
    if (!modalDest) return;
    document.getElementById('modalImg').src = modalDest.img;
    document.getElementById('modalImg').alt = modalDest.name;
    document.getElementById('modalTitle').textContent = modalDest.name;
    document.getElementById('modalCountry').textContent =modalDest.country + ' · ' + modalDest.continent;
    document.getElementById('modalDestination').textContent = modalDest.desc;
    document.getElementById('modalAttractions').innerHTML = modalDest.attractions.map(a => `<li>${a}</li>`).join('');
    document.getElementById('modalCostBody').innerHTML = modalDest.costs.map(c =>
        `<tr><td>${c.cat}</td><td>${c.low}</td><td>${c.mid}</td><td>${c.lux}</td></tr>`
    ).join('');
    document.getElementById('destModal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('destModal').classList.remove('open');
    document.body.style.overflow = '';
}

const destModalElement = document.getElementById('destModal');
if (destModalElement) {
    destModalElement.addEventListener('click', e =>{
        if (e.target === destModalElement) closeModal();
    });
}

explorer();