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
    open: false
  }
})
