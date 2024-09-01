import { defineConfig } from '@ice/app';
import request from '@ice/plugin-request';
import store from '@ice/plugin-store';
import auth from '@ice/plugin-auth';

// The project config, see https://v3.ice.work/docs/guide/basic/config
const minify = process.env.NODE_ENV === 'production' ? 'swc' : false;
const apiUrl = process.env.NODE_ENV === 'production' ? 'http://example.com:8080' : 'http://127.0.0.1:8080';
export default defineConfig(() => ({
  ssg: false,
  minify,
  plugins: [request(), store(), auth()],
  compileDependencies: false,
  crossOriginLoading: 'anonymous',
  define: {
    ICE_API_URL: JSON.stringify(apiUrl),
    ICE_API_APPID: JSON.stringify('api-00000002'),
    ICE_API_APPSECRET: JSON.stringify('61c94399f47c485334b48f8f340bc07b2'),
  },
  // proxy: {
  //   '/api/': {
  //     target: 'http://127.0.0.1:8081',
  //     changeOrigin: true,
  //     pathRewrite: { '^': '' },
  //   },
  // },
}));
