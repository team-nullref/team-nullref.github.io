// Code global du site (animations, etc.)

function scrollToAnchor() {
    const path = location.hash.slice(1); // Enlève le # du début
    const parts = path.split('/');

    if (parts[0] === 'tools' && parts[1]) {
        const anchorElement = document.getElementById(parts[1]);
        if (anchorElement) {
            setTimeout(() => {
                anchorElement.scrollIntoView({behavior: 'smooth'});
            }, 100);
        }
    }
}

function onViewLoaded(path) {
    console.log(`Vue chargée : ${path}`);
    scrollToAnchor();
    if (path === '/') {
        // Pas de code pour l'instant
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const topButton = document.querySelector('.top-button');

    window.addEventListener('scroll', function () {
        // Afficher le bouton après 100px de défilement
        if (window.scrollY > 100) {
            topButton.style.display = 'flex';
            // Délai pour permettre la transition
            setTimeout(() => {
                topButton.style.opacity = '1';
            }, 10);
        } else {
            topButton.style.opacity = '0';
            // Cacher le bouton après la transition
            setTimeout(() => {
                topButton.style.display = 'none';
            }, 300);
        }
    });
});