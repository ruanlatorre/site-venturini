function createHearts() {
    // Using heart character so we can style it with CSS colors (light pink)
    const heartSymbol = "♥";
    const heartColors = ["#e0b0ff", "#ca9bf7", "#b19cd9"];

    for (let i = 0; i < 35; i++) {
        let heart = document.createElement("div");
        heart.className = "heart";
        heart.innerHTML = heartSymbol;

        // Randomize light pink colors slightly
        heart.style.color = heartColors[Math.floor(Math.random() * heartColors.length)];

        // Horizontal position
        heart.style.left = Math.random() * 100 + "vw";

        // Make animation much slower (15 to 35 seconds)
        heart.style.animationDuration = (15 + Math.random() * 20) + "s";
        heart.style.animationDelay = (Math.random() * 15) + "s";

        // Varying sizes
        heart.style.fontSize = (1 + Math.random() * 1.5) + "rem";

        document.body.appendChild(heart);
    }
}
createHearts();

/* =========================================
               PASSWORD LOGIC
            ========================================= */
let enteredPassword = "";
const correctPassword = "150625";

function updateDots() {
    for (let i = 1; i <= 6; i++) {
        const dot = document.getElementById("q" + i);
        if (i <= enteredPassword.length) {
            dot.classList.add("preenchido");
        } else {
            dot.classList.remove("preenchido");
        }
    }
}

function typeDigit(n) {
    if (enteredPassword.length < 6) {
        enteredPassword += n;
        updateDots();

        if (enteredPassword.length === 6) {
            setTimeout(verifyPassword, 300);
        }
    }
}

function eraseDigit() {
    enteredPassword = enteredPassword.slice(0, -1);
    updateDots();
}

function verifyPassword() {
    if (enteredPassword === correctPassword) {
        openScreen('menu');
        // Iniciar timer quando entrar no menu
        setInterval(updateTimer, 1000);
        updateTimer();
    } else {
        alert("Senha incorreta! Dica: nosso dia especial (DDMMAA)");
        enteredPassword = "";
        updateDots();
    }
}

function openScreen(telaId) {
    const telas = document.querySelectorAll('.tela');
    telas.forEach(tela => {
        tela.classList.remove('active');
        tela.style.display = ''; // Limpa qualquer estilo inline anterior
    });

    const activeTela = document.getElementById(telaId);
    // Não forçamos o display aqui para deixar o CSS .active (flex) agir
    setTimeout(() => {
        activeTela.classList.add('active');
        
        // Tocar música ao entrar na seção
        if (telaId === 'musica') {
            const player = document.getElementById('musica-player');
            if (player) player.play().catch(e => console.log("Autoplay bloqueado:", e));
        }
    }, 10);
}

// FOTOS LOGIC
let currentPhoto = 0;
const photos = [
    "https://picsum.photos/seed/amor1/400/500",
    "https://picsum.photos/seed/amor2/400/500",
    "https://picsum.photos/seed/amor3/400/500",
    "https://picsum.photos/seed/amor4/400/500"
];

function updatePhoto() {
    const img = document.getElementById("foto");
    img.style.opacity = 0;
    setTimeout(() => {
        img.src = photos[currentPhoto];
        img.style.opacity = 1;
    }, 300);
}

function nextPhoto() {
    currentPhoto = (currentPhoto + 1) % photos.length;
    updatePhoto();
}

function prevPhoto() {
    currentPhoto = (currentPhoto - 1 + photos.length) % photos.length;
    updatePhoto();
}

// TIMER LOGIC
function updateTimer() {
    const startDate = new Date("2025-06-15T00:00:00");
    const now = new Date();
    const diff = now - startDate;

    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("dias").innerText = dias;
    document.getElementById("horas").innerText = horas;
    document.getElementById("minutos").innerText = minutos;
    document.getElementById("segundos").innerText = segundos;
}

// PEDIDO LOGIC
function runAway(btn) {
    const area = document.querySelector(".botoes-pedido");
    const areaRect = area.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    // Reintroduzimos uma transição rápida mas suave para evitar o aspecto de "bug"
    btn.style.transition = 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';

    // Limites horizontais: Mantém o botão em uma zona central segura
    const paddingX = areaRect.width * 0.1;
    const maxX = areaRect.width - btnRect.width - paddingX;
    
    // Limites verticais: 50% a 90% da altura da box
    const minY = areaRect.height * 0.45; 
    const maxY = areaRect.height - btnRect.height - 10;

    // Gera posições aleatórias com máxima dispersão
    const randomX = Math.floor(paddingX + Math.random() * (maxX - paddingX));
    const randomY = Math.floor(minY + Math.random() * (maxY - minY));

    btn.style.left = randomX + "px";
    btn.style.top = randomY + "px";
}

function acceptProposal() {
    openScreen('resposta');
}

function togglePhotoView() {
    const sliderView = document.getElementById('view-slider');
    const gridView = document.getElementById('view-grid');
    const icon = document.getElementById('toggle-icon');

    if (sliderView && gridView && icon) {
        if (sliderView.classList.contains('active')) {
            sliderView.classList.remove('active');
            gridView.classList.add('active');
            icon.innerText = "📁";
        } else {
            gridView.classList.remove('active');
            sliderView.classList.add('active');
            icon.innerText = "📸";
        }
    }
}

function preloadImages() {
    const imagesToPreload = [
        "https://picsum.photos/seed/amor1/400/500",
        "https://picsum.photos/seed/amor2/400/500",
        "https://picsum.photos/seed/amor3/400/500",
        "https://picsum.photos/seed/amor4/400/500"
    ];

    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    updateDots();
    preloadImages();
});

window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add("loaded");
        }, 500); // Pequeno delay para garantir que a transição seja vista
    }
});
