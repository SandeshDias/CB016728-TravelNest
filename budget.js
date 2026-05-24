function budget() {
    const sel = document.getElementById('budgetDest');
    if (!sel.options.length || sel.options[0].value ==='') {
        destinations.forEach(d => {
           const opt = document.createElement('option');
           opt.value = d.name; opt.textContent = d.name + ', ' + d.country;
           sel.appendChild(opt);  
        });
    }
    renderSavedTrips();
}

function calculatBudget(e) {
    e.preventDefault();
    const dest = document.getElementById('budgetDest').value;
    const days = document.getElementById('budgetDays').value;
    const daily = document.getElementById('budgetDaily').value;
    let valid = true;

    // Validation
    if (!dest) { showErr('errDest', true); valid = false; } else showErr('errDest', false);
    if (!days || days < 1 || days > 365) { showErr('errDays', true); valid = false; } else showErr('errDays', false);
    if (!daily || daily < 1) { showErr('errDaily', true); valid = false; } else showErr('errDaily', false);
    if (!valid) return;

    const total = daily * days;
    const breakdown = {
    Accommodation: Math.round(total * 0.40),
    Food: Math.round(total * 0.25),
    Transport: Math.round(total * 0.18),
    Activities: Math.round(total * 0.12),
    Others: Math.round(total * 0.05),
  };
  const colors = { Accommodation: '#0E1E25', Food: '#FF5A36', Transport: '#2F5D6B', Activities: '#FFBA5C', Others: '#1FA97A' };

  let status, statusClass, progressClass, progressPct;
  if (daily < 50) { status = 'Budget Friendly'; statusClass = 'status-low'; progressClass = 'progress-low'; progressPct = 25; }
  else if (daily < 150) { status = 'Moderate'; statusClass = 'status-moderate'; progressClass = 'progress-moderate'; progressPct = 60; }
  else { status = 'Luxury'; statusClass = 'status-luxury'; progressClass = 'progress-luxury'; progressPct = 95; }

  document.getElementById('budgetTotal').textContent = '$' + total.toLocaleString();
  document.getElementById('budgetTotalSub').textContent = `${days} days in ${dest}`;
  document.getElementById('budgetStatus').textContent = status;
  document.getElementById('budgetStatus').className = 'budget-status ' + statusClass;

  const bar = document.getElementById('progressBar');
  bar.className = 'progress-bar ' + progressClass;
  bar.style.width = '0';
  setTimeout(() => { bar.style.width = progressPct + '%'; }, 50);
  
  document.getElementById('budgetBreakdown').innerHTML = Object.entries(breakdown).map(([k, v]) => `
    <div class="breakdown-item">
        <div class="breakdown-label">
            <span class="breakdown-dot" style="background:${colors[k]}"></span>${k}
        </div>
        <span class="breakdown-value">$${v.toLocaleString()}</span>
    </div>`). join('');
  document.getElementById('budgetResultContent').style.display = 'block';
  document.getElementById('budgetPlaceholder').style.display = 'none';

  // Store current for saving
  window._currentBudget = { dest, days, daily, total };
}

function showErr(id, show) {
    const el = document.getElementById(id);
    const inp = el.previousElementSibling;
    if (show) { el.classList.add('show'); inp?.classList.add('error'); }
    else { el.classList.remove('show'), inp?.classList.remove('error'); }
}

function resetBudget() {
  document.getElementById('budgetForm').reset();
  document.getElementById('budgetResultContent').style.display = 'none';
  document.getElementById('budgetPlaceholder').style.display = 'flex';
  ['errDest', 'errDays', 'errDaily'].forEach(id => showErr(id, false));
}

function saveBudget() {
    if(!window._currentBudget) return;
    const trips = JSON.parse(localStorage.getItem('budgets') || '[]');
    const entry = { ...window._currentBudget, id: Date.now() };
    trips.push(entry);
    localStorage.setItem('budgets', JSON.stringify(trips));
    renderSavedTrips();
}

function renderSavedTrips() {
  const trips = JSON.parse(localStorage.getItem('budgets') || '[]');
  const el = document.getElementById('savedTripList');
  if (!trips.length) { el.innerHTML = '<p style="color:var(--text-muted)">No saved trips yet.</p>'; return; }
  el.innerHTML = trips.map(t => `
    <div class="saved-trip-item">
      <div class="saved-trip-info">
        <strong>${t.dest}</strong>
        <span>${t.days} days · $${t.daily}/day</span>
      </div>
      <div style="display:flex;align-items:center;gap:12px">
        <span class="saved-trip-cost">$${t.total.toLocaleString()}</span>
        <button class="del-button" onclick="deleteBudget(${t.id})">🗑️</button>
      </div>
    </div>`).join('');
}

function deleteBudget(id) {
  let trips = JSON.parse(localStorage.getItem('budgets') || '[]');
  trips = trips.filter(t => t.id !== id);
  localStorage.setItem('budgets', JSON.stringify(trips));
  renderSavedTrips();
}

budget();