import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Wallet, Users } from 'lucide-react';

// Enregistrement des briques Chart.js necessaires au graphique en barres.
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Graphique du dashboard : il bascule entre budgets et participations.
export default function StatChart({ events = [] }) {
    // Mode courant du graphique : comparaison budgetaire ou nombre d'inscrits.
    const [viewMode, setViewMode] = useState('budget');

    // Force le rechargement du graphique quand events change
    const validEvents = Array.isArray(events) ? events : [];

    // Extraction des étiquettes
    const labels = validEvents.map(e =>
        e.titre && e.titre.length > 15 ? `${e.titre.substring(0, 15)}...` : (e.titre || 'Événement')
    );

    // Données pour les budgets
    const budgetPrevuValues = validEvents.map(e => e.budgetPrevu || 0);
    const budgetReelValues = validEvents.map(e => e.budgetReel || 0);

    // Données pour les participations (CORRECTION : compte les participations)
    const participationValues = validEvents.map(e => e.participations ? e.participations.length : 0);

    // Donnees envoyees a Chart.js ; les jeux de donnees changent selon le mode choisi.
    const data = {
        labels: labels,
        datasets: viewMode === 'budget' ? [
            {
                label: 'Budget Prévu (€)',
                data: budgetPrevuValues,
                backgroundColor: 'rgba(20, 42, 77, 0.75)',
                borderColor: 'rgba(20, 42, 77, 1)',
                borderWidth: 1,
                borderRadius: 4,
            },
            {
                label: 'Budget Réel (€)',
                data: budgetReelValues,
                backgroundColor: 'rgba(122, 59, 59, 0.65)',
                borderColor: 'rgba(122, 59, 59, 1)',
                borderWidth: 1,
                borderRadius: 4,
            }
        ] : [
            {
                label: 'Nombre de participants',
                data: participationValues,
                backgroundColor: 'rgba(176, 141, 69, 0.7)',
                borderColor: 'rgba(176, 141, 69, 1)',
                borderWidth: 1,
                borderRadius: 6,
            }
        ]
    };

    // Options d'affichage du graphique : titre, legende, tooltips et graduation de l'axe Y.
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: {
                display: true,
                text: viewMode === 'budget' ? 'Analyse et Comparatif des Budgets' : 'Taux de Participation par Événement',
                color: '#142A4D',
                font: { size: 16, weight: 'bold' }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) label += ' : ';
                        if (context.parsed.y !== null) {
                            label += viewMode === 'budget'
                                ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(context.parsed.y)
                                : context.parsed.y + ' inscrit(s)';
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return viewMode === 'budget' ? value + ' €' : value;
                    }
                }
            }
        }
    };

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                    onClick={() => setViewMode('budget')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: '6px',
                        border: '1px solid var(--line)',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        backgroundColor: viewMode === 'budget' ? 'var(--navy)' : '#fff',
                        color: viewMode === 'budget' ? '#fff' : 'var(--slate)',
                    }}
                >
                    <Wallet size={16} /> Vue Budgets
                </button>
                <button
                    onClick={() => setViewMode('participation')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: '6px',
                        border: '1px solid var(--line)',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        backgroundColor: viewMode === 'participation' ? 'var(--navy)' : '#fff',
                        color: viewMode === 'participation' ? '#fff' : 'var(--slate)',
                    }}
                >
                    <Users size={16} /> Vue Participations
                </button>
            </div>
            <div style={{ flex: 1, minHeight: '260px' }}>
                <Bar key={viewMode + validEvents.length} data={data} options={options} />
            </div>
        </div>
    );
}
