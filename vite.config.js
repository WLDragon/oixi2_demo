import buble from '@rollup/plugin-buble'

export default {
  base: './',
  server: {
    host: '0.0.0.0'
  },
  build: {
    outDir: 'dist',
    assetsDir: 'js',
    emptyOutDir: true,
    terserOptions: {
      format: {
        webkit: true //处理safari的bug
      }
    },
    rollupOptions: {
      external: ['pixi.js', 'oixi2'],
      output: {
        dir: 'dist',
        format: 'iife',
        globals: {
          'pixi.js': 'PIXI',
          'oixi2': 'oixi2'
        }
      },
      plugins: [
        //去掉'=>'等es6代码
        buble({ exclude: ['*/index.html', '*/pixi.min.js', '*/oixi2.umd.min.js'] })
      ]
    }
  }
}