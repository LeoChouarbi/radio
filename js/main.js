
// === Enregistrement obligatoire des plugins GSAP ===
gsap.registerPlugin(ScrollTrigger);

// --- Fonction d'initialisation ---
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initCursor();
    initHeroAnimation();
    initTechUniverse();       // ← Ajouté ici
    initModuleCards();
    initAnimations();
    initSmoothNav();
    initContactForm();
    initRadarAnimation();
});

// --- Preloader ---
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.style.display = 'none', 600);
    }, 2800);
}

// --- Custom Cursor ---
function initCursor() {
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursor-follower');
    if (!cursor || !cursorFollower) return;
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
        gsap.to(cursorFollower, { x: e.clientX, y: e.clientY, duration: 0.3 });
    });
    const interactive = document.querySelectorAll('a, button, .card, .module-card, .method-card, .public-point, .format-card, .value-card, input, textarea');
    interactive.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 2, duration: 0.2 });
            gsap.to(cursorFollower, { scale: 3, opacity: 0.1, duration: 0.2 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, duration: 0.2 });
            gsap.to(cursorFollower, { scale: 1, opacity: 1, duration: 0.2 });
        });
    });
    document.addEventListener('mousedown', () => {
        gsap.to(cursor, { scale: 1.4, duration: 0.1 });
        gsap.to(cursorFollower, { scale: 0.9, opacity: 0.4, duration: 0.1 });
    });
    document.addEventListener('mouseup', () => {
        gsap.to(cursor, { scale: 1, duration: 0.1 });
        gsap.to(cursorFollower, { scale: 1, opacity: 1, duration: 0.1 });
    });
}

// --- Hero animation (Three.js) ---
function initHeroAnimation() {
    const canvasContainer = document.getElementById('heroCanvas');
    if (!canvasContainer || !window.THREE) return;
    try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvasContainer.offsetWidth / canvasContainer.offsetHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        const resize = () => {
            const w = canvasContainer.offsetWidth || window.innerWidth;
            const h = canvasContainer.offsetHeight || window.innerHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        resize();
        const particlesGeometry = new THREE.BufferGeometry();
        const particleCount = 2000;
        const posArray = new Float32Array(particleCount * 3);
        const colorArray = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i += 3) {
            posArray[i] = (Math.random() - 0.5) * 20;
            posArray[i + 1] = (Math.random() - 0.5) * 20;
            posArray[i + 2] = (Math.random() - 0.5) * 20;
            colorArray[i] = 0.0;
            colorArray[i + 1] = 0.8;
            colorArray[i + 2] = 1.0;
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particleSystem);
        camera.position.z = 10;
        const animate = () => {
            requestAnimationFrame(animate);
            particleSystem.rotation.x += 0.0001;
            particleSystem.rotation.y += 0.0005;
            const positions = particlesGeometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] = Math.sin(positions[i] * 2 + Date.now() * 0.001) * 0.5;
            }
            particlesGeometry.attributes.position.needsUpdate = true;
            renderer.render(scene, camera);
        };
        window.addEventListener('resize', resize);
        animate();
        canvasContainer.appendChild(renderer.domElement);
    } catch (e) {
        console.error('Three.js init error:', e);
    }
}

function initTechUniverse() {
    const canvas = document.getElementById('techUniverse');
    if (!canvas || !window.THREE) return;

    // --- Configuration de la scène ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas, 
        alpha: true, 
        antialias: true
    });

    camera.position.z = 15;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

    // Gestion du redimensionnement
    const resize = () => {
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    };

    // Lumière ambiante
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Noyau central
    const coreGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const coreMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x6a5af9,
        transparent: true,
        opacity: 0.9,
        emissive: 0x00f3ff,
        emissiveIntensity: 0.8
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);

    // Particules autour du noyau
    const particleCount = 200;
    const particles = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = 1.5 + Math.random() * 0.5;
        posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
        posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        posArray[i + 2] = radius * Math.cos(phi);
        colorArray[i] = 0.0;
        colorArray[i + 1] = 0.9;
        colorArray[i + 2] = 1.0;
    }
    particles.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.04,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Technologies (sphères)
    const techPositions = [
        { x: -2.5, y: 0.8, z: 1.5 },
        { x: 2, y: -1, z: 0.8 },
        { x: 0.5, y: 2, z: -2 },
        { x: -1.5, y: -1.2, z: 2.5 },
        { x: 2.5, y: 1, z: -1 },
        { x: -2, y: -2, z: 2 }
    ];
    const technologies = [
        { name: '5g', title: '5G & 6G', description: 'Les réseaux 5G et 6G représentent l\'évolution des communications mobiles, avec des débits plus élevés, une latence quasi nulle et une connectivité massive pour l\'IoT.', diagram: [{ title: 'Bande Sub-6 GHz', range: '600 MHz - 6 GHz', usage: 'Couverture large' }, { title: 'Bande mmWave', range: '24-40 GHz', usage: 'Haut débit' }], color: 0x00f3ff },
        { name: 'satellites', title: 'Satellites', description: 'Les satellites de communication, comme Starlink, utilisent des constellations pour fournir un accès internet global et résilient.', diagram: [{ title: 'Basse orbite', range: '300-2000 km', usage: 'Bande large' }, { title: 'Orbite moyenne', range: '2000-35000 km', usage: 'Navigation' }, { title: 'Orbite géostationnaire', range: '35786 km', usage: 'Télévision' }], color: 0xff2ec4 },
        { name: 'ia', title: 'IA & Radio', description: 'L\'intelligence artificielle optimise les réseaux sans fil en temps réel, améliore le traitement du signal et permet des systèmes de communication adaptatifs.', diagram: [{ title: 'Traitement du signal', range: 'Amélioration SNR', usage: 'Réduction du bruit' }, { title: 'Optimisation des réseaux', range: 'Adaptation dynamique', usage: 'Efficacité énergétique' }, { title: 'Prédiction de trafic', range: 'Prévision de charge', usage: 'Gestion des ressources' }], color: 0x6a5af9 },
        { name: 'eco', title: 'Éco-conception', description: 'Les nouveaux systèmes de communication intègrent des principes d\'éco-conception pour réduire l\'empreinte carbone des réseaux sans fil.', diagram: [{ title: 'Énergie verte', range: 'Alimentation solaire', usage: 'Bases relais' }, { title: 'Économie d\'énergie', range: 'Mode veille intelligent', usage: 'Appareils connectés' }, { title: 'Matériaux recyclables', range: 'Conception circulaire', usage: 'Équipements' }], color: 0x00ff00 },
        { name: 'xr', title: 'XR & Métavers', description: 'La réalité augmentée et le métavers nécessitent des débits extrêmement élevés et une latence quasi nulle, rendus possibles par les réseaux 5G/6G.', diagram: [{ title: 'Latence ultra-basse', range: '<1ms', usage: 'Expérience immersive' }, { title: 'Synchronisation précise', range: 'Micro-secondes', usage: 'Environnements partagés' }, { title: 'Bande passante massive', range: 'Gbps par utilisateur', usage: 'Graphiques haute résolution' }], color: 0xffa500 },
        { name: 'vehicules', title: 'Véhicules Connectés', description: 'Les véhicules autonomes utilisent des réseaux V2X (Vehicle-to-Everything) pour communiquer entre eux et avec l\'infrastructure.', diagram: [{ title: 'V2V (Vehicle-to-Vehicle)', range: '5.9 GHz', usage: 'Sécurité routière' }, { title: 'V2I (Vehicle-to-Infrastructure)', range: '5.9 GHz', usage: 'Gestion du trafic' }, { title: 'V2P (Vehicle-to-Pedestrian)', range: '5.9 GHz', usage: 'Prévention des accidents' }], color: 0xff0000 }
    ];

    const techSpheres = [];
    technologies.forEach((tech, index) => {
        const geometry = new THREE.SphereGeometry(0.7, 32, 32);
        const material = new THREE.MeshPhongMaterial({ 
            color: tech.color,
            transparent: true,
            opacity: 0.85,
            emissive: tech.color,
            emissiveIntensity: 0.6
        });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(techPositions[index].x, techPositions[index].y, techPositions[index].z);
        scene.add(sphere);
        sphere.userData = tech; // ← ATTACHEZ LES DONNÉES ICI
        techSpheres.push(sphere);

        // Particules autour
        const sphereParticles = new THREE.BufferGeometry();
        const spherePosArray = new Float32Array(100 * 3);
        for (let i = 0; i < 100 * 3; i += 3) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 0.8 + Math.random() * 0.15;
            spherePosArray[i] = radius * Math.cos(angle);
            spherePosArray[i + 1] = radius * Math.sin(angle);
            spherePosArray[i + 2] = Math.random() * 0.1 - 0.05;
        }
        sphereParticles.setAttribute('position', new THREE.BufferAttribute(spherePosArray, 3));
        const sphereParticleMaterial = new THREE.PointsMaterial({
            size: 0.02,
            color: tech.color,
            transparent: true,
            opacity: 0.6
        });
        const sphereParticleSystem = new THREE.Points(sphereParticles, sphereParticleMaterial);
        sphere.add(sphereParticleSystem);
    });

    // === INTERACTION CORRIGÉE AVEC LE CANVAS ===
    const techInfoPanel = document.querySelector('.tech-info-panel');
    const techInfoClose = document.querySelector('.tech-info-close');
    const techInfoTitle = document.querySelector('.tech-info-title');
    const techInfoDescription = document.querySelector('.tech-info-description');
    const techInfoDiagram = document.querySelector('.tech-info-diagram');

    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();

    function onMouseClick(event) {
        // ✅ CORRECTION : Convertir les coordonnées par rapport au canvas, pas à la fenêtre
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(techSpheres);

        if (intersects.length > 0) {
            const tech = intersects[0].object.userData; // ← Données attachées
            techInfoTitle.textContent = tech.title;
            techInfoDescription.innerHTML = `<p>${tech.description}</p>`;
            techInfoDiagram.innerHTML = tech.diagram.map(item => `
                <div class="frequency-band">
                    <div class="band-title">${item.title}</div>
                    <div class="band-range">${item.range}</div>
                    <div class="band-usage">${item.usage}</div>
                </div>
            `).join('');
            techInfoPanel.classList.add('active');
            
            // Animation visuelle : faire clignoter la sphère cliquée
            const clickedSphere = intersects[0].object;
            gsap.to(clickedSphere.scale, {
                x: 1.5,
                y: 1.5,
                z: 1.5,
                duration: 0.3,
                yoyo: true,
                repeat: 1,
                ease: "power2.out"
            });
        } else {
            techInfoPanel.classList.remove('active');
        }
    }

    canvas.addEventListener('click', onMouseClick);
    window.addEventListener('resize', resize);
    techInfoClose?.addEventListener('click', () => {
        techInfoPanel?.classList.remove('active');
    });

    // Animation
    function animate() {
        requestAnimationFrame(animate);
        scene.rotation.y += 0.0005;
        const time = Date.now() * 0.001;
        const positions = particleSystem.geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const angle = time * 0.5 + i * 0.1;
            positions.array[i * 3] = positions.array[i * 3] * (1 + 0.1 * Math.sin(angle));
            positions.array[i * 3 + 1] = positions.array[i * 3 + 1] * (1 + 0.1 * Math.sin(angle));
            positions.array[i * 3 + 2] = positions.array[i * 3 + 2] * (1 + 0.1 * Math.sin(angle));
        }
        positions.needsUpdate = true;
        techSpheres.forEach(s => s.rotation.y += 0.002);
        renderer.render(scene, camera);
    }
    animate();
}


// --- GSAP animations ---
function initAnimations() {
    gsap.fromTo('.hero h1', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.4, ease: "power3.out", delay: 0.2 });
    gsap.fromTo('.hero-subtitle', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.5 });
    gsap.fromTo('.hero p', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.7, stagger: 0.1 });
    gsap.fromTo('.hero-btns', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 1.0 });
    gsap.utils.toArray('.section-title, .section-subtitle').forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" } });
    });
    gsap.utils.toArray('.card').forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, y: 60, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 85%" }, delay: i * 0.05 });
    });
    gsap.utils.toArray('.module-card').forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, y: 60, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 85%" }, delay: i * 0.05 });
    });
    gsap.fromTo('.radar-container', { opacity: 0, scale: 0.8, y: 50 }, { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "back.out(1.7)", scrollTrigger: { trigger: '.radar-container', start: "top 85%" } });
    gsap.utils.toArray('.public-point').forEach((point, i) => {
        gsap.fromTo(point, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)", scrollTrigger: { trigger: '.radar-container', start: "top 80%" }, delay: i * 0.2 });
    });
    gsap.fromTo('.public-details', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: '.public-details', start: "top 85%" } });
    gsap.utils.toArray('.method-card, .format-card, .value-card').forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 85%" }, delay: i * 0.05 });
    });
    gsap.fromTo('.contact-grid', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: '.contact-grid', start: "top 85%" } });
    gsap.fromTo('footer', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: 'footer', start: "top 90%" } });
}

// --- Navigation smooth scroll ---
function initSmoothNav() {
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// --- Form submission (demo) ---
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('.submit-btn');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;
        setTimeout(() => {
            alert('✅ Votre demande a bien été envoyée !\nJe vous répondrai sous 48h pour établir un devis personnalisé.');
            contactForm.reset();
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer ma demande';
            submitBtn.disabled = false;
        }, 2000);
    });
}

// --- Module Cards ---
function initModuleCards() {
    // Déjà géré dans initAnimations → suppression redondante
}

// --- Radar animation ---
function initRadarAnimation() {
    const radarContainer = document.getElementById('radarContainer');
    const title = document.getElementById('public-title');
    const description = document.getElementById('public-description');
    if (!radarContainer || !title || !description) return;
    const materialData = {
        water: { title: "Eau", description: "Les ondes radio sont fortement absorbées par l'eau...", color: "linear-gradient(135deg, #00f3ff, #00a0ff)" },
        metal: { title: "Métal", description: "Le métal réfléchit presque complètement les ondes radio...", color: "linear-gradient(135deg, #ff2ec4, #c0c0c0)" },
        glass: { title: "Verre", description: "Le verre laisse généralement passer les ondes radio...", color: "linear-gradient(135deg, #00f3ff, #00c0ff)" },
        wood: { title: "Bois", description: "Le bois atténue légèrement les ondes radio...", color: "linear-gradient(135deg, #ff2ec4, #e0e0e0)" }
    };
    function createPoints() {
        const centerX = radarContainer.offsetWidth / 2;
        const centerY = radarContainer.offsetHeight / 2;
        const radius = 150;
        const angleStep = (2 * Math.PI) / Object.keys(materialData).length;
        Object.keys(materialData).forEach((key, index) => {
            const angle = index * angleStep;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            const point = document.createElement('div');
            point.className = 'public-point';
            point.setAttribute('data-target', key);
            point.style.left = `${x}px`;
            point.style.top = `${y}px`;
            point.style.background = materialData[key].color;
            point.addEventListener('click', () => {
                const data = materialData[key];
                gsap.to(title, { opacity: 0, y: 20, duration: 0.3, onComplete: () => { title.textContent = data.title; gsap.to(title, { opacity: 1, y: 0, duration: 0.5 }); } });
                gsap.to(description, { opacity: 0, y: 20, duration: 0.3, onComplete: () => { description.textContent = data.description; gsap.to(description, { opacity: 1, y: 0, duration: 0.5 }); } });
                document.querySelectorAll('.public-point').forEach(p => {
                    if (p === point) gsap.to(p, { scale: 2.5, boxShadow: '0 0 40px rgba(0, 243, 255, 1)', duration: 0.5 });
                    else gsap.to(p, { scale: 0.7, opacity: 0.5, duration: 0.3 });
                });
            });
            radarContainer.appendChild(point);
        });
    }
    setTimeout(createPoints, 300);
    document.addEventListener('click', (e) => {
        if (!radarContainer.contains(e.target) && !e.target.classList.contains('public-point')) {
            document.querySelectorAll('.public-point').forEach(p => gsap.to(p, { scale: 1, opacity: 1, duration: 0.3 }));
            gsap.to(title, { opacity: 0, y: 20, duration: 0.3, onComplete: () => { title.textContent = "Sélectionnez un matériau"; gsap.to(title, { opacity: 1, y: 0, duration: 0.5 }); } });
            gsap.to(description, { opacity: 0, y: 20, duration: 0.3, onComplete: () => { description.textContent = "Cliquez sur les points du radar pour découvrir comment chaque matériau interagit avec les ondes radio."; gsap.to(description, { opacity: 1, y: 0, duration: 0.5 }); } });
        }
    });
}