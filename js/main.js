// === Enregistrement obligatoire des plugins GSAP ===
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// Détection mobile pour optimisations
const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
const isLowEndDevice = !window.WebGLRenderingContext || 
                      !document.createElement('canvas').getContext('webgl');

// --- Fonction d'initialisation principale ---
document.addEventListener('DOMContentLoaded', () => {
    // Désactivation des animations lourdes sur mobile/anciens appareils
    if (isMobile || isLowEndDevice) {
        document.documentElement.classList.add('low-end-mode');
        disableHeavyAnimations();
    }
    
    try {
        initPreloader();
        initCursor();
        initHeroAnimation();
        initSmoothNav();
        initContactForm();
        initSectionAnimations();
    } catch (error) {
        console.error('Erreur d\'initialisation:', error);
        showFallbackContent();
    }
});

// --- Nettoyage global (évite les memory leaks) ---
window.addEventListener('beforeunload', () => {
    // Nettoyage GSAP
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    gsap.killTweensOf('*');
    
    // Nettoyage Three.js (à compléter dans les composants)
    if (window.threeScene) {
        window.threeScene.children.forEach(object => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) object.material.dispose();
        });
    }
});

// --- Preloader optimisé ---
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    
    // Détection fin de chargement réel
    const assetsToLoad = document.images.length + 2; // +2 pour polices et scripts
    let loadedAssets = 0;
    
    const incrementProgress = () => {
        loadedAssets++;
        const progress = Math.min(95, Math.round((loadedAssets / assetsToLoad) * 100));
        preloader.querySelector('.progress-bar').style.width = `${progress}%`;
        
        if (loadedAssets >= assetsToLoad) {
            setTimeout(hidePreloader, 300);
        }
    };
    
    // Écouteurs de chargement
    document.fonts.ready.then(incrementProgress);
    Array.from(document.images).forEach(img => {
        if (img.complete) incrementProgress();
        else img.addEventListener('load', incrementProgress);
        img.addEventListener('error', incrementProgress);
    });
    
    // Timeout de sécurité
    setTimeout(hidePreloader, 4000);
}

function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    
    gsap.to(preloader, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.in",
        onComplete: () => {
            preloader.style.display = 'none';
            initPageAnimations();
        }
    });
}

// --- Custom Cursor optimisé ---
function initCursor() {
    if (isMobile || isLowEndDevice) return;
    
    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    cursor.className = 'cursor-default';
    document.body.appendChild(cursor);
    
    const follower = document.createElement('div');
    follower.id = 'cursor-follower';
    document.body.appendChild(follower);
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    let isDown = false;
    
    // Suivi fluide
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Animation principale
        gsap.to(cursor, {
            x: mouseX - cursor.offsetWidth / 2,
            y: mouseY - cursor.offsetHeight / 2,
            duration: 0.15
        });
    });
    
    // Animation du follower (décalage subtil)
    const animateFollower = () => {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        
        gsap.set(follower, {
            x: followerX - follower.offsetWidth / 2,
            y: followerY - follower.offsetHeight / 2
        });
        
        requestAnimationFrame(animateFollower);
    };
    
    // Éléments interactifs
    const interactiveElements = document.querySelectorAll(`
        a, button, .tech-model, .module-card, .cta-button,
        input, textarea, [data-cursor-hover]
    `);
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
            gsap.to(follower, { scale: 2, opacity: 0.2, duration: 0.3 });
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            gsap.to(follower, { scale: 1, opacity: 1, duration: 0.3 });
        });
        
        el.addEventListener('mousedown', () => {
            isDown = true;
            cursor.classList.add('cursor-down');
            gsap.to(follower, { scale: 0.85, opacity: 0.5, duration: 0.1 });
        });
        
        el.addEventListener('mouseup', () => {
            isDown = false;
            cursor.classList.remove('cursor-down');
            gsap.to(follower, { scale: isDown ? 1.5 : 1, opacity: 1, duration: 0.2 });
        });
    });
    
    // Effet click global
    document.addEventListener('mousedown', () => {
        if (!isDown) {
            gsap.to(follower, { scale: 0.85, duration: 0.1 });
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (!isDown) {
            gsap.to(follower, { scale: 1, duration: 0.2 });
        }
    });
    
    animateFollower();
}

// --- Hero animation (Three.js robuste) ---
function initHeroAnimation() {
    const canvasContainer = document.getElementById('heroCanvas');
    if (!canvasContainer || isLowEndDevice) return;
    
    try {
        // Initialisation Three.js
        const scene = new THREE.Scene();
        window.threeScene = scene; // Pour nettoyage ultérieur
        
        const camera = new THREE.PerspectiveCamera(
            75, 
            canvasContainer.offsetWidth / canvasContainer.offsetHeight, 
            0.1, 
            1000
        );
        
        const renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance"
        });
        
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
        canvasContainer.appendChild(renderer.domElement);
        
        // Particules optimisées
        const particleCount = isMobile ? 800 : 2000;
        const particlesGeometry = new THREE.BufferGeometry();
        const posArray = new Float32Array(particleCount * 3);
        const colorArray = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            posArray[i] = (Math.random() - 0.5) * 20;
            posArray[i + 1] = (Math.random() - 0.5) * 20;
            posArray[i + 2] = (Math.random() - 0.5) * 20;
            
            // Couleurs dégradées
            const t = Math.random();
            colorArray[i] = 0.1 + t * 0.2;     // R
            colorArray[i + 1] = 0.5 + t * 0.4;  // G
            colorArray[i + 2] = 0.9 + t * 0.1;  // B
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: isMobile ? 0.1 : 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.85,
            sizeAttenuation: true
        });
        
        const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particleSystem);
        
        camera.position.z = 10;
        
        // Animation principale
        const animate = () => {
            requestAnimationFrame(animate);
            
            const time = Date.now() * 0.0003;
            particleSystem.rotation.y = time * 0.2;
            particleSystem.rotation.x = Math.sin(time * 0.5) * 0.05;
            
            // Animation ondulatoire
            const positions = particlesGeometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(positions[i] * 2 + time) * 0.02;
            }
            particlesGeometry.attributes.position.needsUpdate = true;
            
            renderer.render(scene, camera);
        };
        
        // Gestion responsive
        const resizeHandler = () => {
            if (!canvasContainer.offsetWidth) return;
            
            camera.aspect = canvasContainer.offsetWidth / canvasContainer.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
        };
        
        window.addEventListener('resize', resizeHandler);
        
        // Démarrage animation
        animate();
        
        // Stockage pour nettoyage
        canvasContainer.__threeRenderer = renderer;
        
        return () => {
            // Nettoyage Three.js
            window.removeEventListener('resize', resizeHandler);
            renderer.dispose();
            particlesGeometry.dispose();
            particlesMaterial.dispose();
            canvasContainer.removeChild(renderer.domElement);
            scene.clear();
        };
    } catch (error) {
        console.warn('Erreur Three.js - Mode dégradé activé', error);
        document.documentElement.classList.add('no-webgl');
    }
}

// --- Navigation fluide ---
function initSmoothNav() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                gsap.to(window, {
                    scrollTo: {
                        y: targetElement,
                        offsetY: 80
                    },
                    duration: isMobile ? 0.8 : 1.2,
                    ease: "power2.inOut"
                });
            }
        });
    });
}

// --- Formulaire contact sécurisé ---
function initContactForm() {
    const form = document.querySelector('.contact-form form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validation basique
        const name = form.querySelector('input[type="text"]').value.trim();
        const email = form.querySelector('input[type="email"]').value.trim();
        const message = form.querySelector('textarea').value.trim();
        
        if (name.length < 2 || !email.includes('@') || message.length < 10) {
            alert('Veuillez remplir correctement tous les champs');
            return;
        }
        
        // Désactivation pendant envoi
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours...';
        
        try {
            // Ici votre logique d'envoi (API, Formspree, etc.)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Succès
            form.reset();
            alert('Votre message a été envoyé avec succès !');
            
            // Reset bouton
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Envoyer ma demande';
            }, 2000);
        } catch (error) {
            console.error('Erreur envoi:', error);
            alert('Erreur lors de l\'envoi. Veuillez réessayer.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Réessayer';
        }
    });
}

// --- Animations des sections ---
function initSectionAnimations() {
    // Titres principaux
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    });
    
    // Cards modules
    gsap.utils.toArray('.module-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            scale: 0.95,
            duration: 0.7,
            delay: i * 0.1,
            ease: 'back.out(1.2)'
        });
    });
    
    // Univers technologique
    const universe = document.querySelector('.tech-universe-container');
    if (universe) {
        gsap.from(universe, {
            scrollTrigger: {
                trigger: universe,
                start: 'top 95%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            scale: 0.9,
            duration: 1,
            ease: 'power3.out'
        });
    }
}

// --- Désactivation animations lourdes ---
function disableHeavyAnimations() {
    // Désactiver Three.js
    const heroCanvas = document.getElementById('heroCanvas');
    if (heroCanvas) {
        heroCanvas.innerHTML = `
            <div class="fallback-hero">
                <div class="wave-pattern"></div>
                <div class="pulse-circle"></div>
            </div>
        `;
    }
    
    // Simplifier particules
    document.documentElement.style.setProperty('--particle-size', '2px');
    
    // Désactiver animations complexes
    gsap.ticker.fps(30);
}

// --- Contenu de secours ---
function showFallbackContent() {
    document.getElementById('heroCanvas')?.classList.add('fallback-mode');
    
    // Ajouter bouton de bascule pour les utilisateurs avancés
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'force-webgl-btn';
    toggleBtn.textContent = 'Activer les effets 3D';
    toggleBtn.onclick = () => {
        document.documentElement.classList.remove('no-webgl', 'low-end-mode');
        document.getElementById('heroCanvas').innerHTML = '';
        initHeroAnimation();
        toggleBtn.remove();
    };
    
    document.querySelector('.hero')?.appendChild(toggleBtn);
}

// --- Animations initiales post-preloader ---
function initPageAnimations() {
    // Animation titre hero
    gsap.from('.hero h1', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.2
    });
    
    gsap.from('.hero-subtitle', {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.4
    });
    
    // Effet onde radio de fond
    const waveContainer = document.querySelector('.hero-waves');
    if (waveContainer) {
        gsap.from(waveContainer.children, {
            duration: 1.5,
            opacity: 0,
            scale: 0.8,
            stagger: 0.15,
            ease: 'back.out(1.7)'
        });
    }
}

// --- Gestionnaire d'erreurs global ---
window.addEventListener('error', (e) => {
    if (e.message.includes('three')) {
        console.warn('Erreur WebGL - Basculer en mode dégradé');
        document.documentElement.classList.add('no-webgl');
    }
});