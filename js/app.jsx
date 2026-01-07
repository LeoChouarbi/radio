import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Environment } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

// Enregistrement de ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// ========== Composants 3D ==========
const CentralCore = React.memo(() => {
  return (
    <mesh>
      <sphereGeometry args={[1.2, 64, 64]} />
      <meshPhongMaterial
        color="#6a5af9"
        transparent
        opacity={0.9}
        emissive="#00f3ff"
        emissiveIntensity={0.8}
      />
      <Html distanceFactor={10}>
        <div className="core-label">
          <span>Radiofréquence</span>
        </div>
      </Html>
    </mesh>
  );
});

const Particles = React.memo(({ count = 200 }) => {
  const particles = useRef();
  const [positions, colors] = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 1.5 + Math.random() * 0.5;
      pos[i] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i + 2] = radius * Math.cos(phi);
      
      // Couleurs variables selon la position
      const hue = (i / (count * 3)) * 0.8 + 0.2;
      const rgb = new THREE.Color().setHSL(hue, 0.7, 0.7);
      col[i] = rgb.r;
      col[i + 1] = rgb.g;
      col[i + 2] = rgb.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (particles.current) {
      particles.current.rotation.y = time * 0.05;
      particles.current.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
    }
  });

  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
});

// Modèles 3D stylisés avec informations contextuelles
const TechModel = React.memo(({ position, color, name, onSelected, isSelected, moduleLink }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Animation de rotation constante
  useFrame(() => {
    if (meshRef.current && !isSelected) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
    }
  });

  // Effet de pulsation pour l'élément sélectionné
  useFrame(() => {
    if (isSelected && meshRef.current) {
      const scale = 1 + Math.sin(Date.now() * 0.005) * 0.1;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  // Gestion de la sélection
  const handleClick = () => {
    onSelected(name, moduleLink);
  };

  // Animation au survol
  const handlePointerOver = () => {
    setHovered(true);
    gsap.to(meshRef.current.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 0.3 });
  };

  const handlePointerOut = () => {
    setHovered(false);
    gsap.to(meshRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
  };

  let model;
  switch (name) {
    case '5g':
      model = (
        <group>
          <mesh position={[0, -0.45, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
            <meshPhongMaterial color="#333333" />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.1, 0.1, 0.8, 16]} />
            <meshPhongMaterial color={color} transparent opacity={0.85} />
          </mesh>
          {[1, 2, 3].map(i => (
            <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.4, 0]}>
              <torusGeometry args={[0.4 + i * 0.1, 0.02, 8, 32]} />
              <meshBasicMaterial color={color} transparent opacity={0.3} />
            </mesh>
          ))}
        </group>
      );
      break;
      
    case 'satellites':
      model = (
        <group>
          <mesh>
            <boxGeometry args={[0.6, 0.3, 0.3]} />
            <meshPhongMaterial color={color} transparent opacity={0.85} />
          </mesh>
          <mesh position={[0.6, 0, 0]}>
            <boxGeometry args={[1.2, 0.05, 0.3]} />
            <meshPhongMaterial color="#ffff00" transparent opacity={0.7} />
          </mesh>
          <mesh position={[-0.6, 0, 0]}>
            <boxGeometry args={[1.2, 0.05, 0.3]} />
            <meshPhongMaterial color="#ffff00" transparent opacity={0.7} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.4, 16]} />
            <meshPhongMaterial color="#ffffff" />
          </mesh>
        </group>
      );
      break;
      
    case 'ia':
      model = (
        <group>
          <mesh>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshPhongMaterial color={color} transparent opacity={0.85} />
          </mesh>
          {[...Array(8)].map((_, i) => (
            <line key={i}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  array={new Float32Array([
                    0, 0, 0,
                    Math.cos(i * Math.PI / 4) * 0.3,
                    Math.sin(i * Math.PI / 4) * 0.3,
                    0
                  ])}
                  count={2}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#ffffff" transparent opacity={0.5} />
            </line>
          ))}
        </group>
      );
      break;
      
    case 'eco':
      model = (
        <group>
          <mesh rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.5, 0.8, 16]} />
            <meshPhongMaterial color={color} transparent opacity={0.85} />
          </mesh>
          {[...Array(4)].map((_, i) => (
            <mesh key={i} rotation={[Math.PI / 2, i * Math.PI / 2, 0]} position={[0, 0.1, 0]}>
              <torusGeometry args={[0.3, 0.01, 8, 32]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
            </mesh>
          ))}
        </group>
      );
      break;
      
    case 'xr':
      model = (
        <group>
          <mesh>
            <boxGeometry args={[0.8, 0.3, 0.1]} />
            <meshPhongMaterial color={color} transparent opacity={0.85} />
          </mesh>
          <mesh position={[-0.3, 0, 0]}>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshPhongMaterial color="#ffffff" transparent opacity={0.6} />
          </mesh>
          <mesh position={[0.3, 0, 0]}>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshPhongMaterial color="#ffffff" transparent opacity={0.6} />
          </mesh>
        </group>
      );
      break;
      
    case 'vehicules':
      model = (
        <group>
          <mesh>
            <boxGeometry args={[0.8, 0.3, 0.4]} />
            <meshPhongMaterial color={color} transparent opacity={0.85} />
          </mesh>
          {[...Array(4)].map((_, i) => (
            <mesh
              key={i}
              rotation={[Math.PI / 2, 0, 0]}
              position={[
                (i % 2 === 0 ? -0.3 : 0.3),
                -0.2,
                (i < 2 ? -0.2 : 0.2)
              ]}
            >
              <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
              <meshPhongMaterial color="#333333" />
            </mesh>
          ))}
          {[1, 2].map(i => (
            <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
              <torusGeometry args={[0.4 + i * 0.1, 0.02, 8, 32]} />
              <meshBasicMaterial color={color} transparent opacity={0.3} />
            </mesh>
          ))}
        </group>
      );
      break;
      
    default:
      model = (
        <mesh>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshPhongMaterial
            color={color}
            transparent
            opacity={0.85}
            emissive={color}
            emissiveIntensity={0.6}
          />
        </mesh>
      );
  }

  return (
    <group
      ref={meshRef}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      scale={hovered ? 1.3 : 1}
    >
      {model}
      <Html distanceFactor={10}>
        <div className={`tech-label ${isSelected ? 'selected' : ''}`}>
          <span>{name.toUpperCase()}</span>
          {hovered && (
            <div className="tech-tooltip">
              {name === '5g' && 'Réseaux 5G/6G & communication mobile'}
              {name === 'satellites' && 'Systèmes satellitaires & communications spatiales'}
              {name === 'ia' && 'Intelligence artificielle appliquée aux ondes radio'}
              {name === 'eco' && 'Éco-conception des systèmes radio'}
              {name === 'xr' && 'Réalité étendue & métavers'}
              {name === 'vehicules' && 'Véhicules connectés & autonomes'}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
});

const TechUniverse = ({ onTechSelected, selectedTech }) => {
  const techPositions = [
    [-3, 1.2, 1.5],
    [3, -1.5, 0.8],
    [0.5, 2.5, -2.5],
    [-2, -2, 2],
    [3, 1.5, -1.5],
    [-3, -1, -2]
  ];
  
  const technologies = [
    { name: '5g', color: '#00f3ff', moduleLink: '#module-5g' },
    { name: 'satellites', color: '#ff2ec4', moduleLink: '#module-satellites' },
    { name: 'ia', color: '#6a5af9', moduleLink: '#module-ia' },
    { name: 'eco', color: '#00ff88', moduleLink: '#module-eco' },
    { name: 'xr', color: '#ffa500', moduleLink: '#module-xr' },
    { name: 'vehicules', color: '#ff0000', moduleLink: '#module-vehicules' }
  ];

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight 
        position={[-10, -10, -10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={1}
        castShadow
      />
      <CentralCore />
      <Particles />
      {technologies.map((tech, index) => (
        <TechModel
          key={tech.name}
          position={techPositions[index]}
          color={tech.color}
          name={tech.name}
          onSelected={onTechSelected}
          isSelected={selectedTech === tech.name}
          moduleLink={tech.moduleLink}
        />
      ))}
      <Environment preset="city" />
    </>
  );
};

// ========== Composants UI ==========

const techData = {
  '5g': {
    title: '5G & 6G',
    description: 'Les réseaux 5G et 6G représentent l\'évolution des communications mobiles, avec des débits plus élevés, une latence quasi nulle et une connectivité massive pour l\'IoT. Ces technologies utilisent des fréquences plus élevées et des techniques avancées comme le beamforming pour optimiser la transmission des ondes radio.',
    applications: [
      'Communications ultra-rapides',
      'Objets connectés (IoT)',
      'Véhicules autonomes',
      'Télé-médecine'
    ],
    module: 'Module 3: Propagation des ondes en environnements complexes'
  },
  'satellites': {
    title: 'Satellites',
    description: 'Les satellites de communication, comme Starlink, utilisent des constellations pour fournir un accès internet global et résilient. La communication avec ces satellites implique des techniques radio avancées pour surmonter l\'atténuation du signal et les délais de propagation dans l\'espace.',
    applications: [
      'Internet global',
      'Positionnement (GPS)',
      'Observation terrestre',
      'Communication d\'urgence'
    ],
    module: 'Module 7: Communications spatiales et systèmes satellitaires'
  },
  'ia': {
    title: 'IA & Radio',
    description: 'L\'intelligence artificielle optimise les réseaux sans fil en temps réel, améliore le traitement du signal et permet des systèmes de communication adaptatifs. Les algorithmes d\'apprentissage automatique analysent les caractéristiques du signal radio pour optimiser la transmission et détecter les interférences.',
    applications: [
      'Optimisation des réseaux',
      'Détection d\'interférences',
      'Prédiction de trafic',
      'Sécurité des communications'
    ],
    module: 'Module 5: Traitement numérique du signal et intelligence artificielle'
  },
  'eco': {
    title: 'Éco-conception',
    description: 'Les nouveaux systèmes de communication intègrent des principes d\'éco-conception pour réduire l\'empreinte carbone des réseaux sans fil. Cela inclut l\'optimisation énergétique des émetteurs-récepteurs et l\'utilisation de matériaux durables dans la fabrication des équipements radio.',
    applications: [
      'Réduction de la consommation énergétique',
      'Matériaux recyclables',
      'Optimisation du cycle de vie',
      'Réseaux basse consommation'
    ],
    module: 'Module 8: Éco-conception des systèmes radio et développement durable'
  },
  'xr': {
    title: 'XR & Métavers',
    description: 'La réalité augmentée et le métavers nécessitent des débits extrêmement élevés et une latence quasi nulle, rendus possibles par les réseaux 5G/6G. Les signaux radio sont utilisés pour localiser précisément les utilisateurs dans l\'espace et synchroniser les expériences immersives en temps réel.',
    applications: [
      'Réalité virtuelle immersive',
      'Réalité augmentée',
      'Métavers collaboratif',
      'Formation professionnelle'
    ],
    module: 'Module 6: Applications immersives et réseaux de nouvelle génération'
  },
  'vehicules': {
    title: 'Véhicules Connectés',
    description: 'Les véhicules autonomes utilisent des réseaux V2X (Vehicle-to-Everything) pour communiquer entre eux et avec l\'infrastructure. Ces communications radio permettent le partage d\'informations sur l\'environnement, la coordination des mouvements et l\'optimisation des flux de trafic.',
    applications: [
      'Sécurité routière',
      'Conduite autonome',
      'Gestion du trafic',
      'Services de mobilité intelligente'
    ],
    module: 'Module 4: Communications véhicule-à-véhicule et systèmes intelligents'
  }
};

const TechInfoPanel = ({ selectedTech, onClose, goToModule }) => {
  if (!selectedTech) return null;
  
  const data = techData[selectedTech];
  if (!data) return null;

  return (
    <div className="tech-info-panel active">
      <div className="tech-info-header">
        <div className="tech-info-title">{data.title}</div>
        <div className="tech-info-close" onClick={onClose}>✕</div>
      </div>
      <div className="tech-info-description">
        <p>{data.description}</p>
      </div>
      
      <div className="tech-applications">
        <h3>Applications concrètes</h3>
        <div className="applications-grid">
          {data.applications.map((app, i) => (
            <div key={i} className="application-item">
              <div className="app-icon">•</div>
              <div>{app}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="tech-module-link">
        <h3>En lien avec le cours :</h3>
        <p>{data.module}</p>
        <button className="btn module-btn" onClick={() => goToModule(data.module)}>
          Explorer ce module
        </button>
      </div>
    </div>
  );
};

// Composant Perspectives avec intégration au cours
const PerspectivesSection = ({ onModuleSelect }) => {
  const [selectedTech, setSelectedTech] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const containerRef = useRef();
  
  const handleTechSelected = useCallback((techName, moduleLink) => {
    setSelectedTech(techName);
    setActiveModule(moduleLink);
  }, []);
  
  const handleClosePanel = useCallback(() => {
    setSelectedTech(null);
    setTimeout(() => {
      setActiveModule(null);
    }, 300);
  }, []);
  
  const handleGoToModule = useCallback((moduleName) => {
    handleClosePanel();
    if (moduleName) {
      // On simule le défilement vers le module
      const moduleElement = document.querySelector(moduleName);
      if (moduleElement) {
        window.scrollTo({
          top: moduleElement.offsetTop - 100,
          behavior: 'smooth'
        });
        onModuleSelect(moduleName);
      }
    }
  }, [handleClosePanel, onModuleSelect]);

  useEffect(() => {
    // Animation d'introduction de la section
    gsap.fromTo('.perspectives-title', 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 }
    );
    
    gsap.fromTo('.perspectives-subtitle', 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.4 }
    );
    
    // Animation du conteneur 3D
    gsap.fromTo('.tech-universe-container', 
      { opacity: 0, scale: 0.95 }, 
      { opacity: 1, scale: 1, duration: 1, ease: "power3.out", delay: 0.6 }
    );
    
    return () => {
      gsap.killTweensOf('.perspectives-title');
      gsap.killTweensOf('.perspectives-subtitle');
      gsap.killTweensOf('.tech-universe-container');
    };
  }, []);

  return (
    <section id="perspectives" className="perspectives-section">
      <div className="container">
        <h2 className="section-title perspectives-title">Perspectives <span>Futures</span></h2>
        <p className="section-subtitle perspectives-subtitle">
          Découvrez comment les ondes radio façonnent notre monde connecté et les technologies de demain
        </p>
        
        <div className="intro-content">
          <p className="intro-text">
            Dans ce cours, nous explorerons non seulement les fondamentaux de la radiofréquence, 
            mais aussi ses applications les plus avancées et ses perspectives futures. Chaque technologie 
            illustrée dans l'univers 3D ci-dessous représente un domaine d'application qui sera étudié 
            en détail dans les modules correspondants.
          </p>
          <p className="intro-text">
            Cliquez sur l'un des objets pour découvrir comment les principes radio sont appliqués dans 
            ce domaine, et comment ils vous seront utiles dans votre parcours d'apprentissage.
          </p>
        </div>
        
        <div className="tech-universe-container">
          <Canvas
            camera={{ position: [0, 0, 12], fov: 60 }}
            style={{ background: 'transparent' }}
            gl={{ antialias: true, alpha: true }}
          >
            <TechUniverse 
              onTechSelected={handleTechSelected} 
              selectedTech={selectedTech}
            />
            <OrbitControls
              enableZoom={true}
              enablePan={true}
              enableRotate={true}
              minDistance={8}
              maxDistance={30}
              autoRotate={true}
              autoRotateSpeed={0.5}
            />
          </Canvas>
          
          <TechInfoPanel 
            selectedTech={selectedTech} 
            onClose={handleClosePanel}
            goToModule={handleGoToModule}
          />
        </div>
        
        <div className="course-integration">
          <h3 className="integration-title">Intégration au programme du cours</h3>
          <p className="integration-text">
            Chaque technologie présentée dans l'univers 3D correspond à un module spécifique du cours. 
            En explorant ces technologies, vous comprendrez mieux le contexte pratique et les applications 
            concrètes des concepts théoriques abordés dans chaque module.
          </p>
          
          <div className="modules-preview">
            <div className="module-preview-card">
              <div className="module-preview-icon">📡</div>
              <h4>Module 3 & 7</h4>
              <p>Propagation des ondes et communications spatiales</p>
            </div>
            <div className="module-preview-card">
              <div className="module-preview-icon">🧠</div>
              <h4>Module 5</h4>
              <p>Traitement du signal et intelligence artificielle</p>
            </div>
            <div className="module-preview-card">
              <div className="module-preview-icon">🌱</div>
              <h4>Module 8</h4>
              <p>Éco-conception des systèmes radio</p>
            </div>
            <div className="module-preview-card">
              <div className="module-preview-icon">🕶️</div>
              <h4>Module 6</h4>
              <p>Applications immersives et métavers</p>
            </div>
          </div>
          
          <div className="cta-container">
            <a href="#modules" className="btn btn-primary cta-button">
              Découvrir tous les modules du cours
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// ========== Composant principal ==========
function App() {
  const [selectedModule, setSelectedModule] = useState(null);
  const containerRef = useRef();

  useEffect(() => {
    // Nettoyage des ScrollTriggers précédents
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  useEffect(() => {
    // Ajout d'un délai pour s'assurer que le DOM est complètement chargé
    const timer = setTimeout(() => {
      // Animations GSAP
      if (document.querySelector('.hero h1')) {
        gsap.fromTo('.hero h1', 
          { opacity: 0, y: 60 }, 
          { opacity: 1, y: 0, duration: 1.4, ease: "power3.out", delay: 0.2 }
        );
      }
      
      if (document.querySelector('.hero-subtitle')) {
        gsap.fromTo('.hero-subtitle', 
          { opacity: 0, y: 30 }, 
          { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.5 }
        );
      }
      
      // Animations pour les titres de section
      gsap.utils.toArray('.section-title, .section-subtitle').forEach((el) => {
        gsap.fromTo(
          el, 
          { opacity: 0, y: 50 }, 
          { 
            opacity: 1, 
            y: 0, 
            duration: 1, 
            ease: "power3.out",
            scrollTrigger: { 
              trigger: el, 
              start: "top 90%",
              toggleActions: "play none none none"
            }
          }
        );
      });
      
      // Animations pour les cartes de modules
      gsap.utils.toArray('.module-card').forEach((card, i) => {
        gsap.fromTo(
          card, 
          { opacity: 0, y: 60, scale: 0.95 }, 
          { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 1, 
            ease: "power3.out",
            delay: i * 0.05,
            scrollTrigger: { 
              trigger: card, 
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleModuleSelect = useCallback((moduleName) => {
    setSelectedModule(moduleName);
  }, []);

  return (
    <div className="App" ref={containerRef}>
      {/* Hero */}
      <section id="hero" className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Initiation à la Radiofréquence</h1>
            <div className="hero-subtitle">Découvrez le monde invisible des ondes</div>
            <p>Des ondes radio aux communications 5G, explorez le spectre électromagnétique qui relie notre monde.</p>
            <div className="hero-btns">
              <a href="#modules" className="btn btn-primary">
                Découvrir les modules
              </a>
              <a href="#contact" className="btn btn-secondary">
                Planifier un atelier
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="modules-section">
        <div className="container">
          <h2 className="section-title">Programme <span>Détailé</span></h2>
          <p className="section-subtitle">9 modules progressifs pour maîtriser les fondamentaux</p>
          <div className="modules-grid">
            {[0,1,2,3,4,5,6,7,8].map(i => (
              <div key={i} id={`module-${i}`} className="module-card">
                <div className="module-icon">📚</div>
                <h3>Module {i+1}</h3>
                <p>Description détaillée du module {i+1} avec ses objectifs pédagogiques et contenus.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perspectives Futures */}
      <PerspectivesSection onModuleSelect={handleModuleSelect} />

      {/* Contact */}
      <section id="contact">
        <div className="container">
          <h2 className="section-title">Me <span>Contacter</span></h2>
          <p className="section-subtitle">Prêt à amener la radio dans votre établissement ?</p>
          <div className="contact-grid">
            <div className="contact-info">
              <h3>Coordonnées Professionnelles</h3>
              <div className="contact-item">
                <div className="contact-icon">✉️</div>
                <div>
                  <h4>Email</h4>
                  <p>contact@radioecole.fr</p>
                </div>
              </div>
            </div>
            <div className="contact-form">
              <form>
                <input type="text" placeholder="Nom complet *" required />
                <input type="email" placeholder="Email professionnel *" required />
                <textarea placeholder="Votre projet..."></textarea>
                <button type="submit" className="submit-btn">Envoyer ma demande</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <p>© 2025 Initiation à la Radiofréquence - Tous droits réservés</p>
          <div className="copyright">Conçu avec passion pour l'éducation scientifique</div>
        </div>
      </footer>
    </div>
  );
}

export default App;