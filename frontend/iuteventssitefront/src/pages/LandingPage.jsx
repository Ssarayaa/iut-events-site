import React, { useEffect, useState, useRef } from 'react';
import { Calendar, Users, Trophy, ArrowRight, ChevronDown, Zap, BookOpen, Globe } from 'lucide-react';
import Logo from '../components/Logo';

export default function LandingPage({ onNavigate, events = [] }) {
    const [count, setCount] = useState({ events: 0, participants: 0 });
    const [heroVisible, setHeroVisible] = useState(false);
    const featuresRef = useRef(null);

    const totalEvents = events.length > 0 ? events.length : 12;
    const totalParticipants = events.length > 0
        ? events.reduce((acc, ev) => acc + (ev.participations?.length ?? 0), 0)
        : 147;

    // Derniers événements pour le ticker
    const tickerEvents = events.length > 0
        ? [...events].sort((a, b) => new Date(b.dateDebut) - new Date(a.dateDebut)).slice(0, 8)
        : [
            { titre: 'Nuit de l\'Info 2026', categorie: 'Événement' },
            { titre: 'Hackathon GreenTech', categorie: 'Hackathon' },
            { titre: 'Journée Portes Ouvertes', categorie: 'Sortie' },
            { titre: 'Conférence UX Design', categorie: 'Conférence' },
        ];

    useEffect(() => {
        const t = setTimeout(() => setHeroVisible(true), 50);
        const duration = 1200;
        const steps = 40;
        const interval = duration / steps;
        let step = 0;
        const timer = setInterval(() => {
            step++;
            const eased = 1 - Math.pow(1 - step / steps, 3);
            setCount({
                events: Math.round(eased * totalEvents),
                participants: Math.round(eased * totalParticipants)
            });
            if (step >= steps) clearInterval(timer);
        }, interval);
        return () => { clearTimeout(t); clearInterval(timer); };
    }, [totalEvents, totalParticipants]);

    const scrollToFeatures = () => featuresRef.current?.scrollIntoView({ behavior: 'smooth' });

    const categories = [
        { label: 'Conférences', icon: <Globe size={14} />, color: 'var(--gold-deep)' },
        { label: 'Hackathons', icon: <Zap size={14} />, color: 'var(--navy-light)' },
        { label: 'Sorties', icon: <BookOpen size={14} />, color: 'var(--wine)' },
        { label: 'Séminaires', icon: <Calendar size={14} />, color: 'var(--success)' },
    ];

    const features = [
        {
            icon: <Calendar size={28} color="var(--gold-deep)" />,
            title: 'Tout en un seul endroit',
            desc: 'Conférences, hackathons, JPO, sorties — le programme complet du département MMI réuni sur une seule plateforme.',
        },
        {
            icon: <Users size={28} color="var(--gold-deep)" />,
            title: 'Inscription en un clic',
            desc: 'Réservez votre place instantanément et gérez toutes vos participations depuis votre compte étudiant.',
        },
        {
            icon: <Trophy size={28} color="var(--gold-deep)" />,
            title: 'Suivi en temps réel',
            desc: 'Consultez les taux de fréquentation, les ressources mobilisées et les statistiques par promotion.',
        },
    ];

    return (
        <div style={{ minHeight: 'calc(100dvh - 70px)', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--paper)' }}>

            {/* ── HERO ──────────────────────────────────────────────────── */}
            <div className="landing-hero" style={{
                background: 'linear-gradient(160deg, var(--navy-deep) 0%, var(--navy) 60%, var(--navy-light) 100%)',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '60px 20px 40px',
                textAlign: 'center',
                position: 'relative',
                minHeight: '68vh',
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'translateY(0)' : 'translateY(18px)',
                transition: 'opacity 0.7s ease, transform 0.7s ease',
                overflow: 'hidden',
            }}>
                {/* Fond décoratif : cercles subtils */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'radial-gradient(ellipse 60% 50% at 80% 20%, rgba(176,141,69,0.10) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(31,58,99,0.4) 0%, transparent 60%)'
                }} />

                <Logo size={56} variant="gold" />

                <span style={{
                    marginTop: '18px', fontSize: '0.72rem',
                    letterSpacing: '0.22em', textTransform: 'uppercase',
                    color: 'var(--gold-light)', fontWeight: 600
                }}>
                    IUT Gustave Eiffel · Département MMI · Meaux
                </span>

                <h1 className="font-display" style={{
                    fontSize: 'clamp(1.9rem, 4vw, 3rem)',
                    margin: '14px 0 12px', fontWeight: 600, maxWidth: '680px',
                    lineHeight: 1.15
                }}>
                    La vie de promo,<br />réunie au même endroit
                </h1>

                <p style={{
                    fontSize: 'clamp(0.92rem, 1.5vw, 1.05rem)',
                    marginBottom: '28px', opacity: 0.82, maxWidth: '500px', lineHeight: 1.6
                }}>
                    Retrouvez et rejoignez les événements du département — de la conférence invitée à la nuit de codeuse.
                </p>

                {/* Pills catégories */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '30px' }}>
                    {categories.map(cat => (
                        <span key={cat.label} style={{
                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                            backgroundColor: 'rgba(255,255,255,0.10)',
                            border: '1px solid rgba(255,255,255,0.18)',
                            color: 'rgba(255,255,255,0.9)',
                            padding: '5px 13px', borderRadius: '20px',
                            fontSize: '0.78rem', fontWeight: '600',
                            backdropFilter: 'blur(4px)'
                        }}>
                            {cat.icon} {cat.label}
                        </span>
                    ))}
                </div>

                {/* Compteurs */}
                <div style={{ display: 'flex', gap: '48px', marginBottom: '34px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {[
                        { value: count.events, label: 'événements', suffix: '' },
                        { value: count.participants, label: 'participants', suffix: '+' },
                    ].map(({ value, label, suffix }) => (
                        <div key={label} style={{ textAlign: 'center' }}>
                            <div style={{
                                fontSize: 'clamp(2.2rem, 4vw, 3rem)',
                                fontWeight: 700, color: 'var(--gold-light)',
                                fontFamily: 'var(--font-display)', lineHeight: 1
                            }}>
                                {value}{suffix}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.60)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '5px' }}>
                                {label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <button
                    onClick={() => onNavigate('#/events')}
                    style={{
                        backgroundColor: 'var(--gold)', color: 'var(--navy-deep)',
                        border: 'none', padding: '14px 32px', borderRadius: '4px',
                        fontSize: '0.98rem', fontWeight: '700',
                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
                        gap: '8px', transition: 'background-color 0.2s, transform 0.15s',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.28)'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#C29F58'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--gold)'; e.currentTarget.style.transform = 'scale(1)'; }}
                >
                    Voir les événements <ArrowRight size={18} />
                </button>

                {/* Scroll indicator */}
                <button
                    onClick={scrollToFeatures}
                    style={{
                        position: 'absolute', bottom: '18px', left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)',
                        cursor: 'pointer', padding: '8px',
                        animation: 'lp-bounce 2s infinite'
                    }}
                    aria-label="Défiler vers le bas"
                >
                    <ChevronDown size={26} />
                </button>

                <style>{`
                    @keyframes lp-bounce {
                        0%, 100% { transform: translateX(-50%) translateY(0); }
                        50% { transform: translateX(-50%) translateY(7px); }
                    }
                    @keyframes lp-ticker {
                        0%   { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    @keyframes lp-fadein {
                        from { opacity: 0; transform: translateY(14px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }
                `}</style>
            </div>

            {/* ── TICKER des derniers événements ───────────────────────── */}
            <div style={{
                backgroundColor: 'var(--navy)', color: 'var(--gold-light)',
                padding: '10px 0', overflow: 'hidden', position: 'relative',
                borderTop: '1px solid rgba(176,141,69,0.3)',
                borderBottom: '1px solid rgba(176,141,69,0.3)'
            }}>
                <div style={{
                    display: 'flex', gap: '0',
                    animation: 'lp-ticker 28s linear infinite',
                    whiteSpace: 'nowrap',
                    width: 'max-content',
                }}>
                    {/* Dupliquer pour une boucle sans saut */}
                    {[...tickerEvents, ...tickerEvents].map((ev, i) => (
                        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0 36px', fontSize: '0.82rem', fontWeight: '600' }}>
                            <span style={{ color: 'var(--gold)', fontSize: '0.65rem' }}>◆</span>
                            {ev.titre}
                            <span style={{ color: 'rgba(212,184,118,0.5)', fontSize: '0.72rem', fontWeight: '400' }}>{ev.categorie}</span>
                        </span>
                    ))}
                </div>
            </div>

            {/* ── FEATURES ─────────────────────────────────────────────── */}
            <div ref={featuresRef} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '56px 20px' }}>
                <div className="landing-features" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '24px', width: '100%', maxWidth: '960px'
                }}>
                    {features.map((f, i) => (
                        <FeatureCard key={i} {...f} delay={i * 80} />
                    ))}
                </div>
            </div>

            {/* ── APPEL À L'ACTION bas de page ─────────────────────────── */}
            <div style={{
                backgroundColor: 'var(--gold-pale)',
                borderTop: '1px solid var(--line)',
                padding: '40px 20px',
                textAlign: 'center'
            }}>
                <p className="font-display" style={{ color: 'var(--navy)', fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', margin: '0 0 16px', fontWeight: 600 }}>
                    Prêt·e à rejoindre la prochaine aventure ?
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => onNavigate('#/events')}
                        style={{
                            backgroundColor: 'var(--navy)', color: '#fff',
                            border: 'none', padding: '11px 28px', borderRadius: '4px',
                            fontSize: '0.92rem', fontWeight: '700',
                            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '7px',
                            transition: 'opacity 0.15s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                        Voir tous les événements <ArrowRight size={16} />
                    </button>
                    <button
                        onClick={() => onNavigate('#/login')}
                        style={{
                            backgroundColor: 'transparent', color: 'var(--navy)',
                            border: '2px solid var(--navy)', padding: '11px 28px', borderRadius: '4px',
                            fontSize: '0.92rem', fontWeight: '600',
                            cursor: 'pointer', transition: 'background-color 0.15s'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(20,42,77,0.07)'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                        Créer un compte
                    </button>
                </div>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, desc, delay }) {
    const [hovered, setHovered] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 300 + delay);
        return () => clearTimeout(t);
    }, [delay]);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                textAlign: 'center', padding: '30px 22px',
                backgroundColor: '#fff', borderRadius: '14px',
                border: `1px solid ${hovered ? 'var(--gold-light)' : 'var(--line)'}`,
                boxShadow: hovered
                    ? '0 10px 28px rgba(20,42,77,0.11)'
                    : '0 2px 8px rgba(20,42,77,0.04)',
                transition: 'all 0.28s ease',
                transform: hovered
                    ? 'translateY(-6px)'
                    : visible ? 'translateY(0)' : 'translateY(16px)',
                opacity: visible ? 1 : 0,
                cursor: 'default',
            }}
        >
            <div style={{
                width: '58px', height: '58px',
                backgroundColor: hovered ? 'var(--gold-pale)' : 'var(--bg-soft)',
                borderRadius: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 18px',
                transition: 'background-color 0.28s'
            }}>
                {icon}
            </div>
            <h3 className="font-display" style={{ margin: '0 0 10px', color: 'var(--navy)', fontSize: '1.05rem', fontWeight: 600 }}>
                {title}
            </h3>
            <p style={{ color: 'var(--slate)', fontSize: '0.87rem', lineHeight: 1.6, margin: 0 }}>
                {desc}
            </p>
        </div>
    );
}
