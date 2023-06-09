/** @type {import('next').NextConfig} */
const nextConfig = {
    // images:{
    //     domains:['cfx-vrf-main-imgs.imgix.net','i.pinimg.com','e7.pngegg.com','d1ypc8j62c29y8.cloudfront.net','platform.cstatic-images.com','tuskercars.com','cdn.imgbin.com','cdn.imgbin.com','']
    // }
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "**",
          },
        ],
      },
}

module.exports = nextConfig
