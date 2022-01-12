import Emitter from 'component-emitter';
import {encode, decode} from '@msgpack/msgpack';
import {isInteger, isString} from 'lodash';

export const protocol = 5;

export const PacketType = {
  CONNECT: 0,
  DISCONNECT: 1,
  EVENT: 2,
  ACK: 3,
  CONNECT_ERROR: 4,
};

export class Encoder {
  public encode(packet: any) {
    return [encode(packet)];
  }
}

export class Decoder extends Emitter {
  private checkPacket = (decoded: any) => {
    const isTypeValid =
      isInteger(decoded.type) &&
      decoded.type >= PacketType.CONNECT &&
      decoded.type <= PacketType.CONNECT_ERROR;
    if (!isTypeValid) {
      console.log(`\x1b[31m🐣️ socket invalid packet type\x1b[0m`);
    }

    if (!isString(decoded.nsp)) {
      console.log(`\x1b[31m🐣️ socket invalid namespace\x1b[0m`);
    }

    if (!this.isPacketValid(decoded)) {
      console.log(`\x1b[31m🐣️ socket invalid payload\x1b[0m`);
    }

    const isAckValid = decoded.id === undefined || isInteger(decoded.id);
    if (!isAckValid) {
      console.log(`\x1b[31m🐣️ socket invalid packet id\x1b[0m`);
    }
  };

  private isPacketValid = ({type, data, nsp, id}: any) => {
    const isNamespaceValid = typeof nsp === 'string';
    const isAckIdValid = id === undefined || Number.isInteger(id);
    if (!isNamespaceValid || !isAckIdValid) {
      return false;
    }
    switch (type) {
      case 0: // CONNECT
        return data === undefined || typeof data === 'object';
      case 1: // DISCONNECT
        return data === undefined;
      case 2: // EVENT
        return Array.isArray(data) && data.length > 0;
      case 3: // ACK
        return Array.isArray(data);
      case 4: // CONNECT_ERROR
        return typeof data === 'object';
      default:
        return false;
    }
  };

  public add(chunk: any) {
    const packet = decode(chunk) as any;
    this.checkPacket(packet);
    this.emit('decoded', packet);
  }

  public destroy() {}
}

/**
 * Load MsgPack config
 * If not enable using default parser of socket io
 * @param enable Boolean
 * @returns MsgPack Parser config
 */
export function getMsgPackParser(enable: boolean) {
  return enable
    ? {
        parser: {
          protocol: protocol,
          Encoder: Encoder,
          Decoder: Decoder,
        },
      }
    : {};
}
