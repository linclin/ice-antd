import { request } from 'ice';
import type { Req, Resp } from '@/interfaces/resp';
export async function GetReqApiLog(data: Req): Promise<Resp> {
 return await request.post('/api/v1/reqapilog/list', data);
}