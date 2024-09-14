import { defineAppConfig, history, defineDataLoader, request } from 'ice';
import { defineAuthConfig } from '@ice/plugin-auth/types';
import { defineStoreConfig } from '@ice/plugin-store/types';
import { defineRequestConfig } from '@ice/plugin-request/types';
import { GetApiToken } from '@/services/api_token';
import { message } from 'antd';
import * as Casdoor from '@/services/casdoor';

export default defineAppConfig(() => ({}));
export const storeConfig = defineStoreConfig(async () => {
    if (!Casdoor.isLoggedIn()) {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    if (code && state) {
      const res = await Casdoor.signin(code, state);
      if (res.success === true) {
         Casdoor.setToken(res.data.access_token);
         Casdoor.goToLink('/');
      }
    } else {
      history?.push(Casdoor.getSigninUrl());
    }
  }
  const userInfo = await Casdoor.getUserinfo();
  return {
    initialStates: {
      user: {
        currentUser: userInfo.data,
      },
    },
  };
});
export const authConfig = defineAuthConfig(async () => {
 return {
    initialAuth: {
      // admin: userInfo.userType === 'admin',
      // user: userInfo.userType === 'user',
    },
  };
});

let currentApiToken;
let requestLock = false;
export const requestConfig = defineRequestConfig(() => ({
  baseURL: ICE_API_URL,
  headers: { 'Content-Type': 'application/json' },
   // 可选的，全局设置 request 是否返回 response 对象，默认为 false
   withFullResponse: false,
  // 拦截器
  interceptors: {
    request: {
      onConfig: (config) => {
         // 发送请求前：可以对 RequestConfig 做一些统一处理
        const currentTime = Date.now();
        const storedUserToken = localStorage.getItem(`${ICE_API_APPID}-user-token`);
        if (storedUserToken) {
          const tokenData = JSON.parse(storedUserToken);
           config.headers = {
                'X-Auth-Token': tokenData.token,
           };
        }
        const storedApiToken = localStorage.getItem(`${ICE_API_APPID}-api-token`);
        if (storedApiToken) {
           const tokenData = JSON.parse(storedApiToken);
           if (currentTime < tokenData.expires) {
            config.headers.Authorization = `Bearer ${tokenData.token}`;
           } else {
            handleTokenExpiration(config);
           }
        } else {
          handleTokenExpiration(config);
        }
        return config;
      },
      onError: (error) => {
        // 请求出错：服务端返回错误状态码
        return Promise.reject(error);
      },
    },
    response: {
      onConfig: (response) => {
        // 请求成功：可以做全局的 toast 展示，或者对 response 做一些格式化
        if (response.data.success !== true) {
          message.error(`请求失败${response.data.msg}`);
        }
        return response;
      },
      onError: (error) => {
        // 请求出错：服务端返回错误状态码
        return Promise.reject(error);
      },
    },
  },
}));

export const dataLoader = defineDataLoader(async () => {
  const apiToken = await getApiToken();
  return {
    apiToken,
  };
});
async function getApiToken() {
  try {
    const apiToken = await GetApiToken();
    localStorage.setItem(`${ICE_API_APPID}-api-token`, JSON.stringify({ token: apiToken.token, expires: Date.now() + 7200 * 1000 }));
    return apiToken;
  } catch (error) {
    return {
      error,
    };
  }
}
function handleTokenExpiration(config) {
  if (requestLock) {
    // 如果已经有请求正在进行，则直接返回
    return;
  }
  requestLock = true; // 设置请求锁
  GetApiToken()
    .then(newToken => {
      currentApiToken = newToken;
      localStorage.setItem(`${ICE_API_APPID}-api-token`, JSON.stringify({ token: currentApiToken.token, expires: Date.now() + 7200 * 1000 }));
      config.headers.Authorization = `Bearer ${currentApiToken.token}`;
      requestLock = false; // 释放请求锁
    })
    .catch(() => {
      console.error('Failed to fetch a new token');
      requestLock = false; // 释放请求锁
      // 进一步的错误处理逻辑，例如提示用户重新登录
    });
}
