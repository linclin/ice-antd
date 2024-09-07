import { request } from 'ice';
import type { Req, Resp } from '@/interfaces/resp';
export async function GetRoles(data: Req): Promise<Resp> {
 return await request.post('/api/v1/role/list', data);
}