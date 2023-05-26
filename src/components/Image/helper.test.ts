import { isEmpty, isEqual } from 'lodash';
import { PostType } from '~/interfaces/IPost';
import {
  formatSource, getImageSizeSupported, getImageUrlsForPreloadImagesOnNewsFeed, getWidthStyle,
} from './helper';

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

  describe('getImageUrlsForPreloadImagesOnNewsFeed function', () => {
    it('given an array articles and series that dont have cover in each item should return an empty array imgs', () => {
      const fakeData = [{
        type: PostType.ARTICLE,
      }, {
        type: PostType.SERIES,
      }];

      expect(getImageUrlsForPreloadImagesOnNewsFeed(fakeData).length).toBe(0);
    });

    it('given an array articles and series that have cover in each item should return an array imgs', () => {
      const fakeData = [{
        type: PostType.ARTICLE,
        coverMedia: {
          url: 'https://img.xyz',
        },
      }, {
        type: PostType.SERIES,
        coverMedia: {
          url: 'https://img.xyz',
        },
      }];

      expect(getImageUrlsForPreloadImagesOnNewsFeed(fakeData).length).toBe(2);
    });

    it('given an array posts should return an array imgs', () => {
      const fakeData = [{
        type: PostType.POST,
        media: {
          images: [
            {
              height: 1080,
              width: 1920,
              url: 'https://img.xyz',
            },
            {
              height: 1018,
              width: 1900,
              url: 'https://img.xyz',
            },
            {
              height: 1080,
              width: 1920,
              url: 'https://img.xyz',
            },
            {
              height: 1920,
              width: 1440,
              url: 'https://img.xyz',
            },
          ],
        },
      }];

      expect(getImageUrlsForPreloadImagesOnNewsFeed(fakeData).length).toBe(4);
    });

    it('given an array posts but dont have imgs should return an empty array imgs', () => {
      const fakeData = {
        type: PostType.POST,
        media: {
          images: [
          ],
        },
      };

      expect(getImageUrlsForPreloadImagesOnNewsFeed(fakeData).length).toBe(0);
    });
  });
});
