import { request } from 'ice';

export function GetApiToken() {
 return request.post('/api/v1/base/auth', { AppId: ICE_API_APPID, AppSecret: ICE_API_APPSECRET });
}