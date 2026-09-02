import React from 'react';

/**
 * Emblème simple — écusson minimal, identité "université sérieuse".
 * size: hauteur en px. variant: 'gold' (sur fond marine) ou 'navy' (sur fond clair).
 */
export default function Logo({ size = 40, variant = 'gold' }) {
    // Le logo change ses couleurs selon le fond sur lequel il est affiche.
    const stroke = variant === 'gold' ? '#D4B876' : '#142A4D';
    const fill = variant === 'gold' ? '#142A4D' : '#FAF8F4';

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Emblème Événements IUT de Meaux"
            role="img"
        >
            {/* Écusson */}
            <path
                d="M24 3 L42 9 V23 C42 33.5 34.5 41 24 45 C13.5 41 6 33.5 6 23 V9 Z"
                fill={fill}
                stroke={stroke}
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
            {/* Liseré intérieur */}
            <path
                d="M24 7 L38 12 V23 C38 31.5 32 37.5 24 41 C16 37.5 10 31.5 10 23 V12 Z"
                fill="none"
                stroke={stroke}
                strokeWidth="0.7"
                opacity="0.55"
            />
            {/* Monogramme */}
            <text
                x="24"
                y="29"
                textAnchor="middle"
                fontFamily="'Fraunces', Georgia, serif"
                fontWeight="600"
                fontSize="17"
                fill={stroke}
            >
                M
            </text>
        </svg>
    );
}
