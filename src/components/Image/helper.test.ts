import { isEmpty, isEqual } from 'lodash';
import { formatSource, getImageSizeSupported, getWidthStyle } from './helper';

describe('helper of Image component', () => {
  describe('formatSource function', () => {
    it('given empty source should return empty', () => {
      expect(isEmpty(formatSource(null))).toBeTruthy();
    });

    it('given source as base64 should return formatted source object', () => {
      expect(isEqual(formatSource('data:xyz'), { uri: 'data:xyz' })).toBeTruthy();
    });

    it('given source as string url should return formatted source object', () => {
      expect(isEqual(formatSource('http://xyz.img', 64), { uri: 'http://xyz.img?width=96' })).toBeTruthy();
    });

    it('given source as object contains url should return formatted source object', () => {
      expect(isEqual(formatSource({ uri: 'http://xyz.img?id=123' }, 64), { uri: 'http://xyz.img?id=123&width=96' })).toBeTruthy();
    });

    it('given source as object contains base64 should return formatted source object', () => {
      expect(isEqual(formatSource({ uri: 'data:xyz' }, 64), { uri: 'data:xyz' })).toBeTruthy();
    });
  });

  describe('getImageSizeSupported function', () => {
    it('given empty width should return empty', () => {
      expect(getImageSizeSupported(null)).toBeUndefined();
    });

    it('given width too large should return empty', () => {
      expect(getImageSizeSupported(4000)).toBeUndefined();
    });

    it('given width that is supported by BE should return corresponding width', () => {
      expect(getImageSizeSupported(64)).toBe(96);
    });
  });

  describe('getWidthStyle function', () => {
    it('given style as an array should return width', () => {
      expect(getWidthStyle([{ width: 64 }, { height: 88 }])).toBe(64);
    });

    it('given style as an object should return width', () => {
      expect(getWidthStyle({ width: 64 })).toBe(64);
    });
  });
});
