import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  htmlLimitedBots: /.*/,
  async headers() {
    return ['/admin/:path*', '/api/:path*', '/loja/carrinho', '/loja/checkout', '/loja/meus-pedidos', '/loja/pedido/:path*', '/pedido/:path*', '/carrinho', '/offline', '/preparar-offline', '/serwist/:path*'].map(source => ({ source, headers: [
      { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
      { key: 'Cache-Control', value: 'private, no-store' },
    ] }));
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
  allowedDevOrigins: ['192.168.0.*'],
};

export default nextConfig;