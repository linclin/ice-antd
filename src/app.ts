import { defineAppConfig, history, defineDataLoader } from 'ice';
import { defineAuthConfig } from '@ice/plugin-auth/types';
import { defineStoreConfig } from '@ice/plugin-store/types';
import { defineRequestConfig } from '@ice/plugin-request/types';
import { GetApiToken } from '@/services/api_token';
import { fetchUserInfo } from './services/user';

// App config, see https://v3.ice.work/docs/guide/basic/app
export default defineAppConfig(() => ({}));

export const authConfig = defineAuthConfig(async (appData) => {
  const { userInfo = {} } = appData;

  if (userInfo.error) {
    history?.push(`/login?redirect=${window.location.pathname}`);
  }

  return {
    initialAuth: {
      admin: userInfo.userType === 'admin',
      user: userInfo.userType === 'user',
    },
  };
});

export const storeConfig = defineStoreConfig(async (appData) => {
  const { userInfo = {} } = appData;
  return {
    initialStates: {
      user: {
        currentUser: userInfo,
      },
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
         const storedApiToken = localStorage.getItem(`${ICE_API_APPID}-api-token`);
         if (storedApiToken) {
           const tokenData = JSON.parse(storedApiToken);
           const currentTime = Date.now();
           if (currentTime < tokenData.expires) {
            currentApiToken = tokenData;
            config.headers.Authorization = `Bearer ${currentApiToken.token}`;
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
          alert('请求失败');
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
  const userInfo = await getUserInfo();
  return {
    apiToken,
    userInfo,
  };
});

async function getUserInfo() {
  try {
    const userInfo = await fetchUserInfo();
    return userInfo;
  } catch (error) {
    return {
      error,
    };
  }
}
async function getApiToken() {
  try {
    const apiToken = await GetApiToken();
    console.log('getApiToken  ', apiToken);
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