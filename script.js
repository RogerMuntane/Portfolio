// Scroll reveal
const contactEmail = 'rogermuntane123@gmail.com';

const emailLink = document.querySelector('a[href^="mailto:"]');
const emailValue = document.querySelector('a[href^="mailto:"] .contact-link-value');

if (emailLink) {
    emailLink.href = `mailto:${contactEmail}`;
}

if (emailValue) {
    emailValue.textContent = contactEmail;
}

const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 80);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));

// Nav highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === '#' + current
            ? '#fff'
            : '';
    });
});

// Form
async function handleForm(e) {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const form = e.target;
    
    const originalHTML = btn.innerHTML;
    btn.textContent = 'Enviant...';
    btn.disabled = true;

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            btn.textContent = '✓ Missatge enviat!';
            btn.style.background = '#22c55e';
            btn.style.borderColor = '#22c55e';
            btn.style.color = '#fff';
            form.reset();
        } else {
            throw new Error('Error');
        }
    } catch (error) {
        btn.textContent = '❌ Error a l\'enviar';
        btn.style.background = 'var(--red)';
        btn.style.borderColor = 'var(--red)';
        btn.style.color = '#fff';
    }

    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = 'var(--red)';
        btn.style.borderColor = 'var(--red)';
        btn.disabled = false;
        
        // Re-apply translation if needed
        if(window.setLanguage) setLanguage(currentLang);
    }, 3000);
}

window.handleForm = handleForm;

// i18n
const userLang = localStorage.getItem('lang') || navigator.language.slice(0, 2);
let currentLang = ['ca', 'es', 'en'].includes(userLang) ? userLang : 'ca';

async function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    try {
        const res = await fetch(`locales/${lang}.json`);
        const translations = await res.json();
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key]) {
                el.innerHTML = translations[key];
            }
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[key]) {
                el.setAttribute('placeholder', translations[key]);
            }
        });

        // Update CV link based on language
        const cvLink = document.getElementById('cv-link');
        if (cvLink) {
            if (lang === 'en') {
                cvLink.href = 'Roger_Muntane_CV_2026_EN.pdf';
            } else if (lang === 'es') {
                cvLink.href = 'Roger_Muntane_CV_2026_ES.pdf';
            } else {
                cvLink.href = 'Roger_Muntane_CV_2026-3.pdf';
            }
        }
    } catch (e) {
        console.error('Error loading language', e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });
});

