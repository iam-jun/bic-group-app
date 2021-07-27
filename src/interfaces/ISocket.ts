export interface ISocketEvent {
  id: string;
  msg: 'result' | 'error';
  result: any;
}
