import { request } from 'ice';

export async function GetApiLog(data) {
 return await request.post('/api/v1/apilog/list', data);
}