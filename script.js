document.addEventListener("DOMContentLoaded", function() {
    
    // --- Language Switcher ---
    const ruBtn = document.getElementById('lang-ru-btn');
    const enBtn = document.getElementById('lang-en-btn');
    const body = document.body;

    function setLanguage(lang) {
        if (lang === 'ru') {
            body.classList.remove('lang-en-active');
            body.classList.add('lang-ru-active');
            ruBtn.classList.add('active');
            enBtn.classList.remove('active');
        } else {
            body.classList.remove('lang-ru-active');
            body.classList.add('lang-en-active');
            enBtn.classList.add('active');
            ruBtn.classList.remove('active');
        }
    }

    ruBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setLanguage('ru');
    });

    enBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setLanguage('en');
    });

    // --- Intersection Observer for animations ---
    const sections = document.querySelectorAll('.content-section');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

});