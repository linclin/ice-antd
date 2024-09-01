import { request } from 'ice';

export async function GetSystems(data) {
 return await request.post('/api/v1/system/list', data);
}

export async function GetSystemById(id) {
  return await request.get(`/api/v1/system/get/${id}`);
 }