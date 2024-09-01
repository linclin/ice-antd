import { request } from 'ice';

export async function GetRouters(data) {
 return await request.post('/api/v1/router/list', data);
}