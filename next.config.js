/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "play-lh.googleusercontent.com",
      },
    ],
  },
};

module.exports  = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias['leaflet-control-geocoder$'] = 'leaflet-control-geocoder/dist/Control.Geocoder.js';
      config.resolve.alias['leaflet-control-geocoder.css$'] = 'leaflet-control-geocoder/dist/Control.Geocoder.css';
    }
    return config;
  }
};
