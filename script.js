document.addEventListener('DOMContentLoaded', () => {
    // Initialisation EmailJS
    emailjs.init("8tHYFvOg1n1v5XadZ"); 

    const togglePassword = document.getElementById('togglePassword');
    const passInput = document.getElementById('passInput');

    togglePassword.addEventListener('click', () => {

    const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passInput.setAttribute('type', type);
    
    togglePassword.textContent = type === 'password' ? '🐵' : '🙈';
});

    // Éléments du Login (toujours présents dans le HTML)
    const loginScreen = document.getElementById('login-screen');
    const btnLogin = document.getElementById('btnLogin');
    const mainContent = document.getElementById('main');

    // --- 1. LOGIQUE DE SÉCURITÉ (HASH) ---
    async function hashText(text) {
        const msgUint8 = new TextEncoder().encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    

    async function verifier() {
        const hashCorrect = "1a2d751ce54b57ad036f22ada91fb43b32aac8c7f6031b135535091f484f1d1e";
        const hashTape = await hashText(passInput.value);

        if (hashTape === hashCorrect) {
            // ÉTAPE 1: Injecter le contenu HTML
            injecterContenu();
            // ÉTAPE 2: Activer la logique JS pour les nouveaux boutons
            initialiserLogiqueQuestionnaire();
            
            loginScreen.style.display = 'none';
            mainContent.style.display = 'block';
        } else {
            alert("Mot de passe incorrect");
            passInput.value = "";
        }
    }

    btnLogin.addEventListener('click', verifier);
    passInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') verifier(); });

    // --- 2. INJECTION DU CONTENU ---
    function injecterContenu() {
        const Q1 = document.getElementById('Q1');
        const Q2 = document.getElementById('Q2');

        Q1.innerHTML = `
            <h1>Veux tu être ma valentine pour la saint-valentin ?</h1>
            <img id="Q1Img" src="styles/q1.png">
            <div class="yesNo">
                <button id="Q1Oui">♡ui</button>
                <button id="Q1Non">n💀n</button>
            </div>
            <button id="formulaire" style="display: none;">Aller au questionnaire -></button>
        `;

        Q2.innerHTML = `
            <label>Nom</label>
            <input type="text" id="nom" placeholder="Nom" autocomplete="off">
            <label>Do you want to spider-kiss ?</label>
            <img id="memeKiss" class="imgQ2">
            <div class="yesNo">
                <button class="btn-choix" data-img="memeKiss" data-src="styles/spiderkissYes.webp">oui</button>
                <button class="btn-choix" data-img="memeKiss" data-src="styles/spiderkissNo.jpg">non</button>
            </div>
            <label>Veux tu qu'on écoute des films d'horreur ensemble ?</label>
            <img id="memeHorreur" class="imgQ2">
            <div class="yesNo">
                <button class="btn-choix" data-img="memeHorreur" data-src="styles/maniac.gif">oui</button>
                <button class="btn-choix" data-img="memeHorreur" data-src="styles/noMovie.jfif">non</button>
            </div>
            <label>Veux tu faire des lego avec moi ?</label>
            <img id="memeLego" class="imgQ2">
            <div class="yesNo">
                <button class="btn-choix" data-img="memeLego" data-src="styles/lego.jpg">oui</button>
                <button class="btn-choix" data-img="memeLego" data-src="styles/legoNo.png">non</button>
            </div>
            <label>Are you Bricked up when you see me ?</label>
            <img id="memeBrick" class="imgQ2">
            <div class="yesNo">
                <button class="btn-choix" data-img="memeBrick" data-src="styles/brick.png">oui</button>
                <button class="btn-choix" data-img="memeBrick" data-src="styles/brickNo.webp">non</button>
            </div>
            <p>Pov (Tu me parle mais je suis éblouie par ta beauté) :</p>
            <video controls><source src="styles/pov.mp4" type="video/mp4"></video>
            <label>Petit message minion</label>
            <textarea id="message" placeholder="Écrit moi ce que tu veux me faire..."></textarea>
            <button id="btnEnvoyer">Envoyer les réponses</button>
        `;
    }

    // --- 3. TOUTE LA LOGIQUE DU QUESTIONNAIRE ---
    function initialiserLogiqueQuestionnaire() {
        const btnFormulaire = document.getElementById('formulaire');
        const question1 = document.getElementById('Q1');
        const question2 = document.getElementById('Q2');
        const q1Oui = document.getElementById("Q1Oui");
        const q1Non = document.getElementById("Q1Non");
        const q1Img = document.getElementById("Q1Img");
        const btnEnvoyer = document.getElementById('btnEnvoyer');
        const inputNom = document.getElementById('nom');

        let reponsesChoisies = {
            valentine: "Pas encore répondu",
            spiderKiss: "Pas encore répondu",
            filmsHorreur: "Pas encore répondu",
            legos: "Pas encore répondu",
            brickedUp: "Pas encore répondu"
        };

        // Effet Nom Prank
        const phraseNom = "Ta princesse Malorie";
        let indexNom = 0;
        inputNom.addEventListener('keydown', (e) => {
            const touchesSpeciales = ['Enter', 'Tab', 'Shift', 'Backspace'];
            if (touchesSpeciales.includes(e.key)) return;
            e.preventDefault();
            if (indexNom < phraseNom.length) {
                inputNom.value += phraseNom[indexNom];
                indexNom++;
            }
        });

        // Navigation Q1
        q1Oui.addEventListener('click', () => {
            btnFormulaire.style.display = "flex";
            q1Img.src = "styles/q1Oui.jpg";
            reponsesChoisies.valentine = "OUI !";
        });

        q1Non.addEventListener('click', () => {
            btnFormulaire.style.display = "none";
            q1Img.src = "styles/RUSure.jpg";
            reponsesChoisies.valentine = "A cliqué Non (pas cool)";
        });

        btnFormulaire.addEventListener('click', () => {
            question1.style.display = 'none';
            question2.style.display = 'flex';
        });

        // Boutons de choix Q2
        const boutonsChoix = document.querySelectorAll('.btn-choix');
        boutonsChoix.forEach(bouton => {
            bouton.addEventListener('click', () => {
                const idImg = bouton.getAttribute('data-img');
                const nouvelleSource = bouton.getAttribute('data-src');
                const reponseTexte = bouton.innerText;

                const imageAChanger = document.getElementById(idImg);
                if (imageAChanger) imageAChanger.src = nouvelleSource;

                if (idImg === "memeKiss") reponsesChoisies.spiderKiss = reponseTexte;
                if (idImg === "memeHorreur") reponsesChoisies.filmsHorreur = reponseTexte;
                if (idImg === "memeLego") reponsesChoisies.legos = reponseTexte;
                if (idImg === "memeBrick") reponsesChoisies.brickedUp = reponseTexte;
            });
        });

        // Envoi EmailJS
        btnEnvoyer.addEventListener('click', () => {
            const params = {
                nom_affiche: inputNom.value,
                message_perso: document.getElementById('message').value,
                rep_valentine: reponsesChoisies.valentine,
                rep_kiss: reponsesChoisies.spiderKiss,
                rep_horreur: reponsesChoisies.filmsHorreur,
                rep_lego: reponsesChoisies.legos,
                rep_brick: reponsesChoisies.brickedUp
            };

            emailjs.send("service_abcd123", "template_on67m8v", params)
                .then(() => {
                    alert("❤️ Réponses envoyées !");
                    document.body.innerHTML = "<h1 style='text-align:center; margin-top:100px;'>Joyeuse St-Valentin Minou xxx ! Je t'aime ❤️</h1>";
                }, (err) => {
                    alert("Erreur lors de l'envoi...");
                });
        });
    }
});