import Encoder from './Encoder';
import Decoder from './Decoder';

export const protocol = 5;

export const PacketType = {
  CONNECT: 0,
  DISCONNECT: 1,
  EVENT: 2,
  ACK: 3,
  CONNECT_ERROR: 4,
};

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
        protocol,
        Encoder,
        Decoder,
      },
    }
    : {};
}
