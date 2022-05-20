/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: [
            "avatars.githubusercontent.com",
            "pbs.twimg.com",
            "cdn.discordapp.com",
        ],
    },
};

module.exports = nextConfig;
