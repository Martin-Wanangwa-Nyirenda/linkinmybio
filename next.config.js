const nextConfig = {
  async redirects(){
    return[
      {
        source : "/",
        destination: '/dashboard',
        permanent: true
      }
    ]
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        // port: '',
        // pathname: '/account123/**',
      },
    ],
  }
}

module.exports = nextConfig
