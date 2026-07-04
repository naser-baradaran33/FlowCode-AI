import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/x/inngest",
        destination: "/api/inngest",
      },
      {
        source: "/.netlify/functions/inngest",
        destination: "/api/inngest",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { 
            key: "Cross-Origin-Embedder-Policy", value: "credentialless"
          },
          { 
            key: "Cross-Origin-Opener-Policy", value: "same-origin"
          },
        ],
      }
    ];
  }
};

const sentryUploadEnabled = process.env.SENTRY_UPLOAD_SOURCE_MAPS === "true";
const sentryOrg = process.env.SENTRY_ORG;
const sentryProject = process.env.SENTRY_PROJECT;
const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;

const shouldEnableSentrySourceMapUpload =
  sentryUploadEnabled &&
  !!sentryOrg &&
  !!sentryProject &&
  !!sentryAuthToken;

const config = shouldEnableSentrySourceMapUpload
  ? withSentryConfig(nextConfig, {
      org: sentryOrg,
      project: sentryProject,
      authToken: sentryAuthToken,
      silent: !process.env.CI,
      widenClientFileUpload: true,
      tunnelRoute: "/monitoring",
      webpack: {
        automaticVercelMonitors: true,
        treeshake: {
          removeDebugLogging: true,
        },
      },
    })
  : nextConfig;

export default config;
