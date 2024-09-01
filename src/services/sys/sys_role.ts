import { request } from 'ice';

export async function GetRoles(data) {
 return await request.post('/api/v1/role/list', data);
}