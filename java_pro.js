document.addEventListener('DOMContentLoaded', () => {
    // Typewriter
    const textElement = document.getElementById('typewriter');
    const texts = ["BTS SIO SISR", "Cybersécurité", "Admin Réseaux"];
    let idx = 0, charIdx = 0, isDeleting = false;

    function type() {
        const current = texts[idx];
        textElement.textContent = isDeleting ? current.substring(0, charIdx--) : current.substring(0, charIdx++);
        if (!isDeleting && charIdx > current.length) { isDeleting = true; setTimeout(type, 2000); }
        else if (isDeleting && charIdx === 0) { isDeleting = false; idx = (idx + 1) % texts.length; setTimeout(type, 500); }
        else { setTimeout(type, isDeleting ? 50 : 100); }
    }
    type();

    // Chatbot Local
    const sendBtn = document.getElementById('send-btn');
    const chatInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');

    sendBtn.addEventListener('click', () => {
        const msg = chatInput.value;
        if (!msg) return;
        const userDiv = document.createElement('div');
        userDiv.className = 'message user';
        userDiv.textContent = msg;
        chatMessages.appendChild(userDiv);
        
        setTimeout(() => {
            const botDiv = document.createElement('div');
            botDiv.className = 'message bot';
            botDiv.textContent = "Je suis l'IA de Rwan. Il est actuellement en cours, mais je peux vous dire qu'il maîtrise Cisco et Debian !";
            chatMessages.appendChild(botDiv);
        }, 1000);
        chatInput.value = '';
    });
});
