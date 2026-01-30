import { NextResponse } from 'next/server';

// Tunisian olive field coordinates
const OLIVE_FIELDS = [
    {
        id: 'sfax-north-001',
        name: 'Sfax Northern Grove',
        region: 'Sfax',
        coordinates: [
            [34.8234, 10.7012],
            [34.8298, 10.7012],
            [34.8298, 10.7156],
            [34.8234, 10.7156],
            [34.8234, 10.7012]
        ],
        center: [34.8266, 10.7084],
        areaHectares: 45.2,
        treesCount: 1800,
    },
    {
        id: 'sousse-coastal-002',
        name: 'Sousse Coastal Olives',
        region: 'Sousse',
        coordinates: [
            [35.8012, 10.5934],
            [35.8089, 10.5934],
            [35.8089, 10.6078],
            [35.8012, 10.6078],
            [35.8012, 10.5934]
        ],
        center: [35.8051, 10.6006],
        areaHectares: 32.8,
        treesCount: 1200,
    },
    {
        id: 'kairouan-inland-003',
        name: 'Kairouan Heritage Field',
        region: 'Kairouan',
        coordinates: [
            [35.6756, 10.0912],
            [35.6834, 10.0912],
            [35.6834, 10.1023],
            [35.6756, 10.1023],
            [35.6756, 10.0912]
        ],
        center: [35.6795, 10.0968],
        areaHectares: 28.5,
        treesCount: 950,
    }
];

// Simulate Sentinel data processing
function computeStressScore(): number {
    // In production: NDVI, NDWI from Sentinel-2, moisture from Sentinel-1
    return Math.floor(Math.random() * 70) + 10;
}

function determineHealthStatus(stressScore: number): 'healthy' | 'warning' | 'critical' {
    if (stressScore <= 30) return 'healthy';
    if (stressScore <= 60) return 'warning';
    return 'critical';
}

function determineYieldRisk(stressScore: number): 'low' | 'medium' | 'high' {
    if (stressScore <= 25) return 'low';
    if (stressScore <= 55) return 'medium';
    return 'high';
}

export async function GET() {
    const now = new Date();

    const fields = OLIVE_FIELDS.map(field => {
        const stressScore = computeStressScore();
        const healthStatus = determineHealthStatus(stressScore);
        const yieldRisk = determineYieldRisk(stressScore);
        const trend = ['stable', 'improving', 'worsening'][Math.floor(Math.random() * 3)] as 'stable' | 'improving' | 'worsening';

        return {
            ...field,
            stressScore,
            moistureLevel: Math.floor(Math.random() * 40) + 35,
            temperatureAnomaly: Math.round((Math.random() * 4 - 1) * 10) / 10,
            healthStatus,
            yieldRisk,
            trend,
            lastUpdated: now.toISOString(),
            sentinelData: {
                ndvi: Math.round((Math.random() * 0.4 + 0.4) * 100) / 100,
                ndwi: Math.round((Math.random() * 0.3 - 0.05) * 100) / 100,
                sentinel1Date: new Date(now.getTime() - 86400000 * 2).toISOString().split('T')[0],
                sentinel2Date: new Date(now.getTime() - 86400000 * 3).toISOString().split('T')[0],
            }
        };
    });

    // Generate AI insights
    const criticalFields = fields.filter(f => f.healthStatus === 'critical');
    const warningFields = fields.filter(f => f.healthStatus === 'warning');

    let summary = '';
    if (criticalFields.length > 0) {
        summary = `⚠️ Attention needed: ${criticalFields.length} field(s) showing high water stress. `;
    } else if (warningFields.length > 0) {
        summary = `Some fields need monitoring: ${warningFields.length} field(s) with moderate stress levels. `;
    } else {
        summary = '✅ Your olive groves are in excellent health! ';
    }
    summary += `Average stress level: ${Math.round(fields.reduce((a, f) => a + f.stressScore, 0) / fields.length)}/100.`;

    const recommendations: string[] = [];
    fields.forEach(field => {
        if (field.stressScore > 60) {
            recommendations.push(`🚨 ${field.name}: Consider immediate irrigation - stress level is critical (${field.stressScore}/100)`);
        } else if (field.stressScore > 40) {
            recommendations.push(`⚡ ${field.name}: Monitor closely and plan irrigation within 3-5 days`);
        }
    });
    if (recommendations.length === 0) {
        recommendations.push('🌿 All fields look healthy - continue current irrigation schedule');
    }

    return NextResponse.json({
        fields,
        aiInsights: {
            summary,
            recommendations: recommendations.slice(0, 4),
            confidence: 85 + Math.floor(Math.random() * 10),
            analysisMethod: 'Sentinel-1 SAR + Sentinel-2 Multispectral fusion',
            lastAnalysis: now.toISOString()
        },
        satelliteStatus: {
            lastSentinel1Pass: new Date(now.getTime() - 86400000 * 2).toISOString().split('T')[0],
            lastSentinel2Pass: new Date(now.getTime() - 86400000 * 3).toISOString().split('T')[0],
            nextUpdate: new Date(now.getTime() + 21600000).toISOString(),
            coverageArea: 'Northern Tunisia (Sfax, Sousse, Kairouan regions)'
        },
        generatedAt: now.toISOString()
    });
}
