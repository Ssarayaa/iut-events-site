import React from 'react';
import Logo from './Logo';

// Pied de page affiche sur toutes les pages de l'application.
export default function Footer() {
    return (
        <footer style={{
            backgroundColor: 'var(--navy-deep)',
            color: 'var(--slate-light)',
            marginTop: 'auto',
        }}>
            <div style={{
                maxWidth: '1100px',
                margin: '0 auto',
                padding: '28px 20px 22px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                textAlign: 'center'
            }}>
                <Logo size={30} variant="gold" />
                <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--gold)', opacity: 0.5, margin: '4px 0' }} />
                <p className="font-display" style={{ margin: 0, fontSize: '0.95rem', color: 'var(--gold-light)', letterSpacing: '0.02em' }}>
                    Département Métiers du Multimédia et de l'Internet
                </p>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--slate-light)' }}>
                    © {new Date().getFullYear()} IUT de Meaux — Tous droits réservés.
                </p>
            </div>
        </footer>
    );
}
