import React from 'react';
import { Calendar, Clock, MapPin, Users, ArrowLeft, BookOpen, User as UserIcon, Wallet } from 'lucide-react';

// Page détail enrichie : même niveau d'information que EventCard
// + liste nominative des participants pour les enseignants/admins
export default function EventDetail({ eventId, events, user, onInscription, onDesinscription, onBack, isUserParticipating }) {

    const event = events.find(e => e.id === eventId);

    if (!event) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <h2>⚠️ Événement introuvable</h2>
                <button onClick={onBack} style={{ padding: '10px 20px', cursor: 'pointer' }}>Retour</button>
            </div>
        );
    }

    const currentUserId = user?.id;
    // Priorité à isUserParticipating (Set global, plus fiable qu'un scan)
    const dejaInscrit = isUserParticipating
        ? isUserParticipating(event.id)
        : event.participations?.some(p => p.user?.id === currentUserId);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
        } catch (e) { return dateStr; }
    };

    // Helpers réutilisés de EventCard
    const getCategoryColor = (cat) => {
        switch (cat) {
            case 'Conférence': return 'var(--gold-deep)';
            case 'Événement': return 'var(--gold)';
            case 'Séminaires':
            case 'Séminaire': return 'var(--navy-light)';
            case 'Sortie': return 'var(--wine)';
            default: return 'var(--slate)';
        }
    };

    const getEventImage = (titre, categorie, imageUrl) => {
        if (imageUrl) return `http://localhost:8080${imageUrl}`;
        const t = titre?.toLowerCase() ?? '';
        const c = categorie?.toLowerCase() ?? '';
        if (t.includes('nuit') || t.includes('info'))
            return 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80';
        if (t.includes('porte') || t.includes('jpo') || t.includes('ouvert'))
            return 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80';
        if (t.includes('hackathon'))
            return 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80';
        if (c.includes('conférence') || t.includes('conférence'))
            return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80';
        if (c.includes('sortie') || t.includes('visite'))
            return 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80';
        return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80';
    };

    const heureDebut = event.heureDebut?.substring(0, 5);
    const heureFin = event.heureFin?.substring(0, 5);
    const plageHoraire = heureDebut
        ? heureFin ? `${heureDebut} → ${heureFin}` : heureDebut
        : null;

    const referentNom = event.referent
        ? `${event.referent.prenom ?? ''} ${event.referent.nom ?? ''}`.trim()
        : null;
    const groupeNom = event.groupe?.nom ?? null;

    const userRole = user?.role?.toUpperCase().trim();
    const isEnseignantOrAdmin = userRole === 'ADMIN' || userRole === 'ENSEIGNANT';
    const imageUrl = getEventImage(event.titre, event.categorie, event.imageUrl);

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>

            {/* BOUTON RETOUR */}
            <button
                onClick={onBack}
                style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    border: 'none', background: 'none', color: 'var(--slate)',
                    cursor: 'pointer', marginBottom: '20px',
                    fontSize: '0.95rem', fontWeight: '500'
                }}
            >
                <ArrowLeft size={16} /> Retour aux événements
            </button>

            {/* CARTE PRINCIPALE */}
            <div style={{
                backgroundColor: '#fff', borderRadius: '16px',
                border: '1px solid var(--line)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                overflow: 'hidden'
            }}>
                {/* IMAGE */}
                <div style={{ width: '100%', height: '240px', position: 'relative', overflow: 'hidden' }}>
                    <img
                        src={imageUrl}
                        alt={event.titre}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {/* Badge catégorie */}
                    <span style={{
                        position: 'absolute', top: '16px', left: '16px',
                        backgroundColor: getCategoryColor(event.categorie),
                        color: '#fff', padding: '6px 14px', borderRadius: '20px',
                        fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                    }}>
                        {event.categorie || 'Événement'}
                    </span>
                    {/* Badge inscrit */}
                    {dejaInscrit && user?.role === 'ETUDIANT' && (
                        <span style={{
                            position: 'absolute', top: '16px', right: '16px',
                            backgroundColor: 'var(--success)', color: '#fff',
                            padding: '6px 14px', borderRadius: '20px',
                            fontSize: '0.75rem', fontWeight: 'bold'
                        }}>
                            ✓ Inscrit
                        </span>
                    )}
                </div>

                {/* CONTENU */}
                <div style={{ padding: '30px' }}>
                    <h1 style={{
                        color: 'var(--navy)', marginTop: 0, marginBottom: '12px',
                        fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: '700', lineHeight: 1.2
                    }}>
                        {event.titre}
                    </h1>

                    <p style={{
                        color: 'var(--ink)', fontSize: '1rem', lineHeight: '1.65',
                        marginBottom: '28px', whiteSpace: 'pre-line'
                    }}>
                        {event.description}
                    </p>

                    {/* GRILLE INFOS LOGISTIQUES */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '16px',
                        backgroundColor: 'var(--paper)',
                        padding: '20px', borderRadius: '12px',
                        marginBottom: '24px'
                    }}>
                        {/* Date */}
                        <InfoBlock icon={<Calendar size={18} color="var(--navy-light)" />} label="Date">
                            {event.dateDebut === event.dateFin || !event.dateFin
                                ? formatDate(event.dateDebut)
                                : `Du ${formatDate(event.dateDebut)} au ${formatDate(event.dateFin)}`}
                        </InfoBlock>

                        {/* Heure */}
                        {plageHoraire && (
                            <InfoBlock icon={<Clock size={18} color="var(--navy-light)" />} label="Horaire">
                                {plageHoraire}
                            </InfoBlock>
                        )}

                        {/* Lieu */}
                        <InfoBlock icon={<MapPin size={18} color="var(--navy-light)" />} label="Lieu">
                            {event.lieu}
                        </InfoBlock>

                        {/* Participants */}
                        <InfoBlock icon={<Users size={18} color="var(--navy-light)" />} label="Inscrits">
                            <strong>{event.participations?.length ?? 0}</strong> participant(s)
                        </InfoBlock>

                        {/* Groupe / Promotion */}
                        {groupeNom && (
                            <InfoBlock icon={<BookOpen size={18} color="var(--navy-light)" />} label="Promotion">
                                {groupeNom}
                            </InfoBlock>
                        )}

                        {/* Référent */}
                        {referentNom && (
                            <InfoBlock icon={<UserIcon size={18} color="var(--navy-light)" />} label="Référent">
                                {referentNom}
                            </InfoBlock>
                        )}

                        {/* Budget — réservé admin/enseignant */}
                        {isEnseignantOrAdmin && event.budgetPrevu > 0 && (
                            <InfoBlock icon={<Wallet size={18} color="var(--gold-deep)" />} label="Budget prévu">
                                <span style={{ color: 'var(--gold-deep)', fontWeight: '600' }}>
                                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(event.budgetPrevu)}
                                    {event.budgetReel > 0 && (
                                        <span style={{ color: 'var(--slate)', fontWeight: 400 }}>
                                            {' '}/ réel {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(event.budgetReel)}
                                        </span>
                                    )}
                                </span>
                            </InfoBlock>
                        )}
                    </div>

                    {/* ZONE INSCRIPTION */}
                    {user?.role === 'ETUDIANT' && (
                        <div style={{ borderTop: '1px solid var(--line)', paddingTop: '20px' }}>
                            {dejaInscrit ? (
                                <button
                                    onClick={() => onDesinscription?.(event.id)}
                                    style={{
                                        width: '100%', padding: '12px 24px', borderRadius: '8px',
                                        border: 'none', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)',
                                        fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer'
                                    }}
                                >
                                    ❌ Se désinscrire de cet événement
                                </button>
                            ) : (
                                <button
                                    onClick={() => onInscription?.(event.id)}
                                    style={{
                                        width: '100%', padding: '12px 24px', borderRadius: '8px',
                                        border: 'none', backgroundColor: 'var(--success)', color: '#fff',
                                        fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer'
                                    }}
                                >
                                    ✅ S'inscrire à cet événement
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* LISTE NOMINATIVE — Enseignant & Admin seulement */}
            {isEnseignantOrAdmin && (
                <div style={{
                    marginTop: '24px', padding: '25px',
                    backgroundColor: '#fff', borderRadius: '12px',
                    border: '1px solid var(--line)',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
                }}>
                    <h3 style={{ color: 'var(--navy)', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        👥 Liste officielle des participants
                    </h3>
                    {event.participations?.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {event.participations.map((p, index) => (
                                <div key={index} style={{
                                    padding: '10px 14px',
                                    backgroundColor: 'var(--paper)', borderRadius: '6px',
                                    fontSize: '0.95rem', color: 'var(--ink)',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    border: '1px solid var(--bg-soft)'
                                }}>
                                    <span>🎓 <strong>{p.user?.prenom} {p.user?.nom}</strong></span>
                                    <span style={{ color: 'var(--slate)', fontSize: '0.85rem' }}>{p.user?.email}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--slate)', margin: 0, fontSize: '0.9rem', fontStyle: 'italic' }}>
                            Aucun étudiant ne s'est inscrit à cet événement pour le moment.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

// Petit composant utilitaire pour les blocs d'info
function InfoBlock({ icon, label, children }) {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{ marginTop: '2px', flexShrink: 0 }}>{icon}</div>
            <div>
                <span style={{
                    display: 'block', fontSize: '0.72rem',
                    color: 'var(--slate-light)', fontWeight: '700',
                    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px'
                }}>
                    {label}
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--ink)' }}>
                    {children}
                </span>
            </div>
        </div>
    );
}
