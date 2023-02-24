import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import cesium from 'vite-plugin-cesium'

// import AutoImport from 'unplugin-auto-import/vite'
// 自动导入组件的vite组件
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
// import {
//   dirResolver,
//   DirResolverHelper
// } from 'vite-auto-import-resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
  cesium(),
  // DirResolverHelper(),
  // AutoImport({
  //   imports: ['vue', 'vue-router', 'vuex'],
  //   resolvers: [
  //     dirResolver()
  //   ]
  // }),
  Components({
    resolvers: [AntDesignVueResolver()]
  })],

  resolve: {
    alias: [
      { find: "@", replacement: resolve(__dirname, "src") },
    ],
  },
  build: {
    target: 'es2020',
    outDir: 'dist',


  },
  server: {
    // host:'',
    port: 5175,
    open: false,
    proxy: {
      // 字符串简写写法：http://localhost:5173/foo -> http://localhost:4567/foo
      '/foo': 'http://localhost:4567',
      // 带选项写法：http://localhost:5173/api/bar -> http://jsonplaceholder.typicode.com/bar
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // 正则表达式写法：http://localhost:5173/fallback/ -> http://jsonplaceholder.typicode.com/
      '^/fallback/.*': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fallback/, ''),
      },
      // 使用 proxy 实例
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        configure: (proxy, options) => {
          // proxy 是 'http-proxy' 的实例
        }
      },
      // 代理 websockets 或 socket.io 写法：ws://localhost:5173/socket.io -> ws://localhost:5174/socket.io
      '/socket.io': {
        target: 'ws://localhost:5174',
        ws: true,
      },
    },
    build: {
      // outDir:'dist',// 指定输出路径，要和库的包区分开
      
    }
  }
})
