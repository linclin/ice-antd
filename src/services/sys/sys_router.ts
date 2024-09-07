import { request } from 'ice';
import type { Req, Resp } from '@/interfaces/resp';
export async function GetRouters(data: Req): Promise<Resp> {
 return await request.post('/api/v1/router/list', data);
}