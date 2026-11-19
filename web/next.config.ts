import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The field-guide PDF lives outside /public so it is only reachable through
  // the gated download route — tracing has to be told to ship it.
  outputFileTracingIncludes: {
    "/api/field-guide/download": ["./private/sitepulse-field-guide.pdf"],
  },
  async redirects() {
    return [
      {
        source: "/rent",
        destination: "/plan",
        permanent: true,
      },
      {
        source: "/rent/:path*",
        destination: "/plan/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
