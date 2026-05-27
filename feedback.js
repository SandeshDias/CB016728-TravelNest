function renderFAQ() {
    const cont = document.getElementById('faqContainer');
    cont.innerHTML = faqs.map((f, i) => `
        <div class="faq-item" role="listitem">
            <button class="faq-question" onclick="toggleFAQ(${i})" id="faq-button-${i}">
                ${f.q}
                <span class="faq-icon">+</span>
            </button>
            <div class="faq-answer" id="faq-ans-${i}">
                <p>${f.a}</p>
            </div>
        </div>`).join('');
}

function toggleFAQ(i) {
    const btn = document.getElementById('faq-button-' + i);
    const ans = document.getElementById('faq-ans-' + i);
    const open = btn.classList.toggle('open');
    ans.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
}

function showErr(id, show) {
    const el = document.getElementById(id);
    const inp = el.previousElementSibling;
    if (show) { el.classList.add('show'); inp?.classList.add('error'); }
    else { el.classList.remove('show'), inp?.classList.remove('error'); }
}

function submitFeedback(e) {
    e.preventDefault();
    const name = document.getElementById('feedbackName').value.trim();
    const email = document.getElementById('feedbackEmail').value.trim();
    const msg = document.getElementById('feedbackMsg').value.trim();
    let valid = true;

    if (!name) { showErr('errFeedbackName', true); valid = false; } else showErr('errFeedbackName', false);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showErr('errFeedbackEmail', true); valid = false; } else showErr('errFeedbackEmail', false);
    if (!msg) { showErr('errFeedbackMsg', true); valid = false; } else showErr('errFeedbackMsg', false);
    if (!valid) return;

    const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    feedbacks.push({ name, email, msg, subject: document.getElementById('feedbackSubject').value, date: new Date().toISOString() });
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));

    document.getElementById('feedbackSuccess').classList.add('show');
    document.getElementById('feedbackForm').reset();
    showNotify('📨 Message sent!', 'success');
    setTimeout(() => document.getElementById('feedbackSuccess').classList.remove('show'), 5000);
}

renderFAQ();