import { request } from 'ice';
import type { Req, Resp } from '@/interfaces/resp';
export async function GetCronjobLog(data: Req): Promise<Resp> {
 return await request.post('/api/v1/cronjoblog/list', data);
}