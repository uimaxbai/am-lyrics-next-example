import type { NextConfig } from "next";

const withLitSSR = require('@lit-labs/nextjs')();

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true
};

module.exports = withLitSSR(nextConfig);
