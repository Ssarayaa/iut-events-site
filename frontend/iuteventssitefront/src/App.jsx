import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import EventDetail from './pages/EventDetail';
import AdminDashboard from './pages/AdminDashboard';
import LandingPage from './pages/LandingPage';
import { UserPlus, LogIn } from 'lucide-react';

// ─── Helpers persistance session ───────────────────────────────────────────
// On stocke l'utilisateur en sessionStorage pour qu'un refresh de page ne
// déconnecte pas l'utilisateur. sessionStorage est effacé automatiquement
// à la fermeture de l'onglet, ce qui reste sécurisé.
const SESSION_KEY = 'iut_mmi_user';

const saveSession = (user) => {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(user)); } catch (_) { }
};
const clearSession = () => {
  try { sessionStorage.removeItem(SESSION_KEY); } catch (_) { }
};
const loadSession = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
};

// ─── Normalisation du rôle ─────────────────────────────────────────────────
// REFERENT est traité exactement comme ENSEIGNANT partout dans l'app.
// On normalise dès la réception du back-end pour n'avoir que 3 rôles :
// ETUDIANT | ENSEIGNANT | ADMIN
const normalizeRole = (role) => {
  if (!role) return '';
  const r = role.toUpperCase().trim();
  if (r === 'REFERENT' || r === 'ROLE_ENSEIGNANT' || r === 'ENSEIGNANT') return 'ENSEIGNANT';
  if (r === 'ADMIN' || r === 'ROLE_ADMIN') return 'ADMIN';
  return 'ETUDIANT';
};

function App() {
  // ─── State global ──────────────────────────────────────────────────────
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  // Chargement de la session dès l'init — pas de re-login au refresh
  const [user, setUser] = useState(() => loadSession());
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const [selectedEventId, setSelectedEventId] = useState(null);

  // États Auth
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [role, setRole] = useState('ETUDIANT');

  const [userParticipations, setUserParticipations] = useState(new Set());

  // ─── fetchEvents ────────────────────────────────────────────────────────
  const fetchEvents = () => {
    axios.get('http://localhost:8080/api/events')
      .then(res => {
        setEvents(res.data);
        setLoading(false);
        if (user) syncParticipations(res.data, user);
      })
      .catch(err => console.error('❌ Erreur chargement :', err));
  };

  const syncParticipations = (evList, u) => {
    const set = new Set();
    evList.forEach(ev => {
      ev.participations?.forEach(p => {
        if (p.user?.id === u.id) set.add(ev.id);
      });
    });
    setUserParticipations(set);
  };

  useEffect(() => { fetchEvents(); }, []);

  useEffect(() => {
    if (user && events.length > 0) syncParticipations(events, user);
    if (!user) setUserParticipations(new Set());
  }, [user, events]);

  // ─── Routing hash ──────────────────────────────────────────────────────
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
      if (window.location.hash.startsWith('#/event/')) {
        setSelectedEventId(parseInt(window.location.hash.replace('#/event/', ''), 10));
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (hash) => { window.location.hash = hash; };

  // ─── Auth ──────────────────────────────────────────────────────────────
  const handleLogout = () => {
    clearSession();
    setUser(null);
    setUserParticipations(new Set());
    setEmail(''); setPassword(''); setNom(''); setPrenom('');
    setRole('ETUDIANT'); setIsRegistering(false);
    navigateTo('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/users/login', { email, password })
      .then(res => {
        // On normalise le rôle avant de stocker l'utilisateur
        const normalizedUser = { ...res.data, role: normalizeRole(res.data.role) };
        setUser(normalizedUser);
        saveSession(normalizedUser);  // ← persistance session
        navigateTo('#/events');
      })
      .catch(() => alert('❌ Email ou mot de passe incorrect'));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/users/register', {
      nom, prenom, email, motDePasse: password,
      // On n'envoie jamais REFERENT au back — ENSEIGNANT suffit
      role: role === 'REFERENT' ? 'ENSEIGNANT' : role
    })
      .then(() => {
        alert('🎉 Compte créé ! Connectez-vous maintenant.');
        setIsRegistering(false);
        setNom(''); setPrenom(''); setRole('ETUDIANT'); setEmail(''); setPassword('');
      })
      .catch(() => alert("❌ Erreur lors de l'inscription"));
  };

  // ─── CRUD événements ────────────────────────────────────────────────────
  // Mise à jour optimiste : on met à jour le state local immédiatement,
  // sans attendre le prochain fetchEvents, pour éviter le "refresh pénible".

  const handleCreateEvent = (formData) => {
    const isMultipart = formData instanceof FormData;
    const req = isMultipart
      ? axios.post('http://localhost:8080/api/events', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      : axios.post('http://localhost:8080/api/events', {
        ...formData,
        heureDebut: formData.heureDebut?.length === 5 ? formData.heureDebut + ':00' : formData.heureDebut
      });

    req.then(res => {
      // Mise à jour optimiste : on ajoute l'événement créé directement dans le state
      const newEvent = { ...res.data, participations: res.data.participations ?? [] };
      setEvents(prev => [...prev, newEvent]);
      alert('🚀 Événement publié !');
    }).catch(err => console.error(err));
  };

  const handleUpdateEvent = (id, formData) => {
    const isMultipart = formData instanceof FormData;
    const req = isMultipart
      ? axios.put(`http://localhost:8080/api/events/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      : axios.put(`http://localhost:8080/api/events/${id}`, {
        ...formData,
        heureDebut: formData.heureDebut?.length === 5 ? formData.heureDebut + ':00' : formData.heureDebut
      });

    req.then(res => {
      // Mise à jour optimiste : on remplace l'événement modifié dans le state
      setEvents(prev => prev.map(ev =>
        ev.id === id
          ? { ...res.data, participations: res.data.participations ?? ev.participations ?? [] }
          : ev
      ));
      alert('📝 Événement mis à jour !');
    }).catch(err => console.error(err));
  };

  const handleDeleteEvent = (id) => {
    if (!window.confirm('⚠️ Supprimer définitivement cet événement ?')) return;
    axios.delete(`http://localhost:8080/api/events/${id}`)
      .then(() => {
        // Mise à jour optimiste : on retire l'événement du state immédiatement
        setEvents(prev => prev.filter(ev => ev.id !== id));
        alert('🗑️ Supprimé.');
      })
      .catch(err => console.error(err));
  };

  // ─── Inscriptions ──────────────────────────────────────────────────────
  const handleInscription = (eventId) => {
    if (userParticipations.has(eventId)) {
      alert('⚠️ Vous êtes déjà inscrit à cet événement !');
      return;
    }
    axios.post('http://localhost:8080/api/participations/inscrire', { userId: user.id, eventId })
      .then(() => {
        alert('🎉 Inscription réussie !');
        fetchEvents();
      })
      .catch(err => {
        if (err.response?.status === 409) alert('⚠️ Vous êtes déjà inscrit à cet événement !');
        else alert("❌ Erreur lors de l'inscription");
      });
  };

  const handleDesinscription = (eventId) => {
    axios.delete(`http://localhost:8080/api/participations/desinscrire?userId=${user.id}&eventId=${eventId}`)
      .then(() => { alert('❌ Désinscription réussie.'); fetchEvents(); })
      .catch(err => console.error(err));
  };

  const isUserParticipating = (eventId) => userParticipations.has(eventId);

  // ─── Rôles (normalisés) ────────────────────────────────────────────────
  const userRole = user?.role ?? '';          // déjà normalisé à la connexion
  const isAdmin = userRole === 'ADMIN';
  const isEnseignant = userRole === 'ENSEIGNANT';

  // ─── Rendu page selon hash ─────────────────────────────────────────────
  let pageContent;

  if (!currentHash || currentHash === '#') {
    pageContent = <LandingPage onNavigate={navigateTo} />;
  }
  else if (currentHash === '#/login') {
    pageContent = (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '20px' }}>
        <div style={{ backgroundColor: '#fff', padding: 'clamp(24px, 5vw, 40px)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px', border: '1px solid var(--line)' }}>
          <h2 style={{ textAlign: 'center', color: 'var(--navy)', marginBottom: '25px' }}>
            {isRegistering ? '📝 Créer un compte' : '🔐 Connexion'}
          </h2>
          <form onSubmit={isRegistering ? handleRegister : handleLogin}>
            {isRegistering && (
              <>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  <input type="text" placeholder="Prénom" value={prenom} onChange={e => setPrenom(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--line)' }} />
                  <input type="text" placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--line)' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--slate)', fontWeight: '600' }}>Vous êtes :</label>
                  <select value={role} onChange={e => setRole(e.target.value)} required
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--line)', backgroundColor: '#fff', fontSize: '0.9rem', cursor: 'pointer' }}>
                    {/* Plus de REFERENT dans les choix — juste ETUDIANT et ENSEIGNANT */}
                    <option value="ETUDIANT">Étudiant</option>
                    <option value="ENSEIGNANT">Enseignant</option>
                  </select>
                </div>
              </>
            )}
            <input type="email" placeholder="Email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--line)', marginBottom: '15px' }} />
            <input type="password" placeholder="Mot de passe" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--line)', marginBottom: '20px' }} />
            <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: 'var(--navy)', color: '#fff', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
              {isRegistering ? <><UserPlus size={18} /> S'inscrire</> : <><LogIn size={18} /> Se connecter</>}
            </button>
          </form>
          <button onClick={() => { setIsRegistering(!isRegistering); setPassword(''); }}
            style={{ width: '100%', marginTop: '15px', background: 'none', border: 'none', color: 'var(--gold-deep)', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}>
            {isRegistering ? 'Déjà un compte ? Se connecter' : "Pas de compte ? S'inscrire"}
          </button>
        </div>
      </div>
    );
  }
  else if (currentHash === '#/admin' && (isAdmin || isEnseignant)) {
    pageContent = (
      <AdminDashboard
        events={events}
        user={user}
        onCreateEvent={handleCreateEvent}
        onUpdateEvent={handleUpdateEvent}
        onDeleteEvent={isAdmin ? handleDeleteEvent : null}
      />
    );
  }
  else if (currentHash.startsWith('#/event/')) {
    pageContent = (
      <EventDetail
        eventId={selectedEventId}
        events={events}
        user={user}
        onInscription={handleInscription}
        onDesinscription={handleDesinscription}
        onBack={() => navigateTo('#/events')}
        isUserParticipating={isUserParticipating}
      />
    );
  }
  else if (currentHash === '#/events') {
    pageContent = (
      <Home
        events={events}
        user={user}
        onInscription={handleInscription}
        onDesinscription={handleDesinscription}
        onSelectEvent={(id) => navigateTo(`#/event/${id}`)}
        isUserParticipating={isUserParticipating}
      />
    );
  }
  else {
    pageContent = <LandingPage onNavigate={navigateTo} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--paper)', width: '100%' }}>
      <Navbar user={user} onLogout={handleLogout} onNavigate={navigateTo} />
      <main style={{ flex: 1, width: '100%' }}>{pageContent}</main>
      <Footer />
    </div>
  );
}

export default App;
