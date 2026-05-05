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
    scrollToAnchor();
    if (path === '/') {
        displayMembers();
    }
}

function displayMembers() {
    const container = document.querySelectorAll('.members .row');

    fetch('/assets/data/members.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(member => {
                const memberCard = document.createElement('div');
                memberCard.classList.add('member', 'col-lg-4', 'text-center', 'card', 'p-2', 'm-2');
                memberCard.innerHTML = `
                    <img class="avatar rounded mb-2" src="${member.avatar}" alt="${member.name}">
                    <h2 class="fs-4">${member.name}</h2>
                    <h3 class="fs-5 fw-normal text-muted">${member.role} • ${member.job}</h3>
                `;

                member.addEventListener('click', () => {
                    if (member.link) {
                        window.open(member.link, '_blank');
                    }
                });

                container.forEach(c => c.appendChild(memberCard));
            });
        });
}

// document.addEventListener('DOMContentLoaded', function () {
//     const topButton = document.querySelector('.top-button');

//     window.addEventListener('scroll', function () {
//         // Afficher le bouton après 100px de défilement
//         if (window.scrollY > 100) {
//             topButton.style.display = 'flex';
//             // Délai pour permettre la transition
//             setTimeout(() => {
//                 topButton.style.opacity = '1';
//             }, 10);
//         } else {
//             topButton.style.opacity = '0';
//             // Cacher le bouton après la transition
//             setTimeout(() => {
//                 topButton.style.display = 'none';
//             }, 300);
//         }
//     });
// });