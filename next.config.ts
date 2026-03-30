const nextConfig = {
  // Disable static optimization globally
  // so middleware always runs on every request
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
