document.addEventListener('DOMContentLoaded', () => {
    /* ================================================================
       CONFIGURATION DE L'INTELLIGENCE ARTIFICIELLE
       ================================================================
       1. Va sur : https://aistudio.google.com/app/apikey
       2. Crée une clé gratuite ("Create API Key")
       3. Colle-la entre les guillemets ci-dessous.
       
       Si tu laisses vide, l'IA répondra uniquement aux questions sur le Portfolio.
    */
    const GEMINI_API_KEY = ""; // <-- COLLE TA CLÉ ICI (Ex: "AlzaSyB...")
    


    // --- ELEMENTS DU DOM ---
    const curseur = document.querySelector('.curseur-personnalise');
    const blob = document.querySelector('.blob');
    const boutonMode = document.getElementById('mode-switch');
    const hueSlider = document.getElementById('hue-slider');

    // --- SOURIS & DESIGN ---
    let sourisX = 0, sourisY = 0;
    document.addEventListener('mousemove', (e) => {
        sourisX = e.clientX;
        sourisY = e.clientY;
    });

    const animerCurseur = () => {
        if (curseur) curseur.style.transform = `translate(${sourisX}px, ${sourisY}px)`;
        if (blob) blob.style.transform = `translate(${sourisX - 300}px, ${sourisY - 300}px)`;
        requestAnimationFrame(animerCurseur);
    };
    if (window.innerWidth >= 768) animerCurseur();

    // --- COULEURS ---
    const savedHue = localStorage.getItem('main-hue');
    if (savedHue) {
        document.documentElement.style.setProperty('--main-hue', savedHue);
        if (hueSlider) hueSlider.value = savedHue;
    }
    if (hueSlider) {
        hueSlider.addEventListener('input', (e) => {
            const hue = e.target.value;
            document.documentElement.style.setProperty('--main-hue', hue);
            localStorage.setItem('main-hue', hue);
        });
    }

    // --- MODE JOUR/NUIT ---
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
    }
    boutonMode.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    });

    // --- TYPEWRITER ---
    const textElement = document.getElementById('typewriter');
    const texts = ["BTS SIO SISR", "Admin Sys & Réseaux", "Cybersécurité", "Cloud & Virtualisation"];
    let textIndex = 0, charIndex = 0, isDeleting = false, typeSpeed = 100;

    function type() {
        if (!textElement) return;
        const currentText = texts[textIndex];
        if (isDeleting) {
            textElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            textElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true; typeSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false; textIndex = (textIndex + 1) % texts.length; typeSpeed = 500;
        }
        setTimeout(type, typeSpeed);
    }
    type();

    // --- LOGIQUE PUISSANTE DE L'IA (CHATBOT) ---
    const chatInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');

    if (chatInput && sendBtn) {
        // Fonction pour ajouter un message à l'écran
        const addMessage = (text, sender) => {
            const div = document.createElement('div');
            div.className = `message ${sender}`;
            // Convertir les retours à la ligne en balises HTML pour l'IA
            div.innerHTML = text.replace(/\n/g, '<br>'); 
            chatMessages.appendChild(div);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };

        // Fonction d'appel à l'API GEMINI
        const callGeminiAI = async (userText) => {
            // Indicateur de chargement
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'message bot';
            loadingDiv.textContent = 'Analyse en cours...';
            chatMessages.appendChild(loadingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            try {
                // Configuration du Prompt Système (Donne la personnalité à l'IA)
                const systemPrompt = `Tu es l'assistant IA du portfolio de Rwan Da Cunha, étudiant en BTS SIO SISR. 
                Tu es expert en informatique, réseaux (Cisco, VLAN), système (Windows Server, Linux Debian) et cybersécurité.
                Tu dois répondre de manière concise, pro et un peu "geek". 
                Si on te pose une question hors sujet, réponds quand même avec humour ou expertise.
                Question de l'utilisateur : ${userText}`;

                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: systemPrompt }] }]
                    })
                });

                const data = await response.json();
                
                // Supprimer le message de chargement
                chatMessages.removeChild(loadingDiv);

                if (data.candidates && data.candidates[0].content) {
                    const aiReply = data.candidates[0].content.parts[0].text;
                    addMessage(aiReply, 'bot');
                } else {
                    addMessage("Erreur : Je n'ai pas pu joindre le cerveau central.", 'bot');
                }
            } catch (error) {
                chatMessages.removeChild(loadingDiv);
                addMessage("Erreur de connexion à l'API. Vérifie ta clé ou ta connexion.", 'bot');
                console.error(error);
            }
        };

        // Logique "Mode Portfolio" (Sans API)
        const localBotReply = (text) => {
            const lowerText = text.toLowerCase();
            let reply = "Je suis en mode 'Hors Ligne'. Pour que je puisse répondre à TOUT, ajoute une clé API Gemini dans le fichier JS.";

            // Réponses locales intelligentes
            if (lowerText.includes('bonjour') || lowerText.includes('salut')) reply = "Salut ! Je suis RwanBot. Pose-moi une question sur mes compétences ou mes projets.";
            else if (lowerText.includes('compétence') || lowerText.includes('stack')) reply = "Je maîtrise :<br>- <strong>Système :</strong> Windows Server, Debian, AD<br>- <strong>Réseau :</strong> Cisco, VLAN, VPN<br>- <strong>Dev :</strong> Python, Bash, SQL";
            else if (lowerText.includes('contact') || lowerText.includes('mail')) reply = "Tu peux joindre Rwan ici : <strong>rwan.dacunha74@gmail.com</strong>";
            else if (lowerText.includes('cv')) reply = "Le CV est téléchargeable via le bouton 'Consulter mon CV' en haut.";
            else if (lowerText.includes('blague')) reply = "Que fait un geek quand il a froid ? <br> Il se met près du Windows car la fenêtre est fermée ! (Active l'API pour de meilleures blagues...)";
            else if (lowerText.includes('sens de la vie')) reply = "42. Mais pour plus de détails, active ma clé API !";
            
            setTimeout(() => addMessage(reply, 'bot'), 600);
        };

        // Gestionnaire d'envoi
        const handleChat = () => {
            const userText = chatInput.value.trim();
            if (userText === "") return;

            addMessage(userText, 'user');
            chatInput.value = '';

            // Si la clé est présente, on interroge Gemini (Internet)
            if (GEMINI_API_KEY && GEMINI_API_KEY.length > 10) {
                callGeminiAI(userText);
            } else {
                // Sinon, on utilise le bot local
                localBotReply(userText);
            }
        };

        sendBtn.addEventListener('click', handleChat);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleChat();
        });
    }

    // --- CARROUSEL & REVEAL & INTERACTION (Reste du code habituel) ---
    const track = document.getElementById('carouselTrack');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    if (track) {
        nextBtn.addEventListener('click', () => track.scrollBy({ left: 340, behavior: 'smooth' }));
        prevBtn.addEventListener('click', () => track.scrollBy({ left: -340, behavior: 'smooth' }));
    }
    const revelerAuScroll = () => {
        document.querySelectorAll('.reveal').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 80) el.classList.add('active');
        });
    };
    window.addEventListener('scroll', revelerAuScroll);
    revelerAuScroll();
    document.querySelectorAll('a, button, .carte-verre, input').forEach(el => {
        el.addEventListener('mouseenter', () => curseur?.classList.add('active'));
        el.addEventListener('mouseleave', () => curseur?.classList.remove('active'));
    });
});