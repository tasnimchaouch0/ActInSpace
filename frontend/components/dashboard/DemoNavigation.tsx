'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Droplet, TrendingUp, AlertTriangle, LayoutDashboard } from 'lucide-react';

const demoPages = [
    {
        name: 'Farm Monitor',
        href: '/dashboard',
        icon: LayoutDashboard,
        color: 'emerald',
        description: 'Individual field tracking'
    },
    {
        name: 'Water Intelligence',
        href: '/water-intelligence',
        icon: Droplet,
        color: 'cyan',
        description: 'Resource optimization'
    },
    {
        name: 'Export Forecast',
        href: '/export-forecast',
        icon: TrendingUp,
        color: 'violet',
        description: 'National planning'
    },
    {
        name: 'Disease Alert',
        href: '/disease-alert',
        icon: AlertTriangle,
        color: 'rose',
        description: 'Early warning system'
    }
];

const colorClasses = {
    emerald: {
        active: 'bg-emerald-500 text-white border-emerald-500',
        inactive: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20'
    },
    cyan: {
        active: 'bg-cyan-500 text-white border-cyan-500',
        inactive: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20 hover:bg-cyan-500/20'
    },
    violet: {
        active: 'bg-violet-500 text-white border-violet-500',
        inactive: 'bg-violet-500/10 text-violet-600 border-violet-500/20 hover:bg-violet-500/20'
    },
    rose: {
        active: 'bg-rose-500 text-white border-rose-500',
        inactive: 'bg-rose-500/10 text-rose-600 border-rose-500/20 hover:bg-rose-500/20'
    }
};

export default function DemoNavigation() {
    const pathname = usePathname();

    return (
        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                    Strategic Intelligence Modules
                </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {demoPages.map((page) => {
                    const isActive = pathname === page.href;
                    const Icon = page.icon;
                    const colors = colorClasses[page.color as keyof typeof colorClasses];

                    return (
                        <Link
                            key={page.href}
                            href={page.href}
                            className={`
                group relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 
                transition-all duration-300
                ${isActive ? colors.active : colors.inactive}
              `}
                        >
                            <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                            <div className="text-center">
                                <div className={`text-sm font-black uppercase tracking-tight ${isActive ? 'text-white' : ''}`}>
                                    {page.name}
                                </div>
                                <div className={`text-[10px] font-mono ${isActive ? 'text-white/80' : 'text-muted-foreground'}`}>
                                    {page.description}
                                </div>
                            </div>
                            {isActive && (
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-white rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
