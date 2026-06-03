// Lädt alle CMS-Inhalte aus den JSON-Dateien und befüllt die Seite
async function loadCMSContent() {
  try {
    const [hero, problem, wasEsIst, ablauf, fuerWen, maria, testimonials, cta] = await Promise.all([
      fetch('/_data/hero.json').then(r => r.json()),
      fetch('/_data/problem.json').then(r => r.json()),
      fetch('/_data/was-es-ist.json').then(r => r.json()),
      fetch('/_data/ablauf.json').then(r => r.json()),
      fetch('/_data/fuer-wen.json').then(r => r.json()),
      fetch('/_data/maria.json').then(r => r.json()),
      fetch('/_data/testimonials.json').then(r => r.json()),
      fetch('/_data/cta.json').then(r => r.json()),
    ]);

    // HERO
    set('hero-eyebrow', hero.eyebrow);
    set('hero-headline', hero.headline);
    set('hero-sub', hero.subheadline);
    setAll('.hero .btn-primary', hero.button_text);

    // PROBLEM
    set('problem-title', problem.title);
    setMarkdown('problem-body', problem.body);

    // WAS ES IST
    set('wasesist-title', wasEsIst.title);
    setMarkdown('wasesist-body', wasEsIst.body);

    // ABLAUF
    set('ablauf-title', ablauf.title);
    if (ablauf.steps && ablauf.steps.length) {
      const container = document.getElementById('ablauf-steps');
      if (container) {
        container.innerHTML = ablauf.steps.map((s, i) => `
          <div class="step">
            <span class="step-number">0${i + 1}</span>
            <div class="step-content">
              <h3>${s.title}</h3>
              <p>${s.body}</p>
            </div>
          </div>`).join('');
      }
    }

    // FÜR WEN
    set('fuerwen-title', fuerWen.title);
    if (fuerWen.yes_items) {
      const yes = document.getElementById('fuerwen-yes');
      if (yes) yes.innerHTML = fuerWen.yes_items.map(i => `<li>${i.item}</li>`).join('');
    }
    if (fuerWen.no_items) {
      const no = document.getElementById('fuerwen-no');
      if (no) no.innerHTML = fuerWen.no_items.map(i => `<li>${i.item}</li>`).join('');
    }

    // MARIA
    set('maria-title', maria.title);
    setMarkdown('maria-body', maria.body);
    if (maria.photo) {
      const img = document.getElementById('maria-photo');
      if (img) { img.src = maria.photo; img.style.display = 'block'; }
      const placeholder = document.getElementById('maria-placeholder');
      if (placeholder) placeholder.style.display = 'none';
    }

    // TESTIMONIALS
    set('testimonials-title', testimonials.title);
    const tGrid = document.getElementById('testimonials-grid');
    if (tGrid) {
      if (testimonials.items && testimonials.items.length > 0) {
        tGrid.innerHTML = testimonials.items.map(t => `
          <div class="testimonial">
            <p class="testimonial-quote">"${t.quote}"</p>
            <p class="testimonial-author">— ${t.author}</p>
          </div>`).join('');
      }
      // Wenn leer → Platzhalter bleibt wie er ist
    }

    // CTA
    set('cta-headline', cta.headline);
    set('cta-sub', cta.subtext);
    const ctaBtn = document.getElementById('cta-btn');
    if (ctaBtn) {
      ctaBtn.textContent = cta.button_text;
      ctaBtn.href = cta.calendly_link;
    }

  } catch (e) {
    // Falls JSON nicht geladen werden kann → hardcodierter Text bleibt sichtbar
    console.log('CMS-Inhalt nicht verfügbar, zeige Standard-Texte.');
  }
}

// Hilfsfunktionen
function set(id, value) {
  const el = document.getElementById(id);
  if (el && value) el.textContent = value;
}
function setAll(selector, value) {
  document.querySelectorAll(selector).forEach(el => { if (value) el.textContent = value; });
}
function setMarkdown(id, text) {
  const el = document.getElementById(id);
  if (!el || !text) return;
  // Einfaches Markdown: Absätze
  el.innerHTML = text.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
}

document.addEventListener('DOMContentLoaded', loadCMSContent);
