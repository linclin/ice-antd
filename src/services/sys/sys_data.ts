import { request } from 'ice';
import type { Resp } from '@/interfaces/resp';
export async function GetSysData(): Promise<Resp> {
 return await request.get('/api/v1/data/list');
}