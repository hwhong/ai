/** @type {import('next').NextConfig} */
// Web Assembly required by the tokenizer library @dqbd/tiktoken
const nextConfig = {
  webpack(config) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    return config;
  },
};

module.exports = nextConfig;
