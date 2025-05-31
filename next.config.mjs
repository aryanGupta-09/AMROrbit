const nextConfig = {
    pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
    experimental: {
        appDir: true,
    },
    webpack: (config) => {
        config.resolve.alias.canvas = false;
        return config;
    },
};

export default nextConfig;
