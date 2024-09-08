import { request } from 'ice';
import type { Req, Resp } from '@/interfaces/resp';
import type { SysRole, SysRolePermission } from '@/interfaces/sys';
export async function GetRoles(data: Req): Promise<Resp> {
 return await request.post('/api/v1/role/list', data);
}

export async function GetRoleById(id: number): Promise<Resp> {
    return await request.get(`/api/v1/role/get/${id}`);
}

export async function CreateRole(data: SysRole): Promise<Resp> {
    return await request.post('/api/v1/role/create', data);
}

export async function UpdateRoleById(id: number, data: SysRole): Promise<Resp> {
    return await request.patch(`/api/v1/role/update/${id}`, data);
}

export async function DeleteRoleById(id: number): Promise<Resp> {
    return await request.delete(`/api/v1/role/delete/${id}`);
}

export async function GetRolePermById(id: number): Promise<Resp> {
    return await request.get(`/api/v1/role/perm/get/${id}`);
}
export async function CreateRolePerm(id: number, data: SysRolePermission): Promise<Resp> {
    return await request.post(`/api/v1/role/perm/create/${id}`, data);
}
export async function DeleteRolePermById(id: number, data: SysRolePermission): Promise<Resp> {
    return await request.delete(`/api/v1/role/perm/delete/${id}`, {
      data: data, // 将data作为请求体的一部分传递
    });
}
export async function GetRoleUsersById(id: number): Promise<Resp> {
    return await request.get(`/api/v1/role/users/get/${id}`);
}
export async function CreateRoleUser(id: number, data: []): Promise<Resp> {
    return await request.post(`/api/v1/role/users/create/${id}`, data);
}
export async function DeleteRoleUserById(id: number, data: []): Promise<Resp> {
    return await request.delete(`/api/v1/role/users/delete/${id}`, {
      data: data, // 将data作为请求体的一部分传递
    });
}