import { request } from 'ice';

export async function GetChangeLog(data) {
 return await request.post('/api/v1/changelog/list', data);
}