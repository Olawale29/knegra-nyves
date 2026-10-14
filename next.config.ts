import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components is intentionally left off: this is a fully static,
  // mock-data frontend demo. Classic static generation keeps every route
  // prerendered and avoids hidden-route state persisting between pages.
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 828, 1080, 1280, 1600, 1920],
    imageSizes: [96, 160, 256, 384],
    qualities: [70, 80, 85],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
