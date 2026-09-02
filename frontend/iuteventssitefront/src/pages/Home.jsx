import React, { useState } from 'react';
import EventCard from '../components/EventCard';

// Page de liste : affiche les evenements avec recherche, filtre et cartes cliquables.
export default function Home({ events = [], user, onInscription, onDesinscription, onSelectEvent, isUserParticipating }) {
    // Etats locaux dedies aux filtres de cette page.
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tous');

    // Securite : on force un tableau vide si la prop events arrive sous un autre format.
    const validEvents = Array.isArray(events) ? events : [];

    console.log("🏠 Home - Nombre d'événements:", validEvents.length);
    console.log("🏠 Home - isUserParticipating fourni?", !!isUserParticipating);
    console.log("🏠 Home - user connecté:", user?.id, user?.prenom);

    // Filtrage des événements
    // La recherche regarde le titre, la description et le lieu, puis applique la categorie choisie.
    const filteredEvents = validEvents.filter(event => {
        if (!event) return false;
        const titre = event.titre ? event.titre.toLowerCase() : '';
        const description = event.description ? event.description.toLowerCase() : '';
        const lieu = event.lieu ? event.lieu.toLowerCase() : '';
        const recherche = searchTerm.toLowerCase();

        return (titre.includes(recherche) || description.includes(recherche) || lieu.includes(recherche)) &&
            (selectedCategory === 'Tous' || event.categorie === selectedCategory);
    });

    return (
        <div style={{ width: '100%', minHeight: '80vh', boxSizing: 'border-box', backgroundColor: 'var(--paper)', padding: '0 20px 60px 20px' }}>

            {/* BARRE DE RECHERCHE CENTRÉE */}
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 0 25px 0' }}>
                <div className="search-bar" style={{
                    backgroundColor: '#fff',
                    padding: '18px 30px',
                    borderRadius: '14px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '20px',
                    border: '1px solid var(--line)'
                }}>
                    <div>
                        <h2 style={{ margin: 0, color: 'var(--navy)', fontSize: '1.4rem', fontWeight: '700' }}>🔎 Trouver un événement</h2>
                    </div>
                    <div className="search-inputs" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--line)', width: '240px', fontSize: '0.9rem', outline: 'none' }}
                        />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--line)', backgroundColor: '#fff', fontSize: '0.9rem', cursor: 'pointer', outline: 'none' }}
                        >
                            <option value="Tous">Toutes catégories</option>
                            <option value="Conférence">Conférence</option>
                            <option value="Événement">Événement</option>
                            <option value="Séminaire">Séminaire</option>
                            <option value="Sortie">Sortie</option>
                            <option value="Autre">Autre</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* ZONE DES CARTES - Version originale bien espacée et centrée */}
            <main style={{ maxWidth: '1100px', margin: '0 auto' }}>
                {filteredEvents.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#fff', borderRadius: '12px', color: 'var(--slate)', border: '1px solid var(--line)' }}>
                        📢 Aucun événement trouvé.
                    </div>
                ) : (
                    <div className="events-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                        gap: '40px',
                        justifyContent: 'center',
                        alignItems: 'start'
                    }}>
                        {/* Chaque evenement filtre devient une carte autonome. */}
                        {filteredEvents.map(event => {
                            console.log(`🏠 Home - Rendu EventCard pour event ${event.id}`);
                            return (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    user={user}
                                    onInscription={onInscription}
                                    onDesinscription={onDesinscription}
                                    onSelect={onSelectEvent}
                                    isUserParticipating={isUserParticipating}
                                />
                            );
                        })}
                    </div>
                )}
            </main>

        </div>
    );
}
