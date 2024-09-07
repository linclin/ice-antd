export interface Req {
  filter: any;
  limit: number | undefined;
  offset: number | undefined;
  sort: Array<string>;
}

export interface Resp {
  success: boolean;
  data: any;
  msg: string;
  total: number;
}
