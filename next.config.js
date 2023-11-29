/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
      domains: ['localhost', '*', 'dongbu-hotel-front-s3.s3.ap-northeast-2.amazonaws.com'],
   },
   reactStrictMode: false, // 1번만 요청하도록 변경
};

module.exports = nextConfig;
