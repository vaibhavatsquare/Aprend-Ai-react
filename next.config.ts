import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    // API Endpoint Config
    NEXT_API_ENDPOINT: process.env.NEXT_API_ENDPOINT,
    EXT_PUBLIC_SOCKET_URL: process.env.EXT_PUBLIC_SOCKET_URL,

    // Firebase Configuration
    FB_API_KEY: process.env.FB_API_KEY,
    FB_AUTH_DOMAIN: process.env.FB_AUTH_DOMAIN,
    FB_PROJECT_ID: process.env.FB_PROJECT_ID,
    FB_STORAGE_BUCKET: process.env.FB_STORAGE_BUCKET,
    FB_MESSAGING_SENDER_ID: process.env.FB_MESSAGING_SENDER_ID,
    FB_APP_ID: process.env.FB_APP_ID,
    FB_VAPID_KEY: process.env.FB_VAPID_KEY,

    //Encryption
    AES_KEY_BASE64: process.env.AES_KEY_BASE64,
    AES_IV_BASE64: process.env.AES_IV_BASE64,
  },
 async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://45.55.48.121/:path*",
      },
    ];
  },

};

export default nextConfig;
