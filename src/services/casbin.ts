import { request } from 'ice';
import type { Resp } from '@/interfaces/resp';

export async function getUserPerm(user): Promise<Resp> {
 return await request.get(`/api/v1/user/perm/${user}`);
}

export async function authPermission(user, data): Promise<Resp> {
 return await request.post(`/api/v1/user/auth/${user}`, data);
}