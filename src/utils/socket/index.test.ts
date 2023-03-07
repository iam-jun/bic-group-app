import { getMsgPackParser } from '.';
import Encoder from './Encoder';
import Decoder from './Decoder';

describe('socket utils', () => {
  it('should getMsgPackParser enable true', () => {
    const test = getMsgPackParser(true);

    expect(test).toEqual({
      parser: {
        protocol: 5,
        Encoder,
        Decoder,
      },
    });
  });

  it('should getMsgPackParser enable false', () => {
    const test = getMsgPackParser(false);

    expect(test).toEqual({});
  });
});
