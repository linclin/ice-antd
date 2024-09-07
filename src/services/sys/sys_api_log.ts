import { request } from 'ice';
import type { Req, Resp } from '@/interfaces/resp';
export async function GetApiLog(data: Req): Promise<Resp> {
 return await request.post('/api/v1/apilog/list', data);
}