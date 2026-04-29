let pagesData = {};
let currentStyle = null;

// Injecte une feuille de style spécifique
function injectStyle(stylePath) {
    if (currentStyle) currentStyle.remove();
    if (!stylePath) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = stylePath;
    document.head.appendChild(link);
    currentStyle = link;
}

// Charge une page selon le path
async function loadPage(path = location.hash.slice(1) || "/") {
    if (!pagesData || Object.keys(pagesData).length === 0) {
        // Charge le JSON si ce n'est pas encore fait
        try {
            const res = await fetch("assets/data/pages.json");
            pagesData = await res.json();
        } catch (err) {
            console.error("Impossible de charger pages.json :", err);
            document.getElementById("app").innerHTML = "<p>Erreur critique : pages.json introuvable.</p>";
            return;
        }
    }

    let route = pagesData[path];

    // Redirection externe
    if (route && route.link) {
        // Afficher la page de chargement
        document.getElementById("app").innerHTML = `
            <div class="section loading-page">
                <div class="loading-spinner"></div>
                <p class="text">Redirection en cours...</p>
                <small class="info">Si vous n'êtes pas redirigé automatiquement, <a href="${route.link}" target="_blank" class="link">cliquez ici</a></small>
            </div>
        `;

        // Ajouter un délai court avant la redirection
        setTimeout(() => {
            window.location.href = route.link;
        }, 1000);
        return;
    }

    // Route non trouvée → 404
    if (!route) {
        route = pagesData["404"];
        location.hash = "/404";
    }

    // Titre spécial pour l'accueil
    if (path === "/") {
        document.title = "Enio Aiello";
    } else {
        document.title = `Enio Aiello | ${route.title}`;
    }

    try {
        // Charger le contenu HTML
        const html = route.view ? await fetch(route.view).then(res => res.text()) : "<p>Erreur lors du chargement de la page.</p>";
        document.getElementById("app").innerHTML = html;
    } catch (err) {
        console.error("Erreur lors du chargement de la vue :", err);
        const errorRoute = pagesData["403"] || { title: "Erreur", view: null };
        const html = errorRoute.view ? await fetch(errorRoute.view).then(r => r.text()) : "<p>Erreur critique</p>";
        document.getElementById("app").innerHTML = html;
        document.title = `Portfolio Enio | ${errorRoute.title}`;
    }

    // Injecter style spécifique
    injectStyle(route.style);

    // Exécuter script spécifique
    if (route.script && typeof window[route.script] === "function") {
        window[route.script]();
    }

    // Callback global
    if (typeof onViewLoaded === "function") onViewLoaded(path);
}

// Événements hashchange et load
window.addEventListener("hashchange", () => loadPage());
window.addEventListener("load", () => loadPage());
