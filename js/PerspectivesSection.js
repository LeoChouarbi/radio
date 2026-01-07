import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Environment, OrbitControls } from '@react-three/drei';
import { gsap } from 'gsap';

// Composant pour les icônes 3D interactives
const TechIcon = ({ position, name, color, onHover, onClick, isSelected }) => {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const [scale, setScale] = useState(1);
  
  // Animation de base
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.005;
      ref.current.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
      
      if (isSelected) {
        const pulseScale = 1 + Math.sin(Date.now() * 0.005) * 0.1;
        ref.current.scale.set(pulseScale, pulseScale, pulseScale);
      }
    }
  });
  
  const handlePointerOver = () => {
    setHovered(true);
    setScale(1.2);
    onHover(name);
  };
  
  const handlePointerOut = () => {
    setHovered(false);
    setScale(1);
    onHover(null);
  };
  
  const handleClick = () => {
    onClick(name);
  };
  
  let icon;
  switch(name) {
    case '5g':
      icon = (
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
      icon = (
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
      icon = (
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
      icon = (
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
      icon = (
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
      icon = (
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
      icon = (
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
      ref={ref} 
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      scale={scale}
    >
      {icon}
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
};

// Panneau d'information
const TechPanel = ({ selectedTech, onClose }) => {
  if (!selectedTech) return null;
  
  const techData = {
    '5g': {
      title: '5G & 6G',
      description: 'Les réseaux 5G et 6G représentent l\'évolution des communications mobiles, avec des débits plus élevés, une latence quasi nulle et une connectivité massive pour l\'IoT. Ces technologies utilisent des fréquences plus élevées et des techniques avancées comme le beamforming pour optimiser la transmission des ondes radio.',
      modules: [
        { id: 'module-3', title: 'Module 3: Propagation des ondes en environnements complexes' },
        { id: 'module-5', title: 'Module 5: Traitement numérique du signal et intelligence artificielle' }
      ]
    },
    'satellites': {
      title: 'Satellites',
      description: 'Les satellites de communication, comme Starlink, utilisent des constellations pour fournir un accès internet global et résilient. La communication avec ces satellites implique des techniques radio avancées pour surmonter l\'atténuation du signal et les délais de propagation dans l\'espace.',
      modules: [
        { id: 'module-7', title: 'Module 7: Communications spatiales et systèmes satellitaires' },
        { id: 'module-3', title: 'Module 3: Propagation des ondes en environnements complexes' }
      ]
    },
    'ia': {
      title: 'IA & Radio',
      description: 'L\'intelligence artificielle optimise les réseaux sans fil en temps réel, améliore le traitement du signal et permet des systèmes de communication adaptatifs. Les algorithmes d\'apprentissage automatique analysent les caractéristiques du signal radio pour optimiser la transmission et détecter les interférences.',
      modules: [
        { id: 'module-5', title: 'Module 5: Traitement numérique du signal et intelligence artificielle' },
        { id: 'module-8', title: 'Module 8: Éco-conception des systèmes radio et développement durable' }
      ]
    },
    'eco': {
      title: 'Éco-conception',
      description: 'Les nouveaux systèmes de communication intègrent des principes d\'éco-conception pour réduire l\'empreinte carbone des réseaux sans fil. Cela inclut l\'optimisation énergétique des émetteurs-récepteurs et l\'utilisation de matériaux durables dans la fabrication des équipements radio.',
      modules: [
        { id: 'module-8', title: 'Module 8: Éco-conception des systèmes radio et développement durable' },
        { id: 'module-2', title: 'Module 2: Économie d\'énergie dans les systèmes radio' }
      ]
    },
    'xr': {
      title: 'XR & Métavers',
      description: 'La réalité augmentée et le métavers nécessitent des débits extrêmement élevés et une latence quasi nulle, rendus possibles par les réseaux 5G/6G. Les signaux radio sont utilisés pour localiser précisément les utilisateurs dans l\'espace et synchroniser les expériences immersives en temps réel.',
      modules: [
        { id: 'module-6', title: 'Module 6: Applications immersives et réseaux de nouvelle génération' },
        { id: 'module-3', title: 'Module 3: Propagation des ondes en environnements complexes' }
      ]
    },
    'vehicules': {
      title: 'Véhicules Connectés',
      description: 'Les véhicules autonomes utilisent des réseaux V2X (Vehicle-to-Everything) pour communiquer entre eux et avec l\'infrastructure. Ces communications radio permettent le partage d\'informations sur l\'environnement, la coordination des mouvements et l\'optimisation des flux de trafic.',
      modules: [
        { id: 'module-4', title: 'Module 4: Communications véhicule-à-véhicule et systèmes intelligents' },
        { id: 'module-3', title: 'Module 3: Propagation des ondes en environnements complexes' }
      ]
    }
  };
  
  const data = techData[selectedTech];
  if (!data) return null;

  return (
    <div className="tech-panel active">
      <div className="tech-panel-header">
        <h2>{data.title}</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      
      <div className="tech-panel-content">
        <p className="tech-description">{data.description}</p>
        
        <div className="module-connections">
          <h3>Liens avec le cours</h3>
          <ul className="module-list">
            {data.modules.map((module, index) => (
              <li key={index} className="module-item">
                <span className="module-id">{module.id}</span>
                <span className="module-title">{module.title}</span>
                <button 
                  className="explore-btn" 
                  onClick={() => {
                    const element = document.getElementById(module.id);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                    onClose();
                  }}
                >
                  Explorer
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="tech-visual">
          <div className="visual-container">
            <div className="signal-wave"></div>
            <div className="signal-wave delay-1"></div>
            <div className="signal-wave delay-2"></div>
          </div>
          <p>Visualisation des signaux radio en temps réel</p>
        </div>
      </div>
    </div>
  );
};

// Section complète
const PerspectivesSection = ({ onModuleSelect }) => {
  const [selectedTech, setSelectedTech] = useState(null);
  const [hoveredTech, setHoveredTech] = useState(null);
  const containerRef = useRef();
  
  // Position des éléments dans l'espace 3D
  const techPositions = [
    [-2.5, 0.8, 1.5],
    [2, -1, 0.8],
    [0.5, 2, -2],
    [-1.5, -1.2, 2.5],
    [2.5, 1, -1],
    [-2, -2, 2]
  ];
  
  const technologies = [
    { name: '5g', color: '#00f3ff', icon: '📡' },
    { name: 'satellites', color: '#ff2ec4', icon: '🛰️' },
    { name: 'ia', color: '#6a5af9', icon: '🧠' },
    { name: 'eco', color: '#00ff00', icon: '🌱' },
    { name: 'xr', color: '#ffa500', icon: '🕶️' },
    { name: 'vehicules', color: '#ff0000', icon: '🚗' }
  ];

  // Animation d'introduction
  useEffect(() => {
    gsap.fromTo('.perspectives-title', 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 }
    );
    
    gsap.fromTo('.perspectives-subtitle', 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.4 }
    );
    
    gsap.fromTo('.tech-container', 
      { opacity: 0, scale: 0.95 }, 
      { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out", delay: 0.6 }
    );
    
    // Animation des modules
    const moduleCards = document.querySelectorAll('.module-card');
    if (moduleCards.length > 0) {
      gsap.from(moduleCards, {
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.8
      });
    }
  }, []);

  const handleTechSelect = (techName) => {
    setSelectedTech(techName);
    onModuleSelect(techName);
  };
  
  const handleTechHover = (techName) => {
    setHoveredTech(techName);
  };

  return (
    <section id="perspectives" className="perspectives-section">
      <div className="container">
        <h2 className="section-title perspectives-title">Perspectives <span>Futures</span></h2>
        <p className="section-subtitle perspectives-subtitle">
          Découvrez comment les technologies radio façonnent notre monde connecté
        </p>
        
        <div className="intro-content">
          <p className="intro-text">
            Cette section présente les technologies émergentes qui reposent sur les principes de la radiofréquence. 
            Chaque élément interactif vous permet de découvrir comment ces technologies sont abordées dans notre programme de formation.
          </p>
        </div>
        
        <div className="tech-container">
          <div className="tech-3d-container">
            <Canvas 
              camera={{ position: [0, 0, 12], fov: 60 }}
              style={{ background: 'transparent' }}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <group position={[0, 0, 0]}>
                {technologies.map((tech, index) => (
                  <TechIcon
                    key={tech.name}
                    position={techPositions[index]}
                    name={tech.name}
                    color={tech.color}
                    onHover={handleTechHover}
                    onClick={handleTechSelect}
                    isSelected={selectedTech === tech.name}
                  />
                ))}
              </group>
              <Environment preset="city" />
              <OrbitControls 
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                minDistance={8}
                maxDistance={25}
                autoRotate={true}
                autoRotateSpeed={0.5}
              />
            </Canvas>
          </div>
          
          <TechPanel 
            selectedTech={selectedTech} 
            onClose={() => setSelectedTech(null)} 
          />
          
          <div className="tech-list">
            <h3>Techologies clés</h3>
            <ul className="tech-list-items">
              {technologies.map((tech) => (
                <li 
                  key={tech.name} 
                  className={`tech-item ${selectedTech === tech.name ? 'selected' : ''} ${hoveredTech === tech.name ? 'hovered' : ''}`}
                  onClick={() => handleTechSelect(tech.name)}
                >
                  <span className="tech-icon">{tech.icon}</span>
                  <span className="tech-name">{tech.name.toUpperCase()}</span>
                  <span className="tech-indicator"></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="course-integration">
          <h3>Intégration avec le programme</h3>
          <p>
            Chaque technologie présentée ci-dessus est directement liée à des modules spécifiques de notre cours. 
            En explorant ces technologies, vous comprendrez mieux le contexte pratique et les applications concrètes 
            des concepts théoriques abordés dans chaque module.
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
            <a href="#modules" className="btn btn-primary">
              Explorer le programme complet
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerspectivesSection;