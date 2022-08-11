import { defineConfig } from 'vite'
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue'

function pathResolve(dir: string): string {
  return resolve(process.cwd(), '.', dir)
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': pathResolve('src')
    }
  },
  server: {
    host: '0.0.0.0', //ip地址
    port: 5050, //端口号
    open: true //启动后是否自动打开浏览器
  }
})
