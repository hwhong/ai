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
  env: {
    OPENAI_API_KEY: "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",
  },
};

module.exports = nextConfig;
