export interface SysSystem {
  ID: number;
  AppId: string;
  SystemName: string;
  AppSecret: string;
  IP: string;
  Operator: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface SystemPermission {
  ID: number;
	AppId: string;
  AbsolutePath: string;
  AbsolutePath1: string;
  AbsolutePath2: string;
  HttpMethod: string;
  Eft: string;
}

export interface SysRouter {
  ID: number;
  Name: string;
  SystemName: string;
  Group: string;
  HttpMethod: string;
  AbsolutePath: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface SysRole {
  ID: number;
  Name: string;
  Keyword: string;
  Desc: string;
  Status: number;
  Operator: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface SysRolePermission {
  ID: number;
	Role: string;
  Obj: string;
  Obj1: string;
  Obj2: string;
  Action: string;
  Eft: string;
}

export interface SysReqApiLog {
  ID: number;
  RequestId: string;
  RequestMethod: string;
  RequestURI: string;
  RequestBody: string;
  StatusCode: string;
  RespBody: string;
  StartTime: string;
  ExecTime: string;
}

export interface SysCronjobLog {
  ID: number;
  CronMethod: string;
  CronParam: string;
  StartTime: string;
  EndTime: string;
  ExecTime: string;
  Status: string;
  ErrMsg: string;
}

export interface ChangeLog {
  ID: number;
  Action: string;
  ObjectID: string;
  ObjectType: string;
  RawObject: string;
  RawMeta: string;
  RawDiff: string;
  CreatedBy: string;
  Object: string;
  Meta: string;
}

export interface SysApiLog {
  ID: number;
  RequestId: string;
  RequestMethod: string;
  RequestURI: string;
  RequestBody: string;
  StatusCode: string;
  RespBody: string;
  ClientIP: string;
  StartTime: string;
  ExecTime: string;
}