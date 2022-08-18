import { encode } from '@msgpack/msgpack';

export default class Encoder {
  // eslint-disable-next-line class-methods-use-this
  public encode(packet: any):unknown {
    return [encode(packet)];
  }
}
