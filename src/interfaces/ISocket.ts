export interface ISocketEvent {
  id: string;
  msg: 'result' | 'error' | 'connected' | 'updated' | 'added';
  result: any;
  fields: any;
  session: string;
  methods: string[];
  error: any;
}
