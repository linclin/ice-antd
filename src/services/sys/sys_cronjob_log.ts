import { request } from 'ice';

export async function GetCronjobLog(data) {
 return await request.post('/api/v1/cronjoblog/list', data);
}