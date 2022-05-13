/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/auth',
        destination: '/auth/signin',
        permanent: true
      }
    ]
  }
}

module.exports = nextConfig
