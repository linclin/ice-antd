import { defineConfig } from '@ice/app';
import request from '@ice/plugin-request';
import store from '@ice/plugin-store';
import auth from '@ice/plugin-auth';

const minify = process.env.NODE_ENV === 'production' ? 'swc' : false;
export default defineConfig(() => ({
  ssg: false,
  minify,
  plugins: [request(), store(), auth()],
  compileDependencies: false,
  crossOriginLoading: 'anonymous',
  define: {
    ICE_API_URL: JSON.stringify(process.env.ICE_API_URL),
    ICE_API_APPID: JSON.stringify(process.env.ICE_API_APPID),
    ICE_API_APPSECRET: JSON.stringify(process.env.ICE_API_APPSECRET),
    CASDOOR_SERVER_URL: JSON.stringify(process.env.CASDOOR_SERVER_URL),
    CASDOOR_CLIENT_ID: JSON.stringify(process.env.CASDOOR_CLIENT_ID),
    CASDOOR_ORGANIZATION_NAME: JSON.stringify(process.env.CASDOOR_ORGANIZATION_NAME),
    CASDOOR_APP_NAME: JSON.stringify(process.env.CASDOOR_APP_NAME),
  },
  // proxy: {
  //   '/api/': {
  //     target: 'http://127.0.0.1:8081',
  //     changeOrigin: true,
  //     pathRewrite: { '^': '' },
  //   },
  // },
}));
