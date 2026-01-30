/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: '/api/sentinel/:path*',
                destination: 'http://localhost:8000/:path*',
            },
        ];
    },
};

module.exports = nextConfig;
