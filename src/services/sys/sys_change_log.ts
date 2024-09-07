import { request } from 'ice';
import type { Req, Resp } from '@/interfaces/resp';
export async function GetChangeLog(data: Req): Promise<Resp> {
 return await request.post('/api/v1/changelog/list', data);
}