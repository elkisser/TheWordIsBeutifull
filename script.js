// Datos de los planetas para referencia
const planetas = [
    'home', 'sol', 'mercurio', 'venus', 'tierra', 'marte', 
    'jupiter', 'saturno', 'urano', 'neptuno', 'pluton'
];

let planetaActual = 0;
let animacionEnProgreso = false;
let animacionLuna;

// Crear estrellas de fondo
function crearEstrellas() {
    const contenedor = document.getElementById('fondoEstrellas');
    for (let i = 0; i < 300; i++) {
        const estrella = document.createElement('div');
        estrella.classList.add('estrella');
        estrella.style.width = `${Math.random() * 3}px`;
        estrella.style.height = estrella.style.width;
        estrella.style.left = `${Math.random() * 100}%`;
        estrella.style.top = `${Math.random() * 100}%`;
        estrella.style.animationDelay = `${Math.random() * 5}s`;
        estrella.style.opacity = Math.random() * 0.7 + 0.3;
        contenedor.appendChild(estrella);
    }
}

// Crear indicador de scroll
function crearIndicadorScroll() {
    const indicador = document.getElementById('indicadorScroll');
    
    planetas.forEach((planeta, index) => {
        const punto = document.createElement('div');
        punto.classList.add('punto-indicador');
        if (index === 0) punto.classList.add('activo');
        
        punto.addEventListener('click', () => {
            if (!animacionEnProgreso) {
                cambiarPlaneta(index);
            }
        });
        
        indicador.appendChild(punto);
    });
}

// Configurar controles de navegación
function configurarControles() {
    // Configurar navegación con rueda del mouse
    document.addEventListener('wheel', (e) => {
        if (animacionEnProgreso) return;
        if (e.deltaY > 0 && planetaActual < planetas.length - 1) {
            cambiarPlaneta(planetaActual + 1);
        } else if (e.deltaY < 0 && planetaActual > 0) {
            cambiarPlaneta(planetaActual - 1);
        }
    });

    // Configurar navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (animacionEnProgreso) return;
        if ((e.key === 'ArrowDown' || e.key === 'PageDown') && planetaActual < planetas.length - 1) {
            cambiarPlaneta(planetaActual + 1);
            e.preventDefault();
        } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && planetaActual > 0) {
            cambiarPlaneta(planetaActual - 1);
            e.preventDefault();
        }
    });
}

// Cambiar al planeta especificado
function cambiarPlaneta(nuevoPlaneta) {
    if (animacionEnProgreso || nuevoPlaneta === planetaActual) return;
    
    animacionEnProgreso = true;
    const direccion = nuevoPlaneta > planetaActual ? 1 : -1;
    
    // Obtener elementos
    const seccionActual = document.getElementById(planetas[planetaActual]);
    const seccionSiguiente = document.getElementById(planetas[nuevoPlaneta]);
    
    // Si estamos en la página de inicio y vamos a los planetas, o viceversa, manejamos de forma especial
    if ((planetaActual === 0 && nuevoPlaneta > 0) || (planetaActual > 0 && nuevoPlaneta === 0)) {
        // Transición especial entre home y planetas
        if (planetaActual === 0) {
            // Transición de home a planetas
            const homeContent = document.querySelector('.home-content');
            anime({
                targets: homeContent,
                opacity: 0,
                translateY: -50,
                duration: 800,
                easing: 'easeInQuad',
                complete: function() {
                    seccionActual.classList.remove('activa');
                    seccionSiguiente.classList.add('activa');
                    animarPlaneta(nuevoPlaneta);
                }
            });
        } else {
            // Transición de planetas a home
            const planetaElemActual = document.getElementById(`planeta${planetas[planetaActual].charAt(0).toUpperCase() + planetas[planetaActual].slice(1)}`);
            const infoActual = seccionActual.querySelectorAll('.info-izquierda, .info-derecha');
            // Anillo de Saturno
            let anilloSaturno = null;
            if (planetas[planetaActual] === 'saturno') {
                anilloSaturno = seccionActual.querySelector('.anillos-saturno');
            }
            // Detener animación de la luna si estamos en la Tierra
            if (planetaActual === 4 && animacionLuna) {
                animacionLuna.pause();
            }
            // Animación de salida del planeta actual y anillo si es Saturno
            const targetsSalida = anilloSaturno ? [planetaElemActual, anilloSaturno] : planetaElemActual;
            anime({
                targets: targetsSalida,
                scale: 0.3,
                opacity: 0,
                rotate: `${direccion * 90}deg`,
                duration: 800,
                easing: 'easeInOutQuad'
            });
            // Animación de salida de la información actual
            anime({
                targets: infoActual,
                translateY: 50,
                opacity: 0,
                duration: 600,
                delay: anime.stagger(100),
                easing: 'easeInQuad',
                complete: function() {
                    seccionActual.classList.remove('activa');
                    seccionSiguiente.classList.add('activa');
                    // Animar contenido de home
                    const homeContent = document.querySelector('.home-content');
                    anime({
                        targets: homeContent,
                        opacity: [0, 1],
                        translateY: [50, 0],
                        duration: 1000,
                        easing: 'easeOutQuad',
                        complete: function() {
                            animacionEnProgreso = false;
                        }
                    });
                }
            });
        }
    } else {
        // Transición normal entre planetas
        if (planetaActual > 0) { // Solo si estamos en un planeta (no en home)
            const planetaElemActual = document.getElementById(`planeta${planetas[planetaActual].charAt(0).toUpperCase() + planetas[planetaActual].slice(1)}`);
            const infoActual = seccionActual.querySelectorAll('.info-izquierda, .info-derecha');
            // Anillo de Saturno
            let anilloSaturno = null;
            if (planetas[planetaActual] === 'saturno') {
                anilloSaturno = seccionActual.querySelector('.anillos-saturno');
            }
            // Detener animación de la luna si estamos en la Tierra
            if (planetaActual === 4 && animacionLuna) {
                animacionLuna.pause();
            }
            // Animación de salida del planeta actual y anillo si es Saturno
            const targetsSalida = anilloSaturno ? [planetaElemActual, anilloSaturno] : planetaElemActual;
            anime({
                targets: targetsSalida,
                scale: 0.3,
                opacity: 0,
                rotate: `${direccion * 90}deg`,
                duration: 1000,
                easing: 'easeInOutQuad'
            });
            // Animación de salida de la información actual
            anime({
                targets: infoActual,
                translateY: 50,
                opacity: 0,
                duration: 800,
                delay: anime.stagger(100),
                easing: 'easeInQuad',
                complete: function() {
                    seccionActual.classList.remove('activa');
                    seccionSiguiente.classList.add('activa');
                    animarPlaneta(nuevoPlaneta);
                }
            });
        } else {
            seccionActual.classList.remove('activa');
            seccionSiguiente.classList.add('activa');
            animarPlaneta(nuevoPlaneta);
        }
    }
    
    // Actualizar indicadores
    document.querySelectorAll('.punto-indicador').forEach((punto, index) => {
        if (index === nuevoPlaneta) {
            punto.classList.add('activo');
        } else {
            punto.classList.remove('activo');
        }
    });
    
    // Actualizar barra de progreso
    const progreso = (nuevoPlaneta / (planetas.length - 1)) * 100;
    anime({
        targets: '#barraProgreso',
        width: `${progreso}%`,
        duration: 1000,
        easing: 'easeOutQuad'
    });
    
    planetaActual = nuevoPlaneta;
    
    // Efectos especiales para planetas específicos
    if (nuevoPlaneta === 5) { // Júpiter
        setTimeout(() => {
            animarManchaRoja();
        }, 1200);
    } else if (nuevoPlaneta === 10) { // Plutón
        setTimeout(() => {
            animarLunaPluton();
        }, 1200);
    }
}

// Animar planeta específico
function animarPlaneta(indicePlaneta) {
    if (indicePlaneta === 0) return; // No animar si es home
    
    const nombrePlaneta = planetas[indicePlaneta];
    const planetaElem = document.getElementById(`planeta${nombrePlaneta.charAt(0).toUpperCase() + nombrePlaneta.slice(1)}`);
    const infoSiguiente = document.querySelectorAll(`#${nombrePlaneta} .info-izquierda, #${nombrePlaneta} .info-derecha`);
    
    // Animación de entrada del siguiente planeta y anillo si es Saturno
    let anilloSaturno = null;
    if (nombrePlaneta === 'saturno') {
        anilloSaturno = document.querySelector('#saturno .anillos-saturno');
    }
    const targetsEntrada = anilloSaturno ? [planetaElem, anilloSaturno] : planetaElem;
    anime({
        targets: targetsEntrada,
        scale: [0.3, 1],
        opacity: [0, 1],
        rotate: [`${-90}deg`, '0deg'],
        duration: 1200,
        delay: 300,
        easing: 'easeOutElastic(1, .8)',
        complete: function() {
            // Si es la Tierra, iniciar animación de la luna
            if (nombrePlaneta === 'tierra') {
                iniciarAnimacionLuna();
            }
        }
    });
    
    // Animación de entrada de la información siguiente
    anime({
        targets: infoSiguiente,
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 1000,
        delay: anime.stagger(100, {start: 600}),
        easing: 'easeOutQuad',
        complete: function() {
            animacionEnProgreso = false;
        }
    });
}

// Inicializar animación del sol al cargar
function animacionInicial() {
    const homeContent = document.querySelector('.home-content');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    // Animación del contenido de home
    anime({
        targets: homeContent,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 1500,
        easing: 'easeOutQuad'
    });
    
    // Animación del indicador de scroll
    anime({
        targets: scrollIndicator,
        opacity: [0, 0.8],
        duration: 1000,
        delay: 1000,
        easing: 'easeInOutQuad'
    });
}

// Iniciar animación de la luna alrededor de la Tierra
function iniciarAnimacionLuna() {
    const luna = document.querySelector('.luna');
    if (!luna) return;
    
    // Detener animación anterior si existe
    if (animacionLuna) {
        animacionLuna.pause();
    }
    
    // Crear nueva animación
    animacionLuna = anime({
        targets: luna,
        translateX: function() {
            return anime.random(-65, 65);
        },
        translateY: function() {
            return anime.random(-65, 65);
        },
        easing: 'linear',
        duration: 8000,
        loop: true,
        direction: 'alternate',
        update: function(anim) {
            // Calcular la posición actual en la órbita
            const angle = (anim.progress / 100) * Math.PI * 2;
            const radius = 65; // Radio de la órbita
            
            // Calcular nuevas coordenadas
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            // Aplicar transformación
            luna.style.transform = `translate(${x}px, ${y}px)`;
        }
    });
}

// Efecto parallax para las estrellas
function configurarParallax() {
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        const estrellas = document.querySelectorAll('.estrella');
        
        estrellas.forEach((estrella, index) => {
            const velocidad = 0.5 + (index % 3) * 0.5;
            const moveX = (x - 0.5) * velocidad * 20;
            const moveY = (y - 0.5) * velocidad * 20;
            
            estrella.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
}

// Función para animar la mancha roja de Júpiter
function animarManchaRoja() {
    anime({
        targets: '.mancha-roja',
        translateX: ['-20px', '0px'],
        opacity: [0, 0.8],
        easing: 'easeInOutQuad',
        duration: 1500
    });
}

// Función para animar la luna de Plutón
function animarLunaPluton() {
    anime({
        targets: '.luna-pluton',
        opacity: [0, 1],
        scale: [0.5, 1],
        easing: 'easeInOutQuad',
        duration: 1000
    });
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    crearEstrellas();
    crearIndicadorScroll();
    configurarControles();
    animacionInicial();
    configurarParallax();
});