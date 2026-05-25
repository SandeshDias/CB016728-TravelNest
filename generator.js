let generatedDest = null;

function generatetrip() {
    const btn = document.getElementById('surpriseButton')
    btn.classList.add('spin');
    setTimeout(() => btn.classList.remove('spin'),600);

    const travelType = document.getElementById('travelType').value;
    const budget = document.getElementById('budgetRange').value;

    let pool = destinations.filter( d => {
        const matchType = !travelType || d.type.includes(travelType);
        const matchBudget = !budget || d.budget === budget;
        return matchType && matchBudget;
    })

    if (!pool.length) pool = destinations;
    generatedDest = pool[Math.floor(Math.random() * pool.length)];

    document.getElementById('resultImg').src = generatedDest.img;
    document.getElementById('resultImg').alt = generatedDest.name;
    document.getElementById('resultName').textContent = generatedDest.name;
    document.getElementById('resultCountry').textContent =generatedDest.country + ' · ' + generatedDest.continent;
    document.getElementById('resultDesc').textContent = generatedDest.desc;
    document.getElementById('resultMeta').innerHTML = `
        <span class="result-tag"> ${generatedDest.type}</span>
        <span class="result-tag"> ${generatedDest.budget.charAt(0).toUpperCase() + generatedDest.budget.slice(1)}</span>
        <span class="result-tag"> ${generatedDest.continent}</span>`;

    document.getElementById('resultplaceholder').style.display = 'none';
    document.getElementById('resultContent').style.display = 'block';
}

function saveGeneratedToWishlist() {
  if (generatedDest) addToWishlist(generatedDest);
}

function addToWishlist(dest) {
  const list = JSON.parse(localStorage.getItem('wishlist') || '[]');
  if (list.find(i => i.id === dest.id)) { showNotify('Already in wishlist!', ''); return; }
  list.push({ id: dest.id, name: dest.name, country: dest.country });
  localStorage.setItem('wishlist', JSON.stringify(list));
  renderWishlist();
}

function renderWishlist() {
    const list = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const el = document.getElementById('wishList');
    if (!list.length) {el.innerHTML = '<p>No destinations saved yet.</p>'; return; }
    el.innerHTML = list.map(i => `
        <div class="wishlist-item">
            <div class="wishlist-item-info">
                <strong>${i.name}</strong>
                <span>${i.country}</span>
            </div>
            <button class="del-button" onclick="removeWishlist(${i.id})">🗑️</button>
        </div>`).join('');
}

function removeWishlist(id) {
  let list = JSON.parse(localStorage.getItem('wishlist') || '[]');
  list = list.filter(i => i.id !== id);
  localStorage.setItem('wishlist', JSON.stringify(list));
  renderWishlist();
}

renderWishlist();