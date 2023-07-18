/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
    // 只在服务器端运行的代码块中处理 canvas.node 文件
    if (isServer) {
      config.module.rules.push({
        test: /canvas.node$/,
        use: 'ignore-loader',
      });
    }
    return config;
  },
};

export default nextConfig;
