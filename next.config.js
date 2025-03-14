module.exports = {
  webpack(config, { isServer }) {
    if (!isServer) {
      // For client-side, ignore Node.js built-in modules like 'fs'
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
};
