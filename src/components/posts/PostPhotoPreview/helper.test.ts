import {
  SPACING_IMAGE,
  getHeighContainer,
  getWidthLargeImage,
  getWidthSmallImage,
} from './helper';
import { dimension } from '~/theme';

describe('PostPhotoPreview helper', () => {
  describe('getHeighContainer function', () => {
    const width = 500;
    it('given one image and is not vertical should return height = width/ratio', () => {
      const imageRatioFirst = 1;
      const height = getHeighContainer(
        width,
        [{}],
        imageRatioFirst,
        false,
        false,
        false,
        false,
        false,
      );
      expect(height).toBe(width / imageRatioFirst);
    });

    it('given one image and is vertical and not is long image should return height = width/ratio', () => {
      const imageRatioFirst = 0.8;
      const height = getHeighContainer(
        width,
        [{}],
        imageRatioFirst,
        true,
        false,
        false,
        false,
        false,
      );
      expect(height).toBe(width / imageRatioFirst);
    });

    it('given one image and is long image should return height = 70% of device height', () => {
      const imageRatioFirst = 0.2;
      const height = getHeighContainer(
        width,
        [{}],
        imageRatioFirst,
        true,
        false,
        false,
        true,
        true,
      );
      expect(height).toBe(dimension.deviceHeight * 0.7);
    });

    it('given multi images and is messy orientation should return height = 1/2 width', () => {
      const imageRatioFirst = 0.8;
      const height = getHeighContainer(
        width,
        [{}, {}],
        imageRatioFirst,
        true,
        true,
        false,
        false,
        false,
      );
      expect(height).toBe(width / 2);
    });

    it('given multi images and is both square should return height = 1/2 width', () => {
      const imageRatioFirst = 1;
      const height = getHeighContainer(
        width,
        [{}, {}],
        imageRatioFirst,
        false,
        false,
        true,
        false,
        false,
      );
      expect(height).toBe(width / 2);
    });
  });

  describe('getWidthSmallImage function', () => {
    const width = 500;
    it('given small images with direction is column and total images is 2 should return small images`s width = (container`s width - spacing) / 2', () => {
      const widthSmallImages = getWidthSmallImage(width, 2, 'column', 'row');
      expect(widthSmallImages).toBe((width - SPACING_IMAGE) / 2);
    });

    it('given small images with direction is column and total images is over 2 should return small images`s width = (container`s width - spacing) / 3', () => {
      const widthSmallImages = getWidthSmallImage(width, 3, 'column', 'row');
      expect(widthSmallImages).toBe((width - SPACING_IMAGE) / 3);
    });

    it('given small images with direction is row and container direction is row and total images is 2 should return small images`s width = (container`s width - spacing) / 2', () => {
      const widthSmallImages = getWidthSmallImage(width, 2, 'row', 'row');
      expect(widthSmallImages).toBe((width - SPACING_IMAGE) / 2);
    });

    it('given small images with direction is row and container direction is column and total images is 2 should return small images`s width = container`s width', () => {
      const widthSmallImages = getWidthSmallImage(width, 2, 'row', 'column');
      expect(widthSmallImages).toBe(width);
    });

    it('given small images with direction is row total images is 3 should return small images`s width = (container`s width - spacing)/2', () => {
      const widthSmallImages = getWidthSmallImage(width, 3, 'row', 'column');
      expect(widthSmallImages).toBe((width - SPACING_IMAGE) / 2);
    });

    it('given small images with direction is row total images is over 3 should return small images`s width = (container`s width - (spacing*2))/3', () => {
      const widthSmallImages = getWidthSmallImage(width, 4, 'row', 'column');
      expect(widthSmallImages).toBe((width - SPACING_IMAGE * 2) / 3);
    });
  });

  describe('getWidthLargeImage function', () => {
    const width = 500;
    it('given container direction is column should return large image`s width = container`s width', () => {
      const widthLargeImage = getWidthLargeImage(width, 2, 'column');
      expect(widthLargeImage).toBe(width);
    });

    it('given container direction is row and total images = 1 should return large image`s width = container`s width', () => {
      const widthLargeImage = getWidthLargeImage(width, 1, 'row');
      expect(widthLargeImage).toBe(width);
    });

    it('given container direction is row and total images = 2 should return large image`s width = (container`s width - spacing) / 2', () => {
      const widthLargeImage = getWidthLargeImage(width, 2, 'row');
      expect(widthLargeImage).toBe((width - SPACING_IMAGE) / 2);
    });

    it('given container direction is row and total images > 2 should return large image`s width = (container`s width - spacing) * 2/3', () => {
      const widthLargeImage = getWidthLargeImage(width, 3, 'row');
      expect(widthLargeImage).toBe((width - SPACING_IMAGE) * (2 / 3));
    });
  });
});
