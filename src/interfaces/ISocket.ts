export interface ISocketEvent {
  id: string;
  msg: string;
  // [TO-DO] Need to check in RocketChat
  // msg: 'result' | 'error' | 'connected' | 'updated' | 'added';
  result: any;
  fields: any;
  session: string;
  methods: string[];
  error: any;
}
