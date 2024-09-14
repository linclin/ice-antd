import Sdk from 'casdoor-js-sdk';
import { request } from 'ice';
import { message } from 'antd';
import type { Resp } from '@/interfaces/resp';

const casdoorSdkConfig = {
  serverUrl: CASDOOR_SERVER_URL,
  clientId: CASDOOR_CLIENT_ID,
  appName: CASDOOR_APP_NAME,
  organizationName: CASDOOR_ORGANIZATION_NAME,
  redirectPath: '/',
  signinPath: '/api/v1/user/login/',
};
export const CasdoorSdk = new Sdk(casdoorSdkConfig);
export const isLoggedIn = () => {
  const token = localStorage.getItem(`${ICE_API_APPID}-user-token`);
  const tokenData = JSON.parse(token);
  const currentTime = Date.now();
  return token !== null && token.length > 0 && tokenData.expires > currentTime;
};

export const setToken = (token) => {
  localStorage.setItem(`${ICE_API_APPID}-user-token`, JSON.stringify({ token: token, expires: Date.now() + 12 * 3600 * 1000 }));
};

export const goToLink = (link) => {
  window.location.href = link;
};

export const getSigninUrl = () => {
  return CasdoorSdk.getSigninUrl();
};

export async function signin(code, state): Promise<Resp> {
 return await request.post(`/api/v1/user/login?state=${state}&code=${code}`);
}

export async function getUserinfo(): Promise<Resp> {
 return await request.get('/api/v1/user/info');
}

export const logout = () => {
  localStorage.removeItem(`${ICE_API_APPID}-user-token`);
};

export const showMessage = (msg) => {
   message.success(msg);
};
