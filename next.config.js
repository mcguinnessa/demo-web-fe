/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/allcharts',
        permanent: true,
      },
    ]
  },
}



module.exports = nextConfig
