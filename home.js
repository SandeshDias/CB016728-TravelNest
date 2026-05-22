let quoteIndex = 0;
let quoteInterval;

function home(){
    setDotd();
    showQuote();
    popularGrid();
}

function showQuote() {
    clearInterval(quoteInterval);
    updateQuote();
    quoteInterval = setInterval (() => {
        quoteIndex = (quoteIndex + 1) % quotes.length;
        updateQuote();
    }, 5000);
}

function updateQuote () {
    const element =document.getElementById('quoteText');
    const author = document.getElementById('quoteAuthor');
    if (!element || !author) return;
    element.style.opacity = 0;
    setTimeout(() => {
        element.textContent = '"' + quotes[quoteIndex].text + '"';
        author.textContent = '- ' + quotes[quoteIndex].author;
        element.style.opacity = 1;
    },300);
}

// Destination of the day
function setDotd() {
  if (!document.getElementById('name')) return;
  const dayIndex = Math.floor(Date.now() / 86400000) % destinations.length;
  const d = destinations[dayIndex];
  document.getElementById('name').textContent = d.name;
  document.getElementById('country').textContent = d.country;
  document.getElementById('desc').textContent = d.desc.substring(0, 120) + '...';
  document.getElementById('destination-image').src = d.img;
  document.getElementById('destination-image').alt = d.name + ', ' + d.country;
  window._name = d.name;
}

function filterByDotd() {
  if (window._name) {
    localStorage.setItem('pending_search', window._name);
  }
}

function popularGrid() {
    const grid = document.getElementById('popularGrid');
    if (!grid) return;
    const popular = destinations.slice(0,8);
    grid.innerHTML = popular.map(d => `
        <div class="popular-destination-card card " onclick="openModal(${d.id})" style="cursor:pointer">
            <div class="popular-destination-card-img">
                <img src="${d.img}" alt="${d.name}, ${d.country}"></img>
                <div class="popular-destination-card-overlay"></div>
                <div class="popular-destination-card-badge">${d.type}</div>
            </div>
            <div class="popular-destination-card-body">
                <div class="popular-destination-card-name">${d.name}</div>
                <div class="popular-destination-card-country">${d.country}</div>
            </div>
        </div>`).join('');
    setTimeout( 100);
}

function heroSearch() {
    const q = document.getElementById('heroSearch').value.trim();
    if(q){
        localStorage.setItem('pending_search', q);
        navigateTo('explorer');
    }
}

home();