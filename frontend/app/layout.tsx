import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';


const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'ZAYTUNA.AI - Smart Olive Grove Monitoring',
    description: 'Protect your olive groves with satellite-based AI insights. Monitor water stress, climate risk, and yield protection for Tunisian olive farmers.',
    keywords: ['olive trees', 'Tunisia', 'satellite', 'AI', 'agriculture', 'water stress', 'Sentinel'],
    authors: [{ name: 'ZAYTUNA.AI Team' }],
    openGraph: {
        title: 'ZAYTUNA.AI - Smart Olive Grove Monitoring',
        description: 'Satellite-powered AI for healthier olive groves',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
            <head>
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                    crossOrigin=""
                />
            </head>
            <body className="min-h-screen font-sans antialiased">
                {children}
            </body>
        </html>
    );
}
