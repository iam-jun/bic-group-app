import {StreamClient} from 'getstream';

export interface IPayloadGetHomePost {
  streamClient: StreamClient;
  userId: string;
  isRefresh?: boolean;
}
