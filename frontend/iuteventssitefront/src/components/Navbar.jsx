import React, { useState } from 'react';
import { Lock, LogOut, User as UserIcon, LayoutDashboard, Info, Home, Menu, X } from 'lucide-react';

export default function Navbar({ user, onLogout, onNavigate }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const userRoleCleaned = user?.role?.toUpperCase().trim() ?? '';
    const canAccessDashboard =
        userRoleCleaned === 'ADMIN' ||
        userRoleCleaned === 'ENSEIGNANT';

    const toggleMenu = () => setIsMenuOpen(prev => !prev);
    const closeMenu = () => setIsMenuOpen(false);

    const handleNavigate = (path) => { onNavigate(path); closeMenu(); };

    const NavBtn = ({ onClick, children, style = {} }) => (
        <button onClick={onClick} style={{
            backgroundColor: 'transparent',
            color: '#fff',
            border: '2px solid rgba(212,184,118,0.55)',
            padding: '7px 14px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            ...style
        }}>
            {children}
        </button>
    );

    return (
        <>
            <nav style={{
                backgroundColor: 'var(--navy)',
                padding: '10px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                color: '#fff',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                flexWrap: 'wrap',
                gap: '8px'
            }}>
                {/* ── LOGO ── */}
                <div
                    onClick={() => handleNavigate('')}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                >
                    <div style={{
    backgroundColor: '#ffffff',
    padding: '4px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}}>
    <img
        src="/logo.png"
        alt="Logo Université Gustave Eiffel"
        style={{
            height: '32px',
            width: 'auto',
            objectFit: 'contain'
        }}
    />
</div>
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                        <span className="font-display" style={{ fontSize: '1.15rem', fontWeight: 600, letterSpacing: '0.01em' }}>
                            IUT Gustave Eiffel
                        </span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
                            Événements MMI Meaux
                        </span>
                    </div>
                </div>

                {/* ── BURGER (mobile) ── */}
                <button
                    onClick={toggleMenu}
                    style={{ display: 'none', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '5px' }}
                    className="burger-btn"
                    aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* ── MENU DESKTOP ── */}
                <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <NavBtn onClick={() => handleNavigate('')}>
                        <Home size={16} /> Accueil
                    </NavBtn>

                    <NavBtn onClick={() => handleNavigate('#/events')} style={{ border: '2px solid var(--gold)' }}>
                        <Info size={16} /> Événements
                    </NavBtn>

                    {user && canAccessDashboard && (
                        <button onClick={() => handleNavigate('#/admin')} style={{
                            backgroundColor: 'var(--navy-light)', color: '#fff', border: 'none',
                            padding: '7px 14px', borderRadius: '6px', cursor: 'pointer',
                            fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem'
                        }}>
                            <LayoutDashboard size={16} /> Dashboard
                        </button>
                    )}

                    <div style={{ height: '20px', width: '1px', backgroundColor: 'var(--slate)', margin: '0 5px' }} />

                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                                <UserIcon size={16} color="var(--gold)" />
                                <span>{user.prenom} ({user.role})</span>
                            </div>
                            <button onClick={onLogout} style={{
                                backgroundColor: 'var(--danger)', color: '#fff', border: 'none',
                                padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem',
                                display: 'flex', alignItems: 'center', gap: '4px'
                            }}>
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => handleNavigate('#/login')} style={{
                            backgroundColor: 'var(--success)', color: '#fff', border: 'none',
                            padding: '7px 18px', borderRadius: '6px', cursor: 'pointer',
                            fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem'
                        }}>
                            <Lock size={16} /> Connexion
                        </button>
                    )}
                </div>
            </nav>

            {/* ── MENU MOBILE ── */}
            {isMenuOpen && (
                <div style={{
                    position: 'fixed', top: '70px', left: 0, right: 0,
                    backgroundColor: 'var(--navy)', padding: '12px 20px',
                    display: 'flex', flexDirection: 'column', gap: '8px',
                    zIndex: 999, boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                    borderTop: '1px solid rgba(255,255,255,0.1)'
                }}>
                    {[
                        { label: 'Accueil', icon: <Home size={18} />, path: '' },
                        { label: 'Événements', icon: <Info size={18} />, path: '#/events' },
                    ].map(item => (
                        <button key={item.path} onClick={() => handleNavigate(item.path)} style={{
                            backgroundColor: 'transparent', color: '#fff',
                            border: '2px solid rgba(212,184,118,0.55)', padding: '8px 12px',
                            borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem',
                            display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center'
                        }}>
                            {item.icon} {item.label}
                        </button>
                    ))}

                    {user && canAccessDashboard && (
                        <button onClick={() => handleNavigate('#/admin')} style={{
                            backgroundColor: 'var(--navy-light)', color: '#fff', border: 'none',
                            padding: '8px 12px', borderRadius: '6px', cursor: 'pointer',
                            fontWeight: '600', fontSize: '0.9rem', display: 'flex',
                            alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center'
                        }}>
                            <LayoutDashboard size={18} /> Dashboard
                        </button>
                    )}

                    <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />

                    {user ? (
                        <>
                            <div style={{ textAlign: 'center', color: '#fff', padding: '4px', fontSize: '0.85rem' }}>
                                👤 {user.prenom} ({user.role})
                            </div>
                            <button onClick={() => { onLogout(); closeMenu(); }} style={{
                                backgroundColor: 'var(--danger)', color: '#fff', border: 'none',
                                padding: '8px 12px', borderRadius: '6px', cursor: 'pointer',
                                fontWeight: '600', fontSize: '0.9rem', display: 'flex',
                                alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center'
                            }}>
                                <LogOut size={18} /> Déconnexion
                            </button>
                        </>
                    ) : (
                        <button onClick={() => handleNavigate('#/login')} style={{
                            backgroundColor: 'var(--success)', color: '#fff', border: 'none',
                            padding: '8px 12px', borderRadius: '6px', cursor: 'pointer',
                            fontWeight: 'bold', fontSize: '0.9rem', display: 'flex',
                            alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center'
                        }}>
                            <Lock size={18} /> Connexion
                        </button>
                    )}
                </div>
            )}
        </>
    );
}