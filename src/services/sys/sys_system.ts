import { request } from 'ice';
import type { Req, Resp } from '@/interfaces/resp';
import type { SysSystem, SystemPermission } from '@/interfaces/sys';
export async function GetSystems(data: Req): Promise<Resp> {
 return await request.post('/api/v1/system/list', data);
}

export async function GetSystemById(id: number): Promise<Resp> {
  return await request.get(`/api/v1/system/get/${id}`);
}

export async function DeleteSystemById(id: number): Promise<Resp> {
  return await request.delete(`/api/v1/system/delete/${id}`);
}

export async function CreateSystem(data: SysSystem): Promise<Resp> {
  return await request.post('/api/v1/system/create', data);
}

export async function UpdateSystemById(id: number, data: SysSystem): Promise<Resp> {
  return await request.patch(`/api/v1/system/update/${id}`, data);
}

export async function GetSystemPermById(id: number): Promise<Resp> {
  return await request.get(`/api/v1/system/perm/get/${id}`);
}

export async function CreateSystemPerm(id: number, data: SystemPermission): Promise<Resp> {
  return await request.post(`/api/v1/system/perm/create/${id}`, data);
}

export async function DeleteSystemPermById(id: number, data: SystemPermission): Promise<Resp> {
  return await request.delete(`/api/v1/system/perm/delete/${id}`, {
    data: data, // 将data作为请求体的一部分传递
  });
}