import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Environment } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { useGSAP } from '@gsap/react';

// Enregistrement des plugins GSAP
gsap.registerPlugin(ScrollTrigger);

// ========== Composants 3D Simples ==========
const WaveVisualizer = React.memo(({ position = [0, 0, 0] }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.1;
      meshRef.current.position.y = Math.sin(t * 2) * 0.1;
    }
  });

  return (
    <group position={position} ref={meshRef}>
      <mesh>
        <torusGeometry args={[1, 0.2, 16, 64]} />
        <meshPhongMaterial 
          color="#00f3ff" 
          transparent 
          opacity={0.8} 
          emissive="#00aaff" 
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Ondes concentriques */}
      {[0.5, 1.2, 2].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius, radius + 0.05, 64]} />
          <meshBasicMaterial color="#00f3ff" transparent opacity={0.3 - i * 0.1} side={THREE.DoubleSide} />
        </mesh>
      ))}
      
      <Html distanceFactor={10}>
        <div className="wave-label">
          <span>Propagation des ondes</span>
        </div>
      </Html>
    </group>
  );
});

// ========== Section Commerciale ==========

const HeroSection = () => {
  return (
    <section id="hero" className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-badge">FORMATION CERTIFIANTE</div>
          <h1>Découvrez le <span className="highlight">Pouvoir Invisible</span> des Ondes Radio</h1>
          <div className="hero-subtitle">Formation professionnelle complète • 45 heures • 100% en ligne</div>
          <p className="hero-description">
            Maîtrisez les fondamentaux de la radiofréquence pour innover dans les télécoms, 
            l'IoT, la santé et l'industrie 4.0. Approche pratique avec simulateurs et études de cas réels.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Taux de satisfaction</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">150+</div>
              <div className="stat-label">Étudiants formés</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">45h</div>
              <div className="stat-label">Contenu expert</div>
            </div>
          </div>
          <div className="hero-btns">
            <a href="#programme" className="btn btn-primary">
              Découvrir le programme →
            </a>
            <a href="#contact" className="btn btn-secondary">
              Réserver une démo gratuite
            </a>
          </div>
          <div className="trust-badges">
            <span>✅ Accès à vie aux mises à jour</span>
            <span>✅ Certificat reconnu par les professionnels</span>
            <span>✅ Support technique 7j/7</span>
          </div>
        </div>
        
        {/* Visualisation 3D simplifiée */}
        <div className="hero-visual">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            style={{ height: '100%' }}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={1} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <WaveVisualizer position={[0, 0, 0]} />
          </Canvas>
        </div>
      </div>
    </section>
  );
};

const DemoSection = () => {
  return (
    <section id="demo" className="demo-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Découvrez notre <span className="highlight">Approche Unique</span></h2>
          <p className="section-subtitle">Des concepts complexes rendus accessibles grâce à des outils pédagogiques innovants</p>
        </div>
        
        <div className="demo-grid">
          <div className="demo-card">
            <div className="demo-icon">🖥️</div>
            <h3>Simulateur d'Ondes en Temps Réel</h3>
            <p>Visualisez la propagation des ondes à travers différents matériaux et environnements avec notre simulateur exclusif.</p>
            <div className="demo-image">
              <img 
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600" 
                alt="Simulateur d'ondes radio montrant la propagation à travers des matériaux"
                loading="lazy"
              />
              <div className="image-overlay">
                <span>Voir la démo interactive</span>
                <button className="play-btn">▶</button>
              </div>
            </div>
          </div>
          
          <div className="demo-card">
            <div className="demo-icon">🤝</div>
            <h3>Ateliers Interactifs</h3>
            <p>Participez à des sessions en direct avec des experts du CNRS et de l'industrie pour des échanges concrets et personnalisés.</p>
            <div className="demo-image">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600" 
                alt="Atelier interactif avec étudiants et professeur sur la radiofréquence"
                loading="lazy"
              />
              <div className="image-overlay">
                <span>Prochain atelier : 15 juin</span>
              </div>
            </div>
          </div>
          
          <div className="demo-card">
            <div className="demo-icon">🌐</div>
            <h3>Interdisciplinarité</h3>
            <p>Découvrez les applications concrètes en médecine (IRM), astronomie (télescopes radio), IoT et communications spatiales.</p>
            <div className="demo-image">
              <img 
                src="https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&w=600" 
                alt="Applications interdisciplinaires des ondes radio dans différents domaines"
                loading="lazy"
              />
              <div className="image-overlay">
                <span>Cas pratiques inclus</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MaterialsSection = () => {
  const materials = [
    {
      name: "Métaux conducteurs",
      description: "Comportement des ondes à l'interface cuivre/air • Applications dans les antennes",
      image: "https://images.unsplash.com/photo-1605733513597-8bb4b2a28a9a?auto=format&fit=crop&w=400"
    },
    {
      name: "Matériaux diélectriques",
      description: "Propagation dans les plastiques et céramiques • Conception de circuits imprimés RF",
      image: "https://images.unsplash.com/photo-1551288366-2bfe1e2e2d7c?auto=format&fit=crop&w=400"
    },
    {
      name: "Milieux biologiques",
      description: "Interactions ondes/tissus • Applications médicales et sécurité des communications",
      image: "https://images.unsplash.com/photo-1579684385127-99220792f747?auto=format&fit=crop&w=400"
    },
    {
      name: "Matériaux composites",
      description: "Comportement dans les structures aéronautiques et spatiales • Blindage électromagnétique",
      image: "https://images.unsplash.com/photo-1581093469833-b65b28d9a1c8?auto=format&fit=crop&w=400"
    }
  ];

  return (
    <section id="materials" className="materials-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Maîtrisez les <span className="highlight">Matériaux & Ondes</span></h2>
          <p className="section-subtitle">Comprenez comment chaque matériau transforme la propagation des ondes radio</p>
          <div className="section-intro">
            <p>Notre formation unique combine théorie fondamentale et applications pratiques pour vous donner une expertise opérationnelle. Chaque module inclut des études de cas concrets et des projets tutorés.</p>
          </div>
        </div>
        
        <div className="materials-grid">
          {materials.map((material, index) => (
            <div key={index} className="material-card">
              <div className="material-image">
                <img 
                  src={material.image} 
                  alt={`Comportement des ondes radio dans les ${material.name}`}
                  loading="lazy"
                />
                <div className="material-overlay">
                  <span>{material.name}</span>
                </div>
              </div>
              <div className="material-content">
                <h3>{material.name}</h3>
                <p>{material.description}</p>
                <div className="material-applications">
                  <span>Applications :</span>
                  <div className="applications-tags">
                    <span className="tag">Antennes</span>
                    <span className="tag">Capteurs</span>
                    <span className="tag">Sécurité</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="cta-container">
          <div className="cta-content">
            <h3>Prêt à devenir expert en radiofréquence ?</h3>
            <p>Rejoignez notre prochaine session et bénéficiez de -15% avec le code <strong>RADIO15</strong></p>
            <a href="#contact" className="btn btn-primary cta-button">S'inscrire maintenant</a>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProgramSection = () => {
  const modules = [
    {
      title: "Fondamentaux des ondes électromagnétiques",
      duration: "5h",
      topics: ["Nature des ondes", "Équations de Maxwell", "Spectre radio"]
    },
    {
      title: "Propagation dans différents milieux",
      duration: "6h",
      topics: ["Milieux conducteurs", "Milieux diélectriques", "Effets de surface"]
    },
    {
      title: "Antennes et systèmes d'émission",
      duration: "8h",
      topics: ["Types d'antennes", "Gain et directivité", "Réseaux d'antennes"]
    },
    {
      title: "Traitement du signal radio",
      duration: "7h",
      topics: ["Modulation", "Démodulation", "Filtrage numérique"]
    },
    {
      title: "Applications médicales",
      duration: "4h",
      topics: ["IRM", "Hyperthermie", "Télémedecine"]
    },
    {
      title: "Communications spatiales",
      duration: "5h",
      topics: ["Satellites", "Deep space network", "Propagation ionosphérique"]
    },
    {
      title: "Sécurité des systèmes RF",
      duration: "6h",
      topics: ["Brouillage", "Cryptage", "Détection d'intrusion"]
    },
    {
      title: "Projets pratiques",
      duration: "4h",
      topics: ["Conception d'antenne", "Analyse de spectre", "Simulation RF"]
    }
  ];

  return (
    <section id="programme" className="program-section">
      <div className="container">
        <div className="section-header centered">
          <h2 className="section-title">Programme <span className="highlight">Détaillé</span></h2>
          <p className="section-subtitle">Une progression pédagogique sur 8 modules complets</p>
        </div>
        
        <div className="modules-container">
          <div className="modules-grid centered">
            {modules.map((module, index) => (
              <div key={index} className="module-card" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="module-header">
                  <div className="module-number">Module {index + 1}</div>
                  <div className="module-duration">{module.duration}</div>
                </div>
                <h3>{module.title}</h3>
                <div className="module-topics">
                  {module.topics.map((topic, i) => (
                    <div key={i} className="topic-item">
                      <div className="topic-icon">•</div>
                      <div>{topic}</div>
                    </div>
                  ))}
                </div>
                <div className="module-projects">
                  <span className="project-icon">🚀</span>
                  <span>Projet pratique inclus</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="program-benefits">
          <div className="benefit-card">
            <div className="benefit-icon">🎓</div>
            <h4>Certification professionnelle</h4>
            <p>Délivrée par notre centre de formation accrédité</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">💡</div>
            <h4>Ressources exclusives</h4>
            <p>Accès à vie aux mises à jour et simulateurs</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">👥</div>
            <h4>Communauté d'experts</h4>
            <p>Échanges privilégiés avec des professionnels du secteur</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Marie Lefevre",
      role: "Ingénieure RF chez Thales",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
      quote: "Cette formation m'a permis de comprendre les subtilités de la propagation dans les matériaux composites, essentielles pour mes projets satellites."
    },
    {
      name: "Thomas Bernard",
      role: "Chef de projet IoT",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      quote: "Les simulateurs interactifs sont exceptionnels. J'ai pu appliquer immédiatement les concepts à la conception de nos capteurs industriels."
    },
    {
      name: "Dr. Sophie Martin",
      role: "Chercheuse en biophysique",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      quote: "L'approche interdisciplinaire m'a ouvert des perspectives inédites pour mes recherches sur les interactions ondes/tissus biologiques."
    }
  ];

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="container">
        <div className="section-header centered">
          <h2 className="section-title">Ils ont <span className="highlight">Réussi</span> avec Nous</h2>
          <p className="section-subtitle">Retours d'expérience de professionnels formés</p>
        </div>
        
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-header">
                <img 
                  src={testimonial.image} 
                  alt={`${testimonial.name}, ${testimonial.role}`}
                  className="testimonial-image"
                  loading="lazy"
                />
                <div className="testimonial-info">
                  <h4>{testimonial.name}</h4>
                  <div className="testimonial-role">{testimonial.role}</div>
                </div>
              </div>
              <div className="testimonial-content">
                <div className="quote-icon">"</div>
                <p>{testimonial.quote}</p>
              </div>
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="star">★</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="cta-center">
          <h3>Vous aussi, transformez votre carrière !</h3>
          <p>Places limitées pour la prochaine session - Inscription ouverte jusqu'au 30 juin</p>
          <a href="#contact" className="btn btn-primary">Réserver ma place</a>
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState({ success: false, message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Réinitialisation
    e.target.reset();
    setFormStatus({ 
      success: true, 
      message: 'Merci ! Nous vous contacterons sous 24h pour finaliser votre inscription.' 
    });
    
    // Réinitialisation du message
    setTimeout(() => {
      setFormStatus({ success: false, message: '' });
    }, 5000);
    
    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="section-header centered">
          <h2 className="section-title">Prêt à <span className="highlight">Commencer</span> ?</h2>
          <p className="section-subtitle">Réservez votre place ou demandez une démo personnalisée</p>
        </div>
        
        <div className="contact-container">
          <div className="contact-info">
            <div className="contact-method">
              <div className="contact-icon">📧</div>
              <div>
                <h4>Email</h4>
                <a href="mailto:formation@radio-ecole.fr">formation@radio-ecole.fr</a>
              </div>
            </div>
            <div className="contact-method">
              <div className="contact-icon">📞</div>
              <div>
                <h4>Téléphone</h4>
                <a href="tel:+33184257390">01 84 25 73 90</a>
                <div className="contact-hours">Du lundi au vendredi • 9h-18h</div>
              </div>
            </div>
            <div className="contact-method">
              <div className="contact-icon">🏢</div>
              <div>
                <h4>Siège</h4>
                <p>15 Rue des Innovateurs 75013 Paris</p>
              </div>
            </div>
          </div>
          
          <div className="contact-form-container">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <input type="text" placeholder="Nom *" required />
                <input type="email" placeholder="Email professionnel *" required />
              </div>
              <div className="form-row">
                <select required>
                  <option value="">Sélectionnez votre profil</option>
                  <option>Étudiant</option>
                  <option>Ingénieur</option>
                  <option>Chercheur</option>
                  <option>Entreprise</option>
                </select>
              </div>
              <textarea 
                placeholder="Décrivez votre projet ou vos questions..." 
                rows="4"
                required
              ></textarea>
              <div className="form-checkbox">
                <input type="checkbox" id="agree" required />
                <label htmlFor="agree">
                  J'accepte les <a href="/cgu">conditions générales</a> et la <a href="/politique">politique de confidentialité</a>
                </label>
              </div>
              {formStatus.message && (
                <div className={`form-status ${formStatus.success ? 'success' : 'error'}`}>
                  {formStatus.message}
                </div>
              )}
              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Réserver ma place'}
              </button>
            </form>
            <div className="form-guarantee">
              🔒 Vos données sont protégées et ne seront jamais partagées à des tiers
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ========== Composant principal ==========
function App() {
  const containerRef = useRef();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|iPhone|iPad/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Nettoyage des ScrollTriggers
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Animations GSAP principales
  useGSAP(() => {
    if (!containerRef.current) return;
    
    // Animation des sections
    gsap.utils.toArray('.section-title').forEach(title => {
      gsap.from(title, {
        scrollTrigger: {
          trigger: title,
          start: 'top 90%'
        },
        y: 30,
        opacity: 0,
        duration: 0.8
      });
    });
    
    // Animation des cartes
    gsap.utils.toArray('.module-card, .material-card, .testimonial-card, .demo-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 95%'
        },
        y: 40,
        opacity: 0,
        duration: 0.7,
        delay: i * 0.1
      });
    });
  }, { scope: containerRef });

  return (
    <div className="App commercial-page" ref={containerRef}>
      <HeroSection />
      <DemoSection />
      <MaterialsSection />
      <ProgramSection />
      <TestimonialsSection />
      <ContactSection />
      
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h4>Radio École</h4>
              <p>Formation professionnelle en radiofréquence depuis 2010</p>
              <div className="social-links">
                <a href="#linkedin">🔗</a>
                <a href="#twitter">🐦</a>
                <a href="#youtube">▶</a>
              </div>
            </div>
            <div className="footer-col">
              <h4>Liens utiles</h4>
              <ul>
                <li><a href="#programme">Programme détaillé</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="/tarifs">Tarifs & financement</a></li>
                <li><a href="/faq">FAQ</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Certifications</h4>
              <div className="certifications">
                <span>RNCP niveau 7</span>
                <span>Qualiopi</span>
                <span>Partenaire CNRS</span>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Radio École - Tous droits réservés</p>
            <div className="legal-links">
              <a href="/cgu">CGU</a> • <a href="/politique">Politique de confidentialité</a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Floating CTA button */}
      <div className="floating-cta">
        <a href="#contact" className="btn btn-primary">Réserver une démo</a>
      </div>
    </div>
  );
}

export default App;