/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prebundled UMD build; transpiling avoids occasional dev chunk / resolution issues with Turbopack/webpack.
  transpilePackages: ["@stellar/freighter-api"],
};

export default nextConfig;
