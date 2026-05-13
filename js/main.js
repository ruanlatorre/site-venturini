function createHearts() {
    const heartSymbol = "♥";
    const heartColors = ["#e0b0ff", "#ca9bf7", "#b19cd9", "#ffffff", "#ffdef2"];

    for (let i = 0; i < 40; i++) {
        let heart = document.createElement("div");
        heart.className = "heart";
        heart.innerHTML = heartSymbol;

        // Cores suaves e variadas
        heart.style.color = heartColors[Math.floor(Math.random() * heartColors.length)];

        // Posição horizontal
        heart.style.left = Math.random() * 100 + "vw";

        // Variáveis customizadas para animação orgânica
        heart.style.setProperty('--drift', (Math.random() * 200 - 100) + "px");
        heart.style.setProperty('--rotation', (Math.random() * 720 - 360) + "deg");

        // Duração e delay aleatórios
        heart.style.animationDuration = (10 + Math.random() * 15) + "s";
        heart.style.animationDelay = (Math.random() * 10) + "s";

        // Tamanhos variados
        heart.style.fontSize = (0.8 + Math.random() * 1.5) + "rem";

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

        if (telaId === 'fotos') {
            setTimeout(initCarousel, 50); // delay para renderização do layout
        } else if (typeof stopCarouselAutoPlay === 'function') {
            stopCarouselAutoPlay();
        }
    }, 10);
}

// FOTOS LOGIC - INFINITE CAROUSEL
let isScrollingCarousel;
let carouselInterval;

function initCarousel() {
    const track = document.getElementById('photos-scroll');
    if (!track) return;

    if (track.dataset.initialized === "true") return;
    track.dataset.initialized = "true";

    const realSlides = Array.from(track.querySelectorAll('.polaroid'));
    if (realSlides.length === 0) return;

    realSlides.forEach((slide, index) => {
        if (index % 2 === 0) {
            slide.style.transform = 'rotate(-3deg)';
        } else {
            slide.style.transform = 'rotate(3deg)';
        }
    });

    const firstClone = realSlides[0].cloneNode(true);
    const lastClone = realSlides[realSlides.length - 1].cloneNode(true);

    firstClone.dataset.clone = "first";
    lastClone.dataset.clone = "last";

    track.appendChild(firstClone);
    track.insertBefore(lastClone, realSlides[0]);

    setTimeout(() => {
        const items = track.querySelectorAll('.polaroid');
        scrollToItem(track, items[1], false);
        startCarouselAutoPlay();
    }, 100);

    track.addEventListener('scroll', () => {
        window.clearTimeout(isScrollingCarousel);
        
        isScrollingCarousel = setTimeout(() => {
            handleScrollEnd(track);
        }, 150);
    });
    
    track.addEventListener('touchstart', stopCarouselAutoPlay, { passive: true });
    track.addEventListener('mousedown', stopCarouselAutoPlay, { passive: true });
}

function handleScrollEnd(track) {
    const items = Array.from(track.querySelectorAll('.polaroid'));
    const containerWidth = track.offsetWidth;
    const center = track.scrollLeft + containerWidth / 2;

    let closestItem = null;
    let minDistance = Infinity;

    items.forEach(item => {
        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        const distance = Math.abs(center - itemCenter);
        if (distance < minDistance) {
            minDistance = distance;
            closestItem = item;
        }
    });

    if (closestItem) {
        if (closestItem.dataset.clone === "first") {
            track.style.scrollBehavior = 'auto'; 
            scrollToItem(track, items[1], false);
        } else if (closestItem.dataset.clone === "last") {
            track.style.scrollBehavior = 'auto';
            scrollToItem(track, items[items.length - 2], false);
        }
    }
}

function scrollToItem(track, item, smooth = true) {
    const containerWidth = track.offsetWidth;
    const itemCenter = item.offsetLeft + item.offsetWidth / 2;
    const scrollPos = itemCenter - containerWidth / 2;
    
    if (smooth) {
        track.scrollTo({ left: scrollPos, behavior: 'smooth' });
    } else {
        track.scrollLeft = scrollPos;
    }
}

function scrollNext(manual = false) {
    if (manual) stopCarouselAutoPlay();
    const track = document.getElementById('photos-scroll');
    if (!track) return;
    
    const items = Array.from(track.querySelectorAll('.polaroid'));
    const containerWidth = track.offsetWidth;
    const center = track.scrollLeft + containerWidth / 2;
    
    let closestIndex = 0;
    let minDistance = Infinity;
    
    items.forEach((item, index) => {
        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        const distance = Math.abs(center - itemCenter);
        if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
        }
    });

    if (closestIndex < items.length - 1) {
        scrollToItem(track, items[closestIndex + 1], true);
    }
}

function nextCarousel() {
    scrollNext(true);
}

function prevCarousel() {
    stopCarouselAutoPlay();
    const track = document.getElementById('photos-scroll');
    if (!track) return;
    
    const items = Array.from(track.querySelectorAll('.polaroid'));
    const containerWidth = track.offsetWidth;
    const center = track.scrollLeft + containerWidth / 2;
    
    let closestIndex = 0;
    let minDistance = Infinity;
    
    items.forEach((item, index) => {
        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        const distance = Math.abs(center - itemCenter);
        if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
        }
    });

    if (closestIndex > 0) {
        scrollToItem(track, items[closestIndex - 1], true);
    }
}

function startCarouselAutoPlay() {
    stopCarouselAutoPlay();
    carouselInterval = setInterval(() => {
        const sliderView = document.getElementById('view-slider');
        if (sliderView && sliderView.classList.contains('active')) {
            scrollNext(false);
        }
    }, 3000);
}

function stopCarouselAutoPlay() {
    if (carouselInterval) clearInterval(carouselInterval);
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
        "media/WhatsApp Image 2026-05-12 at 15.12.23.jpeg",
        "media/WhatsApp Image 2026-05-12 at 15.12.24.jpeg",
        "media/WhatsApp Image 2026-05-12 at 15.12.25(1).jpeg",
        "media/WhatsApp Image 2026-05-12 at 15.12.25(2).jpeg",
        "media/WhatsApp Image 2026-05-12 at 15.12.25.jpeg",
        "media/WhatsApp Image 2026-05-12 at 15.12.26(1).jpeg",
        "media/WhatsApp Image 2026-05-12 at 15.12.26.jpeg",
        "media/WhatsApp Image 2026-05-12 at 15.12.27(1).jpeg",
        "media/WhatsApp Image 2026-05-12 at 15.12.27.jpeg"
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
