import { request } from 'ice';

export async function GetReqApiLog(data) {
 return await request.post('/api/v1/reqapilog/list', data);
}