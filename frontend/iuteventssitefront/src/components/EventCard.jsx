import React from 'react';
import { Calendar, Clock, MapPin, Users, Eye, Wallet, User as UserIcon, BookOpen } from 'lucide-react';

// Budget masqué pour les visiteurs et étudiants — visible uniquement pour ADMIN et ENSEIGNANT.
export default function EventCard({ event, user, onInscription, onDesinscription, onSelect, isUserParticipating }) {

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
        } catch (e) { return dateStr; }
    };

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
            return 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80';
        if (t.includes('porte') || t.includes('jpo') || t.includes('ouvert'))
            return 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80';
        if (t.includes('hackathon'))
            return 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80';
        if (c.includes('conférence') || t.includes('conférence'))
            return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80';
        if (c.includes('sortie') || t.includes('visite'))
            return 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80';
        return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80';
    };

    const dejaInscrit = isUserParticipating
        ? isUserParticipating(event.id)
        : event.participations?.some(p => p.user?.id === user?.id);

    const imageUrl = getEventImage(event.titre, event.categorie, event.imageUrl);

    const referentNom = event.referent
        ? `${event.referent.prenom ?? ''} ${event.referent.nom ?? ''}`.trim()
        : null;
    const groupeNom = event.groupe?.nom ?? null;

    const heureDebut = event.heureDebut?.substring(0, 5);
    const heureFin = event.heureFin?.substring(0, 5);
    const plageHoraire = heureDebut
        ? heureFin ? `${heureDebut} → ${heureFin}` : heureDebut
        : null;

    // Budget : réservé STRICTEMENT aux admin et enseignants connectés.
    // Visiteurs non connectés et étudiants ne voient pas le budget.
    const userRole = user?.role?.toUpperCase().trim();
    const canSeeBudget = userRole === 'ADMIN' || userRole === 'ENSEIGNANT';

    return (
        <div
            style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
                border: '1px solid var(--line)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                overflow: 'hidden',
                height: '100%'
            }}
            onClick={() => onSelect?.(event.id)}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
            }}
        >
            {/* IMAGE */}
            <div style={{ width: '100%', height: '180px', position: 'relative', overflow: 'hidden' }}>
                <img
                    src={imageUrl}
                    alt={event.titre}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <span style={{
                    position: 'absolute', top: '12px', left: '12px',
                    backgroundColor: getCategoryColor(event.categorie),
                    color: '#fff', padding: '5px 12px', borderRadius: '20px',
                    fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                }}>
                    {event.categorie || 'Événement'}
                </span>

                {dejaInscrit && user?.role === 'ETUDIANT' && (
                    <span style={{
                        position: 'absolute', top: '12px', right: '12px',
                        backgroundColor: 'var(--success)', color: '#fff',
                        padding: '4px 10px', borderRadius: '20px',
                        fontSize: '0.65rem', fontWeight: 'bold'
                    }}>
                        ✓ Inscrit
                    </span>
                )}
            </div>

            {/* CONTENU */}
            <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                    <h3 style={{ margin: '0 0 8px 0', color: 'var(--navy)', fontSize: '1.1rem', fontWeight: '700', lineHeight: 1.3 }}>
                        {event.titre}
                    </h3>
                    <p style={{
                        color: 'var(--slate)', fontSize: '0.875rem', lineHeight: '1.5',
                        margin: '0 0 16px 0',
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden'
                    }}>
                        {event.description}
                    </p>
                </div>

                {/* INFOS LOGISTIQUES */}
                <div style={{
                    display: 'flex', flexDirection: 'column', gap: '6px',
                    borderTop: '1px solid var(--bg-soft)', paddingTop: '12px',
                    marginBottom: '12px', fontSize: '0.82rem', color: 'var(--slate)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={13} color="var(--navy-light)" style={{ flexShrink: 0 }} />
                        <span>
                            {event.dateDebut === event.dateFin || !event.dateFin
                                ? formatDate(event.dateDebut)
                                : `Du ${formatDate(event.dateDebut)} au ${formatDate(event.dateFin)}`}
                        </span>
                    </div>

                    {plageHoraire && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Clock size={13} color="var(--navy-light)" style={{ flexShrink: 0 }} />
                            <span>{plageHoraire}</span>
                        </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={13} color="var(--navy-light)" style={{ flexShrink: 0 }} />
                        <span style={{ fontWeight: '500' }}>{event.lieu}</span>
                    </div>

                    {groupeNom && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <BookOpen size={13} color="var(--navy-light)" style={{ flexShrink: 0 }} />
                            <span style={{ color: 'var(--navy)', fontWeight: '500' }}>{groupeNom}</span>
                        </div>
                    )}

                    {referentNom && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <UserIcon size={13} color="var(--navy-light)" style={{ flexShrink: 0 }} />
                            <span>Référent : <strong style={{ color: 'var(--ink)' }}>{referentNom}</strong></span>
                        </div>
                    )}

                    {/* Budget — uniquement pour ADMIN et ENSEIGNANT, jamais pour les étudiants/visiteurs */}
                    {canSeeBudget && event.budgetPrevu > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Wallet size={13} color="var(--gold-deep)" style={{ flexShrink: 0 }} />
                            <span style={{ color: 'var(--gold-deep)', fontWeight: '600' }}>
                                Budget : {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(event.budgetPrevu)}
                                {event.budgetReel > 0 && (
                                    <span style={{ color: 'var(--slate)', fontWeight: 400 }}>
                                        {' '}/ réel {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(event.budgetReel)}
                                    </span>
                                )}
                            </span>
                        </div>
                    )}
                </div>

                {/* ACTIONS */}
                <div style={{ borderTop: '1px solid var(--bg-soft)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--slate)' }}>
                        <Users size={14} />
                        <span><strong style={{ color: 'var(--navy)' }}>{event.participations?.length ?? 0}</strong> inscrit(s)</span>
                    </div>

                    <button
                        style={{
                            width: '100%', padding: '8px',
                            backgroundColor: 'var(--bg-soft)', border: 'none', borderRadius: '6px',
                            color: 'var(--navy)', fontWeight: '600', fontSize: '0.82rem',
                            cursor: 'pointer', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: '6px', transition: 'background-color 0.2s'
                        }}
                        onClick={(e) => { e.stopPropagation(); onSelect?.(event.id); }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E5E0D5'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-soft)'}
                    >
                        <Eye size={14} /> Voir les détails
                    </button>

                    {user?.role === 'ETUDIANT' && (
                        dejaInscrit ? (
                            <button
                                onClick={(e) => { e.stopPropagation(); onDesinscription?.(event.id); }}
                                style={{
                                    width: '100%', padding: '8px', borderRadius: '6px', border: 'none',
                                    backgroundColor: 'var(--danger-bg)', color: 'var(--danger)',
                                    fontWeight: 'bold', fontSize: '0.82rem', cursor: 'pointer'
                                }}
                            >
                                ❌ Se désinscrire
                            </button>
                        ) : (
                            <button
                                onClick={(e) => { e.stopPropagation(); onInscription?.(event.id); }}
                                style={{
                                    width: '100%', padding: '8px', borderRadius: '6px', border: 'none',
                                    backgroundColor: 'var(--success-bg)', color: 'var(--success)',
                                    fontWeight: 'bold', fontSize: '0.82rem', cursor: 'pointer'
                                }}
                            >
                                ✅ S'inscrire
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
